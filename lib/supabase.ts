/**
 * Supabase client placeholder for API Flora.
 * In production, replace with @supabase/supabase-js client and use env vars
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *
 * Currently using mock data from lib/mock-data.ts so the app runs with no backend.
 */

export type SupabaseClientPlaceholder = {
  from: (table: string) => {
    select: () => Promise<{ data: unknown[]; error: null }>
  }
}

export function getSupabaseClient(): SupabaseClientPlaceholder {
  return {
    from: () => ({
      select: async () => ({ data: [], error: null }),
    }),
  }
}
