'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { EmptyState } from '@/components/states'
import { brands } from '@/data/brands'
import { productsByBrand } from '@/data/products'
import { useAuth } from '@/lib/contexts/auth'
import { cn } from '@/lib/utils'

const tabs = [
  { key: 'all', label: '전체' },
  { key: 'own', label: '자체 운영' },
  { key: 'partner', label: '협력 브랜드' },
] as const

type TabKey = typeof tabs[number]['key']

export default function AdminBrandsPage() {
  const { role } = useAuth()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<TabKey>('all')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return brands.filter((b) => {
      const isOwn = b.partnerUserIds.length > 0 || b.isMicrosite
      if (tab === 'own' && !isOwn) return false
      if (tab === 'partner' && isOwn) return false
      if (!term) return true
      return b.name.toLowerCase().includes(term) || b.description.toLowerCase().includes(term)
    })
  }, [q, tab])

  const counts = {
    all: brands.length,
    own: brands.filter((b) => b.partnerUserIds.length > 0 || b.isMicrosite).length,
    partner: brands.filter((b) => !(b.partnerUserIds.length > 0 || b.isMicrosite)).length,
  }

  if (role === 'partner') {
    return (
      <div>
        <AdminPageHeader title="브랜드 관리" />
        <EmptyState
          title="조합사 권한으로는 접근할 수 없습니다"
          description="자기 브랜드 페이지의 가격·이미지·보조 카피는 좌측 '내 브랜드 페이지'에서 직접 수정하세요."
        />
      </div>
    )
  }

  function deleteBrand(name: string) {
    toast.message(`${name} 브랜드 삭제는 데모에서 mock 처리됩니다. 본 개발에서는 운영 데이터 무결성을 위해 보관 처리 워크플로우가 적용됩니다.`)
  }

  function createBrand() {
    toast.success('신규 브랜드 등록 폼이 열립니다 (mock)', { description: '본 개발에서는 사업자 정보·정산 룰·운영자 계정 권한 단계 진행' })
  }

  return (
    <div>
      <AdminPageHeader
        title="브랜드 관리"
        description={`30개 조합사 · 자체 운영 ${counts.own} · 협력 ${counts.partner}`}
        actions={
          <button
            id="admin-brand-create-button"
            type="button"
            onClick={createBrand}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg"
          >
            <Plus className="h-4 w-4" /> 신규 브랜드 등록
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-md border bg-surface px-2.5 py-1.5 w-64">
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
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
                tab === t.key ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
              )}
            >
              {t.label}
              <span className="rounded-full bg-text-muted/15 px-1.5 py-0.5 text-[10px]">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 브랜드가 없어요"
          description="검색어를 바꾸거나 다른 탭을 눌러 보세요."
          ctaLabel="전체 보기"
          onCta={() => { setQ(''); setTab('all') }}
        />
      ) : (
        <div id="admin-brands-table" className="overflow-hidden rounded-lg border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">브랜드</th>
                <th className="px-3 py-2 font-medium">유형</th>
                <th className="px-3 py-2 font-medium">소개</th>
                <th className="px-3 py-2 font-medium text-right">상품 수</th>
                <th className="px-3 py-2 font-medium text-right">액션</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const isOwn = b.partnerUserIds.length > 0 || b.isMicrosite
                const count = productsByBrand(b.id).length
                return (
                  <tr key={b.id} id={`admin-brand-row-${b.slug}`} className="border-t">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-md">
                          <img src={b.imageUrl} alt={b.name} className="absolute inset-0 h-full w-full object-cover" />
                        </span>
                        <div>
                          <Link href={`/brands/${b.slug}`} className="font-medium text-text hover:underline">{b.name}</Link>
                          <p className="text-[11px] text-text-muted">/{b.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn('rounded px-1.5 py-0.5 text-[11px]', isOwn ? 'bg-accent text-white' : 'bg-surface-2 text-text-muted')}>
                        {b.isMicrosite ? '자체 운영 (마이크로사이트)' : isOwn ? '자체 운영' : '협력 브랜드'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-text-muted">
                      <p className="line-clamp-2 max-w-md">{b.description}</p>
                    </td>
                    <td className="px-3 py-2 text-right">{count}점</td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/admin/cms/partner/${b.slug}`}
                          className="inline-flex items-center gap-1 rounded-md border bg-surface px-2 py-1 text-xs hover:bg-surface-2"
                        >
                          <Pencil className="h-3 w-3" /> 페이지 편집
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteBrand(b.name)}
                          className="inline-flex items-center gap-1 rounded-md border bg-surface px-2 py-1 text-xs text-text-muted hover:bg-surface-2"
                        >
                          <Trash2 className="h-3 w-3" /> 삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
