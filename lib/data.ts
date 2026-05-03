export interface Product {
  id: string
  name: string
  price: number
  stock: number
  image: string
  category: 'flowers' | 'confections' | 'gifts' | 'balloons'
}

export interface Order {
  id: string
  customer: string
  phone: string
  email: string
  date: string
  status: 'pending' | 'ai-analyzed' | 'arranging' | 'out-for-delivery' | 'delivered'
  items: { productId: string; quantity: number }[]
  deliveryAddress: string
  deliveryFee: number
  referenceImage?: string
  estimatedTime?: string
}

export interface CapacityDay {
  date: string
  orders: number
  maxCapacity: number
}

export const products: Product[] = [
  {
    id: 'red-rose',
    name: 'Red Rose',
    price: 120,
    stock: 45,
    image: '/flowers/red-rose.jpg',
    category: 'flowers',
  },
  {
    id: 'pink-peony',
    name: 'Pink Peony',
    price: 280,
    stock: 8,
    image: '/flowers/pink-peony.jpg',
    category: 'flowers',
  },
  {
    id: 'white-lily',
    name: 'White Lily',
    price: 95,
    stock: 62,
    image: '/flowers/white-lily.jpg',
    category: 'flowers',
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    price: 60,
    stock: 30,
    image: '/flowers/eucalyptus.jpg',
    category: 'flowers',
  },
  {
    id: 'baby-breath',
    name: "Baby's Breath",
    price: 45,
    stock: 15,
    image: '/flowers/baby-breath.jpg',
    category: 'flowers',
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    price: 150,
    stock: 22,
    image: '/flowers/sunflower.jpg',
    category: 'flowers',
  },
]

export const sampleOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Kasun Perera',
    phone: '+94 77 123 4567',
    email: 'kasun.perera@email.com',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { productId: 'red-rose', quantity: 12 },
      { productId: 'baby-breath', quantity: 5 },
    ],
    deliveryAddress: '45 Galle Road, Colombo 03',
    deliveryFee: 350,
    referenceImage: '/references/bouquet-1.jpg',
    estimatedTime: '2:00 PM - 4:00 PM',
  },
  {
    id: 'ORD-2024-002',
    customer: 'Nimali Fernando',
    phone: '+94 71 987 6543',
    email: 'nimali.fernando@email.com',
    date: '2024-01-16',
    status: 'arranging',
    items: [
      { productId: 'pink-peony', quantity: 8 },
      { productId: 'eucalyptus', quantity: 10 },
    ],
    deliveryAddress: '78 Duplication Road, Colombo 04',
    deliveryFee: 400,
    referenceImage: '/references/bouquet-2.jpg',
    estimatedTime: '10:00 AM - 12:00 PM',
  },
  {
    id: 'ORD-2024-003',
    customer: 'Ravindu Silva',
    phone: '+94 76 555 1234',
    email: 'ravindu.silva@email.com',
    date: '2024-01-17',
    status: 'out-for-delivery',
    items: [
      { productId: 'sunflower', quantity: 6 },
      { productId: 'white-lily', quantity: 4 },
    ],
    deliveryAddress: '23 Park Street, Colombo 02',
    deliveryFee: 300,
    estimatedTime: '3:00 PM - 5:00 PM',
  },
  {
    id: 'ORD-2024-004',
    customer: 'Dilini Jayawardena',
    phone: '+94 70 888 9999',
    email: 'dilini.j@email.com',
    date: '2024-01-17',
    status: 'pending',
    items: [
      { productId: 'red-rose', quantity: 24 },
      { productId: 'baby-breath', quantity: 10 },
      { productId: 'eucalyptus', quantity: 8 },
    ],
    deliveryAddress: '156 Baseline Road, Colombo 09',
    deliveryFee: 500,
    estimatedTime: '11:00 AM - 1:00 PM',
  },
  {
    id: 'ORD-2024-005',
    customer: 'Thilini Bandara',
    phone: '+94 77 444 5555',
    email: 'thilini.b@email.com',
    date: '2024-01-18',
    status: 'ai-analyzed',
    items: [
      { productId: 'pink-peony', quantity: 15 },
      { productId: 'white-lily', quantity: 8 },
    ],
    deliveryAddress: '89 Marine Drive, Colombo 06',
    deliveryFee: 450,
    referenceImage: '/references/bouquet-3.jpg',
    estimatedTime: '4:00 PM - 6:00 PM',
  },
]

export const weekCapacity: CapacityDay[] = [
  { date: '2024-01-15', orders: 12, maxCapacity: 20 },
  { date: '2024-01-16', orders: 18, maxCapacity: 20 },
  { date: '2024-01-17', orders: 20, maxCapacity: 20 },
  { date: '2024-01-18', orders: 8, maxCapacity: 20 },
  { date: '2024-01-19', orders: 15, maxCapacity: 20 },
  { date: '2024-01-20', orders: 5, maxCapacity: 20 },
  { date: '2024-01-21', orders: 10, maxCapacity: 20 },
]

export const analyticsData = {
  ordersPerDay: [
    { day: 'Mon', orders: 12 },
    { day: 'Tue', orders: 18 },
    { day: 'Wed', orders: 20 },
    { day: 'Thu', orders: 8 },
    { day: 'Fri', orders: 15 },
    { day: 'Sat', orders: 25 },
    { day: 'Sun', orders: 10 },
  ],
  flowerTypes: [
    { name: 'Red Rose', value: 35, fill: 'var(--chart-1)' },
    { name: 'Pink Peony', value: 25, fill: 'var(--chart-2)' },
    { name: 'White Lily', value: 20, fill: 'var(--chart-3)' },
    { name: 'Sunflower', value: 12, fill: 'var(--chart-4)' },
    { name: 'Others', value: 8, fill: 'var(--chart-5)' },
  ],
  metrics: {
    totalRevenue: 485750,
    ordersThisWeek: 108,
    avgOrderValue: 4497,
  },
}

export const categories = [
  { id: 'flowers', name: 'Flowers', icon: 'flower' },
  { id: 'confections', name: 'Confections', icon: 'candy' },
  { id: 'gifts', name: 'Gifts', icon: 'gift' },
  { id: 'balloons', name: 'Balloons', icon: 'balloon' },
]

export const aiAnalysisResult = {
  detected: [
    { name: 'Peonies', stems: 20 },
    { name: 'Eucalyptus', stems: 5 },
    { name: "Baby's Breath", stems: 10 },
  ],
  confidence: 94,
  suggestedProducts: [
    { productId: 'pink-peony', quantity: 20 },
    { productId: 'eucalyptus', quantity: 5 },
    { productId: 'baby-breath', quantity: 10 },
  ],
}
