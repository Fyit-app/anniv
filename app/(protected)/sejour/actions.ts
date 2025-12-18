"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

function toNullableString(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim()
  return s.length ? s : null
}

export async function updateSejourInfo(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Récupérer les données du formulaire
  const arrival_date = toNullableString(formData.get("arrival_date"))
  const departure_date = toNullableString(formData.get("departure_date"))
  const arrival_transport = toNullableString(formData.get("arrival_transport"))
  const arrival_airport = toNullableString(formData.get("arrival_airport"))
  const residence_location = toNullableString(formData.get("residence_location"))
  const commentaire = toNullableString(formData.get("commentaire"))

  // Validation des dates
  if (arrival_date && departure_date) {
    if (new Date(departure_date) < new Date(arrival_date)) {
      redirect("/sejour?error=" + encodeURIComponent("La date de départ doit être après la date d'arrivée"))
    }
  }

  // Mise à jour du profil (données principales)
  // Note: On ne met à jour que les colonnes qui existent dans la table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      arrival_date,
      departure_date,
      arrival_transport,
      arrival_airport: arrival_transport === "avion" ? arrival_airport : null,
      residence_location,
    })
    .eq("id", user.id)

  if (profileError) {
    console.error("Erreur lors de la mise à jour du profil:", profileError)
    redirect(`/sejour?error=${encodeURIComponent("Erreur lors de la sauvegarde")}`)
  }

  // Mise à jour/création dans sejours (pour le commentaire et la rétrocompatibilité)
  const { error: sejourError } = await supabase
    .from("sejours")
    .upsert(
      {
        user_id: user.id,
        date_arrivee: arrival_date,
        date_depart: departure_date,
        logement: residence_location,
        commentaire,
      },
      { onConflict: "user_id" }
    )

  if (sejourError) {
    console.error("Erreur lors de la mise à jour du séjour:", sejourError)
    // On ne bloque pas si cette table échoue, les données principales sont dans profiles
  }

  revalidatePath("/sejour")
  revalidatePath("/dashboard")
  redirect("/sejour?saved=1")
}

// Garder l'ancienne fonction pour la rétrocompatibilité
export async function upsertSejour(formData: FormData) {
  return updateSejourInfo(formData)
}

// ═══════════════════════════════════════════════════════════════════════════
// Gestion du nom de groupe
// ═══════════════════════════════════════════════════════════════════════════

export async function updateGroupName(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const group_name = toNullableString(formData.get("group_name"))

  const { error } = await supabase
    .from("profiles")
    .update({ group_name })
    .eq("id", user.id)

  if (error) {
    console.error("Erreur lors de la mise à jour du nom de groupe:", error)
    return { error: "Erreur lors de la sauvegarde" }
  }

  revalidatePath("/sejour")
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════════════
// Gestion des membres du groupe
// ═══════════════════════════════════════════════════════════════════════════

export async function addFamilyMember(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const first_name = toNullableString(formData.get("first_name"))
  const is_minor = formData.get("is_minor") === "true"
  const email = toNullableString(formData.get("email"))

  if (!first_name) {
    return { error: "Le prénom est obligatoire" }
  }

  // Si majeur avec email, vérifier que l'email n'est pas déjà utilisé
  if (!is_minor && email) {
    const { data: existingMember } = await supabase
      .from("family_members")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existingMember) {
      return { error: "Cet email est déjà utilisé par un autre membre" }
    }

    // Vérifier aussi si l'email est déjà un utilisateur
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    // On ne vérifie pas les autres profils pour l'instant
  }

  const { error } = await supabase
    .from("family_members")
    .insert({
      profile_id: user.id,
      first_name,
      is_minor,
      email: is_minor ? null : email, // Pas d'email pour les mineurs
    })

  if (error) {
    console.error("Erreur lors de l'ajout du membre:", error)
    return { error: "Erreur lors de l'ajout" }
  }

  revalidatePath("/sejour")
  return { success: true }
}

