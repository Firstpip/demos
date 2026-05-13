import Link from 'next/link'
import type { Brand } from '@/lib/types'
import { productsByBrand } from '@/data/products'

interface Props {
  brand: Brand
}

export function BrandCard({ brand }: Props) {
  const count = productsByBrand(brand.id).length
  return (
    <Link
      id={`brand-card-${brand.slug}`}
      href={`/brands/${brand.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-surface transition hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <img
          src={brand.imageUrl}
          alt={brand.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 transition group-hover:opacity-30"
          style={{ background: `linear-gradient(180deg, transparent 40%, ${brand.primaryColor}55 100%)` }}
        />
        <span
          aria-hidden
          className="absolute left-3 bottom-3 rounded-md bg-surface/95 px-2 py-1 text-base font-light"
          style={{ color: brand.primaryColor }}
        >
          {brand.logoLetter}
        </span>
        {brand.isMicrosite && (
          <span className="absolute right-3 top-3 rounded-md bg-text px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-fg">
            Microsite
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-base font-semibold text-text">{brand.name}</p>
        <p className="line-clamp-2 text-xs text-text-muted">{brand.description}</p>
        <p className="mt-1 text-[11px] text-text-muted">상품 {count}점</p>
      </div>
    </Link>
  )
}
