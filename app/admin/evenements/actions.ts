"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Vérifier si admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: "Non autorisé" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const event_date = formData.get("event_date") as string
  const location = formData.get("location") as string
  const max_participants = formData.get("max_participants") as string
  const image_url = formData.get("image_url") as string

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
    })

  if (error) {
    console.error("Erreur création événement:", error)
    return { error: "Erreur lors de la création" }
  }

  revalidatePath("/admin/evenements")
  revalidatePath("/evenements")
  return { success: true }
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Vérifier si admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { error: "Non autorisé" }
  }

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
  return { success: true }
}

