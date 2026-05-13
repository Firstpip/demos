'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'
import type { Product } from '@/lib/types'
import { brandById } from '@/data/brands'
import { usePartnerOverrides } from '@/lib/contexts/partnerOverrides'
import { formatKRW, cn } from '@/lib/utils'
import { productImage } from '@/lib/imagePath'

interface Props {
  product: Product
  onQuickView?: (productId: string) => void
}

export function ProductCard({ product: original, onQuickView }: Props) {
  const { apply } = usePartnerOverrides()
  const product = apply(original)
  const brand = brandById(product.brandId)
  const discount = product.priceRegular > product.priceSale
    ? Math.round(((product.priceRegular - product.priceSale) / product.priceRegular) * 100)
    : 0
  const couponPrice = Math.round(product.priceSale * 0.95 / 1000) * 1000

  return (
    <Link
      href={`/products/${product.slug}`}
      id={`product-card-${product.slug}`}
      data-rid="R-04"
      className="group flex flex-col overflow-hidden rounded-lg border bg-surface transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/5] bg-surface-2 overflow-hidden">
        <img
          src={productImage(product.axes.category, product.axes.subCategory, product.id, 0, { name: product.name, slug: product.slug })}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <span
              key={b}
              className={cn(
                'rounded-md px-1.5 py-0.5 text-[10px] font-medium',
                b === 'NEW' && 'bg-success text-white',
                b === 'BEST' && 'bg-accent text-white',
                b === 'LIMITED' && 'bg-danger text-white',
              )}
            >
              {b}
            </span>
          ))}
        </div>
        {product.axes.deliveryDays <= 14 && (
          <span className="absolute right-2 top-2 rounded-md bg-surface/90 px-1.5 py-0.5 text-[10px] font-medium text-text">
            {product.axes.deliveryDays}일 내 배송
          </span>
        )}
        {onQuickView && (
          <button
            type="button"
            id={`quick-view-button-${product.slug}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product.id) }}
            className="absolute bottom-2 right-2 hidden items-center gap-1 rounded-md bg-surface/95 px-2 py-1 text-xs font-medium shadow-sm group-hover:inline-flex"
            aria-label={`${product.name} 빠른 보기`}
          >
            <Eye className="h-3.5 w-3.5" /> Quick View
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{brand?.name}</p>
        <p className="line-clamp-2 text-sm font-medium text-text group-hover:underline">
          {product.name}
        </p>
        <p className="line-clamp-1 text-xs text-text-muted">{product.subtitle}</p>
        <div className="mt-1 flex items-baseline gap-2">
          {discount > 0 && (
            <span className="text-xs font-medium text-danger">{discount}%</span>
          )}
          <span className="text-base font-semibold text-text">{formatKRW(product.priceSale)}</span>
        </div>
        <p className="text-[11px] text-text-muted">
          쿠폰가 {formatKRW(couponPrice)} · 적립 {product.rewardPoint.toLocaleString()}P
        </p>
      </div>
    </Link>
  )
}
