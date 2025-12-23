"use client"

import { useState, useTransition, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/browser"
import type { Event } from "@/lib/types"
import { 
  Check, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight,
  Loader2,
  PartyPopper,
  ChevronLeft
} from "lucide-react"

interface EventStepperModalProps {
  events: Event[]
  onComplete: () => void
}

interface EventsByDate {
  date: string
  formattedDate: string
  events: Event[]
}

export function EventStepperModal({ events, onComplete }: EventStepperModalProps) {
  const [isPending, startTransition] = useTransition()
  const [isVisible, setIsVisible] = useState(false)
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, "yes" | "no">>({})
  const [isCompleted, setIsCompleted] = useState(false)

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Trier les événements par date
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => 
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    )
  }, [events])

  // Grouper par date pour l'affichage
  const eventsByDate = useMemo<EventsByDate[]>(() => {
    const grouped: Record<string, Event[]> = {}
    
    sortedEvents.forEach(event => {
      const dateKey = new Date(event.event_date).toISOString().split("T")[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })

    return Object.entries(grouped).map(([date, events]) => ({
      date,
      formattedDate: new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }),
      events
    }))
  }, [sortedEvents])

  const currentEvent = sortedEvents[currentEventIndex]
  const progress = ((currentEventIndex) / sortedEvents.length) * 100

  // Formater l'heure
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    })
  }

  const handleResponse = async (response: "yes" | "no") => {
    if (!currentEvent) return

    // Sauvegarder la réponse localement
    setResponses(prev => ({ ...prev, [currentEvent.id]: response }))

    startTransition(async () => {
      // Enregistrer la réponse dans Supabase
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        if (response === "yes") {
          // Inscrire à l'événement
          await supabase
            .from("event_registrations")
            .upsert({
              event_id: currentEvent.id,
              profile_id: user.id,
              num_participants: 1
            }, {
              onConflict: "event_id,profile_id"
            })
        } else {
          // Supprimer l'inscription si existante
          await supabase
            .from("event_registrations")
            .delete()
            .eq("event_id", currentEvent.id)
            .eq("profile_id", user.id)
        }
      }

      // Passer à l'événement suivant ou terminer
      if (currentEventIndex < sortedEvents.length - 1) {
        setCurrentEventIndex(currentEventIndex + 1)
      } else {
        setIsCompleted(true)
      }
    })
  }

  const handlePrevious = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
  }

  if (!currentEvent && !isCompleted) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-night-900/80 backdrop-blur-sm
          transition-opacity duration-500
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-lg overflow-hidden rounded-3xl
          bg-white shadow-2xl shadow-night-900/20
          transition-all duration-700 ease-out
          ${isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-8"
          }
        `}
      >
        {/* Écran de complétion */}
        {isCompleted ? (
          <div className="px-6 py-12 sm:px-10 text-center">
            {/* Animation de succès */}
            <div className="inline-flex relative mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-oasis-500 shadow-xl shadow-green-500/30">
                <Check className="h-12 w-12 text-white" />
              </div>
              <PartyPopper className="absolute -top-2 -right-2 h-8 w-8 text-gold-500 animate-bounce" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
              Merci pour tes réponses ! 🙏
            </h2>
            
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Tes inscriptions ont été enregistrées. Tu peux les modifier à tout moment depuis ton espace.
            </p>

            {/* Résumé */}
            <div className="bg-muted/50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-sm text-muted-foreground mb-4">Récapitulatif</h3>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {Object.values(responses).filter(r => r === "yes").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Participations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-muted-foreground">
                    {Object.values(responses).filter(r => r === "no").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Déclinées</div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleComplete}
              size="lg"
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-gold-600 to-terracotta-600 hover:from-gold-700 hover:to-terracotta-700 shadow-xl"
            >
              Accéder à mon espace
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        ) : (
          <>
            {/* Header avec progression */}
            <div className="px-6 pt-6 sm:px-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Programme des festivités
                </span>
                <span className="text-sm font-semibold text-gold-600">
                  {currentEventIndex + 1} / {sortedEvents.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Carte événement */}
            <div className="px-6 py-8 sm:px-8">
              {/* Badge date */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-800 text-sm font-medium mb-6">
                <Calendar className="h-4 w-4" />
                {formatDate(currentEvent.event_date)}
              </div>

              {/* Titre et description */}
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
                {currentEvent.title}
              </h2>
              
              {currentEvent.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {currentEvent.description}
                </p>
              )}

              {/* Infos */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-gold-600" />
                  {formatTime(currentEvent.event_date)}
                </div>
                
                {currentEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-terracotta-600" />
                    {currentEvent.location}
                  </div>
                )}
              </div>

              {/* Image si disponible */}
              {currentEvent.image_url && (
                <div className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-muted">
                  <img
                    src={currentEvent.image_url}
                    alt={currentEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Boutons de réponse */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleResponse("no")}
                  disabled={isPending}
                  variant="outline"
                  size="lg"
                  className="h-14 text-base font-medium border-2 hover:bg-muted/50 hover:border-muted-foreground/30"
                >
                  {isPending && responses[currentEvent.id] === undefined ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <X className="h-5 w-5 mr-2 text-muted-foreground" />
                      Je ne participe pas
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => handleResponse("yes")}
                  disabled={isPending}
                  size="lg"
                  className="h-14 text-base font-medium bg-gradient-to-r from-green-600 to-oasis-600 hover:from-green-700 hover:to-oasis-700 shadow-lg"
                >
                  {isPending && responses[currentEvent.id] === undefined ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Je participe
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer avec navigation */}
            {currentEventIndex > 0 && (
              <div className="px-6 pb-6 sm:px-8">
                <button
                  onClick={handlePrevious}
                  disabled={isPending}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Événement précédent
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}




