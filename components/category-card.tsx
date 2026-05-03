"use client"

import { Flower2, Cookie, Gift, PartyPopper, type LucideIcon } from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  flower: Flower2,
  confection: Cookie,
  gift: Gift,
  balloon: PartyPopper,
}

interface CategoryCardProps {
  label: string
  icon: keyof typeof ICONS
  count?: number
}

export function CategoryCard({ label, icon, count }: CategoryCardProps) {
  const Icon = ICONS[icon] ?? Flower2
  return (
    <button className="group flex flex-col items-start gap-4 rounded-3xl border border-border-subtle bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:border-rose-velvet hover:shadow-[0_16px_48px_-20px_rgba(153,0,72,0.2)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-petal-pink text-rose-velvet">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="label-eyebrow mb-1">Category</p>
        <h3 className="font-serif text-lg text-foreground">{label}</h3>
        {typeof count === "number" && (
          <p className="mt-1 text-xs text-text-muted">{count} items</p>
        )}
      </div>
    </button>
  )
}
