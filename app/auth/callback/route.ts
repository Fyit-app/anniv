import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"

import { createServerClient } from "@supabase/ssr"

function getBaseUrl(request: Request, headersList: Headers): string {
  // 1. Utiliser la variable d'environnement si définie
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // 2. Essayer l'origin de l'URL de la requête
  const { origin } = new URL(request.url)
  if (origin && !origin.includes("localhost")) {
    return origin
  }

  // 3. Construire à partir du header host
  const host = headersList.get("host")
  if (host && !host.includes("localhost")) {
    const protocol = headersList.get("x-forwarded-proto") || "https"
    return `${protocol}://${host}`
  }

  // 4. Fallback pour le développement local
  return "http://localhost:3000"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const headersList = await headers()

  if (code) {
    const cookieStore = await cookies()

    type CookieToSet = {
      name: string
      value: string
      options: Record<string, unknown>
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  const baseUrl = getBaseUrl(request, headersList)
  return NextResponse.redirect(`${baseUrl}/dashboard`)
}
