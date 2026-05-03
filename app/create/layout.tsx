import type { ReactNode } from "react"
import { OrderProvider } from "@/context/OrderContext"

export default function CreateLayout({ children }: { children: ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>
}
