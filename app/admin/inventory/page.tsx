"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Package } from "lucide-react"
import { flowers as initialFlowers, formatLKR, isLowStock } from "@/lib/mock-data"
import type { Flower } from "@/lib/types"
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

export default function AdminInventoryPage() {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<Flower>>({
    name: "",
    price_lkr: 0,
    stock_count: 0,
    category: "flower",
    is_active: true,
    image_url: "/placeholder.svg",
  })

  const incrementStock = (id: string, delta: number) => {
    setFlowers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, stock_count: Math.max(0, f.stock_count + delta) } : f)),
    )
  }

  const toggleActive = (id: string) => {
    setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, is_active: !f.is_active } : f)))
  }

  const addFlower = () => {
    if (!draft.name || !draft.price_lkr) return
    const id = draft.name!.toLowerCase().replace(/\s+/g, "-")
    setFlowers((prev) => [
      ...prev,
      {
        id,
        name: draft.name!,
        price_lkr: Number(draft.price_lkr),
        stock_count: Number(draft.stock_count ?? 0),
        category: (draft.category as Flower["category"]) ?? "flower",
        is_active: true,
        image_url: "/placeholder.svg",
      },
    ])
    setOpen(false)
    setDraft({ name: "", price_lkr: 0, stock_count: 0, category: "flower", is_active: true, image_url: "/placeholder.svg" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-eyebrow mb-1">Inventory</p>
          <h2 className="font-serif text-2xl italic text-foreground">Stems & Stock</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add Flower
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
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
                    onChange={(e) => setDraft({ ...draft, category: e.target.value as Flower["category"] })}
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
                    value={draft.price_lkr}
                    onChange={(e) => setDraft({ ...draft, price_lkr: Number(e.target.value) })}
                    className="h-11 rounded-2xl border-border-subtle"
                  />
                </div>
              </div>
              <div>
                <label className="label-eyebrow mb-2 block">Initial stock</label>
                <Input
                  type="number"
                  value={draft.stock_count}
                  onChange={(e) => setDraft({ ...draft, stock_count: Number(e.target.value) })}
                  className="h-11 rounded-2xl border-border-subtle"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-full">
                Cancel
              </Button>
              <Button onClick={addFlower} className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover">
                Add Flower
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-white">
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                {["Flower", "Category", "Price", "Stock Level", "Status", "Restock"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {flowers.map((f) => {
                const low = isLowStock(f)
                const pct = Math.min(100, (f.stock_count / 60) * 100)
                return (
                  <tr key={f.id} className="border-b border-border-subtle hover:bg-parchment">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-petal-pink">
                          <Image src={f.image_url} alt={f.name} fill sizes="48px" className="object-cover" />
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
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatLKR(f.price_lkr)}</td>
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
                        <span className="text-xs font-medium tabular-nums text-foreground">{f.stock_count}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(f.id)}
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
                        <button
                          onClick={() => incrementStock(f.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:bg-petal-pink hover:text-rose-velvet"
                        >
                          −
                        </button>
                        <button
                          onClick={() => incrementStock(f.id, 5)}
                          className="rounded-full bg-rose-velvet px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-velvet-hover"
                        >
                          +5 stems
                        </button>
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
            return (
              <div key={f.id} className="rounded-2xl bg-parchment p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-petal-pink">
                    <Image src={f.image_url} alt={f.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-text-muted">{formatLKR(f.price_lkr)}/stem</p>
                  </div>
                  {low && <LowStockBadge />}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                    <div className="h-full rounded-full bg-rose-velvet" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-medium tabular-nums text-foreground">{f.stock_count}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => toggleActive(f.id)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      f.is_active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-surface-container text-text-muted",
                    )}
                  >
                    {f.is_active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => incrementStock(f.id, 5)}
                    className="rounded-full bg-rose-velvet px-3 py-1 text-xs font-medium text-white"
                  >
                    + 5 stems
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {flowers.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Package className="h-8 w-8 text-text-muted" />
            <p className="text-sm text-text-muted">No flowers yet. Add your first stem.</p>
          </div>
        )}
      </div>
    </div>
  )
}
