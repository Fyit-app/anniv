"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

// Types de fichiers acceptés
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/mov"]
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100 MB

function isValidMediaType(type: string): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(type) || ACCEPTED_VIDEO_TYPES.includes(type)
}

function getMediaType(type: string): "image" | "video" {
  return ACCEPTED_VIDEO_TYPES.includes(type) ? "video" : "image"
}

export type UploadResult = {
  success: boolean
  error?: string
}

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Non connecté" }
  }

  const file = formData.get("media")
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Veuillez sélectionner un fichier" }
  }

  if (!isValidMediaType(file.type)) {
    return { success: false, error: "Format non supporté. Formats acceptés : JPG, PNG, GIF, WebP, MP4, WebM, MOV" }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Le fichier est trop volumineux (max 100 MB)" }
  }

  const mediaType = getMediaType(file.type)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${user.id}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  const { error: insertError } = await supabase.from("photos").insert({
    user_id: user.id,
    url: path,
    validated: false,
    media_type: mediaType,
  })

  if (insertError) {
    return { success: false, error: insertError.message }
  }

  // Revalider la page pour afficher le nouveau média
  revalidatePath("/galerie")
  
  return { success: true }
}

// Garder l'ancienne fonction pour compatibilité (formulaire HTML classique)
export async function uploadPhoto(formData: FormData) {
  // Convertir le champ "photo" en "media" pour la nouvelle fonction
  const photo = formData.get("photo")
  if (photo instanceof File) {
    formData.set("media", photo)
  }
  
  const result = await uploadMedia(formData)
  
  if (result.success) {
    redirect("/galerie?uploaded=1")
  } else {
    redirect(`/galerie?error=${encodeURIComponent(result.error || "Erreur")}`)
  }
}
