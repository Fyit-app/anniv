"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Check, Calendar, Clock, ChevronLeft, ChevronRight, Euro } from "lucide-react"
import { createEvent } from "./actions"
import { ImageUpload } from "./image-upload"

// Noms des mois en français
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

// Heures disponibles
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
const MINUTES = ["00", "15", "30", "45"]

function DateTimePicker({
  value,
  onChange,
}: {
  value: { date: string; hour: string; minute: string }
  onChange: (value: { date: string; hour: string; minute: string }) => void
}) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    // Par défaut, afficher janvier 2026 (date de l'événement)
    return new Date(2026, 0, 1)
  })

  const selectedDate = value.date ? new Date(value.date) : null

  // Obtenir les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Jour de la semaine du 1er (0 = dimanche, on veut 0 = lundi)
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6

    const days: (number | null)[] = []
    
    // Ajouter les jours vides du début
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const handleDateSelect = (day: number) => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    onChange({ ...value, date: dateStr })
    setShowCalendar(false)
  }

  const navigateMonth = (direction: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1))
  }

  const formatDisplayDate = () => {
    if (!selectedDate) return "Sélectionner une date"
    return selectedDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      viewDate.getMonth() === selectedDate.getMonth() &&
      viewDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="space-y-4">
      {/* Sélecteur de date */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-600" />
          Date *
        </Label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-4 py-3 text-left border rounded-xl bg-white hover:border-gold-300 transition-colors flex items-center justify-between"
          >
            <span className={selectedDate ? "text-foreground capitalize" : "text-muted-foreground"}>
              {formatDisplayDate()}
            </span>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </button>

          {showCalendar && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border rounded-xl shadow-lg z-50">
              {/* Header du calendrier */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-semibold">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(viewDate).map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <button
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`w-full h-full rounded-lg text-sm font-medium transition-all ${
                          isSelected(day)
                            ? "bg-gradient-to-br from-gold-400 to-terracotta-500 text-white shadow-md"
                            : isToday(day)
                            ? "bg-gold-100 text-gold-800 hover:bg-gold-200"
                            : "hover:bg-muted"
                        }`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Raccourcis */}
              <div className="mt-4 pt-4 border-t flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(2026, 0, 1))
                    handleDateSelect(15)
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gold-50 text-gold-700 hover:bg-gold-100 transition-colors"
                >
                  15 Jan 2026
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(2026, 0, 1))
                    handleDateSelect(16)
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gold-50 text-gold-700 hover:bg-gold-100 transition-colors"
                >
                  16 Jan 2026
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(2026, 0, 1))
                    handleDateSelect(17)
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gold-50 text-gold-700 hover:bg-gold-100 transition-colors"
                >
                  17 Jan 2026
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(2026, 0, 1))
                    handleDateSelect(18)
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gold-50 text-gold-700 hover:bg-gold-100 transition-colors"
                >
                  18 Jan 2026
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sélecteur d'heure */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-terracotta-600" />
          Heure *
        </Label>
        <div className="flex gap-2">
          <select
            value={value.hour}
            onChange={(e) => onChange({ ...value, hour: e.target.value })}
            className="flex-1 px-4 py-3 border rounded-xl bg-white hover:border-gold-300 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Heure</option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}h
              </option>
            ))}
          </select>
          <span className="flex items-center text-2xl text-muted-foreground">:</span>
          <select
            value={value.minute}
            onChange={(e) => onChange({ ...value, minute: e.target.value })}
            className="flex-1 px-4 py-3 border rounded-xl bg-white hover:border-gold-300 transition-colors appearance-none cursor-pointer"
          >
            <option value="">Min</option>
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        
        {/* Raccourcis d'heures courantes */}
        <div className="flex gap-2 flex-wrap">
          {[
            { h: "09", m: "00", label: "9h" },
            { h: "12", m: "00", label: "12h" },
            { h: "14", m: "00", label: "14h" },
            { h: "19", m: "00", label: "19h" },
            { h: "20", m: "00", label: "20h" },
            { h: "21", m: "00", label: "21h" },
          ].map(({ h, m, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => onChange({ ...value, hour: h, minute: m })}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                value.hour === h && value.minute === m
                  ? "bg-terracotta-500 text-white"
                  : "bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EventForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [dateTime, setDateTime] = useState({ date: "", hour: "", minute: "" })
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = (formData: FormData) => {
    setError(null)
    setSuccess(false)

    // Vérifier que la date et l'heure sont sélectionnées
    if (!dateTime.date || !dateTime.hour || !dateTime.minute) {
      setError("Veuillez sélectionner une date et une heure")
      return
    }

    // Construire la date complète
    const eventDateTime = `${dateTime.date}T${dateTime.hour}:${dateTime.minute}`
    formData.set("event_date", eventDateTime)

    startTransition(async () => {
      const result = await createEvent(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        // Reset form
        const form = document.getElementById("event-form") as HTMLFormElement
        form?.reset()
        setDateTime({ date: "", hour: "", minute: "" })
        setImageUrl("")
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <form id="event-form" action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: Dîner de gala"
          required
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Décrivez l'événement..."
          rows={3}
          className="bg-white"
        />
      </div>

      {/* Nouveau sélecteur de date/heure */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-gold-50/50 to-terracotta-50/50 border border-gold-200/50">
        <DateTimePicker value={dateTime} onChange={setDateTime} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_participants">Places max</Label>
          <Input
            id="max_participants"
            name="max_participants"
            type="number"
            min="1"
            placeholder="Illimité"
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input
            id="location"
            name="location"
            placeholder="Ex: Riad"
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price_info" className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-oasis-600" />
          Prix
        </Label>
        <Input
          id="price_info"
          name="price_info"
          placeholder="Ex: 50€/pers, Gratuit, 30-50€..."
          className="bg-white"
        />
      </div>

      <ImageUpload 
        value={imageUrl} 
        onChange={setImageUrl} 
        label="Image de l'événement"
      />

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

      <Button 
        type="submit" 
        disabled={isPending} 
        className="w-full bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Créer l'événement"
        )}
      </Button>
    </form>
  )
}
