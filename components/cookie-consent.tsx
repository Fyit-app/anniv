"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"
import { cn } from "@/lib/utils"

const COOKIE_CONSENT_KEY = "cookie-consent-accepted"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!hasConsented) {
      // Délai pour l'animation d'entrée
      const timer = setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true")
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "false")
    setIsAnimating(false)
    setTimeout(() => setIsVisible(false), 300)
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 left-4 sm:left-auto z-50",
        "w-auto sm:max-w-sm",
        "transition-all duration-300 ease-out",
        isAnimating
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      )}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gold-200 shadow-2xl shadow-black/10">
        {/* Fond décoratif */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-terracotta-500 shadow-md">
              <Cookie className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">
                Nous utilisons des cookies 🍪
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Ce site utilise des cookies pour améliorer votre expérience et analyser le trafic.
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleDecline}
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-xs border-gold-200 hover:bg-gold-50"
            >
              Refuser
            </Button>
            <Button
              onClick={handleAccept}
              size="sm"
              className="flex-1 h-9 text-xs bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600 text-white shadow-md"
            >
              Accepter
            </Button>
          </div>

          {/* Lien politique */}
          <p className="text-center text-[10px] text-muted-foreground/60 mt-3">
            En savoir plus sur notre{" "}
            <Link 
              href="/politique-confidentialite" 
              className="underline hover:text-gold-600 transition-colors"
            >
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

