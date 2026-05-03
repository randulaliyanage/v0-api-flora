"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, Sparkles, Minus, Plus, Loader2 } from "lucide-react"
import { useOrder } from "@/context/OrderContext"
import { formatLKR, isLowStock, aiSuggestion } from "@/lib/mock-data"
import { useFlowers } from "@/lib/data/use-flowers"
import { AIResultCard } from "@/components/ai-result-card"
import { LowStockBadge } from "@/components/low-stock-badge"

export function StepBouquet() {
  const { state, dispatch } = useOrder()
  const { activeFlowers: flowers, isLoading } = useFlowers()
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file)
    dispatch({ type: "SET_IMAGE", payload: url })
    setAnalyzed(false)
    setAnalyzing(true)
    setTimeout(() => {
      // Map AI suggestions to currently-available flowers; fall back gracefully
      // if a suggested stem isn't in the live catalog anymore.
      const items = aiSuggestion.detected
        .map((d) => {
          const flower = flowers.find((f) => f.id === d.flower_id)
          if (!flower) return null
          return {
            flower_id: flower.id,
            flower_name: flower.name,
            flower_image: flower.image_url,
            quantity: d.quantity,
            price_lkr: flower.price_lkr,
          }
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
      dispatch({ type: "SET_AI_SUGGESTIONS", payload: items })
      setAnalyzing(false)
      setAnalyzed(true)
    }, 1600)
  }

  const cartQty = (id: string) => state.cart.find((c) => c.flower_id === id)?.quantity ?? 0

  return (
    <div className="space-y-10">
      <div>
        <p className="label-eyebrow mb-3">Step 2 of 5</p>
        <h1 className="font-serif text-3xl italic text-foreground md:text-4xl">
          Build your bouquet
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Upload an inspiration photo or pick stems by hand.
        </p>
      </div>

      {/* Upload zone */}
      <div className="space-y-5">
        <p className="label-eyebrow">AI Inspiration</p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-rose-velvet/50 bg-white px-6 py-12 transition-colors hover:bg-petal-pink/30"
        >
          {state.referenceImageUrl ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl">
              <Image
                src={state.referenceImageUrl}
                alt="Reference"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-petal-pink text-rose-velvet">
              <Upload className="h-6 w-6" />
            </span>
          )}
          <div className="text-center">
            <p className="font-serif text-lg text-foreground">
              {state.referenceImageUrl ? "Replace photo" : "Upload a photo of a bouquet you love"}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              JPG or PNG, up to 8MB — our AI will identify each stem.
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </button>

        {analyzing && (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-petal-pink/40 p-5 text-sm text-rose-velvet">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Analyzing your reference image…
          </div>
        )}

        {analyzed && state.aiSuggestions.length > 0 && (
          <AIResultCard
            detected={state.aiSuggestions.map((s) => ({ name: s.flower_name, quantity: s.quantity }))}
            confidence={aiSuggestion.confidence}
            onAccept={() => dispatch({ type: "ACCEPT_AI_SUGGESTIONS" })}
          />
        )}
      </div>

      {/* Manual builder */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-border-subtle" />
          <span className="label-eyebrow">Or build manually</span>
          <span className="h-px flex-1 bg-border-subtle" />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12 text-sm text-text-muted">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading the garden…
          </div>
        )}

        {!isLoading && flowers.length === 0 && (
          <div className="rounded-2xl bg-petal-pink/30 p-8 text-center text-sm text-rose-velvet">
            The studio is restocking — please check back soon.
          </div>
        )}

        {/* Parent grid MUST be overflow-visible so the floating images aren't clipped */}
        <div
          style={{ overflow: "visible" }}
          className="grid grid-cols-2 gap-x-5 gap-y-16 pt-12 md:grid-cols-3"
        >
          {flowers.map((flower) => {
            const qty = cartQty(flower.id)
            return (
              <div
                key={flower.id}
                style={{ position: "relative", overflow: "visible", paddingTop: "80px" }}
                className="rounded-3xl border border-[rgba(153,0,72,0.12)] bg-white p-5 pb-20"
              >
                {/* Image floats ABOVE the card */}
                <div
                  style={{
                    position: "absolute",
                    top: "-40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    width: "120px",
                    height: "140px",
                  }}
                >
                  <Image
                    src={flower.image_url}
                    alt={flower.name}
                    fill
                    sizes="120px"
                    className="object-contain"
                    style={{ filter: "drop-shadow(0 8px 24px rgba(153,0,72,0.18))" }}
                    unoptimized={flower.image_url.startsWith("data:")}
                  />
                </div>

                {isLowStock(flower) && (
                  <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-1 text-[10px] uppercase tracking-widest text-amber-800">
                    Low Stock
                  </span>
                )}

                <p className="mt-2 text-center font-serif text-base italic">{flower.name}</p>
                <p className="mt-1 text-center text-[11px] uppercase tracking-widest text-[#70585b]">
                  per stem
                </p>
                <p className="mt-1 text-center text-base font-bold text-[#990048]">
                  {formatLKR(flower.price_lkr)}
                </p>

                {/* Stepper anchored at bottom */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_QUANTITY",
                        payload: { flower_id: flower.id, quantity: qty - 1 },
                      })
                    }
                    disabled={qty === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(153,0,72,0.12)] text-[#70585b] transition-colors hover:bg-petal-pink hover:text-[#990048] disabled:opacity-40"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">{qty}</span>
                  <button
                    onClick={() =>
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
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#990048] text-white transition-colors hover:bg-[#7a0039]"
                    aria-label="Increase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
