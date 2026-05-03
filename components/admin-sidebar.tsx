"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutGrid,
  Package,
  Calendar,
  Truck,
  BarChart3,
  LogOut,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

const NAV = [
  { href: "/admin", label: "Orders", icon: LayoutGrid },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/capacity", label: "Capacity", icon: Calendar },
  { href: "/admin/deliveries", label: "Deliveries", icon: Truck },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
      // signOut hard-redirects to "/", but as a fallback push to admin login
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login"
      }
    } catch {
      setSigningOut(false)
    }
  }

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
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
        >
          {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </aside>
  )
}
