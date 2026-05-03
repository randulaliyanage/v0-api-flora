'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloralCardProps {
  name: string
  price: number
  image: string
  stock?: number
  onAdd?: () => void
  className?: string
}

export function FloralCard({ name, price, image, stock, onAdd, className }: FloralCardProps) {
  const isLowStock = stock !== undefined && stock < 20

  return (
    <Card className={cn(
      "relative overflow-visible bg-card border border-border-subtle p-4 pt-16",
      className
    )}>
      {/* Overflow image */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-28 h-28">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-full"
            sizes="112px"
          />
        </div>
      </div>

      {/* Low stock badge */}
      {isLowStock && (
        <Badge 
          variant="outline" 
          className="absolute top-2 right-2 bg-amber-50 text-amber-700 border-amber-200 text-xs"
        >
          Low Stock
        </Badge>
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <h3 className="font-serif text-lg text-foreground text-center">{name}</h3>
        <p className="text-muted-foreground text-sm">
          LKR {price.toLocaleString()}/stem
        </p>

        {/* Add button */}
        {onAdd && (
          <Button
            size="icon"
            className="mt-2 rounded-full bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground w-10 h-10"
            onClick={onAdd}
          >
            <Plus className="w-5 h-5" />
            <span className="sr-only">Add {name} to cart</span>
          </Button>
        )}
      </div>
    </Card>
  )
}
