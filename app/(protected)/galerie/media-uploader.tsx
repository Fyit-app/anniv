"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, Image as ImageIcon, Film, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadMedia, type UploadResult } from "./actions"

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png", 
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime"
]

export function MediaUploader() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMessage("Format non supporté. Utilisez JPG, PNG, GIF, WebP, MP4, WebM ou MOV.")
      return
    }
    
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage("Le fichier est trop volumineux (max 100 MB)")
      return
    }

    setSelectedFile(file)
    setErrorMessage(null)
    setUploadStatus("idle")

    // Créer un aperçu
    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  const clearSelection = useCallback(() => {
    setSelectedFile(null)
    setPreview(null)
    setErrorMessage(null)
    setUploadStatus("idle")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [])

  const router = useRouter()

  const handleSubmit = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append("media", selectedFile)
      
      const result: UploadResult = await uploadMedia(formData)
      
      if (result.success) {
        setUploadStatus("success")
        
        // Reset après 2 secondes et rafraîchir
        setTimeout(() => {
          clearSelection()
          router.refresh()
        }, 2000)
      } else {
        setUploadStatus("error")
        setErrorMessage(result.error || "Erreur lors de l'envoi")
      }
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Erreur lors de l'envoi. Veuillez réessayer.")
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const isVideo = selectedFile?.type.startsWith("video/")

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragActive 
            ? "border-purple-500 bg-purple-50 scale-[1.02]" 
            : selectedFile 
              ? "border-oasis-300 bg-oasis-50/50" 
              : "border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/30 hover:border-purple-400 hover:bg-purple-50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        {/* Preview */}
        {selectedFile && preview ? (
          <div className="relative aspect-video sm:aspect-[21/9]">
            {isVideo ? (
              <video
                src={preview}
                className="w-full h-full object-contain bg-black/5"
                controls={false}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Aperçu"
                className="w-full h-full object-contain"
              />
            )}
            
            {/* Overlay avec infos */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
              {/* Badge type */}
              <div className="absolute top-4 left-4">
                <div className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  ${isVideo ? "bg-purple-500 text-white" : "bg-gold-500 text-white"}
                `}>
                  {isVideo ? <Film className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                  {isVideo ? "Vidéo" : "Photo"}
                </div>
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearSelection()
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Infos fichier */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-medium text-sm truncate">{selectedFile.name}</p>
                <p className="text-white/70 text-xs">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            {/* Overlay upload en cours */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-white">
                  <Loader2 className="h-10 w-10 animate-spin" />
                  <p className="font-medium">Envoi en cours...</p>
                </div>
              </div>
            )}

            {/* Overlay succès */}
            {uploadStatus === "success" && (
              <div className="absolute inset-0 bg-oasis-500/90 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-white">
                  <CheckCircle2 className="h-12 w-12" />
                  <p className="font-medium">Envoyé avec succès !</p>
                  <p className="text-sm opacity-80">En attente de validation</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Zone de drop vide */
          <div className="py-12 sm:py-16 px-6 flex flex-col items-center justify-center text-center">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
              ${dragActive 
                ? "bg-purple-500 scale-110" 
                : "bg-gradient-to-br from-purple-500 to-pink-500"
              }
            `}>
              <Upload className="h-7 w-7 text-white" />
            </div>
            
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              {dragActive ? "Déposez votre fichier ici" : "Ajouter un souvenir"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Glissez-déposez une photo ou vidéo, ou cliquez pour parcourir
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded-full bg-muted">JPG</span>
              <span className="px-2 py-1 rounded-full bg-muted">PNG</span>
              <span className="px-2 py-1 rounded-full bg-muted">WebP</span>
              <span className="px-2 py-1 rounded-full bg-muted">MP4</span>
              <span className="px-2 py-1 rounded-full bg-muted">WebM</span>
              <span className="text-muted-foreground/60">max 100 MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Bouton d'envoi */}
      {selectedFile && uploadStatus !== "success" && (
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Envoyer le fichier
            </>
          )}
        </Button>
      )}

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

