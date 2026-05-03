"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { dailyCapacity as initial } from "@/lib/mock-data"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AdminCapacityPage() {
  const [maxPerDay, setMaxPerDay] = useState(20)
  const [days, setDays] = useState(initial.slice(0, 7))

  const toggleClosed = (date: string) => {
    setDays((prev) =>
      prev.map((d) => (d.date === date ? { ...d, is_closed: !d.is_closed } : d)),
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border-subtle bg-white p-8 md:p-12">
        <p className="label-eyebrow mb-3">Daily Order Limit</p>
        <h2 className="font-serif text-2xl italic text-foreground">
          How many bouquets can you make per day?
        </h2>
        <div className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="font-serif text-7xl text-rose-velvet md:text-[96px]">{maxPerDay}</div>
          <div className="flex-1">
            <Slider
              value={[maxPerDay]}
              min={1}
              max={50}
              step={1}
              onValueChange={(v) => setMaxPerDay(v[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>1</span>
              <span>50 max</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-text-muted">
          New orders past this number will see the date as fully booked.
        </p>
      </div>

      <div>
        <p className="label-eyebrow mb-3">Next 7 Days</p>
        <h2 className="mb-6 font-serif text-2xl italic text-foreground">Week at a glance</h2>
        <div className="grid gap-4 md:grid-cols-7">
          {days.map((d) => {
            const pct = Math.min(100, (d.current_orders / maxPerDay) * 100)
            const date = new Date(d.date)
            const isFull = d.current_orders >= maxPerDay || d.is_closed
            return (
              <div
                key={d.date}
                className={cn(
                  "rounded-3xl border p-5 transition-colors",
                  d.is_closed
                    ? "border-border-subtle bg-surface-container"
                    : "border-border-subtle bg-white",
                )}
              >
                <p className="label-eyebrow">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="mt-1 font-serif text-2xl text-foreground">
                  {date.toLocaleDateString("en-US", { day: "numeric" })}
                </p>
                <p className="text-xs text-text-muted">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </p>

                <div className="mt-4">
                  <p className="mb-1.5 text-xs text-text-muted">
                    <span className="font-serif text-base text-foreground">{d.current_orders}</span>
                    <span className="text-text-muted"> / {maxPerDay}</span>
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isFull ? "bg-amber-500" : "bg-rose-velvet",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleClosed(d.date)}
                  className={cn(
                    "mt-4 h-8 w-full rounded-full text-xs",
                    d.is_closed
                      ? "bg-rose-velvet text-white hover:bg-rose-velvet-hover"
                      : "border border-border-subtle text-text-muted hover:bg-petal-pink hover:text-rose-velvet",
                  )}
                >
                  {d.is_closed ? (
                    <>
                      <Lock className="mr-1 h-3 w-3" />
                      Reopen
                    </>
                  ) : (
                    "Close date"
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
