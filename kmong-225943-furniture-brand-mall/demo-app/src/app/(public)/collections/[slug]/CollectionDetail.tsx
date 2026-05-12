'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Collection, Product } from '@/lib/types'
import { LookbookHero } from '@/components/LookbookHero'
import { FilterPanel, AppliedChips, applyFilter, emptyFilter, type FilterState } from '@/components/FilterPanel'
import { SortToggle, sortProducts, type SortKey } from '@/components/SortToggle'
import { ProductCard } from '@/components/ProductCard'
import { QuickViewModal } from '@/components/QuickViewModal'
import { EmptyState } from '@/components/states'

interface Props {
  collection: Collection
  sourceProducts: Product[]
}

export function CollectionDetail({ collection, sourceProducts }: Props) {
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [sort, setSort] = useState<SortKey>('popular')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const visible = useMemo(
    () => sortProducts(applyFilter(sourceProducts, filter), sort),
    [sourceProducts, filter, sort],
  )

  function reset() {
    setFilter(emptyFilter)
  }

  function openQuickView(productId: string) {
    const p = sourceProducts.find((pp) => pp.id === productId)
    if (p) setQuickViewProduct(p)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-3 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/collections" className="hover:text-text">컬렉션</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">{collection.title}</span>
      </nav>

      <LookbookHero
        letter={collection.heroLetter}
        title={collection.title}
        subtitle={collection.subtitle}
        hotspots={collection.hotspots}
        slug={collection.slug}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-text-muted">{collection.description}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <FilterPanel source={sourceProducts} state={filter} onChange={setFilter} />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-text-muted">전체 {visible.length.toLocaleString()}점</p>
            <SortToggle value={sort} onChange={setSort} />
          </div>
          <AppliedChips state={filter} onChange={setFilter} />
          {visible.length === 0 ? (
            <EmptyState
              title="조건에 맞는 가구가 없어요"
              description="조건을 한 단계 풀어보거나 추천 칩을 선택해 보세요."
              ctaLabel="필터 초기화"
              onCta={reset}
            />
          ) : (
            <div
              key={`grid-${sort}-${visible.length}-${JSON.stringify(filter)}`}
              className="grid animate-fade-in gap-4 sm:grid-cols-2 md:grid-cols-3"
            >
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={openQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onOpenChange={(o) => { if (!o) setQuickViewProduct(null) }}
      />
    </div>
  )
}
