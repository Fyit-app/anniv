import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Infos pratiques | Anniversaire Marrakech",
  description: "Infos utiles: transport, météo, contacts",
}

export default function InfosPratiquesPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Infos pratiques</h1>
          <p className="text-muted-foreground">Le minimum pour que tout se passe simplement.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Événement : 15 janvier 2026</div>
              <div>Lieu : Marrakech</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transport</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Aéroport : Marrakech-Menara (RAK)</div>
              <div>Taxi / transfert selon arrivée</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Météo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Soirées fraîches : prévoir une veste.</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Les détails (WhatsApp, etc.) seront partagés dans l’espace privé.</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
