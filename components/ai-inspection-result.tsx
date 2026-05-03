'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DetectedFlower {
  name: string
  stems: number
}

interface AIInspectionResultProps {
  detected: DetectedFlower[]
  confidence: number
  onAccept?: () => void
  accepted?: boolean
  className?: string
}

export function AIInspectionResult({
  detected,
  confidence,
  onAccept,
  accepted = false,
  className,
}: AIInspectionResultProps) {
  return (
    <Card className={cn(
      "bg-card border border-border-subtle overflow-hidden",
      className
    )}>
      <CardHeader className="bg-rose-velvet/5 border-b border-border-subtle pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-velvet" />
            <CardTitle className="font-serif text-lg">AI Analysis Complete</CardTitle>
          </div>
          <Badge variant="outline" className="bg-rose-velvet/10 text-rose-velvet border-rose-velvet/20">
            {confidence}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-sans">
          Detected Flowers
        </p>
        <ul className="space-y-2 mb-4">
          {detected.map((flower) => (
            <li key={flower.name} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{flower.name}</span>
              <span className="text-muted-foreground">{flower.stems} stems</span>
            </li>
          ))}
        </ul>
        
        {!accepted ? (
          <Button
            onClick={onAccept}
            className="w-full bg-rose-velvet hover:bg-rose-velvet/90 text-primary-foreground"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept Recommendations
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 text-rose-velvet">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Recommendations Applied</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
