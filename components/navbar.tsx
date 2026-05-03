"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
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
          <Link href="/login" className="text-text-muted transition-colors hover:text-rose-velvet">
            Sign In
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-rose-velvet transition-colors hover:bg-petal-pink"
            aria-label="View cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-velvet px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Button
            asChild
            className="hidden rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover sm:inline-flex"
          >
            <Link href="/create">Create Bouquet</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
