"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { User, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  isLoggedIn?: boolean
}

export function SiteHeader({ isLoggedIn = false }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out-expo",
        scrolled
          ? "bg-cream/95 backdrop-blur-xl shadow-lg border-b border-gold-200/30"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group relative flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className={cn(
              "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-all duration-500",
              scrolled
                ? "bg-gradient-to-br from-gold-500 via-terracotta-500 to-oasis-500"
                : "bg-white/20 backdrop-blur-sm border border-gold-300/30"
            )}>
              <span className={cn(
                "font-display text-lg sm:text-xl font-bold transition-colors duration-500",
                scrolled ? "text-white" : "text-gold-100"
              )}>
                60
              </span>
            </div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50 hidden sm:block" />
          </div>
          <div className={cn(
            "hidden sm:block transition-colors duration-500",
            scrolled ? "text-foreground" : "text-white"
          )}>
            <span className="block font-display text-base sm:text-lg font-semibold tracking-wide">
              Yvonne
            </span>
            <span className={cn(
              "block text-[10px] sm:text-xs transition-colors duration-500",
              scrolled ? "text-muted-foreground" : "text-gold-200/70"
            )}>
              Marrakech · Janvier 2026
            </span>
          </div>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          {[
            { href: "/#countdown", label: "Compte à rebours" },
            { href: "/#programme", label: "Programme" },
            { href: "/#infos", label: "Infos" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors duration-300",
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-gold-100/80 hover:text-white",
                "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2",
                "after:bg-gradient-to-r after:from-gold-500 after:to-terracotta-500",
                "after:transition-all after:duration-300 hover:after:w-3/4"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile menu button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            className={cn(
              "hidden sm:inline-flex h-10 sm:h-11 px-4 sm:px-6 text-sm font-medium transition-all duration-300",
              isLoggedIn
                ? scrolled
                  ? "bg-gradient-to-r from-oasis-500 to-oasis-600 hover:from-oasis-400 hover:to-oasis-500 text-white shadow-lg shadow-oasis-500/25"
                  : "bg-oasis-500/90 backdrop-blur-sm border border-oasis-400/30 text-white hover:bg-oasis-400/90"
                : scrolled
                  ? "bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-400 hover:to-terracotta-400 text-white shadow-lg shadow-gold-500/25"
                  : "bg-white/15 backdrop-blur-sm border border-gold-300/30 text-white hover:bg-white/25"
            )}
          >
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <User className="h-4 w-4" />
                  Mon espace
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Espace invité
                </>
              )}
            </Link>
          </Button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              mobileOpen ? "text-foreground" : scrolled ? "text-foreground" : "text-white"
            )}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <div className="relative h-5 w-6">
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-6 rounded-full transition-all duration-300",
                  mobileOpen ? "bg-foreground top-2 rotate-45" : scrolled ? "bg-foreground top-0" : "bg-white top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-2 block h-0.5 w-6 rounded-full transition-all duration-300",
                  mobileOpen ? "opacity-0" : scrolled ? "bg-foreground" : "bg-white"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-0.5 w-6 rounded-full transition-all duration-300",
                  mobileOpen ? "bg-foreground top-2 -rotate-45" : scrolled ? "bg-foreground top-4" : "bg-white top-4"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-night-900/70 backdrop-blur-md lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-full max-w-sm bg-cream shadow-2xl lg:hidden",
          "transform transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Fond opaque de base */}
        <div className="absolute inset-0 bg-cream" />
        {/* Fond décoratif */}
        <div className="absolute inset-0 pattern-zellige opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-oasis-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Bouton fermer */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gold-100/80 hover:bg-gold-200 text-gold-700 transition-colors duration-200"
          aria-label="Fermer le menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <nav className="relative flex h-full flex-col pt-24 pb-8 px-8">
          {/* Liens de navigation */}
          <div className="flex flex-col gap-2">
            {[
              { href: "/#countdown", label: "Compte à rebours", icon: "⏱️" },
              { href: "/#programme", label: "Programme", icon: "📅" },
              { href: "/#infos", label: "Infos pratiques", icon: "ℹ️" },
            ].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                  "text-foreground hover:bg-gold-100/50 hover:text-gold-700",
                  "border border-transparent hover:border-gold-200"
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-display text-lg font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Séparateur */}
          <div className="my-6 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

          {/* CTA Button */}
          <Button
            asChild
            size="lg"
            className={cn(
              "w-full h-14 text-white text-base font-semibold shadow-xl",
              isLoggedIn
                ? "bg-gradient-to-r from-oasis-500 to-oasis-600 hover:from-oasis-600 hover:to-oasis-700 shadow-oasis-500/25"
                : "bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-600 hover:to-terracotta-600 shadow-gold-500/25"
            )}
          >
            <Link href={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2">
              {isLoggedIn ? (
                <>
                  <User className="h-5 w-5" />
                  Mon espace
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Accéder à mon espace
                </>
              )}
            </Link>
          </Button>

          {/* Footer du menu */}
          <div className="mt-auto pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Yvonne · 60 ans
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Marrakech · Janvier 2026
            </p>
          </div>
        </nav>
      </div>
    </header>
  )
}
