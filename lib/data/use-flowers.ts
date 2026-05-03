"use client"

import useSWR from "swr"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Flower } from "@/lib/types"

/**
 * Fetches the active flower catalog from Supabase. Public (anon) access is
 * allowed by RLS, so this works for unauthenticated visitors too.
 *
 * Falls back to a hard error when Supabase isn't configured rather than
 * silently using mock data — this keeps the admin/customer flows honest.
 */
async function fetchFlowers(): Promise<Flower[]> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured")
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from("flowers")
    .select("id, name, image_url, price_lkr, stock_count, category, is_active")
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data ?? []).map((row) => ({
    ...row,
    price_lkr: Number(row.price_lkr),
    stock_count: Number(row.stock_count),
  })) as Flower[]
}

export function useFlowers() {
  const { data, error, isLoading, mutate } = useSWR<Flower[]>(
    "flowers",
    fetchFlowers,
    { revalidateOnFocus: false },
  )
  return {
    flowers: data ?? [],
    activeFlowers: (data ?? []).filter((f) => f.is_active),
    error,
    isLoading,
    refresh: mutate,
  }
}
