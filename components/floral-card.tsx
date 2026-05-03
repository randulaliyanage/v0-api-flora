"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import type { Flower } from "@/lib/types"
import { formatLKR, isLowStock } from "@/lib/mock-data"

interface FloralCardProps {
  flower: Flower
  onAdd?: (flower: Flower) => void
}

export function FloralCard({ flower, onAdd }: FloralCardProps) {
  const lowStock = isLowStock(flower)

  return (
    <article
      className="arrangement-card relative overflow-visible rounded-3xl border border-border-subtle bg-card pb-8 px-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(153,0,72,0.2)]"
      style={{ paddingTop: "80px" }}
    >
      <div
        className="arrangement-image absolute left-1/2 z-10 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full bg-petal-pink sm:h-40 sm:w-40"
        style={{ top: "-28px" }}
      >
        <Image
          src={flower.image_url || "/placeholder.svg"}
          alt={flower.name}
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>

      {lowStock && (
        <span className="absolute right-4 top-4 z-20 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
          Low stock
        </span>
      )}

      <div className="flex flex-col items-center gap-1 pt-4 text-center">
        <span className="label-eyebrow">{flower.category}</span>
        <h3 className="font-serif text-xl text-foreground">{flower.name}</h3>
        <p className="text-xs text-text-muted">Per stem</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="font-serif text-lg font-semibold text-rose-velvet">
          {formatLKR(flower.price_lkr)}
        </p>
        <button
          onClick={() => onAdd?.(flower)}
          aria-label={`Add ${flower.name} to bouquet`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-velvet text-white transition-colors hover:bg-rose-velvet-hover"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </article>
  )
}
