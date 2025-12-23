"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"
import { uploadEventImage } from "./actions"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadEventImage(formData)

    setIsUploading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    if (result.url) {
      onChange(result.url)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleUpload(file)
    } else {
      setError("Veuillez déposer une image (JPG, PNG, GIF, WebP)")
    }
  }

  const handleRemove = () => {
    onChange("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-oasis-600" />
        {label}
      </Label>

      <input
        type="hidden"
        name="image_url"
        value={value}
      />

      {value ? (
        // Prévisualisation de l'image
        <div className="relative group">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gold-200 bg-gradient-to-br from-gold-50 to-terracotta-50">
            <Image
              src={value}
              alt="Aperçu"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Zone d'upload
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragActive 
              ? "border-gold-500 bg-gold-50" 
              : "border-gray-300 hover:border-gold-400 hover:bg-gold-50/50"
            }
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-100 to-terracotta-100 flex items-center justify-center">
                <Upload className="w-7 h-7 text-gold-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Glissez une image ici
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ou cliquez pour sélectionner
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF, WebP • Max 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
}

