import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"

import { updateSejourInfo } from "./actions"
import { GroupManager } from "./group-manager"
import {
  Plane,
  Train,
  Car,
  Calendar,
  Users,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles
} from "lucide-react"
import type { FamilyMember } from "@/lib/types"

type SearchParams = {
  error?: string
  saved?: string
}

export default async function SejourPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { error, saved } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Récupérer le profil (données onboarding)
  // Note: On utilise * pour être tolérant aux colonnes manquantes
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  // Récupérer les données supplémentaires de sejours (commentaire)
  const { data: sejour } = await supabase
    .from("sejours")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle()

  // Récupérer les membres de la famille
  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("*")
    .eq("profile_id", user!.id)
    .order("created_at", { ascending: true })

  const nbParticipants = familyMembers?.length || 0

  // Dernière mise à jour (si la colonne existe)
  const lastUpdated = (profile as Record<string, unknown>)?.updated_at || sejour?.updated_at

  return (
    <div className="min-h-screen pattern-zellige">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-oasis-700 via-oasis-600 to-oasis-700">
        <div className="absolute inset-0 pattern-zellige-dark opacity-30" />
        <div className="absolute inset-0 pattern-stars opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-oasis-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/15 rounded-full blur-[80px]" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-oasis-100 text-xs font-medium mb-3 border border-white/10">
              <Plane className="h-3.5 w-3.5" />
              Informations de voyage
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
              Mon séjour ✈️
            </h1>
            <p className="text-oasis-100/70 text-sm sm:text-base max-w-xl">
              Modifiez vos informations de séjour à tout moment.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Info Box */}
          <div className="p-4 rounded-xl bg-gold-50 border border-gold-200/50 flex items-start gap-3">
            <Info className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gold-800">Pourquoi ces informations ?</p>
              <p className="text-xs text-gold-700 mt-1">
                Ces informations permettent à Yvonne de mieux organiser les activités et de coordonner les transferts si besoin.
              </p>
            </div>
          </div>

          {/* Gestion du groupe */}
          <GroupManager 
            groupName={profile?.group_name || null}
            familyMembers={(familyMembers || []) as FamilyMember[]}
          />

          {/* Form Card */}
          <div className="p-5 sm:p-8 rounded-2xl bg-white border border-oasis-100/50 shadow-lg">
            
            {/* Success message */}
            {saved && (
              <div className="mb-6 p-4 rounded-xl bg-oasis-50 border border-oasis-200 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-oasis-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-oasis-800">Informations enregistrées !</p>
                  <p className="text-xs text-oasis-600">Vos informations de séjour ont été mises à jour.</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <p className="text-sm text-red-800">{decodeURIComponent(error)}</p>
              </div>
            )}

            <form action={updateSejourInfo} className="space-y-6">
              
              {/* Dates Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-oasis-100">
                    <Calendar className="h-4 w-4 text-oasis-600" />
                  </div>
                  <h2 className="font-semibold text-foreground">Dates de séjour</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="arrival_date" className="text-sm font-medium text-foreground">
                      Date d&apos;arrivée
                    </label>
                    <Input
                      id="arrival_date"
                      name="arrival_date"
                      type="date"
                      defaultValue={profile?.arrival_date ?? ""}
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">L&apos;événement est du 12 au 18 janvier 2026</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="departure_date" className="text-sm font-medium text-foreground">
                      Date de départ
                    </label>
                    <Input
                      id="departure_date"
                      name="departure_date"
                      type="date"
                      defaultValue={profile?.departure_date ?? ""}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Transport Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta-100">
                    <Plane className="h-4 w-4 text-terracotta-600" />
                  </div>
                  <h2 className="font-semibold text-foreground">Transport</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { value: "avion", label: "Avion", icon: Plane },
                    { value: "train", label: "Train", icon: Train },
                    { value: "voiture", label: "Voiture", icon: Car },
                    { value: "autre", label: "Autre", icon: MapPin },
                  ].map((option) => {
                    const Icon = option.icon
                    const isSelected = profile?.arrival_transport === option.value
                    return (
                      <label
                        key={option.value}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-terracotta-500 bg-terracotta-50"
                            : "border-border hover:border-terracotta-200 hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="arrival_transport"
                          value={option.value}
                          defaultChecked={isSelected}
                          className="sr-only"
                        />
                        <Icon className={`h-6 w-6 ${isSelected ? "text-terracotta-600" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-terracotta-700" : "text-foreground"}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <Badge className="absolute -top-2 -right-2 bg-terracotta-500 text-white text-[10px] px-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                          </Badge>
                        )}
                      </label>
                    )
                  })}
                </div>

                {/* Airport field (shown if transport is avion) */}
                <div className="space-y-2">
                  <label htmlFor="arrival_airport" className="text-sm font-medium text-foreground flex items-center gap-2">
                    Aéroport d&apos;arrivée
                    <span className="text-xs text-muted-foreground font-normal">(si avion)</span>
                  </label>
                  <Input
                    id="arrival_airport"
                    name="arrival_airport"
                    type="text"
                    placeholder="Ex: Paris CDG, Lyon, Marseille..."
                    defaultValue={profile?.arrival_airport ?? ""}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Logement Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-100">
                    <MapPin className="h-4 w-4 text-gold-600" />
                  </div>
                  <h2 className="font-semibold text-foreground">Hébergement</h2>
                </div>

                <div className="space-y-2">
                  <label htmlFor="residence_location" className="text-sm font-medium text-foreground">
                    Où logez-vous à Marrakech ?
                  </label>
                  <Input
                    id="residence_location"
                    name="residence_location"
                    type="text"
                    placeholder="Nom du riad, hôtel, adresse..."
                    defaultValue={profile?.residence_location ?? ""}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cela nous aide à organiser les transports et points de rendez-vous
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Commentaire */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <h2 className="font-semibold text-foreground">
                    Commentaire
                    <span className="ml-2 text-xs text-muted-foreground font-normal">(optionnel)</span>
                  </h2>
                </div>

                <Textarea
                  id="commentaire"
                  name="commentaire"
                  placeholder="Régime alimentaire, allergies, contraintes de mobilité, horaires d'arrivée/départ particuliers..."
                  defaultValue={sejour?.commentaire ?? ""}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-oasis-600 to-oasis-500 hover:from-oasis-500 hover:to-oasis-400 shadow-lg shadow-oasis-500/25"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Enregistrer mes informations
                </Button>
                
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground text-center sm:text-right">
                    Dernière mise à jour :<br className="sm:hidden" />
                    <span className="font-medium"> {new Date(lastUpdated).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</span>
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Tips */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-night-800 via-night-700 to-night-800 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-gold-400" />
              <h3 className="font-semibold text-white">Conseils pratiques</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm font-medium text-white mb-1">✈️ Vols</p>
                <p className="text-xs text-gold-100/70">
                  Réservez vos vols tôt ! C&apos;est la période de la CAN, les prix montent vite.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm font-medium text-white mb-1">🏨 Hébergement</p>
                <p className="text-xs text-gold-100/70">
                  Riads en médina ou hôtels à Guéliz. Partagez votre adresse !
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

