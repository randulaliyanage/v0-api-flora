import type { Flower, Order, DailyCapacity } from "./types"

export const flowers: Flower[] = [
  {
    id: "red-rose",
    name: "Red Rose",
    image_url: "/flowers/red-rose.jpg",
    price_lkr: 120,
    stock_count: 45,
    category: "flower",
    is_active: true,
  },
  {
    id: "pink-peony",
    name: "Pink Peony",
    image_url: "/flowers/pink-peony.jpg",
    price_lkr: 280,
    stock_count: 8,
    category: "flower",
    is_active: true,
  },
  {
    id: "white-lily",
    name: "White Lily",
    image_url: "/flowers/white-lily.jpg",
    price_lkr: 95,
    stock_count: 62,
    category: "flower",
    is_active: true,
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    image_url: "/flowers/eucalyptus.jpg",
    price_lkr: 60,
    stock_count: 30,
    category: "flower",
    is_active: true,
  },
  {
    id: "baby-breath",
    name: "Baby's Breath",
    image_url: "/flowers/baby-breath.jpg",
    price_lkr: 45,
    stock_count: 15,
    category: "flower",
    is_active: true,
  },
  {
    id: "sunflower",
    name: "Sunflower",
    image_url: "/flowers/sunflower.jpg",
    price_lkr: 150,
    stock_count: 22,
    category: "flower",
    is_active: true,
  },
  {
    id: "garden-rose",
    name: "Garden Rose",
    image_url: "/flowers/garden-rose.jpg",
    price_lkr: 190,
    stock_count: 18,
    category: "flower",
    is_active: true,
  },
  {
    id: "lavender",
    name: "Lavender",
    image_url: "/flowers/lavender.jpg",
    price_lkr: 85,
    stock_count: 40,
    category: "flower",
    is_active: true,
  },
]

