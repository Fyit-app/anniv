"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Check } from "lucide-react"
import { createEvent } from "./actions"

export function EventForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await createEvent(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Reset form
        const form = document.getElementById("event-form") as HTMLFormElement
        form?.reset()
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <form id="event-form" action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: Dîner de gala"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Décrivez l'événement..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_date">Date et heure *</Label>
          <Input
            id="event_date"
            name="event_date"
            type="datetime-local"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_participants">Places max</Label>
          <Input
            id="max_participants"
            name="max_participants"
            type="number"
            min="1"
            placeholder="Illimité"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lieu</Label>
        <Input
          id="location"
          name="location"
          placeholder="Ex: Riad Marrakech"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL de l'image</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          placeholder="https://..."
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          Événement créé avec succès !
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Créer l'événement"
        )}
      </Button>
    </form>
  )
}