export async function updateFamilyMember(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const member_id = formData.get("member_id") as string
  const first_name = toNullableString(formData.get("first_name"))
  const is_minor = formData.get("is_minor") === "true"
  const email = toNullableString(formData.get("email"))

  if (!member_id || !first_name) {
    return { error: "Données invalides" }
  }

  // Vérifier que le membre appartient à l'utilisateur
  const { data: existingMember } = await supabase
    .from("family_members")
    .select("id, profile_id")
    .eq("id", member_id)
    .single()

  if (!existingMember || existingMember.profile_id !== user.id) {
    return { error: "Membre non trouvé" }
  }

  const { error } = await supabase
    .from("family_members")
    .update({
      first_name,
      is_minor,
      email: is_minor ? null : email,
    })
    .eq("id", member_id)

  if (error) {
    console.error("Erreur lors de la mise à jour du membre:", error)
    return { error: "Erreur lors de la mise à jour" }
  }

  revalidatePath("/sejour")
  return { success: true }
}

export async function removeFamilyMember(memberId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Vérifier que le membre appartient à l'utilisateur
  const { data: existingMember } = await supabase
    .from("family_members")
    .select("id, profile_id")
    .eq("id", memberId)
    .single()

  if (!existingMember || existingMember.profile_id !== user.id) {
    return { error: "Membre non trouvé" }
  }

  // Compter les membres restants
  const { count } = await supabase
    .from("family_members")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id)

  if (count && count <= 1) {
    return { error: "Vous devez avoir au moins un participant" }
  }

  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", memberId)

  if (error) {
    console.error("Erreur lors de la suppression du membre:", error)
    return { error: "Erreur lors de la suppression" }
  }

  revalidatePath("/sejour")
  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════════════
// Envoi d'invitation par magic link
// ═══════════════════════════════════════════════════════════════════════════

export async function sendInvitation(memberId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Récupérer le membre
  const { data: member } = await supabase
    .from("family_members")
    .select("*")
    .eq("id", memberId)
    .single()

  if (!member || member.profile_id !== user.id) {
    return { error: "Membre non trouvé" }
  }

  if (member.is_minor) {
    return { error: "Impossible d'envoyer une invitation à un mineur" }
  }

  if (!member.email) {
    return { error: "Veuillez d'abord renseigner l'email du membre" }
  }

  if (member.linked_user_id) {
    return { error: "Ce membre a déjà un compte" }
  }

  // Récupérer le nom du groupe pour personnaliser l'invitation
  const { data: profile } = await supabase
    .from("profiles")
    .select("group_name, prenom")
    .eq("id", user.id)
    .single()

  const groupName = profile?.group_name || `le groupe de ${profile?.prenom || "votre famille"}`

  try {
    // Utiliser le client admin pour envoyer le magic link
    const adminClient = createAdminClient()
    
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      member.email,
      {
        data: {
          prenom: member.first_name,
          invited_by: user.id,
          family_member_id: memberId,
        },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?type=invite`,
      }
    )

    if (inviteError) {
      console.error("Erreur lors de l'envoi de l'invitation:", inviteError)
      
      // Si l'utilisateur existe déjà, envoyer un magic link simple
      if (inviteError.message?.includes("already been registered")) {
        const { error: magicLinkError } = await adminClient.auth.admin.generateLink({
          type: "magiclink",
          email: member.email,
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
          }
        })

        if (magicLinkError) {
          return { error: "Erreur lors de l'envoi du lien de connexion" }
        }
      } else {
        return { error: "Erreur lors de l'envoi de l'invitation" }
      }
    }

    // Mettre à jour le membre avec la date d'envoi
    await supabase
      .from("family_members")
      .update({ invitation_sent_at: new Date().toISOString() })
      .eq("id", memberId)

    revalidatePath("/sejour")
    return { success: true, message: `Invitation envoyée à ${member.email}` }

  } catch (err) {
    console.error("Erreur inattendue:", err)
    return { error: "Erreur lors de l'envoi de l'invitation" }
  }
}
