"use client"

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react"
import type { OrderItem, DeliveryType } from "@/lib/types"

export type CheckoutStep = 1 | 2 | 3 | 4 | 5

export interface CustomerDetails {
  name: string
  phone: string
  email: string
}

export interface OrderState {
  step: CheckoutStep
  customerDetails: CustomerDetails
  referenceImageUrl: string | null
  aiSuggestions: OrderItem[]
  cart: OrderItem[]
  fulfillmentType: DeliveryType
  deliveryAddress: string
  deliveryDistanceKm: number
  deliveryFee: number
  scheduledDate: string | null
  scheduledSlot: "morning" | "afternoon" | "evening" | null
  paymentStatus: "idle" | "pending" | "success" | "failed"
}

const initialState: OrderState = {
  step: 1,
  customerDetails: { name: "", phone: "", email: "" },
  referenceImageUrl: null,
  aiSuggestions: [],
  cart: [],
  fulfillmentType: "delivery",
  deliveryAddress: "",
  deliveryDistanceKm: 0,
  deliveryFee: 0,
  scheduledDate: null,
  scheduledSlot: null,
  paymentStatus: "idle",
}

type Action =
  | { type: "SET_STEP"; payload: CheckoutStep }
  | { type: "SET_CUSTOMER"; payload: Partial<CustomerDetails> }
  | { type: "SET_IMAGE"; payload: string | null }
  | { type: "SET_AI_SUGGESTIONS"; payload: OrderItem[] }
  | { type: "ACCEPT_AI_SUGGESTIONS" }
  | { type: "ADD_TO_CART"; payload: OrderItem }
  | { type: "REMOVE_FROM_CART"; payload: { flower_id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { flower_id: string; quantity: number } }
  | { type: "SET_FULFILLMENT"; payload: { type: DeliveryType; address?: string; distanceKm?: number; fee?: number } }
  | { type: "SET_DATE"; payload: { date: string | null; slot?: "morning" | "afternoon" | "evening" | null } }
  | { type: "SET_PAYMENT_STATUS"; payload: OrderState["paymentStatus"] }
  | { type: "RESET_ORDER" }

function reducer(state: OrderState, action: Action): OrderState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload }
    case "SET_CUSTOMER":
      return { ...state, customerDetails: { ...state.customerDetails, ...action.payload } }
    case "SET_IMAGE":
      return { ...state, referenceImageUrl: action.payload }
    case "SET_AI_SUGGESTIONS":
      return { ...state, aiSuggestions: action.payload }
    case "ACCEPT_AI_SUGGESTIONS": {
      // Merge AI suggestions into cart
      const merged = [...state.cart]
      for (const item of state.aiSuggestions) {
        const existing = merged.find((c) => c.flower_id === item.flower_id)
        if (existing) existing.quantity += item.quantity
        else merged.push({ ...item })
      }
      return { ...state, cart: merged }
    }
    case "ADD_TO_CART": {
      const existing = state.cart.find((c) => c.flower_id === action.payload.flower_id)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((c) =>
            c.flower_id === action.payload.flower_id
              ? { ...c, quantity: c.quantity + action.payload.quantity }
              : c,
          ),
        }
      }
      return { ...state, cart: [...state.cart, action.payload] }
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((c) => c.flower_id !== action.payload.flower_id) }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter((c) => c.flower_id !== action.payload.flower_id) }
      }
      return {
        ...state,
        cart: state.cart.map((c) =>
          c.flower_id === action.payload.flower_id ? { ...c, quantity: action.payload.quantity } : c,
        ),
      }
    }
    case "SET_FULFILLMENT":
      return {
        ...state,
        fulfillmentType: action.payload.type,
        deliveryAddress: action.payload.address ?? state.deliveryAddress,
        deliveryDistanceKm: action.payload.distanceKm ?? state.deliveryDistanceKm,
        deliveryFee: action.payload.type === "pickup" ? 0 : action.payload.fee ?? state.deliveryFee,
      }
    case "SET_DATE":
      return {
        ...state,
        scheduledDate: action.payload.date,
        scheduledSlot: action.payload.slot ?? state.scheduledSlot,
      }
    case "SET_PAYMENT_STATUS":
      return { ...state, paymentStatus: action.payload }
    case "RESET_ORDER":
      return initialState
    default:
      return state
  }
}

interface OrderContextValue {
  state: OrderState
  dispatch: Dispatch<Action>
  cartSubtotal: number
  cartCount: number
  grandTotal: number
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const cartSubtotal = state.cart.reduce((sum, item) => sum + item.price_lkr * item.quantity, 0)
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)
  const grandTotal = cartSubtotal + state.deliveryFee
  return (
    <OrderContext.Provider value={{ state, dispatch, cartSubtotal, cartCount, grandTotal }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error("useOrder must be used within OrderProvider")
  return ctx
}
