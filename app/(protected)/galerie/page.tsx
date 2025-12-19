import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { 
  Camera, 
  Sparkles,
  Image as ImageIcon,
  Film,
  Users,
  Star
} from "lucide-react"

import { MediaUploader } from "./media-uploader"
import { MediaGallery, EmptyGallery } from "./media-gallery"

type MediaRow = {
  id: string
  user_id: string
  url: string
  validated: boolean
  created_at: string
  media_type: "image" | "video"
}

async function signedUrlForOwnMedia(path: string) {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from("photos")
    .createSignedUrl(path, 60 * 60)
  return data?.signedUrl ?? null
}

async function signedUrlForValidatedMedia(path: string) {
  const admin = createAdminClient()
  const { data } = await admin.storage.from("photos").createSignedUrl(path, 60 * 60)
  return data?.signedUrl ?? null
}

export default async function GaleriePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protection: rediriger si non connecté
  if (!user) {
    redirect("/login")
  }

  const { data: myMedia } = await supabase
    .from("photos")
    .select("id,user_id,url,validated,created_at,media_type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: validatedMedia } = await supabase
    .from("photos")
    .select("id,user_id,url,validated,created_at,media_type")
    .eq("validated", true)
    .order("created_at", { ascending: false })

  const myWithUrls = await Promise.all(
    (myMedia ?? []).map(async (p: MediaRow) => ({
      ...p,
      media_type: p.media_type || "image",
      signedUrl: await signedUrlForOwnMedia(p.url),
    }))
  )

  const validatedWithUrls = await Promise.all(
    (validatedMedia ?? []).map(async (p: MediaRow) => ({
      ...p,
      media_type: p.media_type || "image",
      signedUrl: await signedUrlForValidatedMedia(p.url),
    }))
  )
  
  // Statistiques
  const myPhotosCount = myWithUrls.filter(m => m.media_type === "image").length
  const myVideosCount = myWithUrls.filter(m => m.media_type === "video").length
  const myPendingCount = myWithUrls.filter(m => !m.validated).length
  const totalValidated = validatedWithUrls.length
  const validatedPhotosCount = validatedWithUrls.filter(m => m.media_type === "image").length
  const validatedVideosCount = validatedWithUrls.filter(m => m.media_type === "video").length

  return (
    <div className="min-h-screen pattern-zellige">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
        {/* Background effects */}
        <div className="absolute inset-0 pattern-zellige-dark opacity-30" />
        <div className="absolute inset-0 pattern-stars opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-40 left-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px]" />
        
        <div className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-pink-200 text-sm font-medium mb-6 backdrop-blur-sm">
              <Camera className="h-4 w-4" />
              Souvenirs partagés
            </div>
            
            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
              Galerie
              <br />
              <span className="text-pink-200">de souvenirs</span> 📸
            </h1>
            
            <p className="text-lg text-pink-100/70 max-w-xl mb-8">
              Immortalisez et partagez les moments magiques de cette célébration exceptionnelle à Marrakech.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalValidated}</p>
                  <p className="text-xs text-pink-200/70">Médias partagés</p>
                </div>
              </div>
              
              {(myPhotosCount > 0 || myVideosCount > 0) && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-oasis-500 to-oasis-600 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{myPhotosCount + myVideosCount}</p>
                    <p className="text-xs text-pink-200/70">
                      Mes contributions
                      {myPendingCount > 0 && <span className="text-pink-300"> · {myPendingCount} en attente</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Section Upload */}
          <section className="relative -mt-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100/50 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">Ajouter un souvenir</h2>
                  <p className="text-sm text-muted-foreground">Photos et vidéos jusqu&apos;à 100 MB</p>
                </div>
              </div>
              
              <MediaUploader />
            </div>
          </section>

          {/* Mes médias */}
          {myWithUrls.length > 0 && (
            <section>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">Mes contributions</h2>
                    <p className="text-sm text-muted-foreground">
                      {myPhotosCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <ImageIcon className="h-3.5 w-3.5" />
                          {myPhotosCount}
                        </span>
                      )}
                      {myPhotosCount > 0 && myVideosCount > 0 && <span className="mx-2 text-muted-foreground/50">·</span>}
                      {myVideosCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Film className="h-3.5 w-3.5" />
                          {myVideosCount}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-white border border-purple-100/50 shadow-lg">
                <MediaGallery items={myWithUrls} showStatus />
              </div>
            </section>
          )}

          {/* Galerie communautaire */}
          <section>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-terracotta-400 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">Galerie communautaire</h2>
                <p className="text-sm text-muted-foreground">
                  {totalValidated > 0 ? (
                    <>
                      {validatedPhotosCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <ImageIcon className="h-3.5 w-3.5" />
                          {validatedPhotosCount} photo{validatedPhotosCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {validatedPhotosCount > 0 && validatedVideosCount > 0 && <span className="mx-2 text-muted-foreground/50">·</span>}
                      {validatedVideosCount > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Film className="h-3.5 w-3.5" />
                          {validatedVideosCount} vidéo{validatedVideosCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </>
                  ) : (
                    "Les souvenirs de tous les invités"
                  )}
                </p>
              </div>
            </div>
            
            <div className="p-6 rounded-3xl bg-white border border-gold-100/50 shadow-lg min-h-[300px]">
              {validatedWithUrls.length > 0 ? (
                <MediaGallery items={validatedWithUrls} />
              ) : (
                <EmptyGallery
                  iconType="sparkles"
                  title="Aucun souvenir partagé"
                  description="Soyez le premier à partager un moment de cette aventure ! Les médias apparaîtront ici après validation."
                />
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
