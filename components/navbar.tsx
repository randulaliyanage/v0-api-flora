'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  cartCount?: number
  className?: string
}

const navLinks = [
  { href: '/', label: 'Shop' },
  { href: '/create', label: 'Create Bouquet' },
  { href: '/track', label: 'Track Order' },
]

export function Navbar({ cartCount = 0, className }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-parchment/95 backdrop-blur supports-[backdrop-filter]:bg-parchment/80 border-b border-border-subtle",
      className
    )}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif italic text-2xl text-foreground hover:text-rose-velvet transition-colors">
          API Flora
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-sans"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Cart & Mobile Menu */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-velvet text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Shopping cart</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-parchment">
              <SheetTitle className="font-serif italic text-xl text-foreground mb-8">
                API Flora
              </SheetTitle>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-sans"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
