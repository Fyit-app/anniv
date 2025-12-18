import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { signInWithOtp } from "./actions"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkEmail?: string }>
}) {
  const { error, checkEmail } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Saisis ton email. Tu recevras un lien de connexion (Magic Link).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkEmail ? (
            <p className="text-sm text-muted-foreground">
              Vérifie ta boîte mail pour terminer la connexion.
            </p>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive">{decodeURIComponent(error)}</p>
          ) : null}

          <form action={signInWithOtp} className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <Button type="submit" className="w-full">
              Envoyer le lien
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Pas de création de compte publique. Si tu n’as pas accès, contacte l’organisateur.
          </p>

          <p className="text-xs">
            <Link className="underline" href="/">
              Retour au site
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
