"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIResultCardProps {
  detected: { name: string; quantity: number }[]
  confidence: number
  onAccept: () => void
}

export function AIResultCard({ detected, confidence, onAccept }: AIResultCardProps) {
  return (
    <div className="rounded-3xl bg-petal-pink/60 p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-velvet text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-serif text-lg text-foreground">AI Analysis Complete</h3>
          <p className="text-xs text-text-muted">
            {confidence}% match confidence — detected {detected.length} elements
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {detected.map((item) => (
          <span
            key={item.name}
            className="rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-medium text-rose-velvet"
          >
            {item.name} <span className="text-text-muted">×{item.quantity}</span>
          </span>
        ))}
      </div>

      <Button
        onClick={onAccept}
        className="w-full rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
      >
        Accept Recommendations
      </Button>
    </div>
  )
}
