"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function SignupContent() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get("redirect") ?? "/"

  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
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
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            phone,
            role: "customer",
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // If email confirmation is disabled, Supabase returns a session and the
      // user is signed in instantly. Otherwise we need them to confirm email.
      if (data.session) {
        toast.success("Welcome to API Flora!")
        router.push(redirect)
      } else {
        toast.success("Check your email to confirm your account.")
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`)
      }
    } catch (err) {
      setError("Unable to create account. Please try again.")
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
          <p className="label-eyebrow mb-3">Get Started</p>
          <h1 className="font-serif text-3xl italic text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-text-muted">
            Save addresses and reorder favorites in one tap.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label-eyebrow mb-2 block">Full name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nimasha Wickramasinghe"
                required
                className="h-12 rounded-2xl border-border-subtle bg-parchment px-5 focus-visible:ring-rose-velvet"
              />
            </div>
            <div>
              <label className="label-eyebrow mb-2 block">Phone</label>
              <div className="flex h-12 items-center overflow-hidden rounded-2xl border border-border-subtle bg-parchment">
                <span className="flex h-full items-center border-r border-border-subtle bg-petal-pink px-4 text-sm font-medium text-rose-velvet">
                  +94
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="77 412 8855"
                  className="h-full flex-1 bg-transparent px-4 text-base outline-none"
                />
              </div>
            </div>
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
                placeholder="At least 8 characters"
                required
                minLength={8}
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-medium text-rose-velvet hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parchment" />}>
      <SignupContent />
    </Suspense>
  )
}
