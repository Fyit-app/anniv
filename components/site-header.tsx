"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader() {
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
              scrolled
                ? "bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-400 hover:to-terracotta-400 text-white shadow-lg shadow-gold-500/25"
                : "bg-white/15 backdrop-blur-sm border border-gold-300/30 text-white hover:bg-white/25"
            )}
          >
            <Link href="/login">Espace invité</Link>
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

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-cream/98 backdrop-blur-xl transition-all duration-500 lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-6 sm:gap-8 px-6">
          {[
            { href: "/#countdown", label: "Compte à rebours" },
            { href: "/#programme", label: "Programme" },
            { href: "/#infos", label: "Infos pratiques" },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-display text-2xl sm:text-3xl font-semibold text-foreground transition-all hover:text-gold-600",
                mobileOpen ? "animate-fade-in-up" : ""
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            size="lg"
            className={cn(
              "mt-4 w-full max-w-xs h-12 sm:h-14 px-8 sm:px-10 bg-gradient-to-r from-gold-500 to-terracotta-500 text-white text-base sm:text-lg shadow-xl shadow-gold-500/25",
              mobileOpen ? "animate-fade-in-up" : ""
            )}
            style={{ animationDelay: "300ms" }}
          >
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              Accéder à mon espace
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
