import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnv } from "./env"

/**
 * Returns a configured Supabase browser client, or throws a clear error if
 * Supabase env vars aren't set. Callers that want to degrade gracefully
 * should check `isSupabaseConfigured()` first.
 */
export const createClient = () => {
  const env = getSupabaseEnv()
  if (!env) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }
  return createBrowserClient(env.url, env.anonKey)
}

export const isSupabaseConfigured = () => getSupabaseEnv() !== null
