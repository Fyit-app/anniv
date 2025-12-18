"use client"

import { useState, useTransition } from "react"
import { Calendar, MapPin, Plane, Sparkles, Users, Check, Loader2, Minus, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EventWithDetails } from "@/lib/types"
import { registerForEvent, unregisterFromEvent, updateRegistrationParticipants } from "@/app/(protected)/evenements/actions"

interface ProgrammeTimelineProps {
  className?: string
  programmeEvents?: EventWithDetails[]
  maxParticipants?: number
  showRegistration?: boolean
}

// Données statiques du programme (pour les jours sans activité inscriptible)
const STATIC_DAYS = [
  {
    day: "lundi",
    date: "Lundi 12 janvier",
    label: "Jour d'arrivée",
    color: "oasis",
    activities: [
      {
        title: "Bienvenue à Marrakech ! ✈️",
        description: "Arrivée des invités, installation dans vos hébergements et premiers pas dans la ville ocre.",
        badge: "🏨 Installation & repos",
        icon: "plane"
      }
    ]
  },
  {
    day: "dimanche",
    date: "Dimanche 18 janvier",
    label: "Jour de départ",
    color: "terracotta",
    activities: [
      {
        title: "Au revoir Marrakech ! 👋",
        description: "Derniers moments dans la ville ocre avant de reprendre l'avion. Des souvenirs plein la tête !",
        badge: "✈️ Retour à la maison",
        icon: "plane"
      }
    ]
  }
]

function ActivityRegistration({ 
  event, 
  maxParticipants,
  colorClass 
}: { 
  event: EventWithDetails
  maxParticipants: number
  colorClass: string 
}) {
  const [isPending, startTransition] = useTransition()
  const [numParticipants, setNumParticipants] = useState(
    event.my_registration?.num_participants || Math.max(1, maxParticipants)
  )
  const [showSelector, setShowSelector] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFull = event.max_participants 
    ? event.participants_count >= event.max_participants 
    : false
  const spotsLeft = event.max_participants 
    ? event.max_participants - event.participants_count 
    : null

  const handleRegister = () => {
    setError(null)
    startTransition(async () => {
      const result = await registerForEvent(event.id, numParticipants)
      if (result.error) {
        setError(result.error)
      }
      setShowSelector(false)
    })
  }

  const handleUnregister = () => {
    setError(null)
    startTransition(async () => {
      const result = await unregisterFromEvent(event.id)
      if (result.error) {
        setError(result.error)
      }
    })
  }

  const handleUpdateParticipants = (newCount: number) => {
    if (newCount < 1 || newCount > maxParticipants) return
    setNumParticipants(newCount)
    
    if (event.is_registered) {
      startTransition(async () => {
        const result = await updateRegistrationParticipants(event.id, newCount)
        if (result.error) {
          setError(result.error)
        }
      })
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-current/10">
      {/* Statut actuel */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{event.participants_count} inscrit{event.participants_count !== 1 ? "s" : ""}</span>
          {spotsLeft !== null && spotsLeft > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {spotsLeft} place{spotsLeft > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        
        {event.is_registered && (
          <Badge className={cn("text-[10px]", colorClass.includes("oasis") ? "bg-oasis-500" : colorClass.includes("gold") ? "bg-gold-500" : "bg-terracotta-500")}>
            <Check className="h-3 w-3 mr-1" />
            Inscrit ({event.my_registration?.num_participants} pers.)
          </Badge>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 rounded-lg text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Sélecteur de participants */}
      {(showSelector || event.is_registered) && (
        <div className="mb-3 p-3 bg-white/50 rounded-xl border border-current/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Participants</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdateParticipants(numParticipants - 1)}
                disabled={numParticipants <= 1 || isPending}
                className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:bg-muted disabled:opacity-50 text-foreground"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-bold text-sm">{numParticipants}</span>
              <button
                type="button"
                onClick={() => handleUpdateParticipants(numParticipants + 1)}
                disabled={numParticipants >= maxParticipants || isPending}
                className="w-7 h-7 rounded-full bg-white border flex items-center justify-center hover:bg-muted disabled:opacity-50 text-foreground"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          {maxParticipants > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Max {maxParticipants} (votre groupe)
            </p>
          )}
        </div>
      )}

      {/* Boutons d'action */}
      {event.is_registered ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs"
          onClick={handleUnregister}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <X className="w-3 h-3 mr-1" />
              Se désinscrire
            </>
          )}
        </Button>
      ) : isFull ? (
        <Button disabled size="sm" className="w-full h-8 text-xs">
          Complet
        </Button>
      ) : showSelector ? (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setShowSelector(false)}
          >
            Annuler
          </Button>
          <Button
            size="sm"
            className={cn("flex-1 h-8 text-xs", colorClass.includes("oasis") ? "bg-oasis-600 hover:bg-oasis-700" : colorClass.includes("gold") ? "bg-gold-600 hover:bg-gold-700" : "bg-terracotta-600 hover:bg-terracotta-700")}
            onClick={handleRegister}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Check className="w-3 h-3 mr-1" />
                Confirmer
              </>
            )}
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          className={cn("w-full h-8 text-xs", colorClass.includes("oasis") ? "bg-oasis-600 hover:bg-oasis-700" : colorClass.includes("gold") ? "bg-gold-600 hover:bg-gold-700" : "bg-terracotta-600 hover:bg-terracotta-700")}
          onClick={() => {
            setNumParticipants(Math.max(1, maxParticipants))
            setShowSelector(true)
          }}
        >
          Je participe
        </Button>
      )}
    </div>
  )
}

