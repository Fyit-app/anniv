import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

export default async function AdminSejoursPage() {
  await requireAdmin()

  const supabase = await createClient()

  const { data: sejours } = await supabase
    .from("sejours")
    .select("user_id,date_arrivee,date_depart,nb_personnes,logement,commentaire,updated_at")
    .order("updated_at", { ascending: false })

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Séjours</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vue globale</CardTitle>
            <CardDescription>{sejours?.length ?? 0} séjour(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {(sejours ?? []).map((s) => (
                <div key={s.user_id} className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">User: {s.user_id}</div>
                  <div className="text-sm">
                    {s.date_arrivee ?? "?"} → {s.date_depart ?? "?"} | {s.nb_personnes ?? "?"} pers.
                  </div>
                  {s.logement ? (
                    <div className="text-xs text-muted-foreground">Logement: {s.logement}</div>
                  ) : null}
                  {s.commentaire ? (
                    <div className="text-xs text-muted-foreground">{s.commentaire}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
