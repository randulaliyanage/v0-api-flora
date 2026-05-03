'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  label: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  current: number
  className?: string
}

export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < current
          const isCurrent = index === current
          const isPending = index > current

          return (
            <div key={step.label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    isCompleted && "bg-rose-velvet text-primary-foreground",
                    isCurrent && "bg-rose-velvet text-primary-foreground ring-4 ring-rose-velvet/20",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-xs uppercase tracking-widest font-sans",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4",
                    index < current ? "bg-rose-velvet" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden flex flex-col gap-4">
        {steps.map((step, index) => {
          const isCompleted = index < current
          const isCurrent = index === current
          const isPending = index > current

          return (
            <div key={step.label} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    isCompleted && "bg-rose-velvet text-primary-foreground",
                    isCurrent && "bg-rose-velvet text-primary-foreground ring-4 ring-rose-velvet/20",
                    isPending && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-8 mt-2",
                      index < current ? "bg-rose-velvet" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <div className="pt-1">
                <p className={cn(
                  "text-xs uppercase tracking-widest font-sans",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
