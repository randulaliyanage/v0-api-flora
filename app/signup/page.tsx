import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
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

          <form className="mt-8 space-y-5">
            <div>
              <label className="label-eyebrow mb-2 block">Full name</label>
              <Input
                placeholder="Nimasha Wickramasinghe"
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
                  placeholder="77 412 8855"
                  className="h-full flex-1 bg-transparent px-4 text-base outline-none"
                />
              </div>
            </div>
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
                placeholder="At least 8 characters"
                className="h-12 rounded-2xl border-border-subtle bg-parchment px-5 focus-visible:ring-rose-velvet"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-rose-velvet hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
