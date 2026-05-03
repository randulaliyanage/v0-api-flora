"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  steps: { label: string }[]
  current: number
  onSelect?: (step: number) => void
}

export function StepIndicator({ steps, current, onSelect }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:gap-3">
        {steps.map((step, idx) => {
          const stepNum = idx + 1
          const isActive = stepNum === current
          const isPast = stepNum < current
          const isFuture = stepNum > current
          return (
            <button
              key={step.label}
              type="button"
              onClick={() => onSelect && stepNum <= current && onSelect(stepNum)}
              disabled={isFuture}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all md:px-5 md:py-2.5 md:text-sm",
                isActive && "bg-rose-velvet text-white shadow-[0_8px_24px_-8px_rgba(153,0,72,0.5)]",
                isPast && "bg-petal-pink text-rose-velvet hover:bg-petal-pink/80",
                isFuture && "bg-surface-container text-text-muted",
              )}
            >
              {isPast ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                    isActive ? "bg-white/20" : "bg-rose-velvet/10",
                  )}
                >
                  {stepNum}
                </span>
              )}
              <span className="whitespace-nowrap">{step.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
