import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/server"
import { Countdown } from "@/components/countdown"
import { ProgrammeSection } from "@/components/programme-timeline"
import { getProgrammeEvents, getMyFamilyMembers } from "@/app/(protected)/evenements/actions"

import { 
  Calendar, 
  MapPin, 
  Users, 
  Plane,
  Train,
  Car,
  Camera,
  PartyPopper,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rediriger si non connecté (exécution parallèle avec layout)
  if (!user) {
    redirect("/login")
  }

  // Récupérer le profil complet
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Récupérer les membres de la famille
  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("*")
    .eq("profile_id", user.id)

  // Récupérer les inscriptions aux événements
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*, events(*)")
    .eq("profile_id", user.id)

  // Récupérer le nombre total d'événements
  const { count: totalEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })

  // Récupérer les événements du programme
  const programmeEvents = await getProgrammeEvents()
  const familyMembersData = await getMyFamilyMembers()
  const maxParticipants = familyMembersData.length || 1

  // Calculer le pourcentage de complétion du profil
  const completionItems = [
    !!profile?.prenom,
    !!profile?.arrival_date,
    !!profile?.departure_date,
    !!profile?.arrival_transport,
    !!profile?.residence_location,
    (familyMembers?.length || 0) > 0,
  ]
  const completionPercentage = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  )

  const transportOptions = {
    avion: Plane,
    train: Train,
    voiture: Car,
    autre: MapPin,
  } as const

  type TransportType = keyof typeof transportOptions
  const transportKey = (profile?.arrival_transport || "autre") as TransportType
  const TransportIcon = transportOptions[transportKey] || MapPin

  // Formatage des dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "long"
    })
  }

  // Compter les inscriptions aux activités du programme
  const programmeRegistrations = registrations?.filter(r => 
    programmeEvents.some(e => e.id === r.event_id)
  ) || []

  return (
    <div className="min-h-screen pattern-zellige">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-night-800 via-night-700 to-night-800">
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-zellige-dark opacity-30" />
        <div className="absolute inset-0 pattern-stars opacity-20" />
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-oasis-500/15 rounded-full blur-[80px]" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Welcome message */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/20 text-gold-200 text-xs font-medium mb-3 border border-gold-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  Espace invité
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                  Bienvenue, {(profile as Record<string, unknown>)?.group_name || profile?.prenom || user?.email?.split("@")[0]} ! 
                  <span className="inline-block ml-2 animate-bounce">👋</span>
                </h1>
                <p className="text-gold-100/70 text-sm sm:text-base">
                  Préparez votre séjour pour les 60 ans d&apos;Yvonne à Marrakech
                </p>
              </div>
            </div>

            {/* Countdown mini */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-terracotta-500">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Le grand jour approche !</h3>
                  <p className="text-xs text-gold-200/60">15 janvier 2026</p>
                </div>
              </div>
              <Countdown targetIso="2026-01-15T00:00:00" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Completion */}
          {completionPercentage < 100 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gold-50 to-terracotta-50 border border-gold-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-gold-600" />
                    <h3 className="font-semibold text-foreground">Complétez votre profil</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Renseignez vos informations de séjour pour une meilleure organisation
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={completionPercentage} className="flex-1 h-2" />
                    <span className="text-sm font-medium text-gold-700">{completionPercentage}%</span>
                  </div>
                </div>
                <Button asChild className="bg-gold-600 hover:bg-gold-700 shrink-0">
                  <Link href="/sejour">
                    Compléter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            
            {/* Card Séjour */}
            <div className="group p-5 sm:p-6 rounded-2xl bg-white border border-gold-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-oasis-500 to-oasis-600 shadow-lg shadow-oasis-500/25">
                  <Plane className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Mon séjour</h3>
                  <p className="text-xs text-muted-foreground">Dates et transport</p>
                </div>
              </div>

              {profile?.arrival_date && profile?.departure_date ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-oasis-50 border border-oasis-100">
                      <p className="text-xs text-oasis-600 font-medium mb-1">Arrivée</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatDate(profile.arrival_date)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-terracotta-50 border border-terracotta-100">
                      <p className="text-xs text-terracotta-600 font-medium mb-1">Départ</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatDate(profile.departure_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <TransportIcon className="h-5 w-5 text-gold-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Transport</p>
                      <p className="text-sm font-medium capitalize">{profile.arrival_transport}</p>
                    </div>
                  </div>

                  {profile.residence_location && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gold-50/50 border border-gold-100">
                      <MapPin className="h-5 w-5 text-gold-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gold-600 font-medium">Hébergement</p>
                        <p className="text-sm text-foreground">{profile.residence_location}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Informations non renseignées
                  </p>
                </div>
              )}

              <Button asChild variant="outline" className="w-full mt-4 border-oasis-200 text-oasis-700 hover:bg-oasis-50">
                <Link href="/sejour">
                  {profile?.arrival_date ? "Modifier mon séjour" : "Renseigner mon séjour"}
                </Link>
              </Button>
            </div>

            {/* Card Participants */}
            <div className="group p-5 sm:p-6 rounded-2xl bg-white border border-gold-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/25">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Mon groupe</h3>
                  <p className="text-xs text-muted-foreground">Qui vient avec vous ?</p>
                </div>
              </div>

              {familyMembers && familyMembers.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gold-50 to-terracotta-50 border border-gold-200/50"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 flex items-center justify-center text-xs font-bold text-white">
                          {member.first_name[0]}
                        </div>
                        <span className="text-sm font-medium">
                          {member.first_name}
                          {member.is_minor && (
                            <span className="ml-1 text-xs text-muted-foreground">(mineur)</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-gold-50/50 border border-gold-100 text-center">
                    <p className="text-sm font-semibold text-gold-700">
                      {familyMembers.length} participant{familyMembers.length > 1 ? "s" : ""} inscrit{familyMembers.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                  <p className="text-sm text-muted-foreground">
                    Aucun participant enregistré
                  </p>
                </div>
              )}
            </div>

            {/* Card Inscriptions aux activités */}
            <div className="group p-5 sm:p-6 rounded-2xl bg-white border border-gold-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg shadow-terracotta-500/25">
                  <PartyPopper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Mes activités</h3>
                  <p className="text-xs text-muted-foreground">Inscriptions au programme</p>
                </div>
              </div>

              {programmeRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {programmeRegistrations.slice(0, 3).map((reg: { id: string; num_participants: number; events: { title: string; event_date: string } }) => (
                    <div 
                      key={reg.id} 
                      className="flex items-center justify-between p-3 rounded-xl bg-terracotta-50/50 border border-terracotta-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-terracotta-500" />
                        <span className="text-sm font-medium truncate">{reg.events?.title}</span>
                      </div>
                      <Badge variant="secondary" className="shrink-0 bg-terracotta-100 text-terracotta-700">
                        {reg.num_participants} pers.
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      Inscrit à <span className="font-semibold text-terracotta-600">{programmeRegistrations.length}/{programmeEvents.length}</span> activité{programmeRegistrations.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-sm text-muted-foreground">
                    Aucune inscription pour le moment
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inscrivez-vous aux activités ci-dessous !
                  </p>
                </div>
              )}

              <Button asChild className="w-full mt-4 bg-terracotta-600 hover:bg-terracotta-700">
                <Link href="/evenements">
                  Voir toutes les activités
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Card Galerie */}
            <div className="group p-5 sm:p-6 rounded-2xl bg-white border border-gold-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Galerie photos</h3>
                  <p className="text-xs text-muted-foreground">Partagez vos souvenirs</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="grid grid-cols-3 gap-2 w-full mb-4">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
                    >
                      <Camera className="h-6 w-6 text-purple-300" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Partagez vos photos du voyage !
                </p>
              </div>

              <Button asChild variant="outline" className="w-full mt-4 border-purple-200 text-purple-700 hover:bg-purple-50">
                <Link href="/galerie">
                  Accéder à la galerie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Programme Section avec inscriptions */}
          <div className="p-5 sm:p-8 rounded-2xl bg-white border border-gold-100/50 shadow-lg">
            <ProgrammeSection 
              programmeEvents={programmeEvents}
              maxParticipants={maxParticipants}
              showRegistration={true}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
