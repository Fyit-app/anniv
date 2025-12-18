"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Plane, 
  Train, 
  Car, 
  HelpCircle,
  Users,
  MapPin,
  Calendar,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Baby,
  User
} from "lucide-react"
import { saveStayInfo, saveFamilyMembers, completeOnboarding } from "./actions"
import type { Profile, FamilyMember } from "@/lib/types"
import { cn } from "@/lib/utils"

interface OnboardingWizardProps {
  initialProfile: Profile | null
  initialFamilyMembers: FamilyMember[]
  userPrenom: string
}

type Step = 1 | 2 | 3

interface LocalFamilyMember {
  id: string
  first_name: string
  is_minor: boolean
}

const TRANSPORT_OPTIONS = [
  { value: "avion", label: "Avion", icon: Plane },
  { value: "train", label: "Train", icon: Train },
  { value: "voiture", label: "Voiture", icon: Car },
  { value: "autre", label: "Autre", icon: HelpCircle },
]

export function OnboardingWizard({ 
  initialProfile, 
  initialFamilyMembers,
  userPrenom 
}: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  // État étape 1
  const [arrivalDate, setArrivalDate] = useState(initialProfile?.arrival_date || "")
  const [departureDate, setDepartureDate] = useState(initialProfile?.departure_date || "")
  const [transport, setTransport] = useState(initialProfile?.arrival_transport || "")
  const [airport, setAirport] = useState(initialProfile?.arrival_airport || "")
  const [residence, setResidence] = useState(initialProfile?.residence_location || "")

  // État étape 2 - membres de la famille
  const [familyMembers, setFamilyMembers] = useState<LocalFamilyMember[]>(() => {
    if (initialFamilyMembers.length > 0) {
      return initialFamilyMembers.map(m => ({
        id: m.id,
        first_name: m.first_name,
        is_minor: m.is_minor
      }))
    }
    // Par défaut, ajouter l'utilisateur principal
    return [{
      id: crypto.randomUUID(),
      first_name: userPrenom,
      is_minor: false
    }]
  })

  const progressValue = (step / 3) * 100

  const handleNextStep = async () => {
    setError(null)

    if (step === 1) {
      // Validation étape 1
      if (!arrivalDate || !departureDate || !transport || !residence) {
        setError("Veuillez remplir tous les champs obligatoires")
        return
      }
      if (transport === "avion" && !airport) {
        setError("Veuillez indiquer l'aéroport d'arrivée")
        return
      }
      if (new Date(departureDate) < new Date(arrivalDate)) {
        setError("La date de départ doit être après la date d'arrivée")
        return
      }

      // Sauvegarder
      startTransition(async () => {
        const formData = new FormData()
        formData.append("arrival_date", arrivalDate)
        formData.append("departure_date", departureDate)
        formData.append("arrival_transport", transport)
        formData.append("arrival_airport", airport)
        formData.append("residence_location", residence)

        const result = await saveStayInfo(formData)
        if (result.error) {
          setError(result.error)
        } else {
          setStep(2)
        }
      })
    } else if (step === 2) {
      // Validation étape 2
      if (familyMembers.length === 0) {
        setError("Veuillez ajouter au moins un participant")
        return
      }
      for (const member of familyMembers) {
        if (!member.first_name.trim()) {
          setError("Tous les prénoms sont obligatoires")
          return
        }
      }

      // Sauvegarder
      startTransition(async () => {
        const result = await saveFamilyMembers(
          familyMembers.map(m => ({
            first_name: m.first_name,
            is_minor: m.is_minor
          }))
        )
        if (result.error) {
          setError(result.error)
        } else {
          setStep(3)
        }
      })
    }
  }

  const handleComplete = () => {
    startTransition(async () => {
      const result = await completeOnboarding()
      if (result?.error) {
        setError(result.error)
      }
      // La redirection est gérée côté serveur
    })
  }

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: crypto.randomUUID(), first_name: "", is_minor: false }
    ])
  }

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(m => m.id !== id))
    }
  }

  const updateFamilyMember = (id: string, updates: Partial<LocalFamilyMember>) => {
    setFamilyMembers(
      familyMembers.map(m => m.id === id ? { ...m, ...updates } : m)
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-3">
          {[
            { num: 1, label: "Séjour", icon: Calendar },
            { num: 2, label: "Participants", icon: Users },
            { num: 3, label: "Confirmation", icon: Check },
          ].map(({ num, label, icon: Icon }) => (
            <div
              key={num}
              className={cn(
                "flex items-center gap-2 transition-colors",
                step >= num ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  step > num
                    ? "bg-primary text-primary-foreground"
                    : step === num
                    ? "bg-primary/20 text-primary border-2 border-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
              <span className="hidden sm:inline font-medium">{label}</span>
            </div>
          ))}
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Étape 1 - Séjour */}
      {step === 1 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Informations de séjour
            </CardTitle>
            <CardDescription>
              Dites-nous quand et comment vous arrivez à Marrakech
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dates */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrival_date">Date d'arrivée *</Label>
                <Input
                  id="arrival_date"
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  min="2025-01-01"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure_date">Date de départ *</Label>
                <Input
                  id="departure_date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={arrivalDate || "2025-01-01"}
                  className="bg-background"
                />
              </div>
            </div>

            {/* Transport */}
            <div className="space-y-3">
              <Label>Moyen d'arrivée *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TRANSPORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTransport(value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      transport === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aéroport (conditionnel) */}
            {transport === "avion" && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label htmlFor="airport">Aéroport d'arrivée *</Label>
                <Input
                  id="airport"
                  type="text"
                  placeholder="Ex: Paris CDG, Marseille, Lyon..."
                  value={airport}
                  onChange={(e) => setAirport(e.target.value)}
                  className="bg-background"
                />
              </div>
            )}

            {/* Lieu de résidence */}
            <div className="space-y-2">
              <Label htmlFor="residence" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                Lieu de résidence à Marrakech *
              </Label>
              <Input
                id="residence"
                type="text"
                placeholder="Nom de l'hôtel, riad, ou adresse..."
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Indiquez où vous logerez pendant votre séjour
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleNextStep} disabled={isPending} size="lg">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2 - Participants */}
      {step === 2 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Participants au voyage
            </CardTitle>
            <CardDescription>
              Indiquez toutes les personnes qui seront présentes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Liste des membres */}
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.is_minor ? (
                          <Baby className="w-4 h-4 text-primary" />
                        ) : (
                          <User className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <Input
                        placeholder="Prénom *"
                        value={member.first_name}
                        onChange={(e) => updateFamilyMember(member.id, { first_name: e.target.value })}
                        className="flex-1 bg-background"
                      />
                    </div>
                    
                    <div className="flex gap-2 pl-10">
                      <button
                        type="button"
                        onClick={() => updateFamilyMember(member.id, { is_minor: false })}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                          !member.is_minor
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border hover:bg-muted"
                        )}
                      >
                        Majeur
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFamilyMember(member.id, { is_minor: true })}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                          member.is_minor
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-background border hover:bg-muted"
                        )}
                      >
                        Mineur
                      </button>
                    </div>
                  </div>

                  {familyMembers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFamilyMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Bouton ajouter */}
            <Button
              variant="outline"
              onClick={addFamilyMember}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une personne
            </Button>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {familyMembers.filter(m => !m.is_minor).length} majeur(s)
              </div>
              <div className="flex items-center gap-1">
                <Baby className="w-4 h-4" />
                {familyMembers.filter(m => m.is_minor).length} mineur(s)
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button onClick={handleNextStep} disabled={isPending} size="lg">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continuer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3 - Confirmation */}
      {step === 3 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              Récapitulatif
            </CardTitle>
            <CardDescription>
              Vérifiez vos informations avant de confirmer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Récap séjour */}
            <div className="p-4 rounded-xl bg-muted/50 border space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Votre séjour
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Arrivée</span>
                  <p className="font-medium">
                    {new Date(arrivalDate).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long"
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Départ</span>
                  <p className="font-medium">
                    {new Date(departureDate).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long"
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Transport</span>
                  <p className="font-medium capitalize">
                    {TRANSPORT_OPTIONS.find(t => t.value === transport)?.label}
                    {transport === "avion" && airport && ` (${airport})`}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hébergement</span>
                  <p className="font-medium">{residence}</p>
                </div>
              </div>
            </div>

            {/* Récap participants */}
            <div className="p-4 rounded-xl bg-muted/50 border space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Participants ({familyMembers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {familyMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant={member.is_minor ? "secondary" : "default"}
                    className="py-1.5 px-3"
                  >
                    {member.is_minor ? (
                      <Baby className="w-3 h-3 mr-1" />
                    ) : (
                      <User className="w-3 h-3 mr-1" />
                    )}
                    {member.first_name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button onClick={handleComplete} disabled={isPending} size="lg" className="pulse-glow">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirmer et continuer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

