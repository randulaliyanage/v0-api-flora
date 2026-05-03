'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type OrderStatus = 'pending' | 'ai-analyzed' | 'arranging' | 'out-for-delivery' | 'delivered'

interface OrderProgressBarProps {
  status: OrderStatus
  className?: string
}

const steps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'ai-analyzed', label: 'AI Analyzed' },
  { key: 'arranging', label: 'Arranging' },
  { key: 'out-for-delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

const statusOrder: Record<OrderStatus, number> = {
  'pending': 0,
  'ai-analyzed': 1,
  'arranging': 2,
  'out-for-delivery': 3,
  'delivered': 4,
}

export function OrderProgressBar({ status, className }: OrderProgressBarProps) {
  const currentIndex = statusOrder[status]

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.key} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isCompleted && "bg-rose-velvet text-primary-foreground",
                      isCurrent && "bg-rose-velvet text-primary-foreground",
                      isPending && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className={cn(
                        "w-3 h-3 rounded-full",
                        isCurrent && "bg-primary-foreground animate-pulse",
                        isPending && "bg-muted-foreground"
                      )} />
                    )}
                  </div>
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-rose-velvet/30 animate-ping" />
                  )}
                </div>
                <p className={cn(
                  "text-xs uppercase tracking-widest font-sans text-center max-w-20",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    index < currentIndex ? "bg-rose-velvet" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden flex flex-col gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isCompleted && "bg-rose-velvet text-primary-foreground",
                      isCurrent && "bg-rose-velvet text-primary-foreground",
                      isPending && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        isCurrent && "bg-primary-foreground animate-pulse",
                        isPending && "bg-muted-foreground"
                      )} />
                    )}
                  </div>
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-rose-velvet/30 animate-ping" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-6 mt-1",
                      index < currentIndex ? "bg-rose-velvet" : "bg-muted"
                    )}
                  />
                )}
              </div>
              <div className="pt-1.5">
                <p className={cn(
                  "text-xs uppercase tracking-widest font-sans",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
