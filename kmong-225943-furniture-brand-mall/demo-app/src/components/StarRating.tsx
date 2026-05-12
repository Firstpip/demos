'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} role="img" aria-label={`별점 ${value.toFixed(1)} 점`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = rounded >= n
        const half = !filled && rounded >= n - 0.5
        return (
          <Star
            key={n}
            className={cn(
              'shrink-0',
              filled ? 'fill-accent text-accent' : half ? 'text-accent' : 'text-text-muted/40',
            )}
            style={{ width: size, height: size }}
            aria-hidden
          />
        )
      })}
    </span>
  )
}

export function RatingDistribution({ distribution }: { distribution: number[] }) {
  const total = distribution.reduce((acc, n) => acc + n, 0) || 1
  return (
    <div className="space-y-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star - 1] ?? 0
        const ratio = (count / total) * 100
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-6 text-text-muted">{star}점</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-accent" style={{ width: `${ratio}%` }} aria-hidden />
            </div>
            <span className="w-10 text-right text-text-muted">{count}</span>
          </div>
        )
      })}
    </div>
  )
}
