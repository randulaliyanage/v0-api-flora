"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { dailyCapacity } from "@/lib/mock-data"

interface CapacityCalendarProps {
  selectedDate: string | null
  onSelect: (date: string) => void
}

export function CapacityCalendar({ selectedDate, onSelect }: CapacityCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date("2026-05-01"))

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const grid = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startOffset = first.getDay()
    const cells: ({ day: number; iso: string; load: number; max: number; closed: boolean } | null)[] = []
    for (let i = 0; i < startOffset; i++) cells.push(null)
    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(year, month, d)
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      const cap = dailyCapacity.find((c) => c.date === iso)
      cells.push({
        day: d,
        iso,
        load: cap?.current_orders ?? 0,
        max: cap?.max_orders ?? 20,
        closed: cap?.is_closed ?? false,
      })
    }
    return cells
  }, [viewDate])

  const navigate = (delta: number) => {
    const next = new Date(viewDate)
    next.setMonth(next.getMonth() + delta)
    setViewDate(next)
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-xl text-foreground">{monthLabel}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:bg-petal-pink hover:text-rose-velvet"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:bg-petal-pink hover:text-rose-velvet"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d} className="label-eyebrow text-[10px]">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />
          const isFull = cell.load >= cell.max || cell.closed
          const isSelected = selectedDate === cell.iso
          const loadPct = (cell.load / cell.max) * 100
          return (
            <button
              key={cell.iso}
              disabled={isFull}
              onClick={() => onSelect(cell.iso)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-all",
                isSelected && "bg-rose-velvet text-white",
                !isSelected && !isFull && "hover:bg-petal-pink hover:text-rose-velvet",
                isFull && "cursor-not-allowed text-petal-pink line-through opacity-60",
              )}
            >
              <span className="font-medium">{cell.day}</span>
              {!isFull && !isSelected && (
                <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-border-subtle">
                  <span
                    className="block h-full rounded-full bg-rose-velvet"
                    style={{ width: `${loadPct}%` }}
                  />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-velvet" /> Selected
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-petal-pink" /> Available
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-border-subtle" /> Full
        </div>
      </div>
    </div>
  )
}