export function ProgrammeTimeline({ 
  className, 
  programmeEvents = [],
  maxParticipants = 1,
  showRegistration = true
}: ProgrammeTimelineProps) {
  // Organiser les événements par jour
  const eventsByDay: Record<string, EventWithDetails[]> = {}
  programmeEvents.forEach(event => {
    const day = event.programme_day || 'autre'
    if (!eventsByDay[day]) eventsByDay[day] = []
    eventsByDay[day].push(event)
  })

  const getColorClasses = (day: string) => {
    switch (day) {
      case 'lundi': return { bg: 'bg-oasis-50/50', border: 'border-oasis-100', dot: 'bg-oasis-400', badge: 'bg-oasis-100 text-oasis-700', icon: 'bg-oasis-500' }
      case 'mardi': return { bg: 'bg-gold-50/50', border: 'border-gold-100', dot: 'bg-gold-500', badge: 'bg-gold-100 text-gold-700', icon: 'bg-gold-500' }
      case 'mercredi': return { bg: 'bg-terracotta-50/50', border: 'border-terracotta-100', dot: 'bg-terracotta-500', badge: 'bg-terracotta-100 text-terracotta-700', icon: 'bg-terracotta-500' }
      case 'jeudi': return { bg: 'bg-gradient-to-br from-gold-50 via-terracotta-50/50 to-oasis-50/30', border: 'border-gold-300 border-2', dot: 'bg-gradient-to-br from-gold-400 via-terracotta-500 to-oasis-500', badge: 'bg-gradient-to-r from-gold-500 to-terracotta-500 text-white', icon: 'bg-gradient-to-br from-gold-500 to-terracotta-500' }
      case 'vendredi': return { bg: 'bg-terracotta-50/50', border: 'border-terracotta-100', dot: 'bg-terracotta-400', badge: 'bg-terracotta-100 text-terracotta-700', icon: 'bg-terracotta-500' }
      case 'samedi': return { bg: 'bg-oasis-50/50', border: 'border-oasis-100', dot: 'bg-oasis-500', badge: 'bg-oasis-100 text-oasis-700', icon: 'bg-oasis-500' }
      case 'dimanche': return { bg: 'bg-terracotta-50/50', border: 'border-terracotta-100', dot: 'bg-terracotta-400', badge: 'bg-terracotta-100 text-terracotta-700', icon: 'bg-terracotta-500' }
      default: return { bg: 'bg-muted/50', border: 'border-muted', dot: 'bg-muted-foreground', badge: 'bg-muted text-muted-foreground', icon: 'bg-muted-foreground' }
    }
  }

  const getDayLabel = (day: string) => {
    switch (day) {
      case 'lundi': return { date: 'Lundi 12 janvier', label: "Jour d'arrivée" }
      case 'mardi': return { date: 'Mardi 13 janvier', label: 'Journée découverte' }
      case 'mercredi': return { date: 'Mercredi 14 janvier', label: 'Excursion nature' }
      case 'jeudi': return { date: '⭐ Jeudi 15 janvier ⭐', label: 'LE JOUR J !' }
      case 'vendredi': return { date: 'Vendredi 16 janvier', label: 'Shopping & découverte' }
      case 'samedi': return { date: 'Samedi 17 janvier', label: 'Bien-être & détente' }
      case 'dimanche': return { date: 'Dimanche 18 janvier', label: 'Jour de départ' }
      default: return { date: day, label: '' }
    }
  }

  // Ordre des jours
  const dayOrder = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
  const sortedDays = dayOrder.filter(d => eventsByDay[d]?.length > 0 || STATIC_DAYS.some(s => s.day === d))

  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-400 via-terracotta-400 to-oasis-400 hidden md:block" />

      <div className="space-y-4 sm:space-y-6">
        {sortedDays.map((day) => {
          const colors = getColorClasses(day)
          const labels = getDayLabel(day)
          const events = eventsByDay[day] || []
          const staticDay = STATIC_DAYS.find(s => s.day === day)
          const isJourJ = day === 'jeudi'

          return (
            <div key={day} className="relative flex gap-4 sm:gap-6">
              {/* Timeline dot */}
              <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                <div className={cn(
                  "rounded-full border-4 shadow-lg",
                  isJourJ ? "h-7 w-7 border-gold-100 shadow-gold-500/50 animate-pulse" : "h-5 w-5 border-white",
                  colors.dot
                )} />
              </div>
              
              {/* Card */}
              <div className={cn(
                "flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                colors.border,
                isJourJ && "shadow-xl shadow-gold-500/10 relative overflow-hidden"
              )}>
                {/* Decorative for Jour J */}
                {isJourJ && (
                  <>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl">🎂</div>
                    <div className="absolute bottom-3 right-6 sm:bottom-4 sm:right-8 text-lg sm:text-xl">🎉</div>
                  </>
                )}

                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className={cn("px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold", colors.badge)}>
                    {labels.date}
                  </span>
                  <span className={cn("text-xs sm:text-sm", isJourJ ? "text-gold-700 font-semibold" : "text-muted-foreground")}>
                    {labels.label}
                  </span>
                </div>

                {/* Static activities (arrivée/départ) */}
                {staticDay && !events.length && (
                  <div className={cn("flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl", colors.bg, colors.border)}>
                    <div className={cn("flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-white", colors.icon)}>
                      <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm sm:text-base">{staticDay.activities[0].title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{staticDay.activities[0].description}</p>
                      <div className={cn("mt-2 inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm", colors.badge.replace('text-', 'bg-').split(' ')[0] + '/20', colors.badge.split(' ')[1])}>
                        {staticDay.activities[0].badge}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dynamic events from DB */}
                {events.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className={cn(
                        "p-3 sm:p-4 rounded-xl sm:rounded-2xl",
                        isJourJ ? "bg-white/70 border border-gold-200 backdrop-blur-sm" : colors.bg,
                        !isJourJ && colors.border
                      )}>
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={cn("flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-white shadow-lg", colors.icon)}>
                            {isJourJ ? (
                              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : day === 'samedi' ? (
                              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            ) : (
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={cn("font-semibold text-foreground text-sm sm:text-base", isJourJ && "font-display text-lg sm:text-xl font-bold")}>
                              {event.title}
                            </h4>
                            
                            {isJourJ && (
                              <p className="text-gold-800 mt-1.5 sm:mt-2 italic text-sm sm:text-base">
                                Guidée et portée par la grâce de Dieu
                              </p>
                            )}
                            
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{event.description}</p>
                            
                            {/* Location & Time */}
                            {event.location && (
                              <div className={cn("mt-2 sm:mt-3 p-2 sm:p-3 rounded-lg", isJourJ ? "bg-gold-100/50 border border-gold-200" : "bg-white/50")}>
                                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {event.location}
                                </div>
                                {isJourJ && (
                                  <>
                                    <div className="flex items-center gap-2 text-sm mt-1">
                                      <span>🕕</span>
                                      <span className="font-medium">Rendez-vous à 18h00</span>
                                    </div>
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                      Pour un moment dînatoire inoubliable
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                            
                            {/* Price info */}
                            {event.price_info && (
                              <div className={cn("mt-2 inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium", colors.badge)}>
                                {event.price_info}
                              </div>
                            )}
                            
                            {/* Max participants */}
                            {event.max_participants && (
                              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-oasis-100 text-oasis-700 text-xs sm:text-sm">
                                <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                Max {event.max_participants} pers.
                              </span>
                            )}

                            {/* Emojis for Jour J */}
                            {isJourJ && (
                              <>
                                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                                  <span className="text-xl sm:text-2xl">🍾</span>
                                  <span className="text-xl sm:text-2xl">🥳</span>
                                  <span className="text-xl sm:text-2xl">❤️</span>
                                  <span className="text-xl sm:text-2xl">🧡</span>
                                  <span className="text-xl sm:text-2xl">💛</span>
                                  <span className="text-xl sm:text-2xl">💚</span>
                                  <span className="text-xl sm:text-2xl">💙</span>
                                  <span className="text-xl sm:text-2xl">💜</span>
                                </div>
                                <p className="mt-2 sm:mt-3 text-base sm:text-lg font-bold text-gold-700">ONE LIFE ❤️</p>
                              </>
                            )}

                            {/* Registration */}
                            {showRegistration && maxParticipants > 0 && (
                              <ActivityRegistration 
                                event={event}
                                maxParticipants={maxParticipants}
                                colorClass={colors.icon}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ProgrammeSectionProps {
  className?: string
  showHeader?: boolean
  programmeEvents?: EventWithDetails[]
  maxParticipants?: number
  showRegistration?: boolean
}

export function ProgrammeSection({ 
  className, 
  showHeader = true,
  programmeEvents = [],
  maxParticipants = 1,
  showRegistration = true
}: ProgrammeSectionProps) {
  return (
    <div className={cn("relative py-8 sm:py-12", className)}>
      {showHeader && (
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold-100 text-gold-700 text-xs sm:text-sm font-medium mb-4">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>12 – 18 janvier 2026</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground lg:text-4xl">
            Programme de la semaine
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            {showRegistration 
              ? "Inscrivez-vous aux activités qui vous intéressent !"
              : "Une semaine exceptionnelle entre découvertes culturelles et moments de fête"
            }
          </p>
        </div>
      )}
      
      <ProgrammeTimeline 
        programmeEvents={programmeEvents}
        maxParticipants={maxParticipants}
        showRegistration={showRegistration}
      />
      
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-muted-foreground text-xs sm:text-sm">
          * Les tarifs sont indicatifs et peuvent varier
        </p>
      </div>
    </div>
  )
}
