"use server"

import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"

export async function createInvite(formData: FormData) {
  await requireAdmin()

  const email = String(formData.get("email") ?? "").trim()
  const prenom = String(formData.get("prenom") ?? "").trim() || null
  const nom = String(formData.get("nom") ?? "").trim() || null
  const telephone = String(formData.get("telephone") ?? "").trim() || null
  const sendInvitation = formData.get("send_invitation") === "on"

  if (!email) {
    redirect("/admin/invites?error=Email%20requis")
  }

  const admin = createAdminClient()

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
    redirect(`/admin/invites?error=${encodeURIComponent(error?.message ?? "Erreur lors de la création")}`)
  }

  // Créer/mettre à jour le profil
  const { error: profileError } = await admin
    .from("profiles")
    .upsert({
      id: data.user.id,
      role: "invite",
      prenom,
      nom,
      telephone,
      onboarding_completed: false,
    })

  if (profileError) {
    redirect(`/admin/invites?error=${encodeURIComponent(profileError.message)}`)
  }

  // Envoyer l'invitation si demandé
  if (sendInvitation) {
    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    })

    if (inviteError) {
      // L'utilisateur est créé mais l'invitation a échoué
      redirect(`/admin/invites?created=1&error=${encodeURIComponent("Créé mais invitation échouée: " + inviteError.message)}`)
    }
  }

  redirect("/admin/invites?created=1")
}

export async function deleteInvite(formData: FormData) {
  await requireAdmin()

  const userId = String(formData.get("user_id") ?? "").trim()

  if (!userId) {
    redirect("/admin/invites?error=ID%20utilisateur%20manquant")
  }

  const admin = createAdminClient()

  // Supprimer l'utilisateur (le profil sera supprimé en cascade)
  const { error } = await admin.auth.admin.deleteUser(userId)

  if (error) {
    redirect(`/admin/invites?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/invites?deleted=1")
}

export async function sendInvitation(formData: FormData) {
  await requireAdmin()

  const userId = String(formData.get("user_id") ?? "").trim()

  if (!userId) {
    redirect("/admin/invites?error=ID%20utilisateur%20manquant")
  }

  const admin = createAdminClient()

  // Récupérer l'email de l'utilisateur
  const { data: userData, error: userError } = await admin.auth.admin.getUserById(userId)

  if (userError || !userData.user?.email) {
    redirect(`/admin/invites?error=${encodeURIComponent(userError?.message ?? "Utilisateur non trouvé")}`)
  }

  // Envoyer l'invitation
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(userData.user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
  })

  if (inviteError) {
    redirect(`/admin/invites?error=${encodeURIComponent(inviteError.message)}`)
  }

  redirect("/admin/invites?invited=1")
}
