"use client"

import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

function format2(n: number) {
  return String(n).padStart(2, "0")
}

function CountdownUnit({
  value,
  label,
  className,
}: {
  value: number | string
  label: string
  className?: string
}) {
  return (
    <div className={cn("group relative", className)}>
      {/* Glow effect on hover - hidden on mobile for performance */}
      <div className="absolute -inset-1 sm:-inset-2 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gold-400/30 via-terracotta-500/20 to-oasis-500/30 opacity-0 blur-lg sm:blur-xl transition-all duration-500 group-hover:opacity-100 hidden sm:block" />
      
      {/* Main card */}
      <div className="relative">
        {/* Outer border gradient */}
        <div className="absolute -inset-[1px] rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-400/50 via-terracotta-400/30 to-oasis-400/50" />
        
        {/* Card content */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-night-800/95 via-night-900/95 to-night-800/95 backdrop-blur-xl">
          {/* Inner shine */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-gold-300/30 via-transparent to-transparent hidden sm:block" />
          
          {/* Shimmer effect - hidden on mobile */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          
          {/* Content */}
          <div className="relative px-2 py-3 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
            {/* Number */}
            <div className="relative flex items-center justify-center">
              <span className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tabular-nums tracking-tight text-white drop-shadow-lg">
                {value}
              </span>
            </div>
            
            {/* Divider */}
            <div className="mt-2 sm:mt-3 h-px w-full bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
            
            {/* Label */}
            <div className="mt-2 sm:mt-3 text-center">
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-200/80">
                {label}
              </span>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute inset-x-0 bottom-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-500 via-terracotta-500 to-oasis-500 opacity-60" />
        </div>
      </div>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 px-0.5 sm:px-2">
      <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gold-400/60 animate-pulse shadow-lg shadow-gold-500/50" />
      <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-gold-400/60 animate-pulse shadow-lg shadow-gold-500/50" style={{ animationDelay: "0.5s" }} />
    </div>
  )
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [now, setNow] = useState(() => Date.now())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const diff = Math.max(0, target - now)
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4">
        <CountdownUnit value="--" label="jours" />
        <Separator />
        <CountdownUnit value="--" label="heures" />
        <Separator />
        <CountdownUnit value="--" label="min" />
        <Separator />
        <CountdownUnit value="--" label="sec" />
      </div>
    )
  }

  return (
    <div
      aria-label="Compte à rebours"
      className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4"
    >
      <CountdownUnit value={days} label="jours" />
      <Separator />
      <CountdownUnit value={format2(hours)} label="heures" />
      <Separator />
      <CountdownUnit value={format2(minutes)} label="min" />
      <Separator />
      <CountdownUnit value={format2(seconds)} label="sec" />
    </div>
  )
}

// Compact version for other sections
export function CountdownCompact({ targetIso }: { targetIso: string }) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [now, setNow] = useState(() => Date.now())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const diff = Math.max(0, target - now)
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  if (!mounted) {
    return <span className="font-display text-xl sm:text-2xl font-bold">--:--:--:--</span>
  }

  return (
    <span className="font-display text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
      {days}j {format2(hours)}h {format2(minutes)}m {format2(seconds)}s
    </span>
  )
}
