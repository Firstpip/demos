'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { BrandCard } from '@/components/BrandCard'
import { EmptyState } from '@/components/states'
import { brands } from '@/data/brands'

export default function BrandsListPage() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return brands
    return brands.filter((b) =>
      b.name.toLowerCase().includes(term) || b.description.toLowerCase().includes(term),
    )
  }, [q])

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12">
      <header className="mb-8 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">Partners</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text">
          30개 조합사 브랜드 셀렉션
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          한 결제·계정·배송 시스템으로 통합되는 가구페스타 협동조합의 브랜드들. 각 브랜드 페이지에서 큐레이션·상품·소식을 확인하세요.
        </p>
      </header>

      <div className="mb-5 inline-flex items-center gap-2 rounded-md border bg-surface px-2.5 py-1.5 w-64">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="브랜드명·키워드 검색"
          className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          aria-label="브랜드 검색"
        />
      </div>

      <p className="mb-3 text-xs text-text-muted">전체 {filtered.length}개 브랜드</p>

      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 브랜드가 없어요"
          description="검색어를 바꿔 보세요."
          ctaLabel="전체 보기"
          onCta={() => setQ('')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      )}
    </div>
  )
}
