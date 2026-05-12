'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowUpRight, ChevronRight, Filter, LayoutGrid, Rows3 } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { EmptyState } from '@/components/states'
import { AppliedChips, FilterPanel, applyFilter, emptyFilter, type FilterState } from '@/components/FilterPanel'
import { SortToggle, sortProducts, type SortKey } from '@/components/SortToggle'
import { products } from '@/data/products'
import { brandBySlug } from '@/data/brands'
import { categoryTree, subCategoriesOf, letterOf, imageForCategory, imageForSub } from '@/data/categoryTree'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 24

const categoryAccent: Record<string, string> = {
  '거실': '#5C4632',
  '침실': '#7A6A4F',
  '주방·다이닝': '#A86F2A',
  '서재·홈오피스': '#3F3A33',
  '수납': '#6F6353',
  '조명': '#C58F2A',
  '키즈': '#A89272',
  '아웃도어': '#4F5B3F',
}

function ProductsInner() {
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [sort, setSort] = useState<SortKey>('popular')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)

  const categoryParam = searchParams.get('category')
  const subCategoryParam = searchParams.get('subCategory')
  const brandParam = searchParams.get('brand')

  const mode: 'root' | 'category' | 'plp' = categoryParam && subCategoryParam ? 'plp' : categoryParam ? 'category' : 'root'

  useEffect(() => {
    const next: FilterState = { ...emptyFilter }
    if (brandParam) {
      const brand = brandBySlug(brandParam)
      if (brand) next.brand = [brand.id]
    }
    setFilter(next)
    setPage(1)
  }, [categoryParam, brandParam])

  const scoped = useMemo(() => {
    let base = products
    if (categoryParam) base = base.filter((p) => p.axes.category === categoryParam)
    if (subCategoryParam) base = base.filter((p) => p.axes.subCategory === subCategoryParam)
    return base
  }, [categoryParam, subCategoryParam])

  const filtered = useMemo(
    () => sortProducts(applyFilter(scoped, filter), sort),
    [scoped, filter, sort],
  )
  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  function reset() {
    setFilter(emptyFilter)
    setPage(1)
  }

  if (mode === 'root') return <RootHub />
  if (mode === 'category') return <CategoryHub category={categoryParam!} />

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-4 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-text">가구</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${encodeURIComponent(categoryParam!)}`} className="hover:text-text">{categoryParam}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">{subCategoryParam}</span>
      </nav>

      <header className="relative mb-8 overflow-hidden rounded-lg border">
        <img
          src={imageForSub(subCategoryParam!, categoryParam!)}
          alt={subCategoryParam!}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
        <div className="relative px-8 py-12 text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/85">SUB CATEGORY</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight drop-shadow-sm">{subCategoryParam}</h1>
          <p className="mt-1 text-sm text-white/80">{categoryParam} / {subCategoryParam}</p>
        </div>
      </header>

      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">ALL IN {subCategoryParam?.toUpperCase()}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-text">{subCategoryParam} 전체</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs lg:hidden"
            aria-label="필터 열기"
          >
            <Filter className="h-3.5 w-3.5" /> 필터
          </button>
          <SortToggle value={sort} onChange={setSort} />
          <div className="hidden items-center gap-0.5 rounded-md border bg-surface p-0.5 sm:inline-flex">
            <button
              type="button"
              onClick={() => setView('grid')}
              aria-label="그리드 뷰"
              className={cn('rounded p-1.5', view === 'grid' ? 'bg-primary text-primary-fg' : 'text-text-muted')}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              aria-label="리스트 뷰"
              className={cn('rounded p-1.5', view === 'list' ? 'bg-primary text-primary-fg' : 'text-text-muted')}
            >
              <Rows3 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <FilterPanel source={scoped} state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
        </div>
        <div>
          <AppliedChips state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
          {filtered.length === 0 ? (
            <EmptyState
              title="조건에 맞는 상품이 없어요"
              description="조건을 한 단계 풀어보거나 전체 초기화를 눌러주세요."
              ctaLabel="필터 초기화"
              onCta={reset}
            />
          ) : (
            <div
              className={cn(
                'animate-fade-in',
                view === 'grid'
                  ? 'grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                  : 'flex flex-col gap-3',
              )}
            >
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((v) => v + 1)}
                className="rounded-md border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2"
              >
                더 보기 ({(filtered.length - visible.length).toLocaleString()}점 남음)
              </button>
            </div>
          )}
        </div>
      </div>
      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setFilterOpen(false)}>
          <aside
            className="absolute bottom-0 max-h-[80vh] w-full overflow-y-auto rounded-t-xl bg-surface p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterPanel source={scoped} state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-fg"
            >
              결과 {filtered.length.toLocaleString()}점 보기
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

