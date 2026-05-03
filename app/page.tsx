'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { FloralCard } from '@/components/floral-card'
import { CategoryCard } from '@/components/category-card'
import { Button } from '@/components/ui/button'
import { products, categories } from '@/lib/data'

export default function HomePage() {
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([])

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const flowerProducts = products.filter((p) => p.category === 'flowers')

  return (
    <div className="min-h-screen bg-parchment">
      <Navbar cartCount={cartCount} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-visible">
        <div className="container mx-auto">
          <div className="relative bg-card border border-border-subtle rounded-lg overflow-visible">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              {/* Text Content */}
              <div className="flex flex-col justify-center gap-6">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight text-balance">
                  Blooms, Curated for You.
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  Experience the art of floral design with our AI-powered custom bouquet service. 
                  From your vision to your doorstep, crafted with care in Colombo.
                </p>
                <div>
                  <Button asChild size="lg" className="bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground">
                    <Link href="/create">Create Your Bouquet</Link>
                  </Button>
                </div>
              </div>

              {/* Hero Image - Breaking out of container */}
              <div className="relative hidden md:block">
                <div className="absolute -top-8 -right-8 -bottom-8 w-full">
                  <div className="relative w-full h-full min-h-80">
                    <Image
                      src="/hero-bouquet.jpg"
                      alt="Beautiful floral bouquet arrangement"
                      fill
                      className="object-cover rounded-lg"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Hero Image */}
              <div className="relative md:hidden -mx-8 -mb-8 mt-4">
                <div className="relative w-full h-64">
                  <Image
                    src="/hero-bouquet.jpg"
                    alt="Beautiful floral bouquet arrangement"
                    fill
                    className="object-cover rounded-b-lg"
                    priority
                    sizes="100vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-8 text-center font-sans">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                icon={category.icon as 'flower' | 'candy' | 'gift' | 'balloon'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="font-serif text-3xl text-foreground mb-2 text-center">
            Popular Items
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Our most loved blooms, handpicked for every occasion
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 gap-y-16 pt-8">
            {flowerProducts.map((product) => (
              <FloralCard
                key={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                stock={product.stock}
                onAdd={() => addToCart(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-parchment/95 backdrop-blur border-t border-border-subtle md:hidden">
        <Button asChild className="w-full bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground">
          <Link href="/create">Create Bouquet</Link>
        </Button>
      </div>

      {/* Footer spacing for mobile sticky */}
      <div className="h-20 md:hidden" />
    </div>
  )
}
