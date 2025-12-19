"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendOtpCode } from "./actions"
import { Loader2, Mail, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Veuillez saisir votre email")
      return
    }

    startTransition(async () => {
      const result = await sendOtpCode(email.trim())
      
      if (result.error) {
        setError(result.error)
      } else {
        // Stocker l'email dans sessionStorage pour la page verify
        sessionStorage.setItem("otpEmail", email.trim())
        router.push("/verify")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-night-900 via-night-800 to-night-900">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 pattern-zellige-dark opacity-20" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-oasis-500/10 rounded-full blur-[100px]" />
      
      <Card className="relative w-full max-w-md border-gold-200/20 bg-white/95 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <div className="mx-auto mb-4">
            <div className="relative inline-flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 via-terracotta-500 to-oasis-500 shadow-lg shadow-gold-500/25">
                <span className="font-display text-2xl font-bold text-white">60</span>
              </div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-gold-400 to-terracotta-400 opacity-20 blur-lg" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-display">
            Connexion
          </CardTitle>
          <CardDescription className="text-base">
            Saisis ton email pour recevoir un code de connexion
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-600" />
                Adresse email
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton.email@exemple.com"
                className="h-12 text-base bg-muted/50 border-gold-200/50 focus:border-gold-500"
                disabled={isPending}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base bg-gradient-to-r from-gold-600 to-terracotta-600 hover:from-gold-700 hover:to-terracotta-700 shadow-lg shadow-gold-500/25"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Recevoir mon code
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gold-50 border border-gold-100">
            <Sparkles className="h-5 w-5 text-gold-600 mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Tu recevras un code à 8 chiffres par email. 
              Aucun mot de passe n'est requis.
            </p>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Pas de création de compte publique. Si tu n'as pas accès, contacte l'organisateur.
          </p>

          <p className="text-center text-sm">
            <Link className="text-gold-600 hover:text-gold-700 underline underline-offset-4" href="/">
              Retour au site
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