export function formatLKR(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`
}

export function isLowStock(flower: Flower): boolean {
  return flower.stock_count < 20
}

export const orders: Order[] = [
  {
    id: "FLR-2415",
    customer_id: "u1",
    customer_name: "Nimasha Wickramasinghe",
    customer_phone: "+94 77 412 8855",
    status: "delivered",
    flowers: [
      { flower_id: "red-rose", flower_name: "Red Rose", quantity: 12, price_lkr: 120 },
      { flower_id: "baby-breath", flower_name: "Baby's Breath", quantity: 5, price_lkr: 45 },
    ],
    total_lkr: 1665,
    delivery_type: "delivery",
    delivery_address: "23 Jambugasmulla Mawatha, Nugegoda",
    delivery_distance_km: 6.4,
    delivery_fee_lkr: 488,
    scheduled_date: "2026-04-28",
    scheduled_slot: "afternoon",
    reference_image_url: "/hero-bouquet.jpg",
    created_at: "2026-04-26T10:24:00Z",
  },
  {
    id: "FLR-2418",
    customer_id: "u2",
    customer_name: "Tharushi Senanayake",
    customer_phone: "+94 71 990 3321",
    status: "out_for_delivery",
    flowers: [
      { flower_id: "pink-peony", flower_name: "Pink Peony", quantity: 8, price_lkr: 280 },
      { flower_id: "eucalyptus", flower_name: "Eucalyptus", quantity: 10, price_lkr: 60 },
    ],
    total_lkr: 2840,
    delivery_type: "delivery",
    delivery_address: "118 High Level Road, Maharagama",
    delivery_distance_km: 8.1,
    delivery_fee_lkr: 565,
    scheduled_date: "2026-05-03",
    scheduled_slot: "morning",
    reference_image_url: "/flowers/pink-peony.jpg",
    created_at: "2026-05-02T08:11:00Z",
  },
  {
    id: "FLR-2421",
    customer_id: "u3",
    customer_name: "Kavindi Rajapaksa",
    customer_phone: "+94 76 220 4499",
    status: "arranging",
    flowers: [
      { flower_id: "sunflower", flower_name: "Sunflower", quantity: 6, price_lkr: 150 },
      { flower_id: "white-lily", flower_name: "White Lily", quantity: 4, price_lkr: 95 },
    ],
    total_lkr: 1280,
    delivery_type: "delivery",
    delivery_address: "47 Pannipitiya Road, Battaramulla",
    delivery_distance_km: 11.2,
    delivery_fee_lkr: 704,
    scheduled_date: "2026-05-03",
    scheduled_slot: "afternoon",
    created_at: "2026-05-02T14:52:00Z",
  },
  {
    id: "FLR-2424",
    customer_id: "u4",
    customer_name: "Rasanga Wijesinghe",
    customer_phone: "+94 70 663 0098",
    status: "placed",
    flowers: [
      { flower_id: "red-rose", flower_name: "Red Rose", quantity: 24, price_lkr: 120 },
      { flower_id: "baby-breath", flower_name: "Baby's Breath", quantity: 10, price_lkr: 45 },
      { flower_id: "eucalyptus", flower_name: "Eucalyptus", quantity: 8, price_lkr: 60 },
    ],
    total_lkr: 3810,
    delivery_type: "delivery",
    delivery_address: "76 Kotte Road, Rajagiriya",
    delivery_distance_km: 7.8,
    delivery_fee_lkr: 551,
    scheduled_date: "2026-05-04",
    scheduled_slot: "morning",
    created_at: "2026-05-03T09:02:00Z",
  },
  {
    id: "FLR-2426",
    customer_id: "u5",
    customer_name: "Dilini Edirisinghe",
    customer_phone: "+94 77 884 1267",
    status: "arranging",
    flowers: [
      { flower_id: "pink-peony", flower_name: "Pink Peony", quantity: 15, price_lkr: 280 },
      { flower_id: "white-lily", flower_name: "White Lily", quantity: 8, price_lkr: 95 },
    ],
    total_lkr: 4960,
    delivery_type: "pickup",
    delivery_distance_km: 0,
    delivery_fee_lkr: 0,
    scheduled_date: "2026-05-05",
    scheduled_slot: "evening",
    reference_image_url: "/hero-bouquet.jpg",
    created_at: "2026-05-03T15:30:00Z",
  },
]

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id.toLowerCase() === id.toLowerCase())
}

// Daily capacity for next 30 days
function buildCapacity(): DailyCapacity[] {
  const today = new Date("2026-05-03")
  const result: DailyCapacity[] = []
  const presetLoad = [12, 18, 20, 8, 15, 5, 10, 14, 19, 7, 11, 16, 20, 9]
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    result.push({
      date: iso,
      max_orders: 20,
      current_orders: presetLoad[i % presetLoad.length],
      is_closed: false,
    })
  }
  return result
}

export const dailyCapacity: DailyCapacity[] = buildCapacity()

export function getCapacityForDate(date: string): DailyCapacity | undefined {
  return dailyCapacity.find((c) => c.date === date)
}

export const aiSuggestion = {
  detected: [
    { name: "Pink Peony", flower_id: "pink-peony", quantity: 12 },
    { name: "Eucalyptus", flower_id: "eucalyptus", quantity: 6 },
    { name: "Baby's Breath", flower_id: "baby-breath", quantity: 8 },
  ],
  confidence: 94,
}

export const analytics = {
  totalRevenueLKR: 485750,
  ordersThisMonth: 108,
  avgOrderValueLKR: 4497,
  topFlower: "Red Rose",
  topZone: "Nugegoda",
  returnRate: 0.32,
  ordersLast14Days: [
    { day: "Apr 20", orders: 8 },
    { day: "Apr 21", orders: 11 },
    { day: "Apr 22", orders: 14 },
    { day: "Apr 23", orders: 9 },
    { day: "Apr 24", orders: 17 },
    { day: "Apr 25", orders: 21 },
    { day: "Apr 26", orders: 13 },
    { day: "Apr 27", orders: 10 },
    { day: "Apr 28", orders: 16 },
    { day: "Apr 29", orders: 18 },
    { day: "Apr 30", orders: 12 },
    { day: "May 01", orders: 19 },
    { day: "May 02", orders: 22 },
    { day: "May 03", orders: 15 },
  ],
  revenueTrend: [
    { day: "Apr 20", revenue: 24500 },
    { day: "Apr 21", revenue: 31200 },
    { day: "Apr 22", revenue: 38900 },
    { day: "Apr 23", revenue: 27600 },
    { day: "Apr 24", revenue: 47800 },
    { day: "Apr 25", revenue: 56200 },
    { day: "Apr 26", revenue: 38100 },
    { day: "Apr 27", revenue: 29400 },
    { day: "Apr 28", revenue: 44800 },
    { day: "Apr 29", revenue: 51300 },
    { day: "Apr 30", revenue: 33700 },
    { day: "May 01", revenue: 52900 },
    { day: "May 02", revenue: 61400 },
    { day: "May 03", revenue: 42500 },
  ],
  flowerPopularity: [
    { name: "Red Rose", value: 35, fill: "#990048" },
    { name: "Pink Peony", value: 24, fill: "#b8506a" },
    { name: "White Lily", value: 18, fill: "#d4a5b0" },
    { name: "Eucalyptus", value: 12, fill: "#f8d8db" },
    { name: "Other", value: 11, fill: "#70585b" },
  ],
}

export const STORE_LOCATION = {
  name: "API Flora Studio",
  address: "27 Temple Road, Maharagama, Western Province, Sri Lanka",
  lat: 6.846,
  lng: 79.927,
  image: "/hero-bouquet.jpg", // This uses the main image from your public folder
  github: "https://github.com/randulaliyanage/v0-api-flora"
}

export const DELIVERY_BASE_LKR = 200
export const DELIVERY_PER_KM_LKR = 45

export function calculateDeliveryFee(distanceKm: number): number {
  return Math.round(DELIVERY_BASE_LKR + distanceKm * DELIVERY_PER_KM_LKR)
}
