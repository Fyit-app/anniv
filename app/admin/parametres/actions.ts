"use server"

import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function addAdmin(formData: FormData) {
  await requireAdmin()

  const userId = String(formData.get("user_id") ?? "").trim()

  if (!userId) {
    redirect("/admin/parametres?error=ID%20utilisateur%20manquant")
  }

  const supabase = await createClient()

  // Mettre à jour le rôle
  const { error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId)

  if (error) {
    redirect(`/admin/parametres?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/parametres?success=1")
}

export async function removeAdmin(formData: FormData) {
  await requireAdmin()

  const userId = String(formData.get("user_id") ?? "").trim()

  if (!userId) {
    redirect("/admin/parametres?error=ID%20utilisateur%20manquant")
  }

  const supabase = await createClient()

  // Vérifier qu'on n'est pas en train de se révoquer soi-même
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  if (currentUser?.id === userId) {
    redirect("/admin/parametres?error=Vous%20ne%20pouvez%20pas%20révoquer%20vos%20propres%20droits")
  }

  // Vérifier qu'il reste au moins un admin
  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")

  if ((admins?.length || 0) <= 1) {
    redirect("/admin/parametres?error=Il%20doit%20rester%20au%20moins%20un%20administrateur")
  }

  // Révoquer le rôle admin (passer en invité)
  const { error } = await supabase
    .from("profiles")
    .update({ role: "invite" })
    .eq("id", userId)

  if (error) {
    redirect(`/admin/parametres?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/parametres?removed=1")
}

export async function createAdminUser(formData: FormData) {
  await requireAdmin()

  const email = String(formData.get("email") ?? "").trim()
  const prenom = String(formData.get("prenom") ?? "").trim() || null
  const nom = String(formData.get("nom") ?? "").trim() || null

  if (!email) {
    redirect("/admin/parametres?error=Email%20requis")
  }

  const admin = createAdminClient()

  // Vérifier si l'utilisateur existe déjà
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(u => u.email === email)

  let userId: string

  if (existingUser) {
    // L'utilisateur existe, on le promeut admin
    userId = existingUser.id
  } else {
    // Créer l'utilisateur
    const { data, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        prenom,
        nom,
      },
    })

    if (error || !data.user) {
      redirect(`/admin/parametres?error=${encodeURIComponent(error?.message ?? "Erreur lors de la création")}`)
    }

    userId = data.user.id
  }

  // Créer/mettre à jour le profil avec le rôle admin
  const { error: profileError } = await admin
    .from("profiles")
    .upsert({
      id: userId,
      role: "admin",
      prenom,
      nom,
      onboarding_completed: true,
      welcome_seen: true,
    })

  if (profileError) {
    redirect(`/admin/parametres?error=${encodeURIComponent(profileError.message)}`)
  }

  // Envoyer l'invitation
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  })

  if (inviteError && !existingUser) {
    // Ignorer l'erreur si l'utilisateur existait déjà
    console.error("Erreur envoi invitation:", inviteError)
  }

  redirect("/admin/parametres?created=1")
}


