'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search, PackagePlus } from 'lucide-react'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { Dropdown } from '@/components/Dropdown'
import { products } from '@/data/products'
import { brandById } from '@/data/brands'
import { useAuth } from '@/lib/contexts/auth'
import { EmptyState } from '@/components/states'
import { formatKRW, cn } from '@/lib/utils'

const categories = ['전체', '침실', '거실', '주방', '수납', '사무용', '학생']
const sortOptions = [
  { key: 'name', label: '이름순' },
  { key: 'price-asc', label: '가격 낮은순' },
  { key: 'price-desc', label: '가격 높은순' },
  { key: 'stock', label: '재고 많은순' },
] as const
type SortKey = typeof sortOptions[number]['key']
const PAGE_SIZE = 25

export default function AdminProductsPage() {
  const { role } = useAuth()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('전체')
  const [sort, setSort] = useState<SortKey>('name')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const filteredList = products.filter((p) => {
      const brand = brandById(p.brandId)
      const matchTerm = !term ||
        p.name.toLowerCase().includes(term) ||
        (brand?.name.toLowerCase().includes(term) ?? false) ||
        p.axes.category.toLowerCase().includes(term)
      const matchCat = category === '전체' || p.axes.category === category
      return matchTerm && matchCat
    })
    const sorted = [...filteredList]
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price-asc') sorted.sort((a, b) => a.priceSale - b.priceSale)
    if (sort === 'price-desc') sorted.sort((a, b) => b.priceSale - a.priceSale)
    if (sort === 'stock') sorted.sort((a, b) => sumStock(b) - sumStock(a))
    return sorted
  }, [q, category, sort])

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  if (role === 'partner') {
    return (
      <div>
        <AdminPageHeader title="제품 관리" />
        <EmptyState
          title="조합사 권한으로는 접근할 수 없습니다"
          description="제품 신규 등록·삭제는 본체 운영자만 가능합니다. 자기 브랜드 페이지의 가격·이미지는 좌측 '브랜드 페이지'에서 직접 수정하세요."
        />
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="제품 관리"
        description={`${products.length.toLocaleString()}점 등록 · 30개 조합사`}
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg"
          >
            <PackagePlus className="h-4 w-4" /> 신규 제품 등록
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-md border bg-surface px-2.5 py-1.5 w-72">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            id="admin-products-search"
            type="search"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            placeholder="이름·브랜드·카테고리 검색"
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              id={`admin-products-filter-${c}`}
              onClick={() => { setCategory(c); setPage(1) }}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs',
                category === c ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Dropdown
            value={sort}
            onChange={(v) => setSort(v as SortKey)}
            options={sortOptions.map((o) => ({ value: o.key, label: o.label }))}
            ariaLabel="정렬"
            size="sm"
          />
        </div>
      </div>

      <p className="mb-2 text-xs text-text-muted">전체 {filtered.length.toLocaleString()}점</p>

      {filtered.length === 0 ? (
        <EmptyState title="조건에 맞는 제품이 없어요" description="검색어 또는 카테고리를 바꿔 보세요." />
      ) : (
        <div id="admin-products-table" className="overflow-hidden rounded-lg border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">제품</th>
                <th className="px-3 py-2 font-medium">브랜드</th>
                <th className="px-3 py-2 font-medium">카테고리</th>
                <th className="px-3 py-2 font-medium text-right">판매가</th>
                <th className="px-3 py-2 font-medium text-right">재고</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const brand = brandById(p.brandId)
                const stockTotal = sumStock(p)
                const lowStock = stockTotal <= 5
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-base font-light text-text-muted/60">
                          {p.thumbLetter}
                        </div>
                        <div>
                          <Link href={`/products/${p.slug}`} className="font-medium text-text hover:underline">{p.name}</Link>
                          <p className="text-[11px] text-text-muted">{p.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-text-muted">{brand?.name}</td>
                    <td className="px-3 py-2 text-text-muted">{p.axes.category}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatKRW(p.priceSale)}</td>
                    <td className={cn('px-3 py-2 text-right', lowStock ? 'text-warn' : 'text-text-muted')}>{stockTotal}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {p.badges.map((b) => (
                          <span key={b} className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px]">{b}</span>
                        ))}
                        {p.badges.length === 0 && <span className="text-xs text-text-muted">—</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      <Link href={`/admin/cms/partner/${brand?.slug}`} className="text-accent hover:underline">편집</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPage((v) => v + 1)}
            className="rounded-md border bg-surface px-4 py-2 text-sm hover:bg-surface-2"
          >
            더 보기 ({(filtered.length - visible.length).toLocaleString()}점 남음)
          </button>
        </div>
      )}
    </div>
  )
}

function sumStock(p: typeof products[number]): number {
  return Object.values(p.stock).reduce((acc, n) => acc + n, 0)
}
