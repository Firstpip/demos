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
      <div
        className="relative flex aspect-[16/10] items-center justify-center"
        style={{ backgroundColor: brand.primaryColor + '22' }}
      >
        <span
          aria-hidden
          className="text-[88px] font-light"
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
