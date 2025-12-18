import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { Video, Play } from "lucide-react"

import { rejectPhoto, validatePhoto } from "./actions"

type SearchParams = {
  error?: string
  validated?: string
  deleted?: string
}

type MediaRow = {
  id: string
  user_id: string
  url: string
  created_at: string
  media_type: "image" | "video"
}

export default async function AdminPhotosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  await requireAdmin()
  const { error, validated, deleted } = await searchParams

  const supabase = await createClient()
  const { data: pending } = await supabase
    .from("photos")
    .select("id,user_id,url,created_at,media_type")
    .eq("validated", false)
    .order("created_at", { ascending: false })

  const admin = createAdminClient()
  const pendingWithUrls = await Promise.all(
    (pending ?? []).map(async (p: MediaRow) => {
      const { data } = await admin.storage.from("photos").createSignedUrl(p.url, 60 * 60)
      return { 
        ...p, 
        media_type: p.media_type || "image", // Fallback pour les anciens médias
        signedUrl: data?.signedUrl ?? null 
      }
    })
  )
  
  const photosCount = pendingWithUrls.filter(m => m.media_type === "image").length
  const videosCount = pendingWithUrls.filter(m => m.media_type === "video").length

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Photos (validation)</h1>
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
            <CardTitle>En attente de validation</CardTitle>
            <CardDescription>
              {photosCount > 0 && `${photosCount} photo${photosCount > 1 ? "s" : ""}`}
              {photosCount > 0 && videosCount > 0 && " · "}
              {videosCount > 0 && `${videosCount} vidéo${videosCount > 1 ? "s" : ""}`}
              {photosCount === 0 && videosCount === 0 && "Aucun média en attente"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {validated ? (
              <p className="text-sm text-muted-foreground">Média validé.</p>
            ) : null}
            {deleted ? (
              <p className="text-sm text-muted-foreground">Média supprimé.</p>
            ) : null}
            {error ? (
              <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {pendingWithUrls.map((p) => (
                <div key={p.id} className="rounded-md border p-3 space-y-3">
                  <div className="relative">
                    {p.signedUrl ? (
                      p.media_type === "video" ? (
                        <div className="relative aspect-square w-full rounded-md overflow-hidden bg-black">
                          <video
                            src={p.signedUrl}
                            className="w-full h-full object-contain"
                            controls
                            preload="metadata"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-purple-600 text-white text-xs">
                              <Video className="h-3 w-3 mr-1" />
                              Vidéo
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.signedUrl}
                          alt="Photo"
                          className="aspect-square w-full rounded-md object-cover"
                        />
                      )
                    ) : (
                      <div className="aspect-square w-full rounded-md bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">Chargement...</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">User: {p.user_id.slice(0, 8)}...</div>

                  <div className="flex gap-2">
                    <form action={validatePhoto}>
                      <input type="hidden" name="photo_id" value={p.id} />
                      <Button type="submit">Valider</Button>
                    </form>
                    <form action={rejectPhoto}>
                      <input type="hidden" name="photo_id" value={p.id} />
                      <Button variant="destructive" type="submit">
                        Supprimer
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
