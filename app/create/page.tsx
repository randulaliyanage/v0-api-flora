'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { StepIndicator } from '@/components/step-indicator'
import { AIInspectionResult } from '@/components/ai-inspection-result'
import { CapacityCalendar } from '@/components/capacity-calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { products, aiAnalysisResult } from '@/lib/data'
import { Upload, MapPin, Minus, Plus, Truck, Store, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { label: 'Your Details' },
  { label: 'Build Bouquet' },
  { label: 'Fulfillment' },
]

// Full capacity dates (mocked)
const fullCapacityDates = [
  new Date(2024, 0, 17),
  new Date(2024, 0, 20),
  new Date(2024, 0, 25),
]

interface CartItem {
  productId: string
  quantity: number
}

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [aiAccepted, setAiAccepted] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [summaryOpen, setSummaryOpen] = useState(false)

  const flowerProducts = products.filter((p) => p.category === 'flowers')

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedImage(url)
    }
  }, [])

  const handleAcceptAI = useCallback(() => {
    setAiAccepted(true)
    setCart(aiAnalysisResult.suggestedProducts)
  }, [])

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        const newQty = existing.quantity + delta
        if (newQty <= 0) {
          return prev.filter((item) => item.productId !== productId)
        }
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        )
      }
      if (delta > 0) {
        return [...prev, { productId, quantity: delta }]
      }
      return prev
    })
  }

  const getProductQuantity = (productId: string) => {
    return cart.find((item) => item.productId === productId)?.quantity || 0
  }

  const calculateTotal = () => {
    let subtotal = cart.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId)
      return acc + (product?.price || 0) * item.quantity
    }, 0)
    const deliveryFee = fulfillmentType === 'delivery' ? 450 : 0
    return { subtotal, deliveryFee, total: subtotal + deliveryFee }
  }

  const { subtotal, deliveryFee, total } = calculateTotal()

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.name && formData.phone && formData.email
    }
    if (currentStep === 1) {
      return cart.length > 0
    }
    if (currentStep === 2) {
      return selectedDate && (fulfillmentType === 'pickup' || deliveryAddress)
    }
    return true
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} />

      <div className="container mx-auto px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator steps={steps} current={currentStep} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Your Details */}
            {currentStep === 0 && (
              <Card className="bg-card border border-border-subtle">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Your Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Full Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-parchment border-border-subtle focus:ring-rose-velvet focus:border-rose-velvet"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+94 7X XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-parchment border-border-subtle focus:ring-rose-velvet focus:border-rose-velvet"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-parchment border-border-subtle focus:ring-rose-velvet focus:border-rose-velvet"
                      />
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>
            )}

            {/* Step 2: AI Inspiration + Inventory */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-8">
                {/* Upload Zone */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">AI Bouquet Builder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6">
                      {/* Upload Area */}
                      <label
                        className={cn(
                          "relative flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                          uploadedImage
                            ? "border-rose-velvet bg-rose-velvet/5"
                            : "border-rose-velvet/50 hover:border-rose-velvet hover:bg-rose-velvet/5"
                        )}
                      >
                        {uploadedImage ? (
                          <div className="relative w-full h-48">
                            <Image
                              src={uploadedImage}
                              alt="Uploaded inspiration"
                              fill
                              className="object-contain rounded-lg"
                            />
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-rose-velvet" />
                            <div className="text-center">
                              <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
                                Upload Inspiration Bouquet
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Our AI will analyze and recommend flowers
                              </p>
                            </div>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>

                      {/* AI Analysis Result */}
                      {uploadedImage && (
                        <AIInspectionResult
                          detected={aiAnalysisResult.detected}
                          confidence={aiAnalysisResult.confidence}
                          onAccept={handleAcceptAI}
                          accepted={aiAccepted}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory Grid */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Select Flowers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {flowerProducts.map((product) => {
                        const qty = getProductQuantity(product.id)
                        const isLowStock = product.stock < 20

                        return (
                          <div
                            key={product.id}
                            className="flex items-center gap-4 p-4 bg-parchment rounded-lg border border-border-subtle"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover rounded-full"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-serif text-foreground truncate">{product.name}</h3>
                                {isLowStock && (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs flex-shrink-0">
                                    Low Stock
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                LKR {product.price}/stem
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.stock} in stock
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-8 h-8 rounded-full border-border-subtle"
                                onClick={() => updateQuantity(product.id, -1)}
                                disabled={qty === 0}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{qty}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="w-8 h-8 rounded-full border-rose-velvet text-rose-velvet hover:bg-rose-velvet hover:text-primary-foreground"
                                onClick={() => updateQuantity(product.id, 1)}
                                disabled={qty >= product.stock}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Fulfillment */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-8">
                {/* Fulfillment Type */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Fulfillment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFulfillmentType('pickup')}
                        className={cn(
                          "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-colors",
                          fulfillmentType === 'pickup'
                            ? "border-rose-velvet bg-rose-velvet/5"
                            : "border-border-subtle hover:border-rose-velvet/50"
                        )}
                      >
                        <Store className="w-8 h-8 text-rose-velvet" />
                        <span className="font-medium text-foreground">Pickup</span>
                        <span className="text-sm text-muted-foreground">Free</span>
                      </button>
                      <button
                        onClick={() => setFulfillmentType('delivery')}
                        className={cn(
                          "flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-colors",
                          fulfillmentType === 'delivery'
                            ? "border-rose-velvet bg-rose-velvet/5"
                            : "border-border-subtle hover:border-rose-velvet/50"
                        )}
                      >
                        <Truck className="w-8 h-8 text-rose-velvet" />
                        <span className="font-medium text-foreground">Delivery</span>
                        <span className="text-sm text-muted-foreground">From LKR 300</span>
                      </button>
                    </div>

                    {/* Delivery Address */}
                    {fulfillmentType === 'delivery' && (
                      <div className="mt-6 flex flex-col gap-4">
                        {/* Mock Map */}
                        <div className="relative h-40 bg-muted rounded-lg flex items-center justify-center border border-border-subtle">
                          <MapPin className="w-8 h-8 text-rose-velvet" />
                          <span className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                            Map placeholder
                          </span>
                        </div>
                        <Field>
                          <FieldLabel htmlFor="address">Delivery Address</FieldLabel>
                          <Input
                            id="address"
                            placeholder="Enter your delivery address"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="bg-parchment border-border-subtle"
                          />
                        </Field>
                        {deliveryAddress && (
                          <div className="p-4 bg-rose-velvet/5 rounded-lg border border-rose-velvet/20">
                            <p className="text-sm text-foreground">
                              <span className="font-medium">Delivery fee:</span> LKR 450 — 9 km from store
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Date Selection */}
                <Card className="bg-card border border-border-subtle">
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CapacityCalendar
                      disabledDates={fullCapacityDates}
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="border-border-subtle"
              >
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  disabled={!canProceed()}
                  className="bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground"
                >
                  Place Order
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Card className="bg-card border border-border-subtle">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No items in cart</p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {cart.map((item) => {
                        const product = products.find((p) => p.id === item.productId)
                        if (!product) return null
                        return (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {product.name} x {item.quantity}
                            </span>
                            <span className="text-muted-foreground">
                              LKR {(product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        )
                      })}
                      <div className="border-t border-border-subtle pt-4 mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-foreground">LKR {subtotal.toLocaleString()}</span>
                        </div>
                        {fulfillmentType === 'delivery' && deliveryAddress && (
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-muted-foreground">Delivery</span>
                            <span className="text-foreground">LKR {deliveryFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium mt-4">
                          <span className="text-foreground">Total</span>
                          <span className="text-rose-velvet font-serif text-lg">
                            LKR {total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border-subtle lg:hidden">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg text-foreground">
              LKR {total.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
            </span>
          </div>
          {summaryOpen ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        {summaryOpen && (
          <div className="p-4 pt-0 max-h-64 overflow-y-auto">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId)
              if (!product) return null
              return (
                <div key={item.productId} className="flex justify-between text-sm py-2">
                  <span className="text-foreground">
                    {product.name} x {item.quantity}
                  </span>
                  <span className="text-muted-foreground">
                    LKR {(product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Spacing for mobile bottom sheet */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
