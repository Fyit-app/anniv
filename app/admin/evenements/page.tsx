import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Users, Plus } from "lucide-react"
import { EventForm } from "./event-form"

export default async function AdminEvenementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Vérifier si admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

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
      return { ...event, participants_count: count || 0 }
    })
  )

  return (
    <div className="min-h-screen bg-section-warm p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestion des événements</h1>
            <p className="text-muted-foreground">Créez et gérez les activités</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulaire de création */}
          <Card className="bg-card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Nouvel événement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EventForm />
            </CardContent>
          </Card>

          {/* Liste des événements */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">
              Événements existants ({eventsWithCounts.length})
            </h2>
            
            {eventsWithCounts.length === 0 ? (
              <Card className="bg-muted/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Aucun événement créé
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {eventsWithCounts.map((event) => {
                  const eventDate = new Date(event.event_date)
                  const isPast = eventDate < new Date()

                  return (
                    <Card key={event.id} className={isPast ? "opacity-60" : ""}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{event.title}</h3>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {eventDate.toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.participants_count}
                                {event.max_participants && `/${event.max_participants}`}
                              </span>
                            </div>
                          </div>
                          {isPast && (
                            <Badge variant="outline">Passé</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

