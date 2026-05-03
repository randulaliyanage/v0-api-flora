"use client"

import Link from "next/link"
import { ShoppingBag, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrder } from "@/context/OrderContext"
import { useAuth } from "@/context/AuthContext"

/**
 * Site-wide navbar. Cart count is read from the global OrderContext so it
 * stays in sync across pages. Authenticated users see their name and a
 * sign-out button instead of "Sign In".
 */
export function Navbar() {
  const { cartCount } = useOrder()
  const { user, profile, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-parchment/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="font-serif text-2xl italic text-rose-velvet">
          API Flora
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/" className="text-text-muted transition-colors hover:text-rose-velvet">
            Shop
          </Link>
          <Link href="/create" className="text-text-muted transition-colors hover:text-rose-velvet">
            Create
          </Link>
          <Link href="/track" className="text-text-muted transition-colors hover:text-rose-velvet">
            Track Order
          </Link>
          {!user && (
            <>
              <Link href="/login" className="text-text-muted transition-colors hover:text-rose-velvet">
                Sign In
              </Link>
              <Link href="/signup" className="text-text-muted transition-colors hover:text-rose-velvet">
                Sign Up
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* Cart icon with badge */}
          <Link
            href="/create"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-rose-velvet transition-colors hover:bg-petal-pink"
            aria-label={`View cart (${cartCount} items)`}
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-velvet px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-text-muted md:inline">
                {profile?.full_name || user.email}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                aria-label="Sign out"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:bg-petal-pink hover:text-rose-velvet"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              asChild
              className="hidden rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover sm:inline-flex"
            >
              <Link href="/create">Create Bouquet</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
