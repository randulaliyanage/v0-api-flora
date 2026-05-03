import type { ReactNode } from "react"

// OrderProvider is now in the root layout so the cart syncs across every page.
export default function CreateLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
