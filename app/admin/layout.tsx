import type { ReactNode } from "react"
import { headers } from "next/headers"
import { AdminSidebar } from "@/components/admin-sidebar"

const TITLES: Record<string, string> = {
  "/admin": "Orders",
  "/admin/inventory": "Inventory",
  "/admin/capacity": "Capacity",
  "/admin/deliveries": "Deliveries",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const h = await headers()
  // Avoid sidebar on /admin/login
  const path = h.get("x-pathname") ?? ""
  if (path === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-parchment">
      <AdminSidebar />
      <div className="md:ml-[260px]">
        <AdminTopBar />
        <main className="px-4 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  )
}

function AdminTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border-subtle bg-parchment/90 px-4 py-4 backdrop-blur-xl md:px-10">
      <div>
        <p className="label-eyebrow">API Flora · Admin</p>
        <h1 className="font-serif text-2xl italic text-foreground">Studio Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden rounded-full bg-petal-pink px-3 py-1 text-xs font-medium text-rose-velvet md:inline-flex">
          Logged in as Admin
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-velvet font-serif text-sm text-white">
          AF
        </span>
      </div>
    </header>
  )
}
