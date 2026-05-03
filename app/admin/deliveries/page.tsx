"use client"

import { Truck, MapPin, Phone } from "lucide-react"
import { orders, formatLKR } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Queued",
  arranging: "Arranging",
  out_for_delivery: "On the road",
  delivered: "Delivered",
}

export default function AdminDeliveriesPage() {
  const deliveries = orders.filter((o) => o.delivery_type === "delivery")
  const enRoute = deliveries.filter((o) => o.status === "out_for_delivery")
  const upcoming = deliveries.filter((o) => o.status !== "delivered" && o.status !== "out_for_delivery")
  const completed = deliveries.filter((o) => o.status === "delivered")

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="On the road" value={enRoute.length} accent />
        <SummaryCard label="Queued" value={upcoming.length} />
        <SummaryCard label="Completed today" value={completed.length} />
      </div>

      <DeliverySection title="Currently out" items={enRoute} active />
      <DeliverySection title="Upcoming" items={upcoming} />
      <DeliverySection title="Completed" items={completed} />
    </div>
  )
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-border-subtle p-6", accent ? "bg-petal-pink/40" : "bg-white")}>
      <div className="flex items-center justify-between">
        <p className="label-eyebrow">{label}</p>
        <Truck className="h-4 w-4 text-rose-velvet" />
      </div>
      <p className="mt-3 font-serif text-3xl text-rose-velvet">{value}</p>
    </div>
  )
}

function DeliverySection({
  title,
  items,
  active,
}: {
  title: string
  items: typeof orders
  active?: boolean
}) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="mb-4 font-serif text-xl italic text-foreground">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <div
            key={d.id}
            className={cn(
              "rounded-3xl border p-6 transition-shadow hover:shadow-[0_16px_48px_-20px_rgba(153,0,72,0.2)]",
              active ? "border-rose-velvet/40 bg-white" : "border-border-subtle bg-white",
            )}
          >
            <div className="flex items-start justify-between">
              <p className="font-mono text-sm text-rose-velvet">{d.id}</p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  active
                    ? "bg-rose-velvet text-white"
                    : d.status === "delivered"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-petal-pink text-rose-velvet",
                )}
              >
                {STATUS_LABEL[d.status]}
              </span>
            </div>
            <p className="mt-3 font-serif text-lg text-foreground">{d.customer_name}</p>
            <p className="mt-2 flex items-start gap-2 text-sm text-text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-velvet" />
              {d.delivery_address}
            </p>
            <p className="mt-1 flex items-center gap-2 pl-6 text-xs text-text-muted">
              <Phone className="h-3 w-3" />
              {d.customer_phone}
            </p>
            <div className="mt-4 flex items-baseline justify-between border-t border-border-subtle pt-3 text-sm">
              <span className="text-text-muted">
                {d.delivery_distance_km?.toFixed(1)} km
              </span>
              <span className="font-medium text-foreground">{formatLKR(d.delivery_fee_lkr)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
