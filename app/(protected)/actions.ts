"use server"

import { createClient } from "@/lib/supabase/server"
import type { Profile, Event } from "@/lib/types"

/**
 * Récupère le profil complet de l'utilisateur connecté
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

/**
 * Récupère tous les événements du programme
 * triés par date
 */
export async function getProgrammeEvents(): Promise<Event[]> {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })

  return events || []
}

/**
 * Met à jour le flag welcome_seen du profil
 */
export async function markWelcomeSeen(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ welcome_seen: true })
    .eq("id", user.id)

  if (error) {
    console.error("Erreur mise à jour welcome_seen:", error)
    return { error: "Erreur lors de la mise à jour" }
  }

  return {}
}

