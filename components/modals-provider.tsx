"use client"

import { useState, useEffect } from "react"
import { WelcomeModal } from "./welcome-modal"
import { EventStepperModal } from "./event-stepper-modal"
import type { Event, Profile } from "@/lib/types"

interface ModalsProviderProps {
  profile: Profile
  events: Event[]
}

type ModalState = "none" | "welcome" | "stepper"

export function ModalsProvider({ profile, events }: ModalsProviderProps) {
  const [modalState, setModalState] = useState<ModalState>("none")

  // Déterminer quelle modale afficher au chargement
  useEffect(() => {
    // Si onboarding complété ET welcome pas encore vue → afficher WelcomeModal
    if (profile.onboarding_completed && !profile.welcome_seen) {
      setModalState("welcome")
    }
  }, [profile.onboarding_completed, profile.welcome_seen])

  // Callback quand WelcomeModal est fermée → ouvrir EventStepper
  const handleWelcomeComplete = () => {
    setModalState("stepper")
  }

  // Callback quand EventStepper est terminé → fermer tout
  const handleStepperComplete = () => {
    setModalState("none")
  }

  // Ne rien afficher si pas de modale active
  if (modalState === "none") {
    return null
  }

  return (
    <>
      {modalState === "welcome" && (
        <WelcomeModal
          firstName={profile.prenom || ""}
          onComplete={handleWelcomeComplete}
        />
      )}

      {modalState === "stepper" && events.length > 0 && (
        <EventStepperModal
          events={events}
          onComplete={handleStepperComplete}
        />
      )}
    </>
  )
}

