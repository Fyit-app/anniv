import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Programme | Anniversaire Marrakech",
  description: "Programme de l’événement à Marrakech",
}

export default function ProgrammePage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Programme</h1>
          <p className="text-muted-foreground">
            Les horaires exacts seront confirmés. L’essentiel : on se retrouve à Marrakech pour fêter ça.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Mercredi 15 janvier 2026</CardTitle>
              <CardDescription>Jour de l’événement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Arrivées et installation</div>
              <div>Soirée anniversaire</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avant / après</CardTitle>
              <CardDescription>À ton rythme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Temps libre, visites, détente</div>
              <div>Infos et recommandations sur la page Marrakech</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
