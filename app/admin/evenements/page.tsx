import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Clock,
  Trash2,
  PartyPopper,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
} from "lucide-react"
import { EventForm } from "./event-form"
import { deleteEventAction, toggleEventPublished } from "./actions"
import { EditEventButton } from "./edit-event-modal"

type SearchParams = {
  error?: string
  deleted?: string
  published?: string
  depublished?: string
}

export default async function AdminEvenementsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { error, deleted, published, depublished } = await searchParams
  
  const supabase = await createClient()

  // Récupérer tous les événements
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })

  // Pour chaque événement, récupérer le nombre de participants
  const eventsWithCounts = await Promise.all(
    (events || []).map(async (event) => {
      const { data: count } = await supabase
        .rpc("get_event_participants_count", { event_uuid: event.id })
      
      // Récupérer les noms des inscrits
      const { data: registrations } = await supabase
        .from("event_registrations")
        .select("profile_id, num_participants")
        .eq("event_id", event.id)

      const profileIds = registrations?.map(r => r.profile_id) || []
      const { data: profiles } = profileIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id, prenom, nom")
            .in("id", profileIds)
        : { data: [] }

      const registrantsWithNames = registrations?.map(r => {
        const profile = profiles?.find(p => p.id === r.profile_id)
        return {
          name: [profile?.prenom, profile?.nom].filter(Boolean).join(' ') || 'Anonyme',
          count: r.num_participants
        }
      }) || []

      return { 
        ...event, 
        participants_count: count || 0,
        registrants: registrantsWithNames
      }
    })
  )

  const now = new Date()
  const upcomingEvents = eventsWithCounts.filter(e => new Date(e.event_date) >= now)
  const pastEvents = eventsWithCounts.filter(e => new Date(e.event_date) < now)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
            Gestion des événements
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez les activités du séjour
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1.5">
            <Calendar className="w-4 h-4 mr-1" />
            {upcomingEvents.length} à venir
          </Badge>
          <Button asChild variant="outline">
            <Link href="/evenements" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              Voir côté invité
            </Link>
          </Button>
        </div>
      </div>

      {/* Messages de feedback */}
      {published && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <Eye className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Événement publié ! Il est maintenant visible par les invités.</p>
        </div>
      )}
      {depublished && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <EyeOff className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Événement dépublié. Il n&apos;est plus visible par les invités.</p>
        </div>
      )}
      {deleted && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Événement supprimé.</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{decodeURIComponent(error)}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Formulaire de création */}
        <Card className="bg-card-premium lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-gold-500" />
              Nouvel événement
            </CardTitle>
            <CardDescription>
              Ajoutez une nouvelle activité au programme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm />
          </CardContent>
        </Card>

        {/* Liste des événements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Événements à venir */}
          <Card className="bg-card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-oasis-500" />
                Événements à venir
              </CardTitle>
              <CardDescription>
                {upcomingEvents.length} événement(s) programmé(s)
                {upcomingEvents.length > 0 && (
                  <span className="ml-2">
                    ({upcomingEvents.filter(e => e.published).length} publié(s), {upcomingEvents.filter(e => !e.published).length} brouillon(s))
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun événement à venir</p>
                  <p className="text-sm">Créez votre premier événement</p>
                </div>
              ) : (
                upcomingEvents.map((event) => {
                  const eventDate = new Date(event.event_date)
                  const daysUntil = Math.ceil(
                    (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                  )
                  const isFull = event.max_participants && event.participants_count >= event.max_participants
                  const isDraft = !event.published

                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-xl border transition-shadow ${
                        isDraft 
                          ? 'bg-gray-50/50 border-dashed border-gray-300 opacity-80' 
                          : 'bg-white hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          {/* Date */}
                          <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                            isDraft 
                              ? 'bg-gray-100' 
                              : 'bg-gradient-to-br from-gold-100 to-terracotta-100'
                          }`}>
                            <span className={`text-xs font-medium ${isDraft ? 'text-gray-500' : 'text-gold-600'}`}>
                              {eventDate.toLocaleDateString("fr-FR", { month: "short" })}
                            </span>
                            <span className={`text-2xl font-bold ${isDraft ? 'text-gray-600' : 'text-gold-800'}`}>
                              {eventDate.getDate()}
                            </span>
                          </div>

                          {/* Infos */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              {isDraft ? (
                                <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Brouillon
                                </Badge>
                              ) : (
                                <Badge className="bg-oasis-100 text-oasis-700 border-oasis-200 text-xs">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Publié
                                </Badge>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {eventDate.toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {event.location && (
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats et actions */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`${isFull ? 'bg-amber-100 text-amber-700' : 'bg-oasis-100 text-oasis-700'}`}>
                              <Users className="w-3 h-3 mr-1" />
                              {event.participants_count}
                              {event.max_participants && `/${event.max_participants}`}
                            </Badge>
                            {daysUntil <= 3 && (
                              <Badge className="bg-terracotta-100 text-terracotta-700">
                                {daysUntil === 0 ? "Aujourd'hui" : daysUntil === 1 ? "Demain" : `J-${daysUntil}`}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <form action={toggleEventPublished}>
                              <input type="hidden" name="event_id" value={event.id} />
                              <input type="hidden" name="current_published" value={String(event.published)} />
                              <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                className={isDraft 
                                  ? "text-oasis-600 border-oasis-300 hover:bg-oasis-50" 
                                  : "text-amber-600 border-amber-300 hover:bg-amber-50"
                                }
                              >
                                {isDraft ? (
                                  <>
                                    <Send className="w-4 h-4 mr-1" />
                                    Publier
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-4 h-4 mr-1" />
                                    Dépublier
                                  </>
                                )}
                              </Button>
                            </form>
                            <EditEventButton event={event} />
                            <form action={deleteEventAction}>
                              <input type="hidden" name="event_id" value={event.id} />
                              <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Liste des inscrits */}
                      {event.registrants.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dashed">
                          <p className="text-xs text-muted-foreground mb-2">Inscrits :</p>
                          <div className="flex flex-wrap gap-2">
                            {event.registrants.map((r: { name: string; count: number }, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-md text-xs bg-oasis-50 text-oasis-700"
                              >
                                {r.name} {r.count > 1 && `(×${r.count})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Événements passés */}
          {pastEvents.length > 0 && (
            <Card className="bg-card-premium opacity-75">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5" />
                  Événements passés
                </CardTitle>
                <CardDescription>
                  {pastEvents.length} événement(s) terminé(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pastEvents.map((event) => {
                  const eventDate = new Date(event.event_date)

                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {eventDate.toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                            })}
                            {" · "}
                            {event.participants_count} participant(s)
                          </p>
                        </div>
                      </div>
                      <form action={deleteEventAction}>
                        <input type="hidden" name="event_id" value={event.id} />
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
