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
 * Arrangement Header card — outer wrapper reserves room (paddingTop:90px,
 * marginTop:48px) so the floating image can sit absolutely above the inner
 * card without colliding with text or neighboring rows. The inner card uses
 * paddingTop:60px to clear the image's lower half.
 *
 * IMPORTANT: every parent grid that renders FloralCard MUST have
 * `overflow: visible` and a generous row gap (>= 80px).
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
    <div style={{ paddingTop: "90px", marginTop: "48px" }}>
      <div
        style={{
          position: "relative",
          overflow: "visible",
          background: "white",
          borderRadius: "1.5rem",
          border: "1px solid rgba(153,0,72,0.12)",
          padding: "1.5rem",
          paddingTop: "60px",
          textAlign: "center",
        }}
        className="transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(153,0,72,0.2)]"
      >
        {/* Image floats above card — absolutely positioned relative to this inner div */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
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
            style={{ objectFit: "contain" }}
            unoptimized={flower.image_url?.startsWith("data:") ?? false}
          />
        </div>

        {/* Low stock badge — inside card top-right, does not touch image */}
        {lowStock && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "#fef3c7",
              color: "#92400e",
              fontSize: "10px",
              padding: "3px 10px",
              borderRadius: "9999px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Low Stock
          </span>
        )}

        {/* Text — fully in normal flow, no collisions */}
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "#1a0a0e",
            margin: "0 0 4px",
          }}
        >
          {flower.name}
        </p>
        <p
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#70585b",
            margin: "0 0 4px",
          }}
        >
          per stem
        </p>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#990048",
            margin: "0 0 12px",
          }}
        >
          {formatLKR(flower.price_lkr)}
        </p>

        {/* Add button */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${flower.name} to bouquet`}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            width: "36px",
            height: "36px",
            borderRadius: "9999px",
            background: "#990048",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="transition-colors hover:!bg-[#7a0039]"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
