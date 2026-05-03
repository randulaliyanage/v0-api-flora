/**
 * Resolves Supabase environment variables, returning null if either is missing
 * or the URL is not a valid http(s) URL. Used to gracefully degrade the app
 * when Supabase isn't configured yet (e.g. fresh preview env).
 */
export function getSupabaseEnv():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
  } catch {
    return null
  }

  return { url, anonKey }
}
