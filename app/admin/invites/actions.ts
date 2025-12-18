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

  if (!email) {
    redirect("/admin/invites?error=missing_email")
  }

  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  })

  if (error || !data.user) {
    redirect(`/admin/invites?error=${encodeURIComponent(error?.message ?? "create_user_failed")}`)
  }

  const { error: profileError } = await admin
    .from("profiles")
    .upsert({
      id: data.user.id,
      role: "invite",
      prenom,
      nom,
      telephone,
    })

  if (profileError) {
    redirect(`/admin/invites?error=${encodeURIComponent(profileError.message)}`)
  }

  redirect("/admin/invites?created=1")
}
