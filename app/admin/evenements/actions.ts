"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié", isAdmin: false }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: "Non autorisé", isAdmin: false }
  }

  return { error: null, isAdmin: true }
}

// Upload d'image pour événement
export async function uploadEventImage(formData: FormData) {
  const authCheck = await checkAdmin()
  if (!authCheck.isAdmin) {
    return { error: authCheck.error || "Non autorisé" }
  }

  const file = formData.get("file") as File
  if (!file || file.size === 0) {
    return { error: "Aucun fichier sélectionné" }
  }

  // Vérifier le type de fichier
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return { error: "Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP." }
  }

  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Fichier trop volumineux. Maximum 5MB." }
  }

  // Créer un client admin pour contourner les RLS
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Générer un nom de fichier unique
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `events/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

  // Convertir le File en ArrayBuffer puis en Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { data, error } = await supabaseAdmin.storage
    .from("photos")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error("Erreur upload:", error)
    return { error: "Erreur lors de l'upload: " + error.message }
  }

  // Obtenir l'URL publique
  const { data: urlData } = supabaseAdmin.storage
    .from("photos")
    .getPublicUrl(fileName)

  return { success: true, url: urlData.publicUrl, path: fileName }
}

// Supprimer une image d'événement
export async function deleteEventImage(imagePath: string) {
  const authCheck = await checkAdmin()
  if (!authCheck.isAdmin) {
    return { error: authCheck.error || "Non autorisé" }
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin.storage
    .from("photos")
    .remove([imagePath])

  if (error) {
    console.error("Erreur suppression image:", error)
    return { error: "Erreur lors de la suppression de l'image" }
  }

  return { success: true }
}

export async function createEvent(formData: FormData) {
  const authCheck = await checkAdmin()
  if (!authCheck.isAdmin) {
    return { error: authCheck.error || "Non autorisé" }
  }
  
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const event_date = formData.get("event_date") as string
  const location = formData.get("location") as string
  const max_participants = formData.get("max_participants") as string
  const image_url = formData.get("image_url") as string
  const price_info = formData.get("price_info") as string

  if (!title || !event_date) {
    return { error: "Titre et date sont obligatoires" }
  }

  const { error } = await supabase
    .from("events")
    .insert({
      title,
      description: description || null,
      event_date: new Date(event_date).toISOString(),
      location: location || null,
      max_participants: max_participants ? parseInt(max_participants) : null,
      image_url: image_url || null,
      price_info: price_info || null,
    })

  if (error) {
    console.error("Erreur création événement:", error)
    return { error: "Erreur lors de la création: " + error.message }
  }

  revalidatePath("/admin/evenements")
  revalidatePath("/evenements")
  revalidatePath("/(protected)/evenements")
  return { success: true }
}

export async function deleteEvent(eventId: string) {
  const authCheck = await checkAdmin()
  if (!authCheck.isAdmin) {
    return { error: authCheck.error || "Non autorisé" }
  }
  
  const supabase = await createClient()

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)

  if (error) {
    console.error("Erreur suppression événement:", error)
    return { error: "Erreur lors de la suppression" }
  }

  revalidatePath("/admin/evenements")
  revalidatePath("/evenements")
  revalidatePath("/(protected)/evenements")
  return { success: true }
}

export async function deleteEventAction(formData: FormData) {
  const eventId = String(formData.get("event_id") ?? "").trim()

  if (!eventId) {
    redirect("/admin/evenements?error=ID%20événement%20manquant")
  }

  const result = await deleteEvent(eventId)

  if (result.error) {
    redirect(`/admin/evenements?error=${encodeURIComponent(result.error)}`)
  }

  redirect("/admin/evenements?deleted=1")
}

export async function updateEvent(eventId: string, formData: FormData) {
  const authCheck = await checkAdmin()
  if (!authCheck.isAdmin) {
    return { error: authCheck.error || "Non autorisé" }
  }
  
  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const event_date = formData.get("event_date") as string
  const location = formData.get("location") as string
  const max_participants = formData.get("max_participants") as string
  const image_url = formData.get("image_url") as string
  const price_info = formData.get("price_info") as string

  if (!title || !event_date) {
    return { error: "Titre et date sont obligatoires" }
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: description || null,
      event_date: new Date(event_date).toISOString(),
      location: location || null,
      max_participants: max_participants ? parseInt(max_participants) : null,
      image_url: image_url || null,
      price_info: price_info || null,
    })
    .eq("id", eventId)

  if (error) {
    console.error("Erreur modification événement:", error)
    return { error: "Erreur lors de la modification: " + error.message }
  }

  revalidatePath("/admin/evenements")
  revalidatePath("/evenements")
  revalidatePath("/(protected)/evenements")
  return { success: true }
}
