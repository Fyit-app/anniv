import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Marrakech | Anniversaire Marrakech",
  description: "Recommandations et idées pour profiter de Marrakech",
}

export default function MarrakechPage() {
  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-5xl space-y-6 p-4 sm:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Marrakech</h1>
          <p className="text-muted-foreground">
            Quelques idées simples pour profiter sur place. On complétera au fur et à mesure.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>À voir</CardTitle>
              <CardDescription>Classiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Médina & souks</div>
              <div>Jardin Majorelle</div>
              <div>Palais de la Bahia</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>À faire</CardTitle>
              <CardDescription>Expériences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Hammam / spa</div>
              <div>Désert d’Agafay (day trip)</div>
              <div>Restos & rooftops</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
