"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  MapPin,
} from "lucide-react"
import { orders as initialOrders, formatLKR, flowers } from "@/lib/mock-data"
import type { Order, OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  arranging: "Arranging",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  placed: "bg-amber-100 text-amber-800",
  arranging: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
}

const STATUS_OPTIONS: OrderStatus[] = ["placed", "arranging", "out_for_delivery", "delivered"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [expanded, setExpanded] = useState<string | null>(null)

  const totalToday = orders.length
  const revenueToday = orders.reduce((s, o) => s + o.total_lkr + o.delivery_fee_lkr, 0)
  const pending = orders.filter((o) => o.status !== "delivered").length
  const lowStock = flowers.filter((f) => f.stock_count < 20).length

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <div className="space-y-8">
      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Orders Today"
          value={totalToday.toString()}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <MetricCard
          label="Revenue Today"
          value={formatLKR(revenueToday)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          label="Pending"
          value={pending.toString()}
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          label="Low Stock"
          value={lowStock.toString()}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent
        />
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white">
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <p className="label-eyebrow mb-1">Live Queue</p>
            <h2 className="font-serif text-2xl italic text-foreground">All Orders</h2>
          </div>
          <span className="hidden rounded-full bg-petal-pink px-3 py-1 text-xs font-medium text-rose-velvet md:inline-flex">
            {orders.length} active
          </span>
        </div>

        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                {["Order", "Customer", "Bouquet", "Date", "Status", "Type", ""].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-[11px] uppercase tracking-wider text-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  expanded={expanded === order.id}
                  onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
                  onUpdateStatus={(s) => updateStatus(order.id, s)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 md:hidden">
          {orders.map((order) => (
            <OrderMobileCard
              key={order.id}
              order={order}
              expanded={expanded === order.id}
              onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
              onUpdateStatus={(s) => updateStatus(order.id, s)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: string
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className={cn("rounded-2xl border border-border-subtle bg-white p-6", accent && "bg-petal-pink/40")}>
      <div className="flex items-center justify-between">
        <p className="label-eyebrow">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-velvet/10 text-rose-velvet">
          {icon}
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl text-rose-velvet">{value}</p>
    </div>
  )
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onUpdateStatus,
}: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onUpdateStatus: (s: OrderStatus) => void
}) {
  return (
    <>
      <tr className="border-b border-border-subtle hover:bg-parchment">
        <td className="px-6 py-4 font-mono text-sm text-rose-velvet">{order.id}</td>
        <td className="px-6 py-4">
          <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
          <p className="text-xs text-text-muted">{order.customer_phone}</p>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {order.flowers.slice(0, 2).map((f) => (
              <span
                key={f.flower_id}
                className="rounded-full bg-petal-pink/60 px-2.5 py-0.5 text-xs text-rose-velvet"
              >
                {f.flower_name} ×{f.quantity}
              </span>
            ))}
            {order.flowers.length > 2 && (
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-xs text-text-muted">
                +{order.flowers.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-text-muted">
          {new Date(order.scheduled_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </td>
        <td className="px-6 py-4">
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(e.target.value as OrderStatus)}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1 text-xs font-medium outline-none",
              STATUS_STYLES[order.status],
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4 text-xs uppercase tracking-wider text-text-muted">
          {order.delivery_type}
        </td>
        <td className="px-6 py-4">
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-petal-pink hover:text-rose-velvet"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-parchment">
          <td colSpan={7} className="px-6 py-5">
            <ExpandedOrder order={order} />
          </td>
        </tr>
      )}
    </>
  )
}

function OrderMobileCard({
  order,
  expanded,
  onToggle,
  onUpdateStatus,
}: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onUpdateStatus: (s: OrderStatus) => void
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-parchment p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-rose-velvet">{order.id}</p>
          <p className="mt-1 text-sm font-medium text-foreground">{order.customer_name}</p>
        </div>
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(e.target.value as OrderStatus)}
          className={cn(
            "cursor-pointer rounded-full px-3 py-1 text-xs font-medium outline-none",
            STATUS_STYLES[order.status],
          )}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onToggle}
        className="mt-3 flex w-full items-center justify-between text-xs text-rose-velvet"
      >
        <span>{expanded ? "Hide details" : "View details"}</span>
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {expanded && (
        <div className="mt-3 border-t border-border-subtle pt-3">
          <ExpandedOrder order={order} />
        </div>
      )}
    </div>
  )
}

function ExpandedOrder({ order }: { order: Order }) {
  return (
    <div className="grid gap-5 md:grid-cols-[160px_1fr_1fr]">
      {order.reference_image_url ? (
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-petal-pink">
          <Image
            src={order.reference_image_url}
            alt={`Reference for ${order.id}`}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-petal-pink/40 text-xs text-text-muted">
          No reference
        </div>
      )}

      <div>
        <p className="label-eyebrow mb-2">Bouquet</p>
        <ul className="space-y-1.5 text-sm">
          {order.flowers.map((f) => (
            <li key={f.flower_id} className="flex justify-between text-foreground">
              <span>
                {f.flower_name} <span className="text-text-muted">×{f.quantity}</span>
              </span>
              <span className="text-text-muted tabular-nums">{formatLKR(f.price_lkr * f.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border-subtle pt-3 text-sm">
          <span className="text-text-muted">Total</span>
          <span className="font-serif text-rose-velvet">
            {formatLKR(order.total_lkr + order.delivery_fee_lkr)}
          </span>
        </div>
      </div>

      <div>
        <p className="label-eyebrow mb-2">
          {order.delivery_type === "pickup" ? "Pickup" : "Delivery"}
        </p>
        <p className="flex items-start gap-2 text-sm text-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rose-velvet" />
          {order.delivery_type === "pickup" ? "Studio pickup" : order.delivery_address}
        </p>
        {order.delivery_distance_km ? (
          <p className="mt-1 pl-6 text-xs text-text-muted">
            {order.delivery_distance_km.toFixed(1)} km · {formatLKR(order.delivery_fee_lkr)}
          </p>
        ) : null}
        <p className="mt-3 label-eyebrow">Scheduled</p>
        <p className="text-sm capitalize text-foreground">
          {new Date(order.scheduled_date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}{" "}
          · {order.scheduled_slot}
        </p>
      </div>
    </div>
  )
}
