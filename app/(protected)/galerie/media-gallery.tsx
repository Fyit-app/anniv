"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Play, Image as ImageIcon, Film, CheckCircle2, Clock, ZoomIn, Sparkles, Camera } from "lucide-react"

type MediaItem = {
  id: string
  signedUrl: string | null
  media_type: "image" | "video"
  validated: boolean
  created_at: string
}

type MediaGalleryProps = {
  items: MediaItem[]
  showStatus?: boolean
}

export function MediaGallery({ items, showStatus = false }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    setIsPlaying(false)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setIsPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
    setIsPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    setIsPlaying(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
  }

  const currentItem = items[currentIndex]

  if (items.length === 0) return null

  // Grille bento avec tailles variées
  const getGridClass = (index: number, total: number) => {
    // Pour les premières photos, on fait une grille plus intéressante
    if (total >= 5) {
      if (index === 0) return "col-span-2 row-span-2"
      if (index === 3) return "col-span-2"
    } else if (total >= 3) {
      if (index === 0) return "col-span-2 row-span-2"
    } else if (total === 2) {
      return "col-span-1"
    }
    return "col-span-1"
  }

  return (
    <>
      {/* Grille de médias */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[140px] sm:auto-rows-[180px]">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => item.signedUrl && openLightbox(index)}
            className={`
              group relative rounded-2xl overflow-hidden bg-muted cursor-pointer
              transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10
              ${getGridClass(index, items.length)}
            `}
          >
            {item.signedUrl ? (
              <>
                {item.media_type === "video" ? (
                  <video
                    src={item.signedUrl}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.signedUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                {/* Overlay hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      {item.media_type === "video" ? (
                        <Play className="h-5 w-5 text-white ml-0.5" />
                      ) : (
                        <ZoomIn className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge vidéo */}
                {item.media_type === "video" && (
                  <div className="absolute bottom-2 left-2">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium">
                      <Film className="h-3 w-3" />
                      Vidéo
                    </div>
                  </div>
                )}

                {/* Badge de statut */}
                {showStatus && (
                  <div className="absolute top-2 right-2">
                    {item.validated ? (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-oasis-500 text-white text-[10px] font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Validé
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-muted-foreground text-[10px] font-medium backdrop-blur-sm">
                        <Clock className="h-3 w-3" />
                        En attente
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentItem?.signedUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Bouton fermer */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Contenu */}
          <div
            className="max-w-[90vw] max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.media_type === "video" ? (
              <div className="relative">
                <video
                  src={currentItem.signedUrl}
                  className="max-w-full max-h-[85vh] rounded-lg"
                  controls
                  autoPlay={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentItem.signedUrl}
                alt=""
                className="max-w-full max-h-[85vh] rounded-lg object-contain"
              />
            )}
          </div>

          {/* Indicateur de position */}
          {items.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                    setIsPlaying(false)
                  }}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${index === currentIndex 
                      ? "w-6 bg-white" 
                      : "bg-white/40 hover:bg-white/60"
                    }
                  `}
                />
              ))}
            </div>
          )}

          {/* Compteur */}
          <div className="absolute bottom-6 right-6 text-white/60 text-sm">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  )
}

// Composant pour l'état vide
export function EmptyGallery({ 
  title, 
  description, 
  iconType = "image"
}: { 
  title: string
  description: string
  iconType?: "image" | "sparkles" | "camera"
}) {
  const icons = {
    image: ImageIcon,
    sparkles: Sparkles,
    camera: Camera
  }
  const Icon = icons[iconType] || ImageIcon

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-100 to-terracotta-100 flex items-center justify-center mb-5 rotate-3">
        <Icon className="h-9 w-9 text-gold-500" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  )
}

