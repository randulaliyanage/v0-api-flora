"use client"

import { useOrder } from "@/context/OrderContext"
import { Input } from "@/components/ui/input"

export function StepDetails() {
  const { state, dispatch } = useOrder()
  const { customerDetails } = state

  return (
    <div className="space-y-8">
      <div>
        <p className="label-eyebrow mb-3">Step 1 of 5</p>
        <h1 className="font-serif text-3xl italic text-foreground md:text-4xl">
          Tell us about yourself
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          We&apos;ll use these details to confirm your order and reach out for delivery.
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="label-eyebrow mb-2 block">Full name</label>
          <Input
            value={customerDetails.name}
            onChange={(e) => dispatch({ type: "SET_CUSTOMER", payload: { name: e.target.value } })}
            placeholder="Nimasha Wickramasinghe"
            className="h-12 rounded-2xl border-border-subtle bg-white px-5 text-base focus-visible:ring-rose-velvet"
          />
        </div>

        <div>
          <label className="label-eyebrow mb-2 block">Phone number</label>
          <div className="flex h-12 items-center overflow-hidden rounded-2xl border border-border-subtle bg-white">
            <span className="flex h-full items-center border-r border-border-subtle bg-petal-pink px-4 text-sm font-medium text-rose-velvet">
              +94
            </span>
            <input
              value={customerDetails.phone}
              onChange={(e) =>
                dispatch({ type: "SET_CUSTOMER", payload: { phone: e.target.value } })
              }
              placeholder="77 412 8855"
              className="h-full flex-1 bg-transparent px-4 text-base outline-none placeholder:text-text-muted/50"
            />
          </div>
        </div>

        <div>
          <label className="label-eyebrow mb-2 block">Email</label>
          <Input
            type="email"
            value={customerDetails.email}
            onChange={(e) =>
              dispatch({ type: "SET_CUSTOMER", payload: { email: e.target.value } })
            }
            placeholder="nimasha@example.com"
            className="h-12 rounded-2xl border-border-subtle bg-white px-5 text-base focus-visible:ring-rose-velvet"
          />
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Your details are used only for this order. We don&apos;t share or store
        your information beyond delivery confirmation.
      </p>
    </div>
  )
}
