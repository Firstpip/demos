'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import { productById } from '@/data/products'
import { brandById } from '@/data/brands'
import { formatKRW, cn } from '@/lib/utils'

interface Hotspot { x: number; y: number; productId: string; label: string }

interface Props {
  letter: string
  title: string
  subtitle: string
  hotspots: Hotspot[]
  slug: string
  onQuickView: (p: Product) => void
}

export function LookbookHero({ letter, title, subtitle, hotspots, slug, onQuickView }: Props) {
  const [active, setActive] = useState<number | null>(null)
  const activeSpot = active !== null ? hotspots[active] : null
  const activeProduct = activeSpot ? productById(activeSpot.productId) : null
  const activeBrand = activeProduct ? brandById(activeProduct.brandId) : null

  return (
    <div
      id="lookbook-hero"
      className="relative overflow-hidden rounded-lg border bg-surface-2"
      style={{ aspectRatio: '16 / 9' }}
    >
      <div className="flex h-full items-center justify-center text-[180px] font-light text-text-muted/30">
        {letter}
      </div>
      <div className="absolute inset-x-6 top-6 max-w-md text-text">
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Collection</p>
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
      </div>
      {hotspots.map((h, i) => (
        <button
          key={i}
          type="button"
          id={`lookbook-hotspot-${slug}-${i}`}
          aria-label={`${h.label} 핫스팟`}
          onClick={() => setActive(i)}
          className={cn(
            'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-primary text-primary-fg transition hover:scale-110',
            'flex h-7 w-7 items-center justify-center text-[11px] font-semibold shadow-md',
          )}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          {i + 1}
        </button>
      ))}
      {activeSpot && activeProduct && (
        <div
          id="lookbook-hotspot-modal"
          className="absolute z-20 max-w-[280px] rounded-lg border bg-surface p-3 shadow-md animate-fade-in"
          style={{
            left: `${Math.min(70, Math.max(2, activeSpot.x))}%`,
            top: `${Math.min(70, Math.max(2, activeSpot.y + 6))}%`,
          }}
        >
          <p className="text-[11px] uppercase tracking-wide text-text-muted">{activeBrand?.name}</p>
          <p className="mt-0.5 text-sm font-medium text-text">{activeProduct.name}</p>
          <p className="mt-1 text-sm font-semibold">{formatKRW(activeProduct.priceSale)}</p>
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => { onQuickView(activeProduct); setActive(null) }}
              className="flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-fg"
            >
              Quick View
            </button>
            <Link
              href={`/products/${activeProduct.slug}`}
              className="inline-flex items-center gap-0.5 rounded-md border bg-surface px-2 py-1.5 text-xs hover:bg-surface-2"
            >
              상세 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-1.5 top-1.5 text-text-muted hover:text-text"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
