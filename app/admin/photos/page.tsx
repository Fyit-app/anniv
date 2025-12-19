import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  Camera,
  Video,
  CheckCircle2,
  X,
  AlertCircle,
  Trash2,
  Clock,
  Image as ImageIcon,
  Play,
} from "lucide-react"

import { rejectPhoto, validatePhoto, validateAllPhotos } from "./actions"

type SearchParams = {
  error?: string
  validated?: string
  deleted?: string
  validatedAll?: string
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
  const { error, validated, deleted, validatedAll } = await searchParams

  const supabase = await createClient()
  
  // Récupérer les médias en attente
  const { data: pending } = await supabase
    .from("photos")
    .select("id,user_id,url,created_at,media_type")
    .eq("validated", false)
    .order("created_at", { ascending: false })

  // Récupérer les médias validés (les 12 derniers)
  const { data: validatedMedia } = await supabase
    .from("photos")
    .select("id,user_id,url,created_at,media_type")
    .eq("validated", true)
    .order("created_at", { ascending: false })
    .limit(12)

  // Récupérer les profils pour afficher les noms
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, prenom, nom")

  const profilesMap = (profiles || []).reduce((acc, p) => {
    acc[p.id] = [p.prenom, p.nom].filter(Boolean).join(' ') || 'Anonyme'
    return acc
  }, {} as Record<string, string>)

  const admin = createAdminClient()
  
  // Générer les URLs signées pour les médias en attente
  const pendingWithUrls = await Promise.all(
    (pending ?? []).map(async (p: MediaRow) => {
      const { data } = await admin.storage.from("photos").createSignedUrl(p.url, 60 * 60)
      return { 
        ...p, 
        media_type: p.media_type || "image",
        signedUrl: data?.signedUrl ?? null,
        uploaderName: profilesMap[p.user_id] || 'Inconnu',
      }
    })
  )

  // Générer les URLs signées pour les médias validés
  const validatedWithUrls = await Promise.all(
    (validatedMedia ?? []).map(async (p: MediaRow) => {
      const { data } = await admin.storage.from("photos").createSignedUrl(p.url, 60 * 60)
      return { 
        ...p, 
        media_type: p.media_type || "image",
        signedUrl: data?.signedUrl ?? null,
        uploaderName: profilesMap[p.user_id] || 'Inconnu',
      }
    })
  )
  
  const photosCount = pendingWithUrls.filter(m => m.media_type === "image").length
  const videosCount = pendingWithUrls.filter(m => m.media_type === "video").length

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-terracotta-600 bg-clip-text text-transparent">
            Modération des médias
          </h1>
          <p className="text-muted-foreground mt-1">
            Validez les photos et vidéos avant affichage dans la galerie
          </p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">En attente</p>
                <p className="text-3xl font-bold text-amber-800">{pendingWithUrls.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Photos</p>
                <p className="text-3xl font-bold text-blue-800">{photosCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Vidéos</p>
                <p className="text-3xl font-bold text-purple-800">{videosCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages de feedback */}
      {validated && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Média validé avec succès !</p>
        </div>
      )}
      {validatedAll && (
        <div className="p-4 bg-oasis-50 border border-oasis-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-oasis-600" />
          <p className="text-oasis-700">Tous les médias ont été validés !</p>
        </div>
      )}
      {deleted && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-amber-600" />
          <p className="text-amber-700">Média supprimé.</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{decodeURIComponent(error)}</p>
        </div>
      )}

      {/* En attente de validation */}
      <Card className="bg-card-premium">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              En attente de validation
            </CardTitle>
            <CardDescription>
              {pendingWithUrls.length === 0 
                ? "Aucun média en attente"
                : `${photosCount} photo${photosCount > 1 ? 's' : ''} et ${videosCount} vidéo${videosCount > 1 ? 's' : ''} à valider`
              }
            </CardDescription>
          </div>
          {pendingWithUrls.length > 0 && (
            <form action={validateAllPhotos}>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-oasis-500 to-oasis-600 hover:from-oasis-600 hover:to-oasis-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tout valider
              </Button>
            </form>
          )}
        </CardHeader>
        <CardContent>
          {pendingWithUrls.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-oasis-400" />
              <p className="font-medium text-oasis-700">Tout est validé !</p>
              <p className="text-sm">Aucun média en attente de modération</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pendingWithUrls.map((media) => (
                <div 
                  key={media.id} 
                  className="rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Média */}
                  <div className="relative aspect-square bg-gray-100">
                    {media.signedUrl ? (
                      media.media_type === "video" ? (
                        <div className="relative w-full h-full bg-black">
                          <video
                            src={media.signedUrl}
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
                          src={media.signedUrl}
                          alt="Photo"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Infos et actions */}
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{media.uploaderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(media.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <form action={validatePhoto} className="flex-1">
                        <input type="hidden" name="photo_id" value={media.id} />
                        <Button 
                          type="submit" 
                          size="sm" 
                          className="w-full bg-oasis-500 hover:bg-oasis-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Valider
                        </Button>
                      </form>
                      <form action={rejectPhoto}>
                        <input type="hidden" name="photo_id" value={media.id} />
                        <Button 
                          type="submit" 
                          size="sm" 
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Récemment validés */}
      {validatedWithUrls.length > 0 && (
        <Card className="bg-card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-oasis-500" />
              Récemment validés
            </CardTitle>
            <CardDescription>
              Les 12 derniers médias validés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {validatedWithUrls.map((media) => (
                <div 
                  key={media.id} 
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  {media.signedUrl ? (
                    media.media_type === "video" ? (
                      <div className="relative w-full h-full bg-black">
                        <video
                          src={media.signedUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media.signedUrl}
                        alt="Photo"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  {/* Badge validé */}
                  <div className="absolute top-1 right-1">
                    <div className="w-5 h-5 rounded-full bg-oasis-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  {/* Overlay avec info */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{media.uploaderName}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