function RootHub() {
  const [sort, setSort] = useState<SortKey>('popular')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [filterOpen, setFilterOpen] = useState(false)
  const filtered = useMemo(() => applyFilter(products, filter), [filter])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const visible = sorted.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < sorted.length

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-4 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">가구</span>
      </nav>
      <section aria-label="가구 카테고리" className="mb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {categoryTree.map((node) => {
            const count = products.filter((p) => p.axes.category === node.category).length
            return (
              <Link
                key={node.category}
                href={`/products?category=${encodeURIComponent(node.category)}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg border bg-surface-2"
              >
                <img
                  src={imageForCategory(node.category)}
                  alt={node.category}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <p className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">CATEGORY</p>
                <div className="relative p-3 text-white">
                  <p className="text-base font-semibold drop-shadow-sm">{node.category}</p>
                  <p className="mt-0.5 text-[11px] text-white/80">{count}점 · {node.subCategories.length}개 세부</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">ALL FURNITURE</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">전체 가구</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs lg:hidden"
            aria-label="필터 열기"
          >
            <Filter className="h-3.5 w-3.5" /> 필터
          </button>
          <SortToggle value={sort} onChange={(k) => { setSort(k); setPage(1) }} />
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <FilterPanel source={products} state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
        </div>
        <div>
          <AppliedChips state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
          <p className="mb-3 text-xs text-text-muted">결과 {sorted.length.toLocaleString()}점</p>
          {sorted.length === 0 ? (
            <EmptyState
              title="조건에 맞는 가구가 없어요"
              description="필터를 한 단계 풀어보세요."
              ctaLabel="필터 초기화"
              onCta={() => { setFilter(emptyFilter); setPage(1) }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setPage((v) => v + 1)}
                className="rounded-md border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2"
              >
                더 보기 ({(sorted.length - visible.length).toLocaleString()}점 남음)
              </button>
            </div>
          )}
        </div>
      </div>
      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setFilterOpen(false)}>
          <aside
            className="absolute bottom-0 max-h-[80vh] w-full overflow-y-auto rounded-t-xl bg-surface p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterPanel source={products} state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-fg"
            >
              결과 {sorted.length.toLocaleString()}점 보기
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

function CategoryHub({ category }: { category: string }) {
  const subs = subCategoriesOf(category)
  const accent = categoryAccent[category] ?? '#5C4632'
  const letter = letterOf(category)
  const categoryProducts = useMemo(() => products.filter((p) => p.axes.category === category), [category])
  const [sort, setSort] = useState<SortKey>('popular')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [filterOpen, setFilterOpen] = useState(false)
  const filtered = useMemo(() => applyFilter(categoryProducts, filter), [categoryProducts, filter])
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort])
  const visible = sorted.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < sorted.length

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-4 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-text">가구</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">{category}</span>
      </nav>

      <header className="relative mb-8 overflow-hidden rounded-lg border">
        <img
          src={imageForCategory(category)}
          alt={category}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
        <div className="relative px-8 py-12 text-white">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/85">CATEGORY</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight drop-shadow-sm">{category}</h1>
        </div>
      </header>

      {subs.length > 0 && (
      <section className="mb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {subs.map((sub) => {
            const subCount = categoryProducts.filter((p) => p.axes.subCategory === sub).length
            return (
              <Link
                key={sub}
                href={`/products?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(sub)}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg border bg-surface-2"
              >
                <img
                  src={imageForSub(sub, category)}
                  alt={sub}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <p className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">SUB</p>
                <div className="relative p-3 text-white">
                  <p className="text-base font-semibold drop-shadow-sm">{sub}</p>
                  <p className="mt-0.5 text-[11px] text-white/80">{subCount}점</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      )}

      <section>
        <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">ALL IN {category.toUpperCase()}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-text">{category} 전체</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs lg:hidden"
              aria-label="필터 열기"
            >
              <Filter className="h-3.5 w-3.5" /> 필터
            </button>
            <SortToggle value={sort} onChange={(k) => { setSort(k); setPage(1) }} />
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <FilterPanel source={categoryProducts} state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
          </div>
          <div>
            <AppliedChips state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
            <p className="mb-3 text-xs text-text-muted">결과 {sorted.length.toLocaleString()}점</p>
            {sorted.length === 0 ? (
              <EmptyState
                title="조건에 맞는 상품이 없어요"
                description="필터를 한 단계 풀어보세요."
                ctaLabel="필터 초기화"
                onCta={() => { setFilter(emptyFilter); setPage(1) }}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((v) => v + 1)}
                  className="rounded-md border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2"
                >
                  더 보기 ({(sorted.length - visible.length).toLocaleString()}점 남음)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setFilterOpen(false)}>
          <aside
            className="absolute bottom-0 max-h-[80vh] w-full overflow-y-auto rounded-t-xl bg-surface p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterPanel source={categoryProducts} state={filter} onChange={(s) => { setFilter(s); setPage(1) }} />
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-fg"
            >
              결과 {sorted.length.toLocaleString()}점 보기
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1280px] px-4 py-12 text-sm text-text-muted">불러오는 중...</div>}>
      <ProductsInner />
    </Suspense>
  )
}
