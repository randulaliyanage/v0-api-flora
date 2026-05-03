"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get("redirect") ?? "/"

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

      // Fetch profile to check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      const role = profile?.role ?? "customer"

      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push(redirect)
      }
    } catch (err) {
      setError("Unable to sign in. Check your credentials and try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-parchment px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-3xl italic text-rose-velvet">
            API Flora
          </Link>
        </div>

        <div className="rounded-3xl border border-border-subtle bg-white p-8 md:p-10">
          <p className="label-eyebrow mb-3">Welcome Back</p>
          <h1 className="font-serif text-3xl italic text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-text-muted">
            Continue your order or check on past bouquets.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label-eyebrow mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 rounded-2xl border-border-subtle bg-parchment px-5 focus-visible:ring-rose-velvet"
              />
            </div>
            <div>
              <label className="label-eyebrow mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 rounded-2xl border-border-subtle bg-parchment px-5 focus-visible:ring-rose-velvet"
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            New to API Flora?{" "}
            <Link href="/signup" className="font-medium text-rose-velvet hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-text-muted">
          By signing in you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parchment" />}>
      <LoginContent />
    </Suspense>
  )
}
