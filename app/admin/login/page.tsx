"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // Verify admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profile?.role !== "admin") {
        await supabase.auth.signOut()
        setError("You do not have admin access.")
        setLoading(false)
        return
      }

      router.push("/admin")
    } catch (err) {
      setError("Unable to sign in. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-parchment md:flex-row">
      <aside className="flex min-h-[280px] flex-col justify-between bg-rose-velvet px-8 py-10 text-white md:w-2/5 md:px-14 md:py-16 lg:w-[40%]">
        <Link href="/" className="font-serif text-2xl italic">
          API Flora
        </Link>

        <div className="my-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Admin Portal</p>
          <h1 className="mt-3 font-serif text-4xl italic leading-tight md:text-5xl">
            The studio
            <br />
            command room.
          </h1>
          <p className="mt-5 max-w-sm text-sm text-white/80">
            Track orders, manage stock, and keep your florists humming with one
            beautiful dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60">
          <ShieldCheck className="h-4 w-4" />
          Restricted to authorized staff
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">
          <p className="label-eyebrow mb-3">Staff Sign In</p>
          <h2 className="font-serif text-3xl italic text-foreground md:text-4xl">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your admin credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label-eyebrow mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-2xl border-border-subtle bg-white px-5 focus-visible:ring-rose-velvet"
              />
            </div>
            <div>
              <label className="label-eyebrow mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-2xl border-border-subtle bg-white px-5 focus-visible:ring-rose-velvet"
              />
            </div>

            {error && (
              <p className="rounded-2xl bg-red-50 p-3 text-xs text-[#990048]">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
            >
              {loading ? "Signing in..." : "Sign in to Admin"}
            </Button>
          </form>

          <p className="mt-6 text-xs text-text-muted">
            Admin sign-in is separate from{" "}
            <Link href="/login" className="font-medium text-rose-velvet hover:underline">
              customer sign-in
            </Link>
            . Contact your studio manager if you need access.
          </p>
        </div>
      </main>
    </div>
  )
}
