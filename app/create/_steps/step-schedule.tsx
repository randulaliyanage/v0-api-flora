"use client"

import { useOrder } from "@/context/OrderContext"
import { CapacityCalendar } from "@/components/capacity-calendar"
import { cn } from "@/lib/utils"

const SLOTS = [
  { id: "morning" as const, label: "Morning", time: "8am – 12pm" },
  { id: "afternoon" as const, label: "Afternoon", time: "12pm – 5pm" },
  { id: "evening" as const, label: "Evening", time: "5pm – 8pm" },
]

export function StepSchedule() {
  const { state, dispatch } = useOrder()

  return (
    <div className="space-y-8">
      <div>
        <p className="label-eyebrow mb-3">Step 4 of 5</p>
        <h1 className="font-serif text-3xl italic text-foreground md:text-4xl">
          When should we deliver?
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Pick a date and time slot. Greyed-out dates are at full capacity.
        </p>
      </div>

      <CapacityCalendar
        selectedDate={state.scheduledDate}
        onSelect={(date) => dispatch({ type: "SET_DATE", payload: { date } })}
      />

      {state.scheduledDate && (
        <div>
          <p className="label-eyebrow mb-3">Time slot</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SLOTS.map((slot) => {
              const active = state.scheduledSlot === slot.id
              return (
                <button
                  key={slot.id}
                  onClick={() =>
                    dispatch({ type: "SET_DATE", payload: { date: state.scheduledDate, slot: slot.id } })
                  }
                  className={cn(
                    "rounded-2xl border px-5 py-4 text-left transition-all",
                    active
                      ? "border-rose-velvet bg-rose-velvet text-white"
                      : "border-border-subtle bg-white hover:border-rose-velvet hover:bg-petal-pink/40",
                  )}
                >
                  <p className={cn("font-serif text-lg", active ? "text-white" : "text-foreground")}>
                    {slot.label}
                  </p>
                  <p className={cn("mt-0.5 text-xs", active ? "text-white/80" : "text-text-muted")}>
                    {slot.time}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
