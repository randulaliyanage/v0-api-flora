"use client"

import { ShoppingBag, Scissors, Truck, CheckCircle2, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"

interface Stage {
  key: OrderStatus
  label: string
  icon: LucideIcon
}

const STAGES: Stage[] = [
  { key: "placed", label: "Order Placed", icon: ShoppingBag },
  { key: "arranging", label: "Arranging", icon: Scissors },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
]

interface OrderProgressTrackerProps {
  status: OrderStatus
}

export function OrderProgressTracker({ status }: OrderProgressTrackerProps) {
  const currentIdx = STAGES.findIndex((s) => s.key === status)

  return (
    <div className="w-full">
      {/* Desktop horizontal */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {STAGES.map((stage, idx) => {
            const completed = idx < currentIdx
            const active = idx === currentIdx
            const Icon = stage.icon
            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-full transition-all",
                    completed && "bg-[#990048] text-white",
                    active && "border-2 border-[#990048] bg-white",
                    !completed && !active && "border-2 border-gray-200 bg-white text-gray-400",
                  )}
                >
                  {completed && <Icon className="h-5 w-5" />}
                  {active && (
                    <>
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#990048]/20" />
                      <span className="h-3 w-3 animate-pulse rounded-full bg-[#990048]" />
                    </>
                  )}
                  {!completed && !active && <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={cn(
                    "text-xs",
                    (completed || active)
                      ? "font-medium text-[#990048]"
                      : "text-text-muted",
                  )}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
          {/* Connecting line */}
          <div className="absolute left-6 right-6 top-6 -z-0 h-0.5 -translate-y-1/2 bg-[#e5e7eb]">
            <div
              className="h-full bg-[#990048] transition-all"
              style={{
                width:
                  currentIdx <= 0
                    ? "0%"
                    : `${(currentIdx / (STAGES.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile vertical */}
      <ol className="space-y-5 md:hidden">
        {STAGES.map((stage, idx) => {
          const completed = idx < currentIdx
          const active = idx === currentIdx
          const Icon = stage.icon
          return (
            <li key={stage.key} className="flex items-center gap-4">
              <div
                className={cn(
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  completed && "bg-[#990048] text-white",
                  active && "border-2 border-[#990048] bg-white",
                  !completed && !active && "border-2 border-gray-200 bg-white text-gray-400",
                )}
              >
                {completed && <Icon className="h-4 w-4" />}
                {active && (
                  <>
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#990048]/20" />
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#990048]" />
                  </>
                )}
                {!completed && !active && <Icon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  "text-sm",
                  (completed || active)
                    ? "font-medium text-[#990048]"
                    : "text-text-muted",
                )}
              >
                {stage.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
