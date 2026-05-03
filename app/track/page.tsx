"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { OrderProgressTracker } from "@/components/order-progress-tracker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getOrderById, formatLKR } from "@/lib/mock-data"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useAuth } from "@/context/AuthContext"
import type { Order, OrderItem, OrderStatus } from "@/lib/types"

interface SupabaseOrderRow {
  id: string
  customer_name: string
  customer_phone: string
  status: OrderStatus
  total_lkr: number
  delivery_fee_lkr: number
  delivery_type: "pickup" | "delivery"
  delivery_address: string | null
  delivery_distance_km: number | null
  scheduled_date: string
  scheduled_slot: "morning" | "afternoon" | "evening" | null
  reference_image_url: string | null
  created_at: string
  order_items?: Array<{
    flower_id: string | null
    flower_name: string
    flower_image: string | null
    quantity: number
    price_lkr: number
  }>
}

function rowToOrder(row: SupabaseOrderRow): Order {
  return {
    id: row.id,
    customer_id: "",
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    status: row.status,
    flowers: (row.order_items ?? []).map(
      (item): OrderItem => ({
        flower_id: item.flower_id ?? "",
        flower_name: item.flower_name,
        flower_image: item.flower_image ?? undefined,
        quantity: item.quantity,
        price_lkr: Number(item.price_lkr),
      }),
    ),
    total_lkr: Number(row.total_lkr) - Number(row.delivery_fee_lkr),
    delivery_type: row.delivery_type,
    delivery_address: row.delivery_address ?? undefined,
    delivery_distance_km: row.delivery_distance_km ?? undefined,
    delivery_fee_lkr: Number(row.delivery_fee_lkr),
    scheduled_date: row.scheduled_date,
    scheduled_slot: row.scheduled_slot ?? undefined,
    reference_image_url: row.reference_image_url ?? undefined,
    created_at: row.created_at,
  }
}

function TrackContent() {
  const params = useSearchParams()
  const initial = params.get("id") ?? ""
  const { user } = useAuth()
  const [orderId, setOrderId] = useState(initial)
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [searching, setSearching] = useState(false)
  const [myOrders, setMyOrders] = useState<Order[]>([])

  const lookup = useCallback(async (id: string) => {
    setSearching(true)
    setNotFound(false)
    let found: Order | null = null

    // 1. Try Supabase
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("orders")
          .select(
            "id, customer_name, customer_phone, status, total_lkr, delivery_fee_lkr, delivery_type, delivery_address, delivery_distance_km, scheduled_date, scheduled_slot, reference_image_url, created_at, order_items(flower_id, flower_name, flower_image, quantity, price_lkr)",
          )
          .eq("id", id)
          .maybeSingle()
        if (data) found = rowToOrder(data as SupabaseOrderRow)
      } catch {
        // ignore — fall through to mock
      }
    }

    // 2. Fall back to mock demo orders
    if (!found) {
      const mock = getOrderById(id)
      if (mock) found = mock
    }

    if (found) {
      setOrder(found)
      setNotFound(false)
    } else {
      setOrder(null)
      setNotFound(true)
    }
    setSearching(false)
  }, [])

  useEffect(() => {
    if (initial) {
      void lookup(initial)
    }
  }, [initial, lookup])

  // Load this user's recent orders
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      setMyOrders([])
      return
    }
    let cancelled = false
    void (async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("orders")
        .select(
          "id, customer_name, customer_phone, status, total_lkr, delivery_fee_lkr, delivery_type, delivery_address, delivery_distance_km, scheduled_date, scheduled_slot, reference_image_url, created_at, order_items(flower_id, flower_name, flower_image, quantity, price_lkr)",
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
      if (!cancelled && data) {
        setMyOrders((data as SupabaseOrderRow[]).map(rowToOrder))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleSearch = () => {
    if (!orderId.trim()) return
    void lookup(orderId.trim())
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
              disabled={searching}
              className="h-12 w-12 shrink-0 rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
              aria-label="Look up order"
            >
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 px-2 text-xs text-text-muted">
            Demo: try <span className="font-mono text-rose-velvet">FLR-2418</span> or{" "}
            <span className="font-mono text-rose-velvet">FLR-2421</span>
          </p>
        </div>

        {/* Recent orders for the signed-in user */}
        {user && myOrders.length > 0 && (
          <div className="mt-8 rounded-3xl border border-border-subtle bg-white p-6">
            <p className="label-eyebrow mb-4">Your recent orders</p>
            <ul className="divide-y divide-border-subtle">
              {myOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-mono text-rose-velvet">{o.id}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {o.flowers.length} item{o.flowers.length === 1 ? "" : "s"} ·{" "}
                      {new Date(o.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums text-foreground">
                      {formatLKR(Number(o.total_lkr) + Number(o.delivery_fee_lkr))}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-rose-velvet hover:bg-petal-pink"
                    >
                      <Link href={`/track?id=${o.id}`}>View</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
                  Placed{" "}
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
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
                      key={`${item.flower_id}-${item.flower_name}`}
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
