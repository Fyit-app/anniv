"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Event, EventWithDetails, EventRegistration, FamilyMember } from "@/lib/types"

// Récupérer tous les événements avec leurs détails
export async function getEventsWithDetails(eventType?: 'programme' | 'custom' | 'all'): Promise<EventWithDetails[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  // Vérifier si l'utilisateur est admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // Récupérer les événements (filtrer par type si spécifié)
  // La RLS filtre déjà les événements non publiés pour les non-admins,
  // mais on ajoute une double vérification côté code
  let query = supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })

  if (eventType && eventType !== 'all') {
    query = query.eq("event_type", eventType)
  }

  const { data: events, error: eventsError } = await query

  if (eventsError || !events) {
    console.error("Erreur lors de la récupération des événements:", eventsError)
    return []
  }

  // Filtrer les événements non publiés pour les non-admins (double vérification)
  const filteredEvents = isAdmin ? events : events.filter(e => e.published === true)

  // Récupérer les inscriptions de l'utilisateur
  const { data: myRegistrations } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("profile_id", user.id)

  // Pour chaque événement, obtenir le nombre de participants
  const eventsWithDetails: EventWithDetails[] = await Promise.all(
    filteredEvents.map(async (event) => {
      // Utiliser la fonction SQL pour compter les participants
      const { data: countData } = await supabase
        .rpc("get_event_participants_count", { event_uuid: event.id })

      const myReg = myRegistrations?.find(r => r.event_id === event.id)

      return {
        ...event,
        participants_count: countData || 0,
        is_registered: !!myReg,
        my_registration: myReg,
      }
    })
  )

  return eventsWithDetails
}

// Récupérer uniquement les événements du programme
export async function getProgrammeEvents(): Promise<EventWithDetails[]> {
  return getEventsWithDetails('programme')
}

// Récupérer les membres de la famille de l'utilisateur
export async function getMyFamilyMembers(): Promise<FamilyMember[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: members } = await supabase
    .from("family_members")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: true })

  return members || []
}

// S'inscrire à un événement
export async function registerForEvent(eventId: string, numParticipants: number = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Vérifier que l'événement existe
  const { data: event } = await supabase
    .from("events")
    .select("id, max_participants")
    .eq("id", eventId)
    .single()

  if (!event) {
    return { error: "Événement introuvable" }
  }

  // Vérifier si déjà inscrit
  const { data: existingReg } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("profile_id", user.id)
    .single()

  if (existingReg) {
    return { error: "Vous êtes déjà inscrit à cet événement" }
  }

  // Vérifier la capacité si max_participants est défini
  if (event.max_participants) {
    const { data: currentCount } = await supabase
      .rpc("get_event_participants_count", { event_uuid: eventId })

    if ((currentCount || 0) + numParticipants > event.max_participants) {
      return { error: "Nombre de places insuffisant" }
    }
  }

  // Créer l'inscription
  const { error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      profile_id: user.id,
      num_participants: numParticipants,
    })

  if (error) {
    console.error("Erreur lors de l'inscription:", error)
    return { error: "Erreur lors de l'inscription" }
  }

  revalidatePath("/evenements")
  return { success: true }
}

// Se désinscrire d'un événement
export async function unregisterFromEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("profile_id", user.id)

  if (error) {
    console.error("Erreur lors de la désinscription:", error)
    return { error: "Erreur lors de la désinscription" }
  }

  revalidatePath("/evenements")
  return { success: true }
}

// Modifier le nombre de participants pour une inscription
export async function updateRegistrationParticipants(eventId: string, numParticipants: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  if (numParticipants < 1) {
    return { error: "Il faut au moins 1 participant" }
  }

  // Vérifier la capacité si max_participants est défini
  const { data: event } = await supabase
    .from("events")
    .select("max_participants")
    .eq("id", eventId)
    .single()

  if (event?.max_participants) {
    const { data: currentCount } = await supabase
      .rpc("get_event_participants_count", { event_uuid: eventId })

    // Récupérer l'inscription actuelle
    const { data: myReg } = await supabase
      .from("event_registrations")
      .select("num_participants")
      .eq("event_id", eventId)
      .eq("profile_id", user.id)
      .single()

    const oldCount = myReg?.num_participants || 0
    const newTotal = (currentCount || 0) - oldCount + numParticipants

    if (newTotal > event.max_participants) {
      return { error: "Nombre de places insuffisant" }
    }
  }

  const { error } = await supabase
    .from("event_registrations")
    .update({ num_participants: numParticipants })
    .eq("event_id", eventId)
    .eq("profile_id", user.id)

  if (error) {
    console.error("Erreur lors de la mise à jour:", error)
    return { error: "Erreur lors de la mise à jour" }
  }

  revalidatePath("/evenements")
  return { success: true }
}

