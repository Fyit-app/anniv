"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import type { OnboardingFormData } from "@/lib/types"

// Récupérer le profil de l'utilisateur connecté
export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile
}

// Récupérer les membres de la famille
export async function getFamilyMembers() {
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

// Sauvegarder l'étape 1 (séjour)
export async function saveStayInfo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const arrival_date = formData.get("arrival_date") as string
  const departure_date = formData.get("departure_date") as string
  const arrival_transport = formData.get("arrival_transport") as string
  const arrival_airport = formData.get("arrival_airport") as string
  const residence_location = formData.get("residence_location") as string

  // Validation
  if (!arrival_date || !departure_date || !arrival_transport || !residence_location) {
    return { error: "Veuillez remplir tous les champs obligatoires" }
  }

  if (arrival_transport === "avion" && !arrival_airport) {
    return { error: "Veuillez indiquer l'aéroport d'arrivée" }
  }

  if (new Date(departure_date) < new Date(arrival_date)) {
    return { error: "La date de départ doit être après la date d'arrivée" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      arrival_date,
      departure_date,
      arrival_transport,
      arrival_airport: arrival_transport === "avion" ? arrival_airport : null,
      residence_location,
    })
    .eq("id", user.id)

  if (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return { error: "Erreur lors de la sauvegarde" }
  }

  revalidatePath("/onboarding")
  return { success: true }
}

// Sauvegarder l'étape 2 (informations utilisateur + participants)
export async function saveParticipants(data: {
  prenom: string
  nom: string
  accompagnants: { first_name: string; is_minor: boolean }[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Validation
  if (!data.prenom.trim()) {
    return { error: "Le prénom est obligatoire" }
  }
  if (!data.nom.trim()) {
    return { error: "Le nom de famille est obligatoire" }
  }

  for (const member of data.accompagnants) {
    if (!member.first_name.trim()) {
      return { error: "Tous les prénoms des accompagnants sont obligatoires" }
    }
  }

  // Mettre à jour le profil avec prénom et nom
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      prenom: data.prenom.trim(),
      nom: data.nom.trim(),
    })
    .eq("id", user.id)

  if (profileError) {
    console.error("Erreur lors de la sauvegarde du profil:", profileError)
    return { error: "Erreur lors de la sauvegarde" }
  }

  // Supprimer les anciens membres de la famille
  await supabase
    .from("family_members")
    .delete()
    .eq("profile_id", user.id)

  // Créer la liste complète des participants (utilisateur + accompagnants)
  const allMembers = [
    // L'utilisateur principal (toujours majeur)
    { first_name: data.prenom.trim(), is_minor: false },
    // Les accompagnants
    ...data.accompagnants.map(m => ({
      first_name: m.first_name.trim(),
      is_minor: m.is_minor,
    }))
  ]

  // Insérer tous les membres
  const { error } = await supabase
    .from("family_members")
    .insert(
      allMembers.map((m) => ({
        profile_id: user.id,
        first_name: m.first_name,
        is_minor: m.is_minor,
      }))
    )

  if (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return { error: "Erreur lors de la sauvegarde des participants" }
  }

  revalidatePath("/onboarding")
  return { success: true }
}

// Ancienne fonction conservée pour compatibilité
export async function saveFamilyMembers(members: { first_name: string; is_minor: boolean }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Validation
  if (members.length === 0) {
    return { error: "Veuillez ajouter au moins un participant" }
  }

  for (const member of members) {
    if (!member.first_name.trim()) {
      return { error: "Tous les prénoms sont obligatoires" }
    }
  }

  // Supprimer les anciens membres
  await supabase
    .from("family_members")
    .delete()
    .eq("profile_id", user.id)

  // Insérer les nouveaux membres
  const { error } = await supabase
    .from("family_members")
    .insert(
      members.map((m) => ({
        profile_id: user.id,
        first_name: m.first_name.trim(),
        is_minor: m.is_minor,
      }))
    )

  if (error) {
    console.error("Erreur lors de la sauvegarde:", error)
    return { error: "Erreur lors de la sauvegarde des participants" }
  }

  revalidatePath("/onboarding")
  return { success: true }
}

// Finaliser l'onboarding
export async function completeOnboarding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  // Vérifier que toutes les données sont présentes
  const { data: profile } = await supabase
    .from("profiles")
    .select("arrival_date, departure_date, arrival_transport, residence_location")
    .eq("id", user.id)
    .single()

  if (!profile?.arrival_date || !profile?.departure_date || !profile?.arrival_transport || !profile?.residence_location) {
    return { error: "Veuillez compléter toutes les informations de séjour" }
  }

  const { data: members } = await supabase
    .from("family_members")
    .select("id")
    .eq("profile_id", user.id)

  if (!members || members.length === 0) {
    return { error: "Veuillez ajouter au moins un participant" }
  }

  // Marquer l'onboarding comme terminé
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_completed: true })
    .eq("id", user.id)

  if (error) {
    console.error("Erreur lors de la finalisation:", error)
    return { error: "Erreur lors de la finalisation" }
  }

  revalidatePath("/")
  redirect("/dashboard")
}

