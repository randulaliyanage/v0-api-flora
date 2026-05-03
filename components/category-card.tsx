'use client'

import { Card } from '@/components/ui/card'
import { Flower2, Candy, Gift, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  id: string
  name: string
  icon: 'flower' | 'candy' | 'gift' | 'balloon'
  onClick?: () => void
  className?: string
}

const iconMap = {
  flower: Flower2,
  candy: Candy,
  gift: Gift,
  balloon: PartyPopper,
}

export function CategoryCard({ id, name, icon, onClick, className }: CategoryCardProps) {
  const Icon = iconMap[icon]

  return (
    <Card
      onClick={onClick}
      className={cn(
        "bg-card border border-border-subtle p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-rose-velvet/30 transition-colors",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-rose-velvet/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-rose-velvet" strokeWidth={1.5} />
      </div>
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-sans">
        {name}
      </span>
    </Card>
  )
}
