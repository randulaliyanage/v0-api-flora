"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Package,
  Calendar,
  Truck,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Orders", icon: LayoutGrid },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/capacity", label: "Capacity", icon: Calendar },
  { href: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col bg-rose-velvet text-white md:flex md:fixed md:inset-y-0 md:left-0">
      <div className="px-6 py-8">
        <Link href="/admin" className="block">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">API Flora</p>
          <h2 className="font-serif text-2xl italic">Admin Portal</h2>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-white text-rose-velvet"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  )
}
