"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { StepIndicator } from "@/components/step-indicator"
import { CartDrawer } from "@/components/cart-drawer"
import { Button } from "@/components/ui/button"
import { useOrder, type CheckoutStep } from "@/context/OrderContext"
import { StepDetails } from "./_steps/step-details"
import { StepBouquet } from "./_steps/step-bouquet"
import { StepFulfillment } from "./_steps/step-fulfillment"
import { StepSchedule } from "./_steps/step-schedule"
import { StepPayment } from "./_steps/step-payment"

const STEPS = [
  { label: "Details" },
  { label: "Bouquet" },
  { label: "Fulfillment" },
  { label: "Schedule" },
  { label: "Payment" },
]

export default function CreatePage() {
  const { state, dispatch, cartCount } = useOrder()

  const next = () => {
    const n = Math.min(5, state.step + 1) as CheckoutStep
    dispatch({ type: "SET_STEP", payload: n })
  }
  const back = () => {
    const n = Math.max(1, state.step - 1) as CheckoutStep
    dispatch({ type: "SET_STEP", payload: n })
  }

  const canContinue = (() => {
    switch (state.step) {
      case 1:
        return Boolean(
          state.customerDetails.name &&
            state.customerDetails.phone &&
            state.customerDetails.email,
        )
      case 2:
        return state.cart.length > 0
      case 3:
        return state.fulfillmentType === "pickup" || Boolean(state.deliveryAddress)
      case 4:
        return Boolean(state.scheduledDate && state.scheduledSlot)
      case 5:
        return false
      default:
        return false
    }
  })()

  return (
    <div className="min-h-screen bg-parchment pb-32 md:pb-0">
      <Navbar cartCount={cartCount} />

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-10">
          <StepIndicator
            steps={STEPS}
            current={state.step}
            onSelect={(s) => dispatch({ type: "SET_STEP", payload: s as CheckoutStep })}
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-border-subtle bg-white p-6 md:p-10">
            {state.step === 1 && <StepDetails />}
            {state.step === 2 && <StepBouquet />}
            {state.step === 3 && <StepFulfillment />}
            {state.step === 4 && <StepSchedule />}
            {state.step === 5 && <StepPayment />}

            {/* Desktop nav */}
            {state.step < 5 && (
              <div className="mt-10 hidden items-center justify-between border-t border-border-subtle pt-6 md:flex">
                <Button
                  variant="ghost"
                  onClick={back}
                  disabled={state.step === 1}
                  className="rounded-full text-text-muted hover:text-rose-velvet"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={next}
                  disabled={!canContinue}
                  className="rounded-full bg-rose-velvet px-8 text-white hover:bg-rose-velvet-hover"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          <div className="hidden lg:block">
            <CartDrawer />
          </div>
        </div>
      </main>

      {/* Mobile fixed footer */}
      {state.step < 5 && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-3 border-t border-border-subtle bg-parchment p-4 md:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
        >
          <Button
            variant="outline"
            onClick={back}
            disabled={state.step === 1}
            className="rounded-full border-border-subtle bg-white text-foreground"
          >
            Back
          </Button>
          <Button
            onClick={next}
            disabled={!canContinue}
            className="rounded-full bg-rose-velvet text-white hover:bg-rose-velvet-hover"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  )
}
