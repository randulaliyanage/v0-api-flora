'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { OrderProgressBar } from '@/components/order-progress-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { sampleOrders, products } from '@/lib/data'
import { Search, MapPin, Clock } from 'lucide-react'

export default function TrackPage() {
  const [orderId, setOrderId] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<typeof sampleOrders[0] | null>(null)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = () => {
    const order = sampleOrders.find(
      (o) => o.id.toLowerCase() === orderId.toLowerCase()
    )
    if (order) {
      setSearchedOrder(order)
      setNotFound(false)
    } else {
      setSearchedOrder(null)
      setNotFound(true)
    }
  }

  const getOrderItems = (order: typeof sampleOrders[0]) => {
    return order.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        name: product?.name || 'Unknown',
        quantity: item.quantity,
        price: product?.price || 0,
      }
    })
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-foreground mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order ID to see the current status of your bouquet
            </p>
          </div>

          {/* Search Box */}
          <Card className="bg-card border border-border-subtle mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <InputGroup className="flex-1">
                  <InputGroupInput
                    placeholder="Enter Order ID (e.g., ORD-2024-001)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-parchment border-border-subtle"
                  />
                  <InputGroupAddon position="left">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                <Button
                  onClick={handleSearch}
                  className="bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground"
                >
                  Track
                </Button>
              </div>
              
              {/* Sample order hint */}
              <p className="text-xs text-muted-foreground mt-3">
                Try: ORD-2024-001, ORD-2024-002, ORD-2024-003
              </p>
            </CardContent>
          </Card>

          {/* Not Found */}
          {notFound && (
            <Card className="bg-card border border-border-subtle mb-8">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No order found with ID &quot;{orderId}&quot;
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check your order ID and try again
                </p>
              </CardContent>
            </Card>
          )}

          {/* Order Found */}
          {searchedOrder && (
            <div className="flex flex-col gap-8">
              {/* Progress Bar */}
              <Card className="bg-card border border-border-subtle">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif text-xl">Order Status</CardTitle>
                    <span className="text-sm text-muted-foreground">{searchedOrder.id}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <OrderProgressBar status={searchedOrder.status} />
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="bg-card border border-border-subtle">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {/* Items */}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-sans">
                        Items
                      </p>
                      <ul className="space-y-2">
                        {getOrderItems(searchedOrder).map((item) => (
                          <li key={item.name} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="text-muted-foreground">
                              LKR {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Delivery Info */}
                    <div className="border-t border-border-subtle pt-6">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-sans">
                        Delivery Information
                      </p>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-rose-velvet flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-foreground">{searchedOrder.deliveryAddress}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Delivery fee: LKR {searchedOrder.deliveryFee}
                            </p>
                          </div>
                        </div>
                        {searchedOrder.estimatedTime && (
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-rose-velvet flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-foreground">Estimated Delivery</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {searchedOrder.estimatedTime}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="border-t border-border-subtle pt-6">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-sans">
                        Customer
                      </p>
                      <p className="text-sm text-foreground">{searchedOrder.customer}</p>
                      <p className="text-xs text-muted-foreground mt-1">{searchedOrder.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
