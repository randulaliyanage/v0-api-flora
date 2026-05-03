import { AlertTriangle } from "lucide-react"

export function LowStockBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
      <AlertTriangle className="h-3 w-3" />
      Low Stock
    </span>
  )
}
