"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import type { Flower } from "@/lib/types"
import { formatLKR, isLowStock } from "@/lib/mock-data"
import { useOrder } from "@/context/OrderContext"

interface FloralCardProps {
  flower: Flower
  /** Optional override; defaults to dispatching ADD_TO_CART on the global OrderContext. */
  onAdd?: (flower: Flower) => void
}

/**
 * Arrangement Header card — the floral image floats ABOVE the card body
 * (no circular crop, no rectangular bg). The parent wrapper MUST be
 * overflow-visible so the image isn't clipped.
 */
export function FloralCard({ flower, onAdd }: FloralCardProps) {
  const { dispatch } = useOrder()
  const lowStock = isLowStock(flower)

  const handleAdd = () => {
    if (onAdd) {
      onAdd(flower)
      return
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        flower_id: flower.id,
        flower_name: flower.name,
        flower_image: flower.image_url,
        quantity: 1,
        price_lkr: flower.price_lkr,
      },
    })
  }

  return (
    <div
      style={{ position: "relative", overflow: "visible", paddingTop: "120px" }}
      className="rounded-3xl border border-[rgba(153,0,72,0.12)] bg-white px-6 pb-16 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(153,0,72,0.2)]"
    >
      {/* Image floats ABOVE the card — overflow-visible parent required */}
      <div
        style={{
          position: "absolute",
          top: "-48px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "120px",
          height: "120px",
          zIndex: 10,
        }}
      >
        <Image
          src={flower.image_url || "/placeholder.svg"}
          alt={flower.name}
          fill
          sizes="120px"
          className="object-contain"
          style={{ filter: "drop-shadow(0 8px 24px rgba(153,0,72,0.18))" }}
          unoptimized={flower.image_url?.startsWith("data:") ?? false}
        />
      </div>

      {/* Card text content — normal flow, sits below the 120px paddingTop gap */}
      <p
        className="text-center font-serif text-base italic"
        style={{ color: "#1a0a0e" }}
      >
        {flower.name}
      </p>
      <p
        className="mt-1 text-center text-xs uppercase tracking-widest"
        style={{ color: "#70585b" }}
      >
        Per Stem
      </p>
      <p
        className="mt-1 text-center text-xl font-bold"
        style={{ color: "#990048" }}
      >
        {formatLKR(flower.price_lkr)}
      </p>

      {/* Low stock badge — inside card, top-right corner */}
      {lowStock && (
        <span
          className="absolute rounded-full bg-amber-100 px-2 py-1 text-[10px] uppercase tracking-widest text-amber-800"
          style={{ top: "12px", right: "12px" }}
        >
          Low Stock
        </span>
      )}

      {/* Add button — bottom-right corner */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${flower.name} to bouquet`}
        className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-[#990048] text-white transition-colors hover:bg-[#7a0039]"
        style={{ bottom: "16px", right: "16px" }}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
