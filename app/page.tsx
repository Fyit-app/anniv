import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, MapPin, Users, Sparkles, ChevronDown, Plane, Sun } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Countdown } from "@/components/countdown"
import { Button } from "@/components/ui/button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CookieConsent } from "@/components/cookie-consent"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Yvonne fête ses 60 ans – Marrakech · 15 janvier 2026",
  description: "Invitation privée à célébrer les 60 ans d'Yvonne à Marrakech, du 12 au 18 janvier 2026",
}

// Video background for hero - Place your video file at /public/hero-video.mp4
const HERO_VIDEO = "/hero-video.mp4"

// Local images - Place in /public folder
const IMAGES = {
  marrakechSunset: "/marrakech-sunset.jpg", // Vue panoramique de Marrakech avec la Koutoubia
}

export default async function Home() {
  // Vérifier si l'utilisateur est connecté
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  return (
    <div className="relative bg-cream">
      <SiteHeader isLoggedIn={isLoggedIn} />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background video */}
        <div className="absolute inset-0 bg-night-900">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-right sm:object-center"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-night-900/70 via-night-800/50 to-night-900/80" />
        </div>

        {/* Decorative elements - hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gold-400/20 blur-3xl animate-float-slow" />
          <div className="absolute bottom-40 right-20 h-40 w-40 rounded-full bg-terracotta-400/15 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-oasis-400/10 blur-2xl animate-float" />
        </div>

        {/* Moroccan pattern overlay */}
        <div className="absolute inset-0 pattern-zellige-dark opacity-40 mix-blend-overlay" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32 text-center">
          {/* Badge */}
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-gold-500/10 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-md animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-oasis-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gold-100">Invitation privée</span>
          </div>

          {/* Main title */}
          <h1 className="font-display text-[2.5rem] leading-tight font-bold tracking-tight text-white sm:text-6xl lg:text-8xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Yvonne fête ses <span className="text-gradient-gold">60 ans</span>
            <span className="block mt-1 sm:mt-2">à Marrakech !</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 sm:mt-8 max-w-2xl text-base sm:text-lg text-gold-100/80 lg:text-xl animate-fade-in-up px-2" style={{ animationDelay: "0.4s" }}>
            Une semaine magique sous le soleil du Maroc pour célébrer ensemble cet anniversaire exceptionnel
          </p>

          {/* Date & Location badges */}
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md border border-white/20 w-full sm:w-auto justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gold-400" />
              <span className="font-medium text-white text-sm sm:text-base">12 – 18 janvier 2026</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 sm:px-5 sm:py-3 backdrop-blur-md border border-white/20 w-full sm:w-auto justify-center">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-oasis-400" />
              <span className="font-medium text-white text-sm sm:text-base">Marrakech, Maroc</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center animate-fade-in-up px-2" style={{ animationDelay: "0.8s" }}>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-400 hover:to-terracotta-400 text-white text-base sm:text-lg font-semibold shadow-2xl shadow-gold-500/30 transition-all duration-300 hover:scale-105 hover:shadow-gold-500/40"
            >
              <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                {isLoggedIn ? "Mon espace invité" : "Accéder à mon espace"}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md text-base sm:text-lg"
            >
              <Link href="#programme">Découvrir le programme</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce-soft">
          <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-gold-200/60" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INVITATION SECTION - Photo + Message
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 lg:py-32 bg-section-warm overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pattern-zellige opacity-50" />
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-bl from-gold-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-tr from-oasis-200/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Photo */}
            <ScrollReveal>
              <div className="relative mx-auto max-w-[280px] sm:max-w-sm lg:max-w-md">
                {/* Decorative frame */}
                <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-br from-gold-400/20 via-terracotta-400/10 to-oasis-400/20 rounded-[1.25rem] sm:rounded-[1.5rem] blur-xl" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-gold-500 via-terracotta-500 to-oasis-500 rounded-[1.1rem] sm:rounded-[1.25rem] opacity-20" />
                
                {/* Photo container */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-gold-200/50 shadow-2xl shadow-night-900/20">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src="/yvonne-portrait.jpg"
                      alt="Yvonne"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  
                  {/* Decorative lantern */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-60">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-600/80 sm:w-8 sm:h-8">
                      <path d="M12 2c1.8 2 4 3 6 3v3c0 1.2-.4 2.2-1.1 3.1L13 18v3h-2v-3l-3.9-6.9C6.4 10.2 6 9.2 6 8V5c2 0 4.2-1 6-3Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8.5 10h7" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>

                {/* Floating decorative element */}
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-oasis-400/30 to-oasis-500/20 blur-2xl animate-float-slow" />
              </div>
            </ScrollReveal>

            {/* Message content */}
            <ScrollReveal delayMs={200}>
              <div className="space-y-6 sm:space-y-8">
                {/* Opening quote decoration */}
                <div className="text-gold-400/40 text-5xl sm:text-6xl font-serif leading-none -mb-4">"</div>
                
                {/* Main invitation text */}
                <div className="space-y-4 sm:space-y-5">
                  <p className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground leading-relaxed">
                    Le <span className="text-gold-600 font-bold">15 janvier 2026</span>, je célèbrerai mes <span className="text-gradient-gold font-bold">60 ans</span> et j'aimerais vivre ce moment unique à vos côtés, sous le soleil du Maroc.
                  </p>
                </div>

                {/* Info cards with enhanced design */}
                <div className="grid gap-3 sm:gap-4 grid-cols-2">
                  <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gold-50/50 border border-gold-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl hover:border-gold-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-gold-100 group-hover:bg-gold-200 transition-colors">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gold-600" />
                      </div>
                      <span className="font-semibold text-foreground text-sm sm:text-base">Quand ?</span>
                    </div>
                    <p className="text-foreground/90 font-medium text-sm sm:text-base">12 – 18 janvier 2026</p>
                    <p className="text-foreground/60 text-xs sm:text-sm mt-1">7 jours de bonheur</p>
                  </div>
                  <div className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-oasis-50/50 border border-oasis-200/50 shadow-lg backdrop-blur-sm hover:shadow-xl hover:border-oasis-300/60 transition-all duration-300">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-oasis-100 group-hover:bg-oasis-200 transition-colors">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-oasis-600" />
                      </div>
                      <span className="font-semibold text-foreground text-sm sm:text-base">Où ?</span>
                    </div>
                    <p className="text-foreground/90 font-medium text-sm sm:text-base">Marrakech</p>
                    <p className="text-foreground/60 text-xs sm:text-sm mt-1">La ville ocre 🇲🇦</p>
                  </div>
                </div>

                {/* Activities text with decorative element */}
                <div className="relative pl-4 sm:pl-5">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-400 via-terracotta-400 to-oasis-400 rounded-full" />
                  <p className="text-base sm:text-lg text-foreground/80 italic leading-relaxed">
                    De belles activités et de précieux moments de partage nous attendent tout au long du séjour.
                  </p>
                </div>

                {/* Warning box with enhanced design */}
                <div className="relative overflow-hidden p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-gold-100/80 border border-amber-300/60 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/30 rounded-full blur-2xl" />
                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-200/80">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-amber-900 mb-1.5 text-sm sm:text-base flex items-center gap-2">
                        ⚠️ À noter
                      </p>
                      <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                        Cette période coïncide avec la <strong>CAN</strong>, les tarifs des vols et des hébergements peuvent augmenter rapidement. <span className="font-semibold">Je vous invite donc à réserver au plus tôt.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Closing message with gift icon */}
                <div className="space-y-4 sm:space-y-5 pt-3 sm:pt-4">
                  <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-50/80 to-pink-50/60 border border-rose-200/40">
                    <span className="text-2xl sm:text-3xl">🎁</span>
                    <p className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed">
                      Votre présence à mes côtés sera le plus beau des cadeaux.
                    </p>
                  </div>
                  
                  <div className="pt-3 sm:pt-5 text-center sm:text-left">
                    <p className="text-foreground/70 italic text-base sm:text-lg">Avec tout mon amour,</p>
                    <div className="mt-2 sm:mt-3 flex items-center justify-center sm:justify-start gap-2">
                      <p className="font-display text-3xl sm:text-4xl font-bold text-gradient-gold">Yvonne</p>
                      <span className="text-2xl">❤️</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROGRAMME SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="programme" className="relative py-16 sm:py-24 lg:py-32 bg-section-light scroll-mt-20 sm:scroll-mt-24 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pattern-zellige opacity-40" />
        <div className="absolute top-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-gradient-to-bl from-gold-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 sm:w-[400px] h-56 sm:h-[400px] bg-gradient-to-tr from-oasis-200/20 to-transparent rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold-100 text-gold-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>12 – 18 janvier 2026</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground lg:text-6xl">
                Programme de la semaine
              </h2>
              <p className="mt-4 sm:mt-6 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
                Une semaine exceptionnelle entre découvertes culturelles et moments de fête
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-400 via-terracotta-400 to-oasis-400 hidden md:block" />

            <div className="space-y-4 sm:space-y-6">
              {/* Lundi 12 janvier - ARRIVÉE */}
              <ScrollReveal delayMs={0}>
                <div className="relative flex gap-4 sm:gap-6">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-5 w-5 rounded-full bg-oasis-400 border-4 border-oasis-100 shadow-lg shadow-oasis-400/30" />
                  </div>
                  
                  {/* Card */}
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-oasis-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-oasis-100 text-oasis-700 text-xs sm:text-sm font-semibold">
                        Lundi 12 janvier
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">Jour d'arrivée</span>
                    </div>
                    
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-oasis-50/50 border border-oasis-100">
                      <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-oasis-500 text-white">
                        <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">Bienvenue à Marrakech ! ✈️</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Arrivée des invités, installation dans vos hébergements et premiers pas dans la ville ocre. Profitez-en pour vous acclimater !</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-oasis-100 text-oasis-700 text-xs sm:text-sm">
                          🏨 Installation & repos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Mardi 13 janvier */}
              <ScrollReveal delayMs={50}>
                <div className="relative flex gap-4 sm:gap-6">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-5 w-5 rounded-full bg-gold-500 border-4 border-gold-100 shadow-lg shadow-gold-500/30" />
                  </div>
                  
                  {/* Card */}
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gold-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-xs sm:text-sm font-semibold">
                        Mardi 13 janvier
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">Journée découverte</span>
                    </div>
                    
                    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                      {/* Jardin Majorelle */}
                      <div className="group overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-oasis-100 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-[4/3] overflow-hidden bg-oasis-50">
                          <Image
                            src="/jardin.jpg"
                            alt="Jardin Majorelle"
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3 sm:p-4 bg-gradient-to-b from-oasis-50/50 to-white">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base">Visite du Jardin Majorelle</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Un jardin botanique légendaire aux couleurs éclatantes</p>
                            </div>
                            <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-lg bg-oasis-500 text-white text-xs font-medium">
                              16€
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Palais de la Bahia */}
                      <div className="group overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gold-100 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-[4/3] overflow-hidden bg-gold-50">
                          <Image
                            src="/palais.jpg"
                            alt="Palais de la Bahia"
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3 sm:p-4 bg-gradient-to-b from-gold-50/50 to-white">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base">Visite du Palais de la Bahia</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Chef-d'œuvre de l'architecture marocaine du XIXe siècle</p>
                            </div>
                            <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-lg bg-gold-500 text-white text-xs font-medium">
                              13€
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Mercredi 14 janvier */}
              <ScrollReveal delayMs={150}>
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-5 w-5 rounded-full bg-terracotta-500 border-4 border-terracotta-100 shadow-lg shadow-terracotta-500/30" />
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-terracotta-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs sm:text-sm font-semibold">
                        Mercredi 14 janvier
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">Excursion nature</span>
                    </div>
                    
                    <div className="group overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-terracotta-100 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-[16/9] overflow-hidden bg-terracotta-50">
                        <Image
                          src="/ourika.jpg"
                          alt="Vallée de l'Ourika"
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-b from-terracotta-50/50 to-white">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">Visite de la Vallée de l'Ourika</h4>
                          <span className="shrink-0 inline-flex items-center px-2 py-1 rounded-lg bg-terracotta-500 text-white text-xs font-medium">
                            24€
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Escapade dans les montagnes de l'Atlas, cascades et villages berbères</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-oasis-100 text-oasis-700 text-xs">
                          <Users className="h-3 w-3" />
                          Groupe 15 pers.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Jeudi 15 janvier - JOUR J */}
              <ScrollReveal delayMs={200}>
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-gold-400 via-terracotta-500 to-oasis-500 border-4 border-gold-100 shadow-xl shadow-gold-500/50 animate-pulse" />
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gold-50 via-terracotta-50/50 to-oasis-50/30 border-2 border-gold-300 shadow-xl shadow-gold-500/10 relative overflow-hidden">
                    {/* Decorative sparkles */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl">🎂</div>
                    <div className="absolute bottom-3 right-6 sm:bottom-4 sm:right-8 text-lg sm:text-xl">🎉</div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-terracotta-500 text-white text-xs sm:text-sm font-bold shadow-lg">
                        ⭐ Jeudi 15 janvier ⭐
                      </span>
                      <span className="text-gold-700 font-semibold text-sm sm:text-base">LE JOUR J !</span>
                    </div>
                    
                    <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gold-200 shadow-lg">
                      {/* Layout horizontal sur desktop */}
                      <div className="flex flex-col md:flex-row">
                        {/* Photo du restaurant */}
                        <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-gold-100">
                          <Image
                            src="/resto.jpg"
                            alt="Restaurant Comptoir Darna"
                            fill
                            className="object-contain"
                          />
                        </div>
                        
                        {/* Contenu */}
                        <div className="flex-1 p-4 sm:p-5 bg-gradient-to-br from-gold-50 to-white">
                          <h4 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
                            Nouvelle bougie, nouvelle étape ! 🎂
                          </h4>
                          <p className="text-gold-700 italic text-sm sm:text-base mb-3">
                            Guidée et portée par la grâce de Dieu
                          </p>
                          
                          <div className="p-3 rounded-xl bg-gold-100/70 border border-gold-200">
                            <div className="flex items-center gap-2 text-gold-900 font-semibold mb-1 text-sm">
                              <MapPin className="h-3.5 w-3.5" />
                              Restaurant Comptoir Darna
                            </div>
                            <div className="flex items-center gap-2 text-gold-800 text-sm">
                              <span>🕕</span>
                              <span className="font-medium">Rendez-vous à 18h00</span>
                            </div>
                            <p className="mt-1 text-gold-700 text-xs">
                              Pour un moment dînatoire inoubliable
                            </p>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="text-lg">🍾</span>
                            <span className="text-lg">🥳</span>
                            <span className="text-lg">❤️</span>
                            <span className="text-lg">🧡</span>
                            <span className="text-lg">💛</span>
                            <span className="text-lg">💚</span>
                            <span className="text-lg">💙</span>
                            <span className="text-lg">💜</span>
                          </div>
                          <p className="mt-2 text-sm sm:text-base font-bold text-gold-700">ONE LIFE ❤️</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Vendredi 16 janvier */}
              <ScrollReveal delayMs={250}>
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-5 w-5 rounded-full bg-terracotta-400 border-4 border-terracotta-100 shadow-lg shadow-terracotta-400/30" />
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-terracotta-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs sm:text-sm font-semibold">
                        Vendredi 16 janvier
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">Shopping & découverte</span>
                    </div>
                    
                    <div className="group overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-terracotta-100 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-[16/9] overflow-hidden bg-terracotta-50">
                        <Image
                          src="/Place.jpg"
                          alt="Place Jemaa el-Fna"
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-b from-terracotta-50/50 to-white">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">Place Jemaa el-Fna & Souks</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Plongez dans l'effervescence de la place mythique et perdez-vous dans les souks colorés</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Samedi 17 janvier */}
              <ScrollReveal delayMs={300}>
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-5 w-5 rounded-full bg-oasis-500 border-4 border-oasis-100 shadow-lg shadow-oasis-500/30" />
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-oasis-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-oasis-100 text-oasis-700 text-xs sm:text-sm font-semibold">
                        Samedi 17 janvier
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">Bien-être & détente</span>
                    </div>
                    
                    <div className="group overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-oasis-100 shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-[16/9] overflow-hidden bg-oasis-50">
                        <Image
                          src="/spa.jpg"
                          alt="Spa & Hammam"
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 sm:p-4 bg-gradient-to-b from-oasis-50/50 to-white">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">Détente au Spa & Hammam</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Moment de relaxation dans un hammam traditionnel marocain pour clôturer la semaine en beauté</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Dimanche 18 janvier - DÉPART */}
              <ScrollReveal delayMs={350}>
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="hidden md:flex flex-shrink-0 w-14 items-start justify-center pt-6">
                    <div className="h-5 w-5 rounded-full bg-terracotta-400 border-4 border-terracotta-100 shadow-lg shadow-terracotta-400/30" />
                  </div>
                  
                  <div className="flex-1 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-terracotta-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-700 text-xs sm:text-sm font-semibold">
                        Dimanche 18 janvier
                      </span>
                      <span className="text-muted-foreground text-xs sm:text-sm">Jour de départ</span>
                    </div>
                    
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-terracotta-50/50 border border-terracotta-100">
                      <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-terracotta-500 text-white">
                        <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm sm:text-base">Au revoir Marrakech ! 👋</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Derniers moments dans la ville ocre avant de reprendre l'avion. Des souvenirs plein la tête et le cœur rempli de joie !</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-terracotta-100 text-terracotta-700 text-xs sm:text-sm">
                          ✈️ Retour à la maison
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Note */}
          <ScrollReveal delayMs={500}>
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-muted-foreground text-xs sm:text-sm">
                * Les tarifs sont indicatifs et peuvent varier. Réservations à confirmer sur place.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INFOS PRATIQUES SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="infos" className="relative py-16 sm:py-24 lg:py-32 bg-section-night text-white scroll-mt-20 sm:scroll-mt-24 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pattern-zellige-dark opacity-30" />
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gold-500/10 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-oasis-500/10 rounded-full blur-[80px] sm:blur-[120px]" />
        
        {/* Top border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-gold-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm border border-white/10">
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Préparez votre voyage</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold lg:text-6xl">
                Infos pratiques
              </h2>
              <p className="mt-3 sm:mt-4 text-gold-100/60 text-base sm:text-lg max-w-2xl mx-auto px-2">
                Tout ce qu'il faut savoir pour organiser votre séjour à Marrakech
              </p>
            </div>
          </ScrollReveal>

          {/* Main grid */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Vol */}
            <ScrollReveal delayMs={0}>
              <div className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-500">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-500 to-terracotta-600 shadow-lg shadow-gold-500/25">
                    <Plane className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Vol & Aéroport</h3>
                    <div className="space-y-2 sm:space-y-3 text-gold-100/70">
                      <div className="flex items-start gap-2">
                        <span className="text-gold-400 mt-0.5 sm:mt-1 text-sm">✈</span>
                        <div>
                          <p className="font-medium text-white text-sm sm:text-base">Aéroport Marrakech-Menara (RAK)</p>
                          <p className="text-xs sm:text-sm">À 6 km du centre-ville</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gold-400 mt-0.5 sm:mt-1 text-sm">🛫</span>
                        <div>
                          <p className="text-xs sm:text-sm">Vols directs depuis Paris, Lyon, Marseille...</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gold-400 mt-0.5 sm:mt-1 text-sm">💰</span>
                        <div>
                          <p className="text-xs sm:text-sm">Low-cost : Ryanair, EasyJet, Transavia</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Logement */}
            <ScrollReveal delayMs={100}>
              <div className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm hover:border-oasis-500/30 transition-all duration-500">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-oasis-500 to-oasis-600 shadow-lg shadow-oasis-500/25">
                    <MapPin className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Logement</h3>
                    <div className="space-y-2 sm:space-y-3 text-gold-100/70">
                      <div className="flex items-start gap-2">
                        <span className="text-oasis-400 mt-0.5 sm:mt-1 text-sm">🏨</span>
                        <div>
                          <p className="font-medium text-white text-sm sm:text-base">Riads ou Hôtels</p>
                          <p className="text-xs sm:text-sm">Quartiers : Médina, Guéliz, Hivernage</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-oasis-400 mt-0.5 sm:mt-1 text-sm">📍</span>
                        <div>
                          <p className="text-xs sm:text-sm">Partagez votre adresse dans l'espace invité</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Météo */}
            <ScrollReveal delayMs={200}>
              <div className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm hover:border-terracotta-500/30 transition-all duration-500">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg shadow-terracotta-500/25">
                    <Sun className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Météo en janvier</h3>
                    <div className="space-y-2 sm:space-y-3 text-gold-100/70">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10">
                          <p className="text-xl sm:text-2xl font-bold text-white">18°C</p>
                          <p className="text-[10px] sm:text-xs">Journée</p>
                        </div>
                        <div className="text-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10">
                          <p className="text-xl sm:text-2xl font-bold text-white">8°C</p>
                          <p className="text-[10px] sm:text-xs">Soirée</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-terracotta-400 mt-0.5 sm:mt-1 text-sm">🧥</span>
                        <p className="text-xs sm:text-sm">Prévoyez une veste chaude pour les soirées !</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Formalités */}
            <ScrollReveal delayMs={300}>
              <div className="group p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm hover:border-gold-500/30 transition-all duration-500">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex-shrink-0 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-600 to-gold-700 shadow-lg shadow-gold-600/25">
                    <svg className="h-5 w-5 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Formalités</h3>
                    <div className="space-y-2 sm:space-y-3 text-gold-100/70">
                      <div className="flex items-start gap-2">
                        <span className="text-gold-400 mt-0.5 sm:mt-1 text-sm">🛂</span>
                        <div>
                          <p className="font-medium text-white text-sm sm:text-base">Passeport valide</p>
                          <p className="text-xs sm:text-sm">Validité 6 mois après le retour</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-gold-400 mt-0.5 sm:mt-1 text-sm">✅</span>
                        <div>
                          <p className="text-xs sm:text-sm">Pas de visa pour les Français (&lt; 90 jours)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Practical tips */}
          <ScrollReveal delayMs={400}>
            <div className="mt-8 sm:mt-12 grid gap-3 sm:gap-4 grid-cols-3">
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">💵</div>
                <p className="font-medium text-white text-xs sm:text-sm">Monnaie</p>
                <p className="text-[10px] sm:text-sm text-gold-100/60">Dirham (MAD)</p>
                <p className="text-[10px] sm:text-xs text-gold-100/40 mt-0.5 sm:mt-1">1€ ≈ 11 MAD</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">🔌</div>
                <p className="font-medium text-white text-xs sm:text-sm">Électricité</p>
                <p className="text-[10px] sm:text-sm text-gold-100/60">Prises EU</p>
                <p className="text-[10px] sm:text-xs text-gold-100/40 mt-0.5 sm:mt-1">220V</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">🕐</div>
                <p className="font-medium text-white text-xs sm:text-sm">Décalage</p>
                <p className="text-[10px] sm:text-sm text-gold-100/60">UTC+1</p>
                <p className="text-[10px] sm:text-xs text-gold-100/40 mt-0.5 sm:mt-1">= Paris</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Warning CAN */}
          <ScrollReveal delayMs={500}>
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-gold-500/20 via-terracotta-500/15 to-gold-500/20 border border-gold-500/30 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                <div className="flex-shrink-0 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-500 to-terracotta-500 shadow-lg">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg sm:text-xl font-semibold text-gold-300 mb-1.5 sm:mb-2">
                    ⚠️ Réservez dès maintenant !
                  </h4>
                  <p className="text-gold-100/80 leading-relaxed text-sm sm:text-base">
                    C'est aussi la période de la <strong className="text-white">CAN</strong> au Maroc. 
                    Les prix risquent de monter rapidement. 
                    <span className="text-gold-300 font-medium"> N'attendez pas !</span>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delayMs={600}>
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-gold-100/60 mb-3 sm:mb-4 text-sm sm:text-base">Des questions ? Besoin d'aide pour organiser votre voyage ?</p>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 bg-white text-night-800 hover:bg-gold-50 font-semibold shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  {isLoggedIn ? "Mon espace invité" : "Accéder à l'espace invité"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CTA SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={IMAGES.marrakechSunset}
            alt="Vue panoramique de Marrakech avec la Koutoubia au coucher du soleil"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night-900/90 via-night-800/80 to-night-900/90" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white lg:text-6xl">
              On vous attend à Marrakech !
            </h2>
          </ScrollReveal>

          <ScrollReveal delayMs={100}>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gold-100/80 max-w-2xl mx-auto px-2">
              Accédez à votre espace invité pour renseigner votre séjour, partager vos photos et recevoir toutes les informations.
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={200}>
            <div className="mt-8 sm:mt-10">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 bg-white text-night-900 hover:bg-gold-50 text-base sm:text-lg font-semibold shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  {isLoggedIn ? "Mon espace invité" : "Accéder à mon espace invité"}
                  <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={300}>
            <p className="mt-6 sm:mt-8 text-gold-200/50 text-xs sm:text-sm px-4">
              Site privé. Si vous n'avez pas reçu de lien d'accès, contactez l'organisateur.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COUNTDOWN SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="countdown" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Dark premium background */}
        <div className="absolute inset-0 bg-section-night" />
        
        {/* Animated gradient orbs - reduced on mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-10 sm:-left-20 w-48 sm:w-96 h-48 sm:h-96 bg-gold-500/20 rounded-full blur-[60px] sm:blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-10 sm:-right-20 w-48 sm:w-96 h-48 sm:h-96 bg-terracotta-500/15 rounded-full blur-[60px] sm:blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        
        {/* Moroccan pattern overlay */}
        <div className="absolute inset-0 pattern-zellige-dark opacity-20" />
        
        {/* Stars pattern */}
        <div className="absolute inset-0 pattern-stars opacity-30" />
        
        {/* Top decorative border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              {/* Decorative element */}
              <div className="inline-flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold-500/60" />
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gold-400 animate-pulse shadow-lg shadow-gold-500/50" />
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold-500/60" />
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white lg:text-6xl tracking-tight">
                Le jour J approche
                <span className="text-gold-400">…</span>
              </h2>
              
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gold-200/60 lg:text-xl">
                Plus que quelques instants avant la célébration
              </p>
            </div>
          </ScrollReveal>

          {/* Countdown */}
          <ScrollReveal delayMs={200}>
            <Countdown targetIso="2026-01-15T00:00:00" />
          </ScrollReveal>

          {/* Date reminder */}
          <ScrollReveal delayMs={400}>
            <div className="mt-10 sm:mt-16 text-center">
              <div className="inline-flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-4 rounded-full bg-white/5 border border-gold-500/20 backdrop-blur-sm">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gold-400" />
                <span className="text-white/90 font-medium text-sm sm:text-base">15 janvier 2026 • Marrakech</span>
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-oasis-400" />
              </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal delayMs={500}>
            <div className="mt-8 sm:mt-12 text-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto group h-12 sm:h-14 px-6 sm:px-10 bg-gradient-to-r from-gold-500 to-terracotta-500 hover:from-gold-400 hover:to-terracotta-400 text-white font-semibold shadow-xl shadow-gold-500/25 transition-all duration-300 hover:scale-105 hover:shadow-gold-500/40"
              >
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  {isLoggedIn ? "Mon espace invité" : "Confirmer ma présence"}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-night-900 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-terracotta-500">
                <span className="font-display text-xs sm:text-sm font-bold text-white">60</span>
              </div>
              <div className="text-gold-100/60 text-xs sm:text-sm">
                Yvonne · 60 ans · Marrakech 2026
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/#programme" className="text-gold-100/50 hover:text-white text-xs sm:text-sm transition-colors">
                Programme
              </Link>
              <Link href="/#infos" className="text-gold-100/50 hover:text-white text-xs sm:text-sm transition-colors">
                Infos
              </Link>
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="text-gold-400 hover:text-gold-300 text-xs sm:text-sm font-medium transition-colors">
                {isLoggedIn ? "Mon espace" : "Se connecter"}
              </Link>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 text-center">
            <p className="text-gold-100/30 text-[10px] sm:text-xs">
              Fait avec ❤️ pour un anniversaire exceptionnel
            </p>
          </div>
        </div>
      </footer>

      {/* Bouton retour en haut */}
      <ScrollToTop />

      {/* Bannière de consentement cookies */}
      <CookieConsent />
    </div>
  )
}
