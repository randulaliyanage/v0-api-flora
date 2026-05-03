"use client"

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useOrder } from "@/context/OrderContext"
import { formatLKR, flowers } from "@/lib/mock-data"

interface CartDrawerProps {
  variant?: "sidebar" | "inline"
}

export function CartDrawer({ variant = "sidebar" }: CartDrawerProps) {
  const { state, dispatch, cartSubtotal } = useOrder()

  const containerCls =
    variant === "sidebar"
      ? "sticky top-24 rounded-3xl border border-border-subtle bg-white p-6"
      : "rounded-3xl border border-border-subtle bg-white p-6"

  if (state.cart.length === 0) {
    return (
      <aside className={containerCls}>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-petal-pink text-rose-velvet">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <p className="font-serif text-lg text-foreground">Your bouquet is empty</p>
          <p className="text-xs text-text-muted">Add flowers to get started.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className={containerCls}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-serif text-xl text-foreground">Your Bouquet</h3>
        <span className="rounded-full bg-petal-pink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-velvet">
          {state.cart.reduce((s, i) => s + i.quantity, 0)} stems
        </span>
      </div>

      <ul className="space-y-3">
        {state.cart.map((item) => {
          const flower = flowers.find((f) => f.id === item.flower_id)
          return (
            <li key={item.flower_id} className="flex items-center gap-3 rounded-2xl bg-parchment p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-petal-pink">
                {flower?.image_url && (
                  <Image src={flower.image_url} alt={item.flower_name} fill className="object-cover" sizes="48px" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.flower_name}</p>
                <p className="text-xs text-text-muted">{formatLKR(item.price_lkr)}/stem</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_QUANTITY",
                      payload: { flower_id: item.flower_id, quantity: item.quantity - 1 },
                    })
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:bg-petal-pink hover:text-rose-velvet"
                  aria-label="Decrease"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_QUANTITY",
                      payload: { flower_id: item.flower_id, quantity: item.quantity + 1 },
                    })
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
                  aria-label="Increase"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: { flower_id: item.flower_id } })}
                className="text-text-muted hover:text-rose-velvet"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-5 space-y-2 border-t border-border-subtle pt-5 text-sm">
        <div className="flex justify-between text-text-muted">
          <span>Subtotal</span>
          <span className="font-medium tabular-nums text-foreground">{formatLKR(cartSubtotal)}</span>
        </div>
        {state.deliveryFee > 0 && (
          <div className="flex justify-between text-text-muted">
            <span>Delivery</span>
            <span className="font-medium tabular-nums text-foreground">{formatLKR(state.deliveryFee)}</span>
          </div>
        )}
        <div className="flex items-baseline justify-between pt-2">
          <span className="text-xs uppercase tracking-wider text-text-muted">Total</span>
          <span className="font-serif text-2xl text-rose-velvet tabular-nums">
            {formatLKR(cartSubtotal + state.deliveryFee)}
          </span>
        </div>
      </div>
    </aside>
  )
}
