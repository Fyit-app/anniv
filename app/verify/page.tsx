"use client"

import { useState, useEffect, useRef, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyOtpCode, resendOtpCode } from "@/app/login/actions"
import { Loader2, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react"

export default function VerifyPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  // Supabase envoie des codes à 8 chiffres par défaut
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendSuccess, setResendSuccess] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Récupérer l'email depuis sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otpEmail")
    if (!storedEmail) {
      router.push("/login")
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  // Timer pour le cooldown de renvoi
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Focus sur le premier input au chargement
  useEffect(() => {
    if (email && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [email])

  const handleChange = (index: number, value: string) => {
    // Accepter uniquement les chiffres
    const digit = value.replace(/\D/g, "").slice(-1)
    
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError(null)

    // Auto-focus sur le champ suivant
    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }

    // Si tous les chiffres sont saisis, soumettre automatiquement
    const fullCode = newOtp.join("")
    if (fullCode.length === 8 && newOtp.every(d => d !== "")) {
      handleSubmit(fullCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Retour arrière : aller au champ précédent
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Flèches gauche/droite pour navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8)
    
    if (pastedData.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length && i < 8; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)
      
      // Focus sur le dernier champ rempli ou le suivant
      const focusIndex = Math.min(pastedData.length, 7)
      inputRefs.current[focusIndex]?.focus()

      // Soumettre si complet
      if (pastedData.length === 8) {
        handleSubmit(pastedData)
      }
    }
  }

  const handleSubmit = (code?: string) => {
    if (!email) return

    const finalCode = code || otp.join("")
    
    if (finalCode.length !== 8) {
      setError("Veuillez saisir les 8 chiffres du code")
      return
    }

    startTransition(async () => {
      const result = await verifyOtpCode(email, finalCode)
      
      if (result.error) {
        setError(result.error)
        // Réinitialiser le code en cas d'erreur
        setOtp(["", "", "", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
      // Si pas d'erreur, la redirection est gérée côté serveur
    })
  }

  const handleResend = () => {
    if (!email || resendCooldown > 0 || isResending) return

    setIsResending(true)
    setError(null)
    setResendSuccess(false)

    // Utiliser startTransition pour les Server Actions
    startTransition(async () => {
      try {
        const result = await resendOtpCode(email)
        
        setIsResending(false)
        
        if (result.error) {
          setError(result.error)
          // Si on a un temps d'attente, l'utiliser pour le cooldown
          if (result.waitSeconds) {
            setResendCooldown(result.waitSeconds)
          }
        } else {
          setResendSuccess(true)
          setResendCooldown(60) // 60 secondes de cooldown après un envoi réussi
          setTimeout(() => setResendSuccess(false), 3000)
        }
      } catch (err) {
        setIsResending(false)
        setError("Erreur lors de l'envoi. Veuillez réessayer.")
      }
    })
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-night-900 via-night-800 to-night-900">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 pattern-zellige-dark opacity-20" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-oasis-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px]" />
      
      <Card className="relative w-full max-w-md border-gold-200/20 bg-white/95 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-2">
          {/* Icône */}
          <div className="mx-auto mb-4">
            <div className="relative inline-flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-oasis-500 to-oasis-600 shadow-lg shadow-oasis-500/25">
                <KeyRound className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-oasis-400 to-oasis-500 opacity-20 blur-lg" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-display">
            Vérifie ton code
          </CardTitle>
          <CardDescription className="text-base">
            Un code à 8 chiffres a été envoyé à ton email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 px-6 sm:px-10 md:px-12">
          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {/* Message de succès pour renvoi */}
          {resendSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                Nouveau code envoyé !
              </div>
              <p className="text-xs text-green-600">
                ⚠️ L'ancien code n'est plus valide, utilise le nouveau.
              </p>
            </div>
          )}

          {/* Input OTP segmenté */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isPending}
                className={`
                  w-9 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold 
                  rounded-lg sm:rounded-xl border-2 transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-gold-500/20
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${digit 
                    ? "border-gold-500 bg-gold-50 text-gold-800" 
                    : "border-gray-200 bg-white hover:border-gold-300"
                  }
                `}
              />
            ))}
          </div>

          {/* Bouton de validation */}
          <Button 
            onClick={() => handleSubmit()}
            className="w-full h-12 text-base bg-gradient-to-r from-gold-600 to-terracotta-600 hover:from-gold-700 hover:to-terracotta-700 shadow-lg shadow-gold-500/25"
            disabled={isPending || otp.join("").length !== 8}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Vérification...
              </>
            ) : (
              "Valider"
            )}
          </Button>

          {/* Renvoi du code */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Tu n'as pas reçu le code ?
            </p>
            <Button
              variant="ghost"
              type="button"
              onClick={handleResend}
              disabled={isResending || isPending || resendCooldown > 0}
              className="text-gold-600 hover:text-gold-700 hover:bg-gold-50"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Envoi...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renvoyer ({resendCooldown}s)
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renvoyer le code
                </>
              )}
            </Button>
          </div>

          {/* Retour */}
          <div className="pt-2 border-t">
            <Link 
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Modifier l'adresse email
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

