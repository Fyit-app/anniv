import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  // #region agent log
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  fetch('http://127.0.0.1:7243/ingest/fb4a7806-e756-4471-885f-b759a4a71bde',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/supabase/server.ts:createClient',message:'Checking env vars',data:{urlDefined:!!supabaseUrl,urlValue:supabaseUrl?.substring(0,30),urlLength:supabaseUrl?.length,keyDefined:!!supabaseKey,keyLength:supabaseKey?.length,keyPrefix:supabaseKey?.substring(0,10),nodeEnv:process.env.NODE_ENV},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A-B-C-D'})}).catch(()=>{});
  // #endregion

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore if called from a Server Component where cookies are read-only.
          }
        },
      },
    }
  )
}
