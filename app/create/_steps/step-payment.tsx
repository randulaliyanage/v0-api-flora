"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Lock, Loader2 } from "lucide-react"
import { useOrder } from "@/context/OrderContext"
import { formatLKR, flowers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export function StepPayment() {
  const router = useRouter()
  const { state, dispatch, cartSubtotal, grandTotal } = useOrder()
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)
    dispatch({ type: "SET_PAYMENT_STATUS", payload: "pending" })
    setTimeout(() => {
      dispatch({ type: "SET_PAYMENT_STATUS", payload: "success" })
      const orderId = `FLR-${Math.floor(Math.random() * 9000 + 1000)}`
      router.push(`/order/${orderId}/success`)
    }, 1800)
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

      {/* Order summary card */}
      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white">
        <div className="border-b border-border-subtle px-6 py-5">
          <p className="label-eyebrow mb-1">Your Bouquet</p>
          <p className="font-serif text-lg text-foreground">
            {state.cart.reduce((s, i) => s + i.quantity, 0)} stems
          </p>
        </div>

        <ul className="divide-y divide-border-subtle">
          {state.cart.map((item) => {
            const flower = flowers.find((f) => f.id === item.flower_id)
            return (
              <li key={item.flower_id} className="flex items-center gap-4 px-6 py-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-petal-pink">
                  {flower?.image_url && (
                    <Image
                      src={flower.image_url}
                      alt={item.flower_name}
                      fill
                      sizes="56px"
                      className="object-cover"
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
            )
          })}
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

      <Button
        onClick={handlePay}
        disabled={loading || state.cart.length === 0}
        size="lg"
        className="w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing payment…
          </span>
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
