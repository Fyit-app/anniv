"use server"

import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function validatePhoto(formData: FormData) {
  await requireAdmin()

  const photoId = String(formData.get("photo_id") ?? "").trim()

  if (!photoId) {
    redirect("/admin/photos?error=ID%20photo%20manquant")
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

  const photoId = String(formData.get("photo_id") ?? "").trim()

  if (!photoId) {
    redirect("/admin/photos?error=ID%20photo%20manquant")
  }

  const supabase = await createClient()
  const admin = createAdminClient()

  // Récupérer l'URL de la photo
  const { data: photo } = await supabase
    .from("photos")
    .select("url")
    .eq("id", photoId)
    .single()

  if (photo?.url) {
    // Supprimer le fichier du storage
    await admin.storage.from("photos").remove([photo.url])
  }

  // Supprimer l'entrée de la base de données
  const { error } = await supabase
    .from("photos")
    .delete()
    .eq("id", photoId)

  if (error) {
    redirect(`/admin/photos?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/photos?deleted=1")
}

export async function validateAllPhotos() {
  await requireAdmin()

  const supabase = await createClient()

  const { error } = await supabase
    .from("photos")
    .update({ validated: true })
    .eq("validated", false)

  if (error) {
    redirect(`/admin/photos?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/admin/photos?validatedAll=1")
}
