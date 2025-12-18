import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Camera, MapPin, PartyPopper } from "lucide-react"

export default async function AdminHomePage() {
  return (
    <div className="min-h-screen bg-section-warm p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-muted-foreground">Gérez l'application</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">Retour au dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Invités
              </CardTitle>
              <CardDescription>Créer et gérer les comptes invités</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/invites">Gérer les invités</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-accent" />
                Événements
              </CardTitle>
              <CardDescription>Créer et gérer les activités</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/admin/evenements">Gérer les événements</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Séjours
              </CardTitle>
              <CardDescription>Vue globale des séjours</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/sejours">Voir les séjours</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card-premium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-muted-foreground" />
                Photos
              </CardTitle>
              <CardDescription>Valider les photos avant affichage</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/photos">Valider les photos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
