// Types pour l'application Anniv Marrakech

export interface Profile {
  id: string
  role: 'admin' | 'invite'
  prenom: string | null
  nom: string | null
  telephone: string | null
  onboarding_completed: boolean
  arrival_date: string | null
  departure_date: string | null
  arrival_transport: 'avion' | 'train' | 'voiture' | 'autre' | null
  arrival_airport: string | null
  residence_location: string | null
  group_name: string | null
  updated_at: string
}

export interface FamilyMember {
  id: string
  profile_id: string
  first_name: string
  is_minor: boolean
  email: string | null
  invitation_sent_at: string | null
  linked_user_id: string | null
  created_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  max_participants: number | null
  image_url: string | null
  created_at: string
  event_type?: 'programme' | 'custom'
  price_info?: string | null
  programme_day?: string | null
}

export interface EventRegistration {
  id: string
  event_id: string
  profile_id: string
  num_participants: number
  created_at: string
}

export interface EventWithDetails extends Event {
  participants_count: number
  is_registered: boolean
  my_registration?: EventRegistration
}

// Types pour le formulaire d'onboarding
export interface OnboardingFormData {
  // Étape 1 - Séjour
  arrival_date: string
  departure_date: string
  arrival_transport: 'avion' | 'train' | 'voiture' | 'autre'
  arrival_airport: string
  residence_location: string
  // Étape 2 - Participants
  family_members: {
    first_name: string
    is_minor: boolean
  }[]
}

