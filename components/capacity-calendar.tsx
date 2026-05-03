'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface CapacityCalendarProps {
  disabledDates?: Date[]
  selectedDate?: Date
  onSelectDate?: (date: Date | undefined) => void
  className?: string
}

export function CapacityCalendar({
  disabledDates = [],
  selectedDate,
  onSelectDate,
  className,
}: CapacityCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate)

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    onSelectDate?.(newDate)
  }

  // Convert disabled dates to matchers
  const disabledMatcher = (checkDate: Date) => {
    return disabledDates.some(
      (disabled) =>
        disabled.getDate() === checkDate.getDate() &&
        disabled.getMonth() === checkDate.getMonth() &&
        disabled.getFullYear() === checkDate.getFullYear()
    )
  }

  return (
    <div className={cn("", className)}>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        disabled={(checkDate) => {
          // Disable past dates
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (checkDate < today) return true
          // Disable full capacity dates
          return disabledMatcher(checkDate)
        }}
        className="rounded-lg border border-border-subtle bg-card p-3"
        classNames={{
          day_selected: "bg-rose-velvet text-primary-foreground hover:bg-rose-velvet/90",
          day_today: "bg-muted text-foreground",
          day_disabled: "text-petal-pink opacity-50 cursor-not-allowed",
        }}
      />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Greyed out dates are at full capacity
      </p>
    </div>
  )
}
