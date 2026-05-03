import Link from "next/link"
import { Check, Package, Calendar } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

interface SuccessPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ params }: SuccessPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar cartCount={0} />

      <main className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="rounded-3xl border border-border-subtle bg-white p-10 text-center md:p-14">
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-rose-velvet/20" />
            <span className="absolute inset-2 rounded-full bg-petal-pink" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-rose-velvet text-white">
              <Check className="h-8 w-8" strokeWidth={3} />
            </span>
          </div>

          <p className="label-eyebrow mb-3">Confirmed</p>
          <h1 className="font-serif text-3xl italic text-foreground md:text-5xl">
            Your bouquet is on its way
          </h1>
          <p className="mt-4 text-sm text-text-muted md:text-base">
            We&apos;ve received your order and our florists are preparing your stems.
            You&apos;ll get an SMS when it&apos;s out for delivery.
          </p>

          <div className="my-8 rounded-2xl bg-petal-pink/40 px-6 py-5">
            <p className="label-eyebrow mb-1">Order Reference</p>
            <p className="font-serif text-2xl text-rose-velvet">{id}</p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover sm:w-auto"
            >
              <Link href={`/track?id=${id}`} className="inline-flex items-center gap-2">
                <Package className="h-4 w-4" />
                Track Your Order
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full text-foreground hover:bg-petal-pink hover:text-rose-velvet sm:w-auto"
            >
              <Link href="/" className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Back to shop
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
