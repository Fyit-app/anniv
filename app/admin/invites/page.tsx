import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"

import { createInvite } from "./actions"

type SearchParams = {
  error?: string
  created?: string
}

export default async function AdminInvitesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()

  const { error, created } = await searchParams

  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, prenom, nom, telephone")
    .order("nom", { ascending: true })

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Invités</h1>
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
            <CardTitle>Créer un invité</CardTitle>
            <CardDescription>
              Crée un utilisateur Supabase (auth) + un profil. Connexion via Magic Link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {created ? (
              <p className="text-sm text-muted-foreground">Invité créé.</p>
            ) : null}
            {error ? (
              <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>
            ) : null}

            <form action={createInvite} className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input id="email" name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="prenom">
                  Prénom
                </label>
                <Input id="prenom" name="prenom" type="text" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="nom">
                  Nom
                </label>
                <Input id="nom" name="nom" type="text" />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium" htmlFor="telephone">
                  Téléphone
                </label>
                <Input id="telephone" name="telephone" type="tel" />
              </div>

              <div className="sm:col-span-2">
                <Button type="submit">Créer</Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground">
              Requis côté serveur : variable d’environnement `SUPABASE_SERVICE_ROLE_KEY`.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des profils</CardTitle>
            <CardDescription>{profiles?.length ?? 0} profil(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {(profiles ?? []).map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col gap-1 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {(p.prenom ?? "") + " " + (p.nom ?? "")}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.telephone ?? ""}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{p.role}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
