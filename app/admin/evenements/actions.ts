"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export async function createEvent(formData: FormData) {
  await requireAdmin()
  
  const supabase = await createClient()

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
  await requireAdmin()
  
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
