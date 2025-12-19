import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Camera,
  MapPin,
  UserCheck,
  Plane,
  Clock,
  TrendingUp,
  PartyPopper,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  // Récupérer les profils
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, onboarding_completed, arrival_date, departure_date, prenom, nom")

  // Récupérer les membres de famille
  const { data: familyMembers } = await supabase
    .from("family_members")
    .select("id, profile_id, is_minor")

  // Récupérer les événements
  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date, max_participants")
    .order("event_date", { ascending: true })

  // Récupérer les inscriptions
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("id, event_id, num_participants")

  // Récupérer les photos en attente
  const { data: pendingPhotos } = await supabase
    .from("photos")
    .select("id")
    .eq("validated", false)

  // Récupérer les photos validées
  const { data: validatedPhotos } = await supabase
    .from("photos")
    .select("id")
    .eq("validated", true)

  // Récupérer les messages
  const { data: messages } = await supabase
    .from("messages")
    .select("id")

  const invites = profiles?.filter((p) => p.role === "invite") || []
  const onboardingCompleted = invites.filter((p) => p.onboarding_completed).length
  const totalFamilyMembers = familyMembers?.length || 0
  const minors = familyMembers?.filter((f) => f.is_minor).length || 0

  // Calcul du total des participants
  const totalParticipants = invites.length + totalFamilyMembers

  // Calcul des arrivées par date
  const arrivalsByDate = invites.reduce((acc, p) => {
    if (p.arrival_date) {
      acc[p.arrival_date] = (acc[p.arrival_date] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Événements à venir
  const now = new Date()
  const upcomingEvents = events?.filter((e) => new Date(e.event_date) >= now) || []
  const pastEvents = events?.filter((e) => new Date(e.event_date) < now) || []

  // Calcul des inscriptions totales
  const totalRegistrations = registrations?.reduce((sum, r) => sum + r.num_participants, 0) || 0

  return {
    invites: invites.length,
    onboardingCompleted,
    onboardingPending: invites.length - onboardingCompleted,
    totalParticipants,
    familyMembers: totalFamilyMembers,
    minors,
    adults: totalFamilyMembers - minors,
    arrivalsByDate,
    events: events?.length || 0,
    upcomingEvents: upcomingEvents.length,
    pastEvents: pastEvents.length,
    totalRegistrations,
    pendingPhotos: pendingPhotos?.length || 0,
    validatedPhotos: validatedPhotos?.length || 0,
    messages: messages?.length || 0,
    recentInvites: invites.slice(0, 5),
    nextEvents: upcomingEvents.slice(0, 3),
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de l'événement Anniversaire Marrakech
        </p>
      </div>

      {/* Stats principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/invites">
          <Card className="bg-card-premium hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Invités
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-gold-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.invites}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-oasis-50 text-oasis-700 border-oasis-200">
                  <UserCheck className="w-3 h-3 mr-1" />
                  {stats.onboardingCompleted} confirmés
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-card-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total participants
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-terracotta-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.invites} invités + {stats.familyMembers} accompagnants
            </p>
          </CardContent>
        </Card>

        <Link href="/admin/evenements">
          <Card className="bg-card-premium hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Événements
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-oasis-100 to-oasis-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-oasis-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.events}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {stats.upcomingEvents} à venir · {stats.totalRegistrations} inscrits
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/photos">
          <Card className="bg-card-premium hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Médias
              </CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.validatedPhotos}</div>
              {stats.pendingPhotos > 0 && (
                <Badge className="mt-1 bg-amber-100 text-amber-700 border-amber-200">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {stats.pendingPhotos} en attente
                </Badge>
              )}
              {stats.pendingPhotos === 0 && (
                <Badge variant="outline" className="mt-1 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Tout validé
                </Badge>
              )}
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Répartition des participants */}
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold-500" />
              Répartition des participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Invités principaux</span>
                <span className="font-semibold">{stats.invites}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gold-400 to-gold-500 h-2 rounded-full"
                  style={{ width: `${(stats.invites / stats.totalParticipants) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Accompagnants adultes</span>
                <span className="font-semibold">{stats.adults}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-oasis-400 to-oasis-500 h-2 rounded-full"
                  style={{ width: `${(stats.adults / stats.totalParticipants) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Enfants / Mineurs</span>
                <span className="font-semibold">{stats.minors}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-terracotta-400 to-terracotta-500 h-2 rounded-full"
                  style={{ width: `${(stats.minors / stats.totalParticipants) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statut onboarding */}
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-oasis-500" />
              Onboarding
            </CardTitle>
            <CardDescription>
              Progression des confirmations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(stats.onboardingCompleted / stats.invites) * 352} 352`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(158, 45%, 45%)" />
                      <stop offset="100%" stopColor="hsl(158, 45%, 55%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {stats.invites > 0 ? Math.round((stats.onboardingCompleted / stats.invites) * 100) : 0}%
                  </span>
                  <span className="text-xs text-muted-foreground">complété</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 rounded-lg bg-oasis-50">
                <div className="text-2xl font-bold text-oasis-700">{stats.onboardingCompleted}</div>
                <div className="text-xs text-oasis-600">Confirmés</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-amber-50">
                <div className="text-2xl font-bold text-amber-700">{stats.onboardingPending}</div>
                <div className="text-xs text-amber-600">En attente</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prochains événements */}
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-terracotta-500" />
              Prochains événements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.nextEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Aucun événement à venir
              </p>
            ) : (
              <div className="space-y-3">
                {stats.nextEvents.map((event) => {
                  const eventDate = new Date(event.event_date)
                  const daysUntil = Math.ceil(
                    (eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )

                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-terracotta-100 to-terracotta-200 flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-terracotta-600">
                          {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-terracotta-700">
                          {eventDate.getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {daysUntil === 0
                            ? "Aujourd'hui"
                            : daysUntil === 1
                            ? "Demain"
                            : `Dans ${daysUntil} jours`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Arrivées par date */}
      {Object.keys(stats.arrivalsByDate).length > 0 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="w-5 h-5 text-gold-500" />
              Arrivées prévues
            </CardTitle>
            <CardDescription>
              Répartition des arrivées par date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.arrivalsByDate)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, count]) => (
                  <div
                    key={date}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-50 to-terracotta-50 border border-gold-200"
                  >
                    <MapPin className="w-4 h-4 text-gold-600" />
                    <span className="font-medium">
                      {new Date(date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <Badge className="bg-gold-500 text-white">{count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
