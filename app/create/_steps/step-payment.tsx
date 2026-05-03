"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Lock, Loader2, LogIn } from "lucide-react"
import { useOrder } from "@/context/OrderContext"
import { useAuth } from "@/context/AuthContext"
import { formatLKR } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

function generateOrderId() {
  return `FLR-${Math.floor(Math.random() * 9000 + 1000)}`
}

export function StepPayment() {
  const router = useRouter()
  const { state, dispatch, cartSubtotal, grandTotal } = useOrder()
  const { user, profile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handlePay = async () => {
    if (!user) return
    setErrorMsg(null)
    setLoading(true)
    dispatch({ type: "SET_PAYMENT_STATUS", payload: "pending" })

    const orderId = generateOrderId()
    const supabase = createClient()

    try {
      // 1. Insert order
      const { error: orderError } = await supabase.from("orders").insert({
        id: orderId,
        customer_id: user.id,
        customer_name: state.customerDetails.name || profile?.full_name || "Guest",
        customer_phone: state.customerDetails.phone || profile?.phone || "",
        customer_email: state.customerDetails.email || user.email || null,
        status: "placed",
        subtotal_lkr: cartSubtotal,
        delivery_fee_lkr: state.deliveryFee,
        total_lkr: grandTotal,
        delivery_type: state.fulfillmentType,
        delivery_address: state.fulfillmentType === "delivery" ? state.deliveryAddress : null,
        delivery_distance_km:
          state.fulfillmentType === "delivery" ? state.deliveryDistanceKm : null,
        scheduled_date: state.scheduledDate,
        scheduled_slot: state.scheduledSlot,
        reference_image_url: state.referenceImageUrl,
      })
      if (orderError) throw orderError

      // 2. Insert order items
      const items = state.cart.map((c) => ({
        order_id: orderId,
        flower_id: c.flower_id,
        flower_name: c.flower_name,
        flower_image: c.flower_image ?? null,
        quantity: c.quantity,
        price_lkr: c.price_lkr,
      }))
      const { error: itemsError } = await supabase.from("order_items").insert(items)
      if (itemsError) throw itemsError

      // 3. Best-effort stock decrement. Fetch current counts then update.
      //    (For a demo we skip true atomicity / overselling protection.)
      for (const item of state.cart) {
        const { data: existing } = await supabase
          .from("flowers")
          .select("stock_count")
          .eq("id", item.flower_id)
          .single()
        if (existing) {
          const next = Math.max(0, Number(existing.stock_count) - item.quantity)
          await supabase
            .from("flowers")
            .update({ stock_count: next })
            .eq("id", item.flower_id)
        }
      }

      dispatch({ type: "SET_PAYMENT_STATUS", payload: "success" })
      // Clear the cart so they start fresh next time.
      dispatch({ type: "RESET_ORDER" })
      router.push(`/order/${orderId}/success`)
    } catch (err) {
      console.error("[v0] Order placement failed:", err)
      setErrorMsg((err as Error).message ?? "Could not place order")
      dispatch({ type: "SET_PAYMENT_STATUS", payload: "failed" })
      setLoading(false)
    }
  }

  const formattedDate = state.scheduledDate
    ? new Date(state.scheduledDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "Not selected"

  return (
    <div className="space-y-8">
      <div>
        <p className="label-eyebrow mb-3">Step 5 of 5</p>
        <h1 className="font-serif text-3xl italic text-foreground md:text-4xl">
          Review and pay
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          One last check before we start arranging.
        </p>
      </div>

      {/* Auth gate: customers must be signed in to place an order */}
      {!authLoading && !user && (
        <div className="rounded-3xl border border-rose-velvet/30 bg-petal-pink/40 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-xl italic text-rose-velvet">
                Sign in to complete your order
              </p>
              <p className="mt-1 text-sm text-text-muted">
                We need an account so you can track this bouquet and reorder later.
                Your cart is saved.
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/login?redirect=/create">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover">
                <Link href="/signup?redirect=/create">Create account</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Order summary card */}
      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white">
        <div className="border-b border-border-subtle px-6 py-5">
          <p className="label-eyebrow mb-1">Your Bouquet</p>
          <p className="font-serif text-lg text-foreground">
            {state.cart.reduce((s, i) => s + i.quantity, 0)} stems
          </p>
        </div>

        <ul className="divide-y divide-border-subtle">
          {state.cart.map((item) => (
            <li key={item.flower_id} className="flex items-center gap-4 px-6 py-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-petal-pink">
                {item.flower_image && (
                  <Image
                    src={item.flower_image}
                    alt={item.flower_name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized={item.flower_image.startsWith("data:")}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{item.flower_name}</p>
                <p className="text-xs text-text-muted">
                  {item.quantity} × {formatLKR(item.price_lkr)}
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums text-foreground">
                {formatLKR(item.price_lkr * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="space-y-2 border-t border-border-subtle bg-parchment px-6 py-5 text-sm">
          <div className="flex justify-between text-text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-foreground tabular-nums">
              {formatLKR(cartSubtotal)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>{state.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</span>
            <span className="font-medium text-foreground tabular-nums">
              {state.deliveryFee > 0 ? formatLKR(state.deliveryFee) : "Free"}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-border-subtle pt-3">
            <span className="text-xs uppercase tracking-wider text-text-muted">Total</span>
            <span className="font-serif text-3xl text-rose-velvet tabular-nums">
              {formatLKR(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="rounded-3xl border border-border-subtle bg-white p-6">
        <p className="label-eyebrow mb-3">Delivery details</p>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-text-muted">Recipient</dt>
            <dd className="text-right font-medium text-foreground">
              {state.customerDetails.name || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-muted">Phone</dt>
            <dd className="text-right font-medium text-foreground">
              +94 {state.customerDetails.phone || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-muted">
              {state.fulfillmentType === "pickup" ? "Pickup from" : "Deliver to"}
            </dt>
            <dd className="text-right font-medium text-foreground">
              {state.fulfillmentType === "pickup"
                ? "Maharagama Studio"
                : state.deliveryAddress || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-text-muted">Date</dt>
            <dd className="text-right font-medium text-foreground">{formattedDate}</dd>
          </div>
        </dl>
      </div>

      {errorMsg && (
        <div className="rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900">
          {errorMsg}
        </div>
      )}

      <Button
        onClick={() => void handlePay()}
        disabled={loading || state.cart.length === 0 || !user}
        size="lg"
        className="w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Placing your order…
          </span>
        ) : !user ? (
          "Sign in to pay"
        ) : (
          `Pay ${formatLKR(grandTotal)}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
        <Lock className="h-3 w-3" />
        Secure sandbox payment — no real charges will be made.
      </div>
    </div>
  )
}
