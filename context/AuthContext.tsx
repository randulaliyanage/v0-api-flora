"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, SupabaseClient, User } from "@supabase/supabase-js"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: "customer" | "admin"
}

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase: SupabaseClient | null = useMemo(() => {
    if (!isSupabaseConfigured()) return null
    try {
      return createClient()
    } catch {
      return null
    }
  }, [])

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    const loadProfile = async (session: Session | null) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, role")
          .eq("id", session.user.id)
          .single()
        if (mounted) setProfile((data as Profile) ?? null)
      } else {
        if (mounted) setProfile(null)
      }
      if (mounted) setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      void loadProfile(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadProfile(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const value: AuthContextValue = {
    user,
    profile,
    isAdmin: profile?.role === "admin",
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
