"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Clock, AlertCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { OrderProgressTracker } from "@/components/order-progress-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getOrderById, formatLKR } from "@/lib/mock-data"
import type { Order } from "@/lib/types"

function TrackContent() {
  const params = useSearchParams()
  const initial = params.get("id") ?? ""
  const [orderId, setOrderId] = useState(initial)
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (initial) {
      const found = getOrderById(initial)
      if (found) setOrder(found)
      else if (initial.startsWith("FLR-")) {
        // Show a synthetic order for newly created references
        setOrder({
          id: initial,
          customer_id: "guest",
          customer_name: "You",
          customer_phone: "+94 ••• ••• ••",
          status: "placed",
          flowers: [],
          total_lkr: 0,
          delivery_type: "delivery",
          delivery_fee_lkr: 0,
          scheduled_date: new Date().toISOString().slice(0, 10),
          created_at: new Date().toISOString(),
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = () => {
    const found = getOrderById(orderId.trim())
    if (found) {
      setOrder(found)
      setNotFound(false)
    } else {
      setOrder(null)
      setNotFound(true)
    }
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div className="mb-10 text-center">
          <p className="label-eyebrow mb-3">Track Order</p>
          <h1 className="font-serif text-3xl italic text-foreground md:text-5xl">
            Where are my blooms?
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            Enter your order reference to see live progress.
          </p>
        </div>

        {/* Search */}
        <div className="rounded-3xl border border-border-subtle bg-white p-3">
          <div className="flex items-center gap-2">
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. FLR-2418"
              className="h-12 flex-1 rounded-2xl border-0 bg-transparent px-5 text-base shadow-none focus-visible:ring-0"
            />
            <Button
              onClick={handleSearch}
              size="icon"
              className="h-12 w-12 shrink-0 rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
              aria-label="Look up order"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 px-2 text-xs text-text-muted">
            Demo: try <span className="font-mono text-rose-velvet">FLR-2418</span> or{" "}
            <span className="font-mono text-rose-velvet">FLR-2421</span>
          </p>
        </div>

        {notFound && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900">
            <AlertCircle className="h-4 w-4" />
            We couldn&apos;t find that order. Double-check the reference and try again.
          </div>
        )}

        {order && (
          <div className="mt-10 space-y-8">
            {/* Progress */}
            <div className="rounded-3xl border border-border-subtle bg-white p-6 md:p-10">
              <div className="mb-8 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <p className="label-eyebrow mb-1">Reference</p>
                  <p className="font-serif text-2xl text-rose-velvet">{order.id}</p>
                </div>
                <p className="text-sm text-text-muted">
                  Placed {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <OrderProgressTracker status={order.status} />
            </div>

            {/* Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-border-subtle bg-white p-6">
                <p className="label-eyebrow mb-3">Delivery</p>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-petal-pink text-rose-velvet">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.delivery_type === "pickup" ? "Studio Pickup" : "Home Delivery"}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {order.delivery_type === "pickup"
                        ? "27 Temple Road, Maharagama"
                        : order.delivery_address ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border-subtle bg-white p-6">
                <p className="label-eyebrow mb-3">Schedule</p>
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-petal-pink text-rose-velvet">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(order.scheduled_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs capitalize text-text-muted">
                      {order.scheduled_slot ?? "—"} window
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            {order.flowers.length > 0 && (
              <div className="rounded-3xl border border-border-subtle bg-white p-6">
                <p className="label-eyebrow mb-4">Your bouquet</p>
                <ul className="divide-y divide-border-subtle">
                  {order.flowers.map((item) => (
                    <li
                      key={item.flower_id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="text-foreground">
                        <span className="font-medium">{item.flower_name}</span>
                        <span className="ml-2 text-text-muted">×{item.quantity}</span>
                      </span>
                      <span className="font-medium text-text-muted tabular-nums">
                        {formatLKR(item.price_lkr * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-baseline justify-between border-t border-border-subtle pt-4">
                  <span className="label-eyebrow">Total paid</span>
                  <span className="font-serif text-xl text-rose-velvet">
                    {formatLKR(order.total_lkr + order.delivery_fee_lkr)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-parchment" />}>
      <TrackContent />
    </Suspense>
  )
}
