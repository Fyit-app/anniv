"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, 
  Check, 
  X, 
  Pencil,
  Calendar,
  Clock,
  MapPin,
  Users,
  Euro
} from "lucide-react"
import { updateEvent } from "./actions"
import { ImageUpload } from "./image-upload"

type Event = {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  max_participants: number | null
  image_url: string | null
  price_info: string | null
}

export function EditEventButton({ event }: { event: Event }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="text-gold-600 border-gold-200 hover:bg-gold-50"
      >
        <Pencil className="w-4 h-4 mr-1" />
        Modifier
      </Button>

      {isOpen && (
        <EditEventModal event={event} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}

function EditEventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Parser la date existante
  const existingDate = new Date(event.event_date)
  const dateStr = existingDate.toISOString().split("T")[0]
  const hourStr = existingDate.getHours().toString().padStart(2, "0")
  const minuteStr = existingDate.getMinutes().toString().padStart(2, "0")

  const [date, setDate] = useState(dateStr)
  const [hour, setHour] = useState(hourStr)
  const [minute, setMinute] = useState(minuteStr)
  const [imageUrl, setImageUrl] = useState(event.image_url || "")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    // Vérifier date et heure
    if (!date || !hour || !minute) {
      setError("Veuillez sélectionner une date et une heure")
      return
    }

    // Construire la date complète
    const eventDateTime = `${date}T${hour}:${minute}`
    formData.set("event_date", eventDateTime)

    startTransition(async () => {
      const result = await updateEvent(event.id, formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          // Rafraîchir la page pour voir les changements
          window.location.reload()
        }, 1000)
      }
    })
  }

  const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const MINUTES = ["00", "15", "30", "45"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Pencil className="w-5 h-5 text-gold-500" />
            Modifier l'événement
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre *</Label>
            <Input
              id="edit-title"
              name="title"
              defaultValue={event.title}
              required
              className="bg-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={event.description || ""}
              rows={3}
              className="bg-white"
            />
          </div>

          {/* Date et Heure */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-gold-50/50 to-terracotta-50/50 border border-gold-200/50 space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-600" />
                Date *
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white"
                required
              />
            </div>

            {/* Heure */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-terracotta-600" />
                Heure *
              </Label>
              <div className="flex gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-xl bg-white"
                  required
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{h}h</option>
                  ))}
                </select>
                <span className="flex items-center text-xl text-muted-foreground">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-xl bg-white"
                  required
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lieu et Places */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Lieu
              </Label>
              <Input
                id="edit-location"
                name="location"
                defaultValue={event.location || ""}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-max" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Places max
              </Label>
              <Input
                id="edit-max"
                name="max_participants"
                type="number"
                min="1"
                defaultValue={event.max_participants || ""}
                placeholder="Illimité"
                className="bg-white"
              />
            </div>
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <Label htmlFor="edit-price" className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-oasis-600" />
              Prix
            </Label>
            <Input
              id="edit-price"
              name="price_info"
              defaultValue={event.price_info || ""}
              placeholder="Ex: 50€/pers, Gratuit..."
              className="bg-white"
            />
          </div>

          {/* Image */}
          <ImageUpload 
            value={imageUrl} 
            onChange={setImageUrl}
            label="Image de l'événement"
          />

          {/* Messages */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Événement modifié avec succès !
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

