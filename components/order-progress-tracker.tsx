"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/lib/types"

const STAGES: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Order Placed" },
  { key: "ai_analyzed", label: "AI Analyzed" },
  { key: "arranging", label: "Arranging" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
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
        <div className="relative flex items-center justify-between">
          {STAGES.map((stage, idx) => {
            const completed = idx < currentIdx
            const active = idx === currentIdx
            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                    completed && "border-rose-velvet bg-rose-velvet text-white",
                    active && "border-rose-velvet bg-white",
                    !completed && !active && "border-border-subtle bg-white",
                  )}
                >
                  {completed && <Check className="h-5 w-5" />}
                  {active && (
                    <>
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-rose-velvet/20" />
                      <span className="h-3 w-3 rounded-full bg-rose-velvet" />
                    </>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    (completed || active) ? "text-foreground" : "text-text-muted",
                  )}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
          {/* Connecting line */}
          <div className="absolute left-6 right-6 top-6 -z-0 h-0.5 bg-border-subtle">
            <div
              className="h-full bg-rose-velvet transition-all"
              style={{
                width: `${(currentIdx / (STAGES.length - 1)) * 100}%`,
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
          return (
            <li key={stage.key} className="flex items-center gap-4">
              <div
                className={cn(
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                  completed && "border-rose-velvet bg-rose-velvet text-white",
                  active && "border-rose-velvet bg-white",
                  !completed && !active && "border-border-subtle bg-white",
                )}
              >
                {completed && <Check className="h-4 w-4" />}
                {active && (
                  <>
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-rose-velvet/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-velvet" />
                  </>
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  (completed || active) ? "font-medium text-foreground" : "text-text-muted",
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
