export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: "customer" | "admin"
  created_at: string
}

export type FlowerCategory = "flower" | "confection" | "gift" | "balloon"

export interface Flower {
  id: string
  name: string
  image_url: string
  price_lkr: number
  stock_count: number
  category: FlowerCategory
  is_active: boolean
}

export interface OrderItem {
  flower_id: string
  flower_name: string
  flower_image?: string
  quantity: number
  price_lkr: number
}

export type OrderStatus =
  | "placed"
  | "ai_analyzed"
  | "arranging"
  | "out_for_delivery"
  | "delivered"

export type DeliveryType = "pickup" | "delivery"

export interface Order {
  id: string
  customer_id: string
  customer_name: string
  customer_phone: string
  status: OrderStatus
  flowers: OrderItem[]
  total_lkr: number
  delivery_type: DeliveryType
  delivery_address?: string
  delivery_lat?: number
  delivery_lng?: number
  delivery_distance_km?: number
  delivery_fee_lkr: number
  scheduled_date: string
  scheduled_slot?: "morning" | "afternoon" | "evening"
  reference_image_url?: string
  created_at: string
}

export interface DailyCapacity {
  date: string
  max_orders: number
  current_orders: number
  is_closed?: boolean
}
