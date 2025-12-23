"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Check, 
  Loader2,
  Minus,
  Plus,
  X
} from "lucide-react"
import { registerForEvent, unregisterFromEvent, updateRegistrationParticipants } from "./actions"
import type { EventWithDetails } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: EventWithDetails
  maxParticipants: number
  delay?: number
}

export function EventCard({ event, maxParticipants, delay = 0 }: EventCardProps) {
  const [isPending, startTransition] = useTransition()
  const [numParticipants, setNumParticipants] = useState(
    event.my_registration?.num_participants || maxParticipants
  )
  const [showParticipantSelector, setShowParticipantSelector] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const eventDate = new Date(event.event_date)
  const isPast = eventDate < new Date()
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
      setShowParticipantSelector(false)
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
    <Card 
      className={cn(
        "bg-card-premium overflow-hidden transition-all duration-300 hover:shadow-lg reveal reveal--visible",
        event.is_registered && "ring-2 ring-secondary",
        isPast && "opacity-60"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      {event.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {event.is_registered && (
            <div className="absolute top-3 right-3">
              <Badge variant="success" className="shadow-lg">
                <Check className="w-3 h-3 mr-1" />
                Inscrit
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
          {!event.image_url && event.is_registered && (
            <Badge variant="success" className="shrink-0">
              <Check className="w-3 h-3 mr-1" />
              Inscrit
            </Badge>
          )}
        </div>

        {/* Date et lieu */}
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {eventDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              {" à "}
              {eventDate.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {event.description}
          </p>
        )}

        {/* Compteur participants */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {event.participants_count} participant{event.participants_count !== 1 ? "s" : ""}
            </span>
          </div>
          {spotsLeft !== null && (
            <Badge variant={spotsLeft <= 3 ? "warning" : "outline"}>
              {spotsLeft <= 0 ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""} restante${spotsLeft > 1 ? "s" : ""}`}
            </Badge>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="mt-3 p-2 bg-destructive/10 rounded text-destructive text-xs">
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {/* Sélecteur de participants */}
        {(showParticipantSelector || event.is_registered) && !isPast && (
          <div className="w-full p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nombre de participants</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateParticipants(numParticipants - 1)}
                  disabled={numParticipants <= 1 || isPending}
                  className="w-8 h-8 rounded-full bg-background border flex items-center justify-center hover:bg-muted disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{numParticipants}</span>
                <button
                  type="button"
                  onClick={() => handleUpdateParticipants(numParticipants + 1)}
                  disabled={numParticipants >= maxParticipants || isPending}
                  className="w-8 h-8 rounded-full bg-background border flex items-center justify-center hover:bg-muted disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum {maxParticipants} (votre groupe)
            </p>
          </div>
        )}

        {/* Boutons d'action */}
        {isPast ? (
          <div className="w-full text-center text-sm text-muted-foreground py-2">
            Événement passé
          </div>
        ) : event.is_registered ? (
          <div className="w-full flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleUnregister}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Se désinscrire
                </>
              )}
            </Button>
          </div>
        ) : isFull ? (
          <Button disabled className="w-full">
            Complet
          </Button>
        ) : showParticipantSelector ? (
          <div className="w-full flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowParticipantSelector(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={handleRegister}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Confirmer
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => {
              setNumParticipants(maxParticipants)
              setShowParticipantSelector(true)
            }}
          >
            Je participe
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}




