import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
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

          <form className="mt-8 space-y-5">
            <div>
              <label className="label-eyebrow mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-2xl border-border-subtle bg-parchment px-5 focus-visible:ring-rose-velvet"
              />
            </div>
            <div>
              <label className="label-eyebrow mb-2 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-2xl border-border-subtle bg-parchment px-5 focus-visible:ring-rose-velvet"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
            >
              Sign In
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
