'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { EmptyState } from '@/components/states'
import { SortToggle, sortProducts, type SortKey } from '@/components/SortToggle'
import { products } from '@/data/products'
import { brandById } from '@/data/brands'

function SearchInner() {
  const params = useSearchParams()
  const router = useRouter()
  const initialQ = params.get('q') ?? ''
  const [q, setQ] = useState(initialQ)
  const [sort, setSort] = useState<SortKey>('popular')

  const trimmed = q.trim().toLowerCase()
  const results = useMemo(() => {
    if (!trimmed) return [] as typeof products
    const matched = products.filter((p) => {
      const brand = brandById(p.brandId)
      return (
        p.name.toLowerCase().includes(trimmed) ||
        p.subtitle.toLowerCase().includes(trimmed) ||
        p.axes.category.toLowerCase().includes(trimmed) ||
        p.axes.material.some((m) => m.toLowerCase().includes(trimmed)) ||
        (brand?.name.toLowerCase().includes(trimmed) ?? false)
      )
    })
    return sortProducts(matched, sort)
  }, [trimmed, sort])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    router.replace(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-text">검색</h1>
        <p className="mt-1 text-sm text-text-muted">가구·브랜드·소재 어디서든 키워드로 찾을 수 있습니다.</p>
      </header>
      <form onSubmit={submit} className="mb-6 flex items-center gap-2 rounded-md border bg-surface px-3 py-2">
        <SearchIcon className="h-4 w-4 text-text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='예: "오크 소파", "라온우드", "거실"'
          className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          aria-label="검색어"
        />
        <button
          type="submit"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg hover:opacity-90"
        >
          검색
        </button>
      </form>

      {!trimmed ? (
        <EmptyState
          title="검색어를 입력해 주세요"
          description="가구 이름·브랜드·소재 어떤 단어로도 찾을 수 있습니다."
        />
      ) : results.length === 0 ? (
        <EmptyState
          title={`"${q}"에 대한 결과가 없어요`}
          description="다른 키워드를 입력하거나 전체 가구에서 둘러보세요."
          ctaLabel="전체 가구"
          onCta={() => router.push('/products')}
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-text-muted">
              <strong className="text-text">{results.length.toLocaleString()}</strong>개의 결과 · &ldquo;{q}&rdquo;
            </p>
            <SortToggle value={sort} onChange={setSort} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1280px] px-4 py-12 text-sm text-text-muted">불러오는 중...</div>}>
      <SearchInner />
    </Suspense>
  )
}
