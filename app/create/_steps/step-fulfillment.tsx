"use client"

import { useState, useEffect } from "react"
import { MapPin, Store, Truck } from "lucide-react"
import { useOrder } from "@/context/OrderContext"
import { STORE_LOCATION, calculateDeliveryFee, formatLKR } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

// Mock distance based on address keywords (Colombo zones)
function mockDistance(address: string): number {
  const lower = address.toLowerCase()
  if (lower.includes("nugegoda")) return 6.4
  if (lower.includes("maharagama")) return 1.2
  if (lower.includes("battaramulla")) return 11.2
  if (lower.includes("rajagiriya")) return 7.8
  if (lower.includes("dehiwala")) return 9.2
  if (lower.includes("colombo 03") || lower.includes("colombo 3")) return 12.5
  if (lower.includes("colombo 07") || lower.includes("colombo 7")) return 13.8
  if (lower.length > 5) return 9.2
  return 0
}

export function StepFulfillment() {
  const { state, dispatch } = useOrder()
  const [address, setAddress] = useState(state.deliveryAddress)
  const [distance, setDistance] = useState(state.deliveryDistanceKm)

  useEffect(() => {
    if (state.fulfillmentType === "delivery" && address) {
      const d = mockDistance(address)
      setDistance(d)
      dispatch({
        type: "SET_FULFILLMENT",
        payload: {
          type: "delivery",
          address,
          distanceKm: d,
          fee: calculateDeliveryFee(d),
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const fee = state.fulfillmentType === "delivery" ? calculateDeliveryFee(distance) : 0

  return (
    <div className="space-y-8">
      <div>
        <p className="label-eyebrow mb-3">Step 3 of 5</p>
        <h1 className="font-serif text-3xl italic text-foreground md:text-4xl">
          How will you receive it?
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Pick up from our Maharagama studio or have it delivered to your door.
        </p>
      </div>

      {/* Toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-full border border-border-subtle bg-white p-1.5">
        <button
          onClick={() =>
            dispatch({ type: "SET_FULFILLMENT", payload: { type: "pickup", fee: 0, distanceKm: 0 } })
          }
          className={cn(
            "flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            state.fulfillmentType === "pickup"
              ? "bg-rose-velvet text-white"
              : "text-text-muted hover:text-rose-velvet",
          )}
        >
          <Store className="h-4 w-4" />
          Pickup · Free
        </button>
        <button
          onClick={() =>
            dispatch({
              type: "SET_FULFILLMENT",
              payload: { type: "delivery", address, distanceKm: distance, fee: calculateDeliveryFee(distance) },
            })
          }
          className={cn(
            "flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
            state.fulfillmentType === "delivery"
              ? "bg-rose-velvet text-white"
              : "text-text-muted hover:text-rose-velvet",
          )}
        >
          <Truck className="h-4 w-4" />
          Delivery
        </button>
      </div>

      {/* Pickup */}
      {state.fulfillmentType === "pickup" && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-border-subtle bg-white p-6">
            <p className="label-eyebrow mb-2">Pickup Location</p>
            <h3 className="font-serif text-xl text-foreground">{STORE_LOCATION.name}</h3>
            <p className="mt-1 text-sm text-text-muted">{STORE_LOCATION.address}</p>
            <p className="mt-3 text-xs text-text-muted">
              Open Mon–Sat, 8am–8pm · Sundays 10am–6pm
            </p>
          </div>

          {/* Map placeholder */}
          <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-2xl bg-surface-container">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(153,0,72,0.06),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(153,0,72,0.06),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,0,72,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,0,72,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-velvet text-white shadow-[0_8px_24px_rgba(153,0,72,0.4)]">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-rose-velvet shadow-sm">
                {STORE_LOCATION.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Delivery */}
      {state.fulfillmentType === "delivery" && (
        <div className="space-y-5">
          <div>
            <label className="label-eyebrow mb-2 block">Delivery address</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="23 Jambugasmulla Mawatha, Nugegoda"
              className="h-12 rounded-2xl border-border-subtle bg-white px-5 text-base focus-visible:ring-rose-velvet"
            />
            <p className="mt-2 text-xs text-text-muted">
              Try: Nugegoda, Maharagama, Battaramulla, Rajagiriya, Dehiwala
            </p>
          </div>

          {/* Map placeholder */}
          <div className="relative flex h-[200px] items-center justify-center overflow-hidden rounded-2xl bg-surface-container">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(153,0,72,0.06),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(153,0,72,0.06),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,0,72,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,0,72,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-velvet text-white shadow-[0_8px_24px_rgba(153,0,72,0.4)]">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-rose-velvet shadow-sm">
                {address || "Enter your address"}
              </span>
            </div>
          </div>

          {distance > 0 && (
            <div className="flex items-center justify-between rounded-2xl bg-petal-pink/50 px-6 py-4">
              <div>
                <p className="label-eyebrow mb-1">Estimated Distance</p>
                <p className="font-serif text-lg text-foreground">{distance.toFixed(1)} km</p>
              </div>
              <div className="text-right">
                <p className="label-eyebrow mb-1">Delivery Fee</p>
                <p className="font-serif text-lg text-rose-velvet">{formatLKR(fee)}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-text-muted">
            Fee = LKR 200 base + LKR 45 × km. Calculated on confirmation.
          </p>
        </div>
      )}
    </div>
  )
}
