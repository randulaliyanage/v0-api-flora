'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { sampleOrders, products, weekCapacity, analyticsData } from '@/lib/data'
import {
  ClipboardList,
  Package,
  Calendar,
  Truck,
  BarChart3,
  ChevronDown,
  ChevronUp,
  MapPin,
  Plus,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Tab = 'orders' | 'inventory' | 'capacity' | 'deliveries' | 'analytics'

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'capacity', label: 'Capacity', icon: Calendar },
  { id: 'deliveries', label: 'Deliveries', icon: Truck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'ai-analyzed': 'bg-blue-100 text-blue-800 border-blue-200',
  arranging: 'bg-rose-velvet/10 text-rose-velvet border-rose-velvet/20',
  'out-for-delivery': 'bg-green-100 text-green-800 border-green-200',
  delivered: 'bg-gray-100 text-gray-800 border-gray-200',
}

const chartConfig = {
  orders: {
    label: 'Orders',
    color: 'var(--chart-1)',
  },
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [maxCapacity, setMaxCapacity] = useState(20)
  const [inventory, setInventory] = useState(products)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newFlowerForm, setNewFlowerForm] = useState({
    name: '',
    price: '',
    stock: '',
  })

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const updateStock = (productId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    )
  }

  return (
    <div className="min-h-screen bg-parchment flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-card p-2 rounded-lg border border-border-subtle"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border-subtle flex flex-col transform transition-transform lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <Link href="/" className="font-serif italic text-2xl text-foreground">
            API Flora
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-rose-velvet text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Admin Info */}
        <div className="p-4 border-t border-border-subtle">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm text-foreground font-medium">Admin</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="font-serif text-3xl text-foreground mb-8">Orders</h1>
              <Card className="bg-card border border-border-subtle overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border-subtle">
                      <TableHead className="text-xs uppercase tracking-widest">Order ID</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest">Customer</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest">Status</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleOrders.map((order) => (
                      <>
                        <TableRow key={order.id} className="border-border-subtle">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{order.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[order.status]}>
                              {order.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleOrderExpand(order.id)}
                            >
                              {expandedOrder === order.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedOrder === order.id && (
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={5}>
                              <div className="flex flex-col md:flex-row gap-4 p-4">
                                {order.referenceImage && (
                                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">Ref Image</span>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-rose-velvet mt-0.5" />
                                  <div>
                                    <p className="text-sm text-foreground">{order.deliveryAddress}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {order.estimatedTime}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-serif text-3xl text-foreground">Inventory</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Flower
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl">Add New Flower</DialogTitle>
                    </DialogHeader>
                    <FieldGroup className="mt-4">
                      <Field>
                        <FieldLabel>Flower Name</FieldLabel>
                        <Input
                          placeholder="e.g., Orchid"
                          value={newFlowerForm.name}
                          onChange={(e) => setNewFlowerForm({ ...newFlowerForm, name: e.target.value })}
                          className="bg-parchment border-border-subtle"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Price per Stem (LKR)</FieldLabel>
                        <Input
                          type="number"
                          placeholder="e.g., 200"
                          value={newFlowerForm.price}
                          onChange={(e) => setNewFlowerForm({ ...newFlowerForm, price: e.target.value })}
                          className="bg-parchment border-border-subtle"
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Initial Stock</FieldLabel>
                        <Input
                          type="number"
                          placeholder="e.g., 50"
                          value={newFlowerForm.stock}
                          onChange={(e) => setNewFlowerForm({ ...newFlowerForm, stock: e.target.value })}
                          className="bg-parchment border-border-subtle"
                        />
                      </Field>
                      <Button className="w-full bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground mt-2">
                        Add Flower
                      </Button>
                    </FieldGroup>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="bg-card border border-border-subtle overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border-subtle">
                      <TableHead className="text-xs uppercase tracking-widest">Flower</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest hidden md:table-cell">Price</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest">Stock Level</TableHead>
                      <TableHead className="text-xs uppercase tracking-widest text-right">Restock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.filter(p => p.category === 'flowers').map((product) => {
                      const stockPercent = (product.stock / 100) * 100
                      const isLow = product.stock < 20

                      return (
                        <TableRow key={product.id} className="border-border-subtle">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            LKR {product.price}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Progress
                                value={stockPercent}
                                className={cn(
                                  "w-20 h-2",
                                  isLow && "[&>div]:bg-red-500"
                                )}
                              />
                              <span className={cn(
                                "text-sm",
                                isLow ? "text-red-600" : "text-muted-foreground"
                              )}>
                                {product.stock}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Input
                                type="number"
                                placeholder="Qty"
                                className="w-20 bg-parchment border-border-subtle text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const value = parseInt((e.target as HTMLInputElement).value)
                                    if (!isNaN(value)) {
                                      updateStock(product.id, product.stock + value)
                                      ;(e.target as HTMLInputElement).value = ''
                                    }
                                  }
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Capacity Tab */}
          {activeTab === 'capacity' && (
            <div>
              <h1 className="font-serif text-3xl text-foreground mb-8">Capacity Management</h1>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Max Capacity Slider */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-sans font-normal">
                      Max Orders Per Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-8">
                      <span className="font-serif text-7xl text-foreground">{maxCapacity}</span>
                    </div>
                    <Slider
                      value={[maxCapacity]}
                      onValueChange={(value) => setMaxCapacity(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      className="[&>span:first-child]:bg-rose-velvet/20 [&_[role=slider]]:bg-rose-velvet [&_[role=slider]]:border-rose-velvet"
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Week View */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-sans font-normal">
                      This Week
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {weekCapacity.map((day) => {
                        const percent = (day.orders / maxCapacity) * 100
                        const isFull = day.orders >= maxCapacity
                        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })

                        return (
                          <div key={day.date} className="flex items-center gap-4">
                            <span className="w-10 text-sm text-muted-foreground">{dayName}</span>
                            <Progress
                              value={Math.min(percent, 100)}
                              className={cn(
                                "flex-1 h-3",
                                isFull && "[&>div]:bg-red-500"
                              )}
                            />
                            <span className={cn(
                              "text-sm w-12 text-right",
                              isFull ? "text-red-600" : "text-muted-foreground"
                            )}>
                              {day.orders}/{maxCapacity}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Deliveries Tab */}
          {activeTab === 'deliveries' && (
            <div>
              <h1 className="font-serif text-3xl text-foreground mb-8">Deliveries</h1>

              <div className="grid gap-4">
                {sampleOrders
                  .filter((o) => o.status === 'out-for-delivery' || o.status === 'arranging')
                  .map((order) => (
                    <Card key={order.id} className="bg-card border border-border-subtle">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-velvet/10 flex items-center justify-center flex-shrink-0">
                              <Truck className="w-5 h-5 text-rose-velvet" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{order.customer}</p>
                              <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                              <p className="text-xs text-muted-foreground mt-1">{order.estimatedTime}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={statusColors[order.status]}>
                            {order.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h1 className="font-serif text-3xl text-foreground mb-8">Analytics</h1>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-card border border-border-subtle">
                  <CardContent className="pt-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                      Total Revenue
                    </p>
                    <p className="font-serif text-3xl text-foreground mt-2">
                      LKR {analyticsData.metrics.totalRevenue.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border-subtle">
                  <CardContent className="pt-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                      Orders This Week
                    </p>
                    <p className="font-serif text-3xl text-foreground mt-2">
                      {analyticsData.metrics.ordersThisWeek}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border-subtle">
                  <CardContent className="pt-6">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                      Avg Order Value
                    </p>
                    <p className="font-serif text-3xl text-foreground mt-2">
                      LKR {analyticsData.metrics.avgOrderValue.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Orders Per Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <BarChart data={analyticsData.ordersPerDay}>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="orders" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Most Ordered Flowers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-64 w-full">
                      <PieChart>
                        <Pie
                          data={analyticsData.flowerTypes}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {analyticsData.flowerTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
