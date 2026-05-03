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
      style={{ position: "relative", overflow: "visible", paddingTop: "80px" }}
      className="rounded-3xl border border-[rgba(153,0,72,0.12)] bg-white p-6 pb-16 transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(153,0,72,0.2)]"
    >
      {/* Image floats ABOVE the card */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          width: "140px",
          height: "160px",
        }}
      >
        <Image
          src={flower.image_url || "/placeholder.svg"}
          alt={flower.name}
          fill
          sizes="140px"
          className="object-contain"
          style={{ filter: "drop-shadow(0 8px 24px rgba(153,0,72,0.18))" }}
        />
      </div>

      {/* Card content below */}
      <p className="mt-2 text-center font-serif text-lg italic">{flower.name}</p>
      <p className="mt-1 text-center text-sm uppercase tracking-widest text-[#70585b]">
        per stem
      </p>
      <p className="mt-1 text-center text-xl font-bold text-[#990048]">
        {formatLKR(flower.price_lkr)}
      </p>

      {/* Stock badge */}
      {lowStock && (
        <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-2 py-1 text-[10px] uppercase tracking-widest text-amber-800">
          Low Stock
        </span>
      )}

      {/* Add button */}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Add ${flower.name} to bouquet`}
        className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#990048] text-white transition-colors hover:bg-[#7a0039]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
