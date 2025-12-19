"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/browser"
import { Sparkles, Calendar, ArrowRight, PartyPopper, Sun, Moon } from "lucide-react"

interface WelcomeModalProps {
  firstName: string
  onComplete: () => void
}

export function WelcomeModal({ firstName, onComplete }: WelcomeModalProps) {
  const [isPending, startTransition] = useTransition()
  const [isVisible, setIsVisible] = useState(false)

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleDiscoverProgramme = () => {
    startTransition(async () => {
      // Mettre à jour welcome_seen dans Supabase
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from("profiles")
          .update({ welcome_seen: true })
          .eq("id", user.id)
      }

      // Appeler le callback pour ouvrir l'EventStepper
      onComplete()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop avec overlay sombre */}
      <div 
        className={`
          absolute inset-0 bg-night-900/90 backdrop-blur-md
          transition-opacity duration-500
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-lg overflow-hidden rounded-3xl
          bg-cream border-2 border-gold-200/50
          shadow-2xl shadow-black/30
          transition-all duration-700 ease-out
          ${isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-8"
          }
        `}
      >
        {/* Fond dégradé interne */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gold-50 to-terracotta-50/50" />
        
        {/* Éléments décoratifs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-oasis-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Pattern */}
        <div className="absolute inset-0 pattern-zellige opacity-10" />

        {/* Contenu */}
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          {/* En-tête avec icône */}
          <div className="text-center mb-8">
            <div className="inline-flex relative mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 via-terracotta-400 to-oasis-400 shadow-xl shadow-gold-500/30 animate-pulse">
                <span className="text-5xl">🌴</span>
              </div>
              {/* Étoiles animées */}
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-gold-500 animate-bounce" />
              <Sun className="absolute -bottom-1 -left-3 h-5 w-5 text-terracotta-500 animate-spin" style={{ animationDuration: "8s" }} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gradient-gold mb-3">
              Bienvenue à Marrakech, {firstName} !
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              Nous sommes ravis de t'accueillir pour célébrer les 60 ans d'Yvonne
            </p>
          </div>

          {/* Message chaleureux */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gold-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg shadow-terracotta-500/30">
                <PartyPopper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Un moment inoubliable t'attend
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Du 12 au 18 janvier 2026, retrouve-nous dans la magie de Marrakech 
                  pour une semaine de célébration, de partage et de souvenirs.
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-4 rounded-xl bg-white border border-gold-200 shadow-sm">
              <div className="text-2xl mb-1">☀️</div>
              <p className="text-xs font-medium text-foreground/70">Soleil</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white border border-gold-200 shadow-sm">
              <div className="text-2xl mb-1">🎉</div>
              <p className="text-xs font-medium text-foreground/70">Festivités</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white border border-gold-200 shadow-sm">
              <div className="text-2xl mb-1">❤️</div>
              <p className="text-xs font-medium text-foreground/70">Famille</p>
            </div>
          </div>

          {/* Bouton principal */}
          <Button
            onClick={handleDiscoverProgramme}
            disabled={isPending}
            size="lg"
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-gold-600 via-terracotta-600 to-gold-600 hover:from-gold-700 hover:via-terracotta-700 hover:to-gold-700 shadow-xl shadow-gold-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:-translate-y-0.5"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Chargement...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Découvrir le programme
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>

          {/* Note */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Dis-nous à quelles activités tu souhaites participer
          </p>
        </div>
      </div>
    </div>
  )
}

