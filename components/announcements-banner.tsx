"use client"

import { Megaphone, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Announcement {
  id: string
  title: string
  content: string
  created_at: string
  published?: boolean
}

interface AnnouncementsBannerProps {
  announcements: Announcement[]
  className?: string
  variant?: "light" | "dark"
}

export function AnnouncementsBanner({ 
  announcements, 
  className,
  variant = "light"
}: AnnouncementsBannerProps) {
  if (!announcements || announcements.length === 0) return null

  const isDark = variant === "dark"

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-2 rounded-xl",
          isDark ? "bg-gold-500/20" : "bg-terracotta-100"
        )}>
          <Megaphone className={cn(
            "h-5 w-5",
            isDark ? "text-gold-400" : "text-terracotta-600"
          )} />
        </div>
        <h3 className={cn(
          "font-display text-lg font-semibold",
          isDark ? "text-white" : "text-foreground"
        )}>
          Annonces importantes
        </h3>
        <Badge className={cn(
          "text-xs",
          isDark 
            ? "bg-gold-500/20 text-gold-300 border-gold-500/30" 
            : "bg-terracotta-100 text-terracotta-700"
        )}>
          {announcements.length}
        </Badge>
      </div>

      {/* Announcements list */}
      <div className="space-y-3">
        {announcements.map((announcement) => {
          const createdAt = new Date(announcement.created_at)
          const isRecent = Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000

          return (
            <div
              key={announcement.id}
              className={cn(
                "p-4 sm:p-5 rounded-2xl border transition-all",
                isDark 
                  ? isRecent 
                    ? "bg-gradient-to-r from-gold-500/10 to-terracotta-500/10 border-gold-500/30" 
                    : "bg-white/5 border-white/10"
                  : isRecent 
                    ? "bg-gradient-to-r from-terracotta-50 to-gold-50 border-terracotta-200 shadow-md" 
                    : "bg-white border-gold-100/50 shadow-sm"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 p-2 rounded-xl",
                  isDark
                    ? isRecent ? "bg-gold-500/20" : "bg-white/10"
                    : isRecent ? "bg-terracotta-100" : "bg-gold-100"
                )}>
                  <Bell className={cn(
                    "h-4 w-4",
                    isDark
                      ? isRecent ? "text-gold-400" : "text-white/60"
                      : isRecent ? "text-terracotta-600" : "text-gold-600"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className={cn(
                      "font-semibold",
                      isDark ? "text-white" : "text-foreground"
                    )}>
                      {announcement.title}
                    </h4>
                    {isRecent && (
                      <Badge className={cn(
                        "text-xs",
                        isDark 
                          ? "bg-gold-500 text-white" 
                          : "bg-terracotta-500 text-white"
                      )}>
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm whitespace-pre-wrap leading-relaxed",
                    isDark ? "text-gold-100/70" : "text-muted-foreground"
                  )}>
                    {announcement.content}
                  </p>
                  <p className={cn(
                    "text-xs mt-2",
                    isDark ? "text-gold-200/50" : "text-muted-foreground"
                  )}>
                    {createdAt.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

