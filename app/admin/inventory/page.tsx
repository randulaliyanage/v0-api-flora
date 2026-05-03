"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Package, Sparkles, Loader2, Check } from "lucide-react"
import { formatLKR, isLowStock } from "@/lib/mock-data"
import { useFlowers } from "@/lib/data/use-flowers"
import { createClient } from "@/lib/supabase/client"
import type { Flower, FlowerCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LowStockBadge } from "@/components/low-stock-badge"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DraftFlower {
  name: string
  price_lkr: number
  stock_count: number
  category: FlowerCategory
  image_url: string | null
}

const EMPTY_DRAFT: DraftFlower = {
  name: "",
  price_lkr: 0,
  stock_count: 0,
  category: "flower",
  image_url: null,
}

export default function AdminInventoryPage() {
  const { flowers, isLoading, error, refresh } = useFlowers()

  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DraftFlower>(EMPTY_DRAFT)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Per-row stock editing state. Maps flower id -> the in-flight value.
  const [stockDraft, setStockDraft] = useState<Record<string, number>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const supabase = createClient()

  const generateImage = async () => {
    if (!draft.name.trim()) {
      setGenError("Enter a flower name first")
      return
    }
    setGenError(null)
    setGenerating(true)
    try {
      const res = await fetch("/api/generate-flower-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: draft.name }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to generate image")
      setDraft((d) => ({ ...d, image_url: json.image_url }))
    } catch (err) {
      setGenError((err as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  const addFlower = async () => {
    if (!draft.name.trim() || draft.price_lkr <= 0) return
    setSaving(true)
    const id =
      draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6)

    const { error: insertError } = await supabase.from("flowers").insert({
      id,
      name: draft.name.trim(),
      price_lkr: draft.price_lkr,
      stock_count: draft.stock_count,
      category: draft.category,
      is_active: true,
      image_url: draft.image_url ?? "/placeholder.svg",
    })
    setSaving(false)
    if (insertError) {
      setGenError(insertError.message)
      return
    }
    await refresh()
    setOpen(false)
    setDraft(EMPTY_DRAFT)
    setGenError(null)
  }

  const setStockValue = (id: string, value: number) => {
    setStockDraft((prev) => ({ ...prev, [id]: Math.max(0, value) }))
  }

  const saveStock = async (flower: Flower) => {
    const next = stockDraft[flower.id]
    if (next === undefined || next === flower.stock_count) return
    setSavingId(flower.id)
    const { error: updateError } = await supabase
      .from("flowers")
      .update({ stock_count: next })
      .eq("id", flower.id)
    setSavingId(null)
    if (updateError) return
    setStockDraft((prev) => {
      const copy = { ...prev }
      delete copy[flower.id]
      return copy
    })
    await refresh()
  }

  const toggleActive = async (flower: Flower) => {
    await supabase
      .from("flowers")
      .update({ is_active: !flower.is_active })
      .eq("id", flower.id)
    await refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-eyebrow mb-1">Inventory</p>
          <h2 className="font-serif text-2xl italic text-foreground">Stems & Stock</h2>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o)
            if (!o) {
              setDraft(EMPTY_DRAFT)
              setGenError(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add Flower
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl italic">Add a new flower</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="label-eyebrow mb-2 block">Name</label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Pink Carnation"
                  className="h-11 rounded-2xl border-border-subtle"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-eyebrow mb-2 block">Category</label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value as FlowerCategory })
                    }
                    className="h-11 w-full rounded-2xl border border-border-subtle bg-white px-4 text-sm outline-none focus:border-rose-velvet"
                  >
                    <option value="flower">Flower</option>
                    <option value="confection">Confection</option>
                    <option value="gift">Gift</option>
                    <option value="balloon">Balloon</option>
                  </select>
                </div>
                <div>
                  <label className="label-eyebrow mb-2 block">Price LKR / stem</label>
                  <Input
                    type="number"
                    min={0}
                    value={draft.price_lkr || ""}
                    onChange={(e) =>
                      setDraft({ ...draft, price_lkr: Number(e.target.value) })
                    }
                    className="h-11 rounded-2xl border-border-subtle"
                  />
                </div>
              </div>
              <div>
                <label className="label-eyebrow mb-2 block">Initial stock</label>
                <Input
                  type="number"
                  min={0}
                  value={draft.stock_count || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, stock_count: Number(e.target.value) })
                  }
                  className="h-11 rounded-2xl border-border-subtle"
                />
              </div>

              {/* AI image preview */}
              <div>
                <label className="label-eyebrow mb-2 block">Image</label>
                <div className="rounded-2xl border border-dashed border-rose-velvet/40 bg-petal-pink/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-petal-pink/60">
                      {draft.image_url ? (
                        <Image
                          src={draft.image_url}
                          alt={draft.name || "Generated flower"}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-rose-velvet/60">
                          <Sparkles className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {draft.image_url ? "Looks good?" : "AI will paint your flower"}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        Auto-generated from the flower name with our AI image model.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={generateImage}
                      disabled={generating || !draft.name.trim()}
                      size="sm"
                      className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
                    >
                      {generating ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Generating
                        </span>
                      ) : draft.image_url ? (
                        "Regenerate"
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3" />
                          Generate
                        </span>
                      )}
                    </Button>
                  </div>
                  {genError && (
                    <p className="mt-2 text-xs text-amber-700">{genError}</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-full"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={addFlower}
                disabled={saving || !draft.name.trim() || draft.price_lkr <= 0}
                className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
              >
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </span>
                ) : (
                  "Add Flower"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          Failed to load inventory: {(error as Error).message}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white">
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                {["Flower", "Category", "Price", "Stock Level", "Status", "Update Stock"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[11px] uppercase tracking-wider text-text-muted"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {flowers.map((f) => {
                const low = isLowStock(f)
                const pct = Math.min(100, (f.stock_count / 60) * 100)
                const stockValue = stockDraft[f.id] ?? f.stock_count
                const dirty = stockValue !== f.stock_count
                return (
                  <tr key={f.id} className="group border-b border-border-subtle hover:bg-parchment">
                    <td className="relative px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0">
                          <div className="absolute inset-x-0 -top-3 mx-auto h-16 w-16 rounded-full bg-petal-pink/70 blur-md transition-opacity group-hover:opacity-100 opacity-80" />
                          <div className="absolute -top-3 left-1/2 h-16 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-petal-pink ring-4 ring-white shadow-[0_8px_20px_-8px_rgba(153,0,72,0.35)]">
                            <Image
                              src={f.image_url}
                              alt={f.name}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              unoptimized={f.image_url.startsWith("data:")}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{f.name}</p>
                          {low && (
                            <div className="mt-1">
                              <LowStockBadge />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-petal-pink/60 px-3 py-1 text-xs font-medium capitalize text-rose-velvet">
                        {f.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {formatLKR(f.price_lkr)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2 w-32 overflow-hidden rounded-full bg-surface-container",
                            low && "ring-1 ring-amber-400",
                          )}
                        >
                          <div
                            className="h-full rounded-full bg-rose-velvet transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums text-foreground">
                          {f.stock_count}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => void toggleActive(f)}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          f.is_active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-surface-container text-text-muted hover:bg-border-subtle",
                        )}
                      >
                        {f.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={stockValue}
                          onChange={(e) =>
                            setStockValue(f.id, Number(e.target.value))
                          }
                          className="h-9 w-20 rounded-full border-border-subtle text-center text-sm tabular-nums"
                        />
                        <Button
                          size="sm"
                          onClick={() => void saveStock(f)}
                          disabled={!dirty || savingId === f.id}
                          className={cn(
                            "h-9 rounded-full px-3 text-xs",
                            dirty
                              ? "bg-rose-velvet text-white hover:bg-rose-velvet-hover"
                              : "bg-surface-container text-text-muted",
                          )}
                        >
                          {savingId === f.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : dirty ? (
                            "Update"
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="space-y-3 p-4 md:hidden">
          {flowers.map((f) => {
            const low = isLowStock(f)
            const pct = Math.min(100, (f.stock_count / 60) * 100)
            const stockValue = stockDraft[f.id] ?? f.stock_count
            const dirty = stockValue !== f.stock_count
            return (
              <div key={f.id} className="relative rounded-2xl bg-parchment p-4 pt-8">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0">
                    <div className="absolute -top-6 left-1/2 h-16 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-petal-pink ring-4 ring-white shadow-[0_8px_20px_-8px_rgba(153,0,72,0.35)]">
                      <Image
                        src={f.image_url}
                        alt={f.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized={f.image_url.startsWith("data:")}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-text-muted">{formatLKR(f.price_lkr)}/stem</p>
                  </div>
                  {low && <LowStockBadge />}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full rounded-full bg-rose-velvet"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums text-foreground">
                    {f.stock_count}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => void toggleActive(f)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      f.is_active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-surface-container text-text-muted",
                    )}
                  >
                    {f.is_active ? "Active" : "Inactive"}
                  </button>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={stockValue}
                      onChange={(e) => setStockValue(f.id, Number(e.target.value))}
                      className="h-9 w-20 rounded-full border-border-subtle text-center text-sm tabular-nums"
                    />
                    <Button
                      size="sm"
                      onClick={() => void saveStock(f)}
                      disabled={!dirty || savingId === f.id}
                      className={cn(
                        "h-9 rounded-full px-3 text-xs",
                        dirty
                          ? "bg-rose-velvet text-white hover:bg-rose-velvet-hover"
                          : "bg-surface-container text-text-muted",
                      )}
                    >
                      {savingId === f.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : dirty ? (
                        "Update"
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!isLoading && flowers.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Package className="h-8 w-8 text-text-muted" />
            <p className="text-sm text-text-muted">No flowers yet. Add your first stem.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16 text-sm text-text-muted">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading inventory…
          </div>
        )}
      </div>
    </div>
  )
}
