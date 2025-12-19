"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Afficher le bouton après avoir scrollé 400px
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center",
        "rounded-full bg-gradient-to-br from-gold-500 to-terracotta-500",
        "text-white shadow-lg shadow-gold-500/30",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-gold-500/40 hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Retour en haut de la page"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}

