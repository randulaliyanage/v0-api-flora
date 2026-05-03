"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { FloralCard } from "@/components/floral-card"
import { CategoryCard } from "@/components/category-card"
import { Button } from "@/components/ui/button"
import { flowers } from "@/lib/mock-data"

const CATEGORIES = [
  { id: "flower", label: "Flowers", icon: "flower" as const, count: 24 },
  { id: "confection", label: "Confections", icon: "confection" as const, count: 12 },
  { id: "gift", label: "Gifts", icon: "gift" as const, count: 18 },
  { id: "balloon", label: "Balloons", icon: "balloon" as const, count: 9 },
]

export default function HomePage() {
  const popular = flowers.slice(0, 4)

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar cartCount={0} />

      {/* HERO */}
      <section className="px-4 pb-24 pt-10 md:px-8 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-visible rounded-[2rem] bg-petal-pink px-6 pb-12 pt-12 md:px-14 md:pb-20 md:pt-16">
            <div className="grid items-center gap-10 md:grid-cols-2">
              {/* Copy */}
              <div className="relative z-10 max-w-xl">
                <p className="label-eyebrow mb-5">Sri Lankan Floral Atelier</p>
                <h1 className="font-serif text-4xl italic leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
                  Blooms,
                  <br />
                  Arranged
                  <br />
                  for You.
                </h1>
                <p className="mt-6 max-w-md text-base leading-relaxed text-text-muted md:text-lg">
                  AI-curated bouquets, hand-tied in our Maharagama studio and
                  delivered the same day across Colombo.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-rose-velvet px-7 text-white hover:bg-rose-velvet-hover"
                  >
                    <Link href="/create" className="group inline-flex items-center gap-2">
                      Create Your Bouquet
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="rounded-full text-foreground hover:bg-white/40 hover:text-rose-velvet"
                  >
                    <Link href="#shop">Browse Shop</Link>
                  </Button>
                </div>

                <div className="mt-10 flex items-center gap-6 border-t border-rose-velvet/10 pt-6">
                  <div>
                    <p className="font-serif text-2xl text-rose-velvet">2,400+</p>
                    <p className="label-eyebrow">Bouquets Delivered</p>
                  </div>
                  <div className="h-10 w-px bg-rose-velvet/20" />
                  <div>
                    <p className="font-serif text-2xl text-rose-velvet">4.9★</p>
                    <p className="label-eyebrow">Customer Rating</p>
                  </div>
                </div>
              </div>

              {/* Hero image — overflows up by 40px */}
              <div className="relative h-[420px] md:h-[520px]">
                <div
                  className="absolute inset-x-0 mx-auto md:left-auto md:right-0"
                  style={{ top: "-40px", bottom: "-40px", width: "100%", maxWidth: "560px" }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(153,0,72,0.35)]">
                    <Image
                      src="/hero-bouquet.jpg"
                      alt="A luxurious pink and cream floral bouquet"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="label-eyebrow mb-3">Curated Categories</p>
              <h2 className="font-serif text-3xl text-foreground md:text-4xl">
                Find the perfect gesture
              </h2>
            </div>
            <Link
              href="/create"
              className="hidden text-sm font-medium text-rose-velvet hover:text-rose-velvet-hover md:inline-flex md:items-center md:gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} label={c.label} icon={c.icon} count={c.count} />
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR ITEMS — surface-container background */}
      <section id="shop" className="bg-surface-container px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-center text-center">
            <p className="label-eyebrow mb-3">This Season</p>
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">Popular Stems</h2>
            <p className="mt-3 max-w-md text-sm text-text-muted">
              Hand-selected blooms our florists are reaching for this week.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-12 md:grid-cols-4 md:gap-8">
            {popular.map((flower) => (
              <FloralCard key={flower.id} flower={flower} />
            ))}
          </div>
        </div>
      </section>

      {/* FULL CATALOG */}
      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="label-eyebrow mb-3">The Full Garden</p>
            <h2 className="font-serif text-3xl text-foreground md:text-4xl">
              Every bloom, by the stem
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-12 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {flowers.map((flower) => (
              <FloralCard key={flower.id} flower={flower} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-rose-velvet px-8 py-16 text-center text-white md:px-16 md:py-20">
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-white/70">
              Bespoke Florals
            </p>
            <h2 className="mx-auto max-w-2xl font-serif text-3xl italic md:text-5xl">
              Send us a photo. We&apos;ll arrange the rest.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/80 md:text-base">
              Upload your inspiration — our AI matches it to in-stock stems and
              our florists do the binding.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-white px-8 text-rose-velvet hover:bg-petal-pink"
            >
              <Link href="/create">Start Creating</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border-subtle px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-text-muted md:flex-row">
          <p className="font-serif text-xl italic text-rose-velvet">API Flora</p>
          <p>27 Temple Road, Maharagama · Western Province · Sri Lanka</p>
          <p>© 2026 API Flora</p>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-parchment p-4 md:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <Button
          asChild
          className="w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
        >
          <Link href="/create">Create Bouquet</Link>
        </Button>
      </div>
      <div className="h-20 md:hidden" />
    </div>
  )
}
