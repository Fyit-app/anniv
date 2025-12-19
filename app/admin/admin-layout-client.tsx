"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  Camera,
  MapPin,
  MessageSquare,
  LayoutDashboard,
  ArrowLeft,
  Menu,
  X,
  Crown,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Invités",
    href: "/admin/invites",
    icon: Users,
  },
  {
    title: "Événements",
    href: "/admin/evenements",
    icon: Calendar,
  },
  {
    title: "Séjours",
    href: "/admin/sejours",
    icon: MapPin,
  },
  {
    title: "Médias",
    href: "/admin/photos",
    icon: Camera,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
]

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-section-warm">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gold-200/50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-terracotta-500 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gold-200/50 transform transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo section */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gold-100">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 via-terracotta-400 to-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/20">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Administration</h1>
            <p className="text-xs text-muted-foreground">Anniv Marrakech</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-gold-100 to-terracotta-50 text-gold-800 shadow-sm"
                    : "text-muted-foreground hover:bg-gold-50 hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-gold-600" : ""
                  )}
                />
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gold-100">
          <Button
            asChild
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}

