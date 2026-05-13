'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import type { Brand, Product } from '@/lib/types'
import { ProductCard } from '@/components/ProductCard'
import { SortToggle, sortProducts, type SortKey } from '@/components/SortToggle'
import { Dropdown } from '@/components/Dropdown'
import { EmptyState } from '@/components/states'
import { usePartnerOverrides } from '@/lib/contexts/partnerOverrides'
import { cn } from '@/lib/utils'

interface Props {
  brand: Brand
  products: Product[]
}

export function BrandDetail({ brand, products }: Props) {
  const ov = usePartnerOverrides()
  const [sort, setSort] = useState<SortKey>('popular')
  const [category, setCategory] = useState<string>('전체')

  const curated = useMemo(() => ov.applyBrandProducts(brand.id, products), [ov, brand.id, products])
  const curatedBanners = ov.brandBanners[brand.id] ?? []
  const overriddenDesc = ov.brandDesc[brand.id]

  const categories = useMemo(() => {
    const set = new Set<string>(curated.map((p) => p.axes.category))
    return ['전체', ...Array.from(set).sort()]
  }, [curated])

  const visible = useMemo(() => {
    const filtered = category === '전체' ? curated : curated.filter((p) => p.axes.category === category)
    return sortProducts(filtered, sort)
  }, [curated, category, sort])

  const avgRating = products.length
    ? (products.reduce((acc, p) => acc + p.rating, 0) / products.length).toFixed(1)
    : '—'
  const isOwn = brand.partnerUserIds.length > 0 || brand.isMicrosite

  return (
    <div>
      <section
        className="relative overflow-hidden border-b"
        style={{ backgroundColor: brand.primaryColor + '15' }}
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-3 flex items-center gap-1 text-xs text-text-muted">
              <Link href="/" className="hover:text-text">홈</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/brands" className="hover:text-text">브랜드</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-text">{brand.name}</span>
            </nav>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
              {isOwn ? 'House Brand' : 'Partner Brand'}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl" style={{ color: brand.primaryColor }}>
              {brand.name}
            </h1>
            {overriddenDesc ? (
              <div className="rich-content mt-3 max-w-md text-sm leading-relaxed text-text-muted" dangerouslySetInnerHTML={{ __html: overriddenDesc }} />
            ) : (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted">{brand.description}</p>
            )}
            <dl className="mt-5 flex gap-6 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-text-muted">상품</dt>
                <dd className="mt-0.5 text-xl font-semibold text-text">{products.length}점</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-text-muted">평균 평점</dt>
                <dd className="mt-0.5 text-xl font-semibold text-text">{avgRating}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-text-muted">유형</dt>
                <dd className="mt-0.5 text-xl font-semibold text-text">{isOwn ? '자체 운영' : '협력'}</dd>
              </div>
            </dl>
            {brand.isMicrosite && (
              <div className="mt-6">
                <Link
                  href="/maholn"
                  className="inline-flex items-center gap-1.5 rounded-md bg-text px-4 py-2.5 text-sm font-medium text-primary-fg hover:opacity-90"
                >
                  마홀앤 마이크로사이트로 가기 <ArrowUpRight className="h-4 w-4" />
                </Link>
                <p className="mt-2 max-w-md text-[11px] text-text-muted">
                  자체 대표 브랜드는 별도의 프리미엄 마이크로사이트로 운영됩니다. 다른 29개 조합사는 본 페이지와 동일한 형식의 브랜드 페이지를 사용합니다.
                </p>
              </div>
            )}
          </div>
          <div className="relative hidden aspect-square overflow-hidden rounded-lg lg:flex">
            <img
              src={brand.imageUrl}
              alt={brand.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${brand.primaryColor}66 100%)` }} />
            <span aria-hidden className="absolute right-6 bottom-6 rounded-md bg-surface/95 px-3 py-1.5 text-2xl font-light" style={{ color: brand.primaryColor }}>
              {brand.logoLetter}
            </span>
          </div>
        </div>
      </section>

      {curatedBanners.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-4 pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {curatedBanners.map((b) => (
              <article key={b.id} className="rounded-lg border bg-surface-2 p-4">
                <p className="text-sm font-semibold text-text">{b.title}</p>
                <p className="mt-1 text-xs text-text-muted">{b.body}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent">{b.cta}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1280px] px-4 py-10">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">Shop</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-text">{brand.name} 상품</h2>
          </div>
          <div className="flex items-center gap-2">
            <Dropdown
              value={category}
              onChange={setCategory}
              options={categories.map((c) => ({ value: c, label: c }))}
              ariaLabel="카테고리"
              size="sm"
            />
            <SortToggle value={sort} onChange={setSort} />
          </div>
        </header>
        {visible.length === 0 ? (
          <EmptyState
            title="조건에 맞는 상품이 없어요"
            description="가구 분류를 다시 선택해 보세요."
            ctaLabel="전체 가구"
            onCta={() => setCategory('전체')}
          />
        ) : (
          <div className={cn('grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4')}>
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
