"use server"

import { redirect } from "next/navigation"

import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function validatePhoto(formData: FormData) {
  await requireAdmin()

  const photoId = String(formData.get("photo_id") ?? "")
  if (!photoId) {
    redirect("/admin/photos?error=missing_id")
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("photos")
    .update({ validated: true })
    .eq("id", photoId)

  if (error) {
    redirect(`/admin/photos?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/photos?validated=1")
}

export async function rejectPhoto(formData: FormData) {
  await requireAdmin()

  const photoId = String(formData.get("photo_id") ?? "")
  if (!photoId) {
    redirect("/admin/photos?error=missing_id")
  }

  const supabase = await createClient()
  const { error } = await supabase.from("photos").delete().eq("id", photoId)

  if (error) {
    redirect(`/admin/photos?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/photos?deleted=1")
}
