'use client'

import { useMemo, useState } from 'react'
import { Save, ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Brand, Product, CmsAuditLog } from '@/lib/types'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { RichTextEditor } from '@/components/RichTextEditor'
import { TabsPanel } from '@/components/TabsPanel'
import { usePartnerOverrides, type BrandBanner } from '@/lib/contexts/partnerOverrides'
import { useAuth } from '@/lib/contexts/auth'
import { usePermissionDenied } from '@/components/PermissionDeniedModal'
import { cmsAuditLogs, logsByPartner } from '@/data/cmsAuditLogs'
import { formatKRW, cn } from '@/lib/utils'
import { productImage } from '@/lib/imagePath'

interface Props {
  brand: Brand
  products: Product[]
}

export function PartnerCmsEditor({ brand, products }: Props) {
  const ov = usePartnerOverrides()
  const { user } = useAuth()
  const { recentLogs, appendLog } = usePermissionDenied()

  const baseLogs = useMemo(() => logsByPartner(brand.id), [brand.id])
  const runtimeLogs = recentLogs.filter((l) => l.partnerId === brand.id)
  const allLogs: CmsAuditLog[] = [...runtimeLogs, ...baseLogs]

  const desc = ov.brandDesc[brand.id] ?? `<p>${brand.description}</p>`
  const banners = ov.brandBanners[brand.id] ?? []

  function log(field: string, before: unknown, after: unknown) {
    appendLog({
      id: `ca-runtime-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      partnerId: brand.id,
      userId: user.id,
      field,
      before,
      after,
      at: new Date().toISOString(),
    })
  }

  const publicBrandHref = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/brands/${brand.slug}/`
  const previewAction = {
    label: '공개 페이지에서 보기',
    onClick: () => window.open(publicBrandHref, '_blank', 'noopener,noreferrer'),
  }

  // === 탭1: 페이지 큐레이션 ===
  const curationTab = (
    <div className="space-y-6">
      <section className="rounded-lg border bg-surface p-5">
        <h2 className="mb-2 text-sm font-semibold text-text">브랜드 소개 (페이지 hero 본문)</h2>
        <p className="mb-3 text-[11px] text-text-muted">공개 브랜드 페이지 hero 하단에 표시됩니다.</p>
        <RichTextEditor
          value={desc}
          onChange={(html) => ov.setBrandDesc(brand.id, html)}
          minHeight={140}
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => { log(`brand:${brand.slug}:description`, '...', desc.slice(0, 60) + '...'); toast.success('브랜드 소개가 저장됐어요', { action: previewAction }) }}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg"
          >
            <Save className="h-3.5 w-3.5" /> 소개 저장
          </button>
        </div>
      </section>

      <CurationSection
        brandSlug={brand.slug}
        brandId={brand.id}
        products={products}
        log={log}
      />

      <section className="rounded-lg border bg-surface p-5">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text">시즌 배너 카드</h2>
            <p className="mt-0.5 text-[11px] text-text-muted">브랜드 페이지 상단에 노출되는 배너 (최대 3개)</p>
          </div>
          {banners.length < 3 && (
            <button
              type="button"
              onClick={() => {
                const next: BrandBanner[] = [...banners, { id: `b-${Date.now()}`, title: '새 배너', body: '간단한 설명', cta: '자세히' }]
                ov.setBrandBanners(brand.id, next)
                log(`brand:${brand.slug}:banner`, banners.length, next.length)
              }}
              className="inline-flex items-center gap-1 rounded-md border bg-surface px-2 py-1 text-xs hover:bg-surface-2"
            >
              <Plus className="h-3.5 w-3.5" /> 배너 추가
            </button>
          )}
        </header>
        {banners.length === 0 ? (
          <p className="text-xs text-text-muted">등록된 배너가 없습니다. 위 버튼으로 추가할 수 있어요.</p>
        ) : (
          <ul className="space-y-2">
            {banners.map((b, i) => (
              <li key={b.id} className="rounded-md border bg-surface-2 p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
                  <input
                    value={b.title}
                    onChange={(e) => { const n = [...banners]; n[i] = { ...b, title: e.target.value }; ov.setBrandBanners(brand.id, n) }}
                    placeholder="제목"
                    className="rounded-md border bg-surface px-2 py-1 text-xs outline-none focus:border-primary"
                  />
                  <input
                    value={b.body}
                    onChange={(e) => { const n = [...banners]; n[i] = { ...b, body: e.target.value }; ov.setBrandBanners(brand.id, n) }}
                    placeholder="본문"
                    className="rounded-md border bg-surface px-2 py-1 text-xs outline-none focus:border-primary"
                  />
                  <input
                    value={b.cta}
                    onChange={(e) => { const n = [...banners]; n[i] = { ...b, cta: e.target.value }; ov.setBrandBanners(brand.id, n) }}
                    placeholder="CTA"
                    className="w-24 rounded-md border bg-surface px-2 py-1 text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => { const n = banners.filter((_, j) => j !== i); ov.setBrandBanners(brand.id, n); log(`brand:${brand.slug}:banner-remove`, b.title, '삭제') }}
                    className="rounded-md border bg-surface px-2 py-1 text-xs text-text-muted hover:bg-surface"
                    aria-label="배너 삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )

  // === 탭2: 변경 이력 ===
  const historyTab = (
    <div id="partner-cms-history" className="rounded-lg border bg-surface p-5">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text">변경 이력</h2>
          <p className="text-[11px] text-text-muted">페이지 큐레이션·상품 정보 변경 + 차단된 시도 모두 통합 기록.</p>
        </div>
        <span className="text-xs text-text-muted">총 {allLogs.length}건</span>
      </header>
      <ul className="space-y-1.5">
        {allLogs.slice(0, 30).map((l) => (
          <li key={l.id} className={cn('rounded-md border bg-surface-2 px-3 py-2 text-xs', l.attemptedDeniedAction && 'border-warn/40 bg-warn/5')}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-text">
                {l.attemptedDeniedAction
                  ? `차단된 시도: ${l.attemptedDeniedAction}`
                  : l.field.replace(/^product:/, '').replace(/^brand:/, '').replace(/:/g, ' · ')}
              </span>
              <span className="text-[10px] text-text-muted">{l.at.slice(5, 16).replace('T', ' ')}</span>
            </div>
            {!l.attemptedDeniedAction && (
              <p className="mt-0.5 text-[11px] text-text-muted">
                <span className="line-through">{String(l.before)}</span>
                {' → '}
                <strong className="text-text">{String(l.after)}</strong>
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-text-muted">전체 누적 {cmsAuditLogs.length + runtimeLogs.length}건</p>
    </div>
  )

  // === 탭4: 브랜드 정보 ===
  const infoTab = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-text">브랜드 식별</h2>
        <dl className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">슬러그</dt>
            <dd className="font-medium">{brand.slug}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">유형</dt>
            <dd className="font-medium">
              {brand.isMicrosite ? '자체 운영 (마이크로사이트)' : brand.partnerUserIds.length > 0 ? '자체 운영' : '협력 브랜드'}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">대표 컬러</dt>
            <dd className="inline-flex items-center gap-2 font-medium">
              <span aria-hidden className="h-4 w-4 rounded-full border" style={{ backgroundColor: brand.primaryColor }} />
              {brand.primaryColor}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">로고 letter</dt>
            <dd className="font-medium">{brand.logoLetter}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[11px] text-text-muted">슬러그·유형 변경은 본체 운영자 권한입니다.</p>
      </div>
      <div className="rounded-lg border bg-surface p-5">
        <h2 className="mb-3 text-sm font-semibold text-text">담당 운영자</h2>
        {brand.partnerUserIds.length === 0 ? (
          <p className="text-xs text-text-muted">담당 조합사 운영자가 지정되지 않았습니다.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {brand.partnerUserIds.map((id) => (
              <li key={id} className="rounded-md border bg-surface-2 px-2 py-1 text-xs">{id}</li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11px] text-text-muted">운영자 추가·해제는 회원 관리에서 조정됩니다.</p>
      </div>
    </div>
  )

  return (
    <div>
      <AdminPageHeader
        title={`${brand.name} 페이지 편집`}
        description="페이지 큐레이션과 상품 정보 편집을 탭으로 분리했습니다. 변경 사항은 공개 페이지에 즉시 반영됩니다."
      />
      <TabsPanel
        items={[
          { key: 'curation', label: '페이지 큐레이션', content: curationTab },
          { key: 'history', label: '변경 이력', count: allLogs.length, content: historyTab },
          { key: 'info', label: '브랜드 정보', content: infoTab },
        ]}
      />
    </div>
  )
}

interface CurationSectionProps {
  brandSlug: string
  brandId: string
  products: Product[]
  log: (field: string, before: unknown, after: unknown) => void
}

function previewActionFor(slug: string) {
  return {
    label: '공개 페이지에서 보기',
    onClick: () => window.open(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/brands/${slug}/`, '_blank', 'noopener,noreferrer'),
  }
}

function CurationSection({ brandSlug, brandId, products, log }: CurationSectionProps) {
  const ov = usePartnerOverrides()
  const curated = ov.curated[brandId] ?? []
  const isCurating = curated.length > 0
  const curatedProducts = curated.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[]
  const notCurated = products.filter((p) => !curated.includes(p.id))

  return (
    <section className="rounded-lg border bg-surface p-5">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text">노출 상품 큐레이션</h2>
          <p className="mt-0.5 text-[11px] text-text-muted">
            {isCurating
              ? `${curated.length}개 큐레이션 · 전체 ${products.length}개 중. 큐레이션을 비우면 전체 자동 노출로 복귀.`
              : `현재 큐레이션 없음 — brand의 전체 ${products.length}개가 자동 노출됩니다. 아래 "상품 추가"로 큐레이션을 시작하세요.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCurating && (
            <button
              type="button"
              onClick={() => { ov.resetCurated(brandId); log(`brand:${brandSlug}:curation-reset`, `${curated.length}개`, '전체 노출') }}
              className="rounded-md border bg-surface px-2 py-1 text-xs text-text-muted hover:bg-surface-2"
            >
              큐레이션 초기화
            </button>
          )}
          <AddProductsDialog brandId={brandId} brandSlug={brandSlug} candidates={notCurated} log={log} />
        </div>
      </header>
      {curatedProducts.length === 0 ? (
        <div className="rounded-md border border-dashed bg-surface-2 px-3 py-6 text-center text-xs text-text-muted">
          큐레이션이 비어 있어요. 상단의 "+ 상품 추가" 버튼으로 노출할 상품을 선택해 보세요.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {curatedProducts.map((p) => (
            <li key={p.id} className="flex items-center gap-2 rounded-md border bg-surface-2 px-3 py-2 text-sm">
              <div className="relative h-8 w-8 overflow-hidden rounded-md bg-surface">
                <img src={productImage(p.axes.category, p.axes.subCategory, p.id, 0, { name: p.name, slug: p.slug })} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
                {ov.thumbs[p.id] && (
                  <span className="absolute bottom-0 right-0 rounded-tl bg-surface/95 px-1 text-[9px] font-medium leading-tight text-text">{ov.thumbs[p.id]}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{p.name}</p>
                <p className="text-[11px] text-text-muted">
                  {p.axes.category}{p.axes.subCategory ? ` / ${p.axes.subCategory}` : ''} · {formatKRW(ov.prices[p.id] ?? p.priceSale)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { ov.moveCurated(brandId, p.id, -1); log(`brand:${brandSlug}:curation-order`, '', `${p.name} ↑`) }}
                  className="rounded p-1 text-text-muted hover:bg-surface hover:text-text"
                  aria-label="위로"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => { ov.moveCurated(brandId, p.id, 1); log(`brand:${brandSlug}:curation-order`, '', `${p.name} ↓`) }}
                  className="rounded p-1 text-text-muted hover:bg-surface hover:text-text"
                  aria-label="아래로"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ov.removeCurated(brandId, p.id)
                    log(`brand:${brandSlug}:curation-remove`, p.name, '삭제')
                    toast.message(`${p.name} 큐레이션에서 제거`, { action: previewActionFor(brandSlug) })
                  }}
                  className="ml-1 rounded p-1 text-text-muted hover:bg-danger/10 hover:text-danger"
                  aria-label="삭제"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

interface AddProductsDialogProps {
  brandId: string
  brandSlug: string
  candidates: Product[]
  log: (field: string, before: unknown, after: unknown) => void
}

function AddProductsDialog({ brandId, brandSlug, candidates, log }: AddProductsDialogProps) {
  const ov = usePartnerOverrides()
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [q, setQ] = useState('')

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function confirm() {
    if (picked.size === 0) { setOpen(false); return }
    ov.addCurated(brandId, Array.from(picked))
    log(`brand:${brandSlug}:curation-add`, '추가 전', `${picked.size}개 추가`)
    toast.success(`${picked.size}개 상품을 큐레이션에 추가했어요`, { action: previewActionFor(brandSlug) })
    setPicked(new Set())
    setOpen(false)
  }

  const filtered = q.trim()
    ? candidates.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()))
    : candidates

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setPicked(new Set()); setQ('') }}
        disabled={candidates.length === 0}
        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg disabled:opacity-50"
      >
        <Plus className="h-3.5 w-3.5" /> 상품 추가
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setOpen(false)}>
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-surface shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="border-b px-5 py-3">
              <h4 className="text-sm font-semibold text-text">노출 상품 추가</h4>
              <p className="mt-1 text-[11px] text-text-muted">현재 큐레이션에 없는 brand 상품 {candidates.length}개 중 선택. 추가한 순서대로 페이지에 노출됩니다.</p>
            </header>
            <div className="border-b px-5 py-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="상품명 검색"
                className="w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <ul className="flex-1 overflow-y-auto px-5 py-3">
              {filtered.length === 0 ? (
                <li className="rounded-md border border-dashed bg-surface-2 px-3 py-6 text-center text-xs text-text-muted">
                  추가할 수 있는 상품이 없습니다.
                </li>
              ) : (
                filtered.map((p) => {
                  const isPicked = picked.has(p.id)
                  return (
                    <li
                      key={p.id}
                      onClick={() => toggle(p.id)}
                      className={cn(
                        'mb-1.5 flex cursor-pointer items-center gap-2 rounded-md border bg-surface-2 px-3 py-2',
                        isPicked && 'border-primary bg-primary/10',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isPicked}
                        onChange={() => toggle(p.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={p.name}
                      />
                      <div className="relative h-8 w-8 overflow-hidden rounded-md bg-surface">
                        <img src={productImage(p.axes.category, p.axes.subCategory, p.id, 1, { name: p.name, slug: p.slug })} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
                        {ov.thumbs[p.id] && (
                          <span className="absolute bottom-0 right-0 rounded-tl bg-surface/95 px-1 text-[9px] font-medium leading-tight text-text">{ov.thumbs[p.id]}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text">{p.name}</p>
                        <p className="text-[11px] text-text-muted">
                          {p.axes.category}{p.axes.subCategory ? ` / ${p.axes.subCategory}` : ''} · {formatKRW(ov.prices[p.id] ?? p.priceSale)}
                        </p>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
            <footer className="flex items-center justify-between border-t px-5 py-3">
              <p className="text-xs text-text-muted">{picked.size}개 선택</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border bg-surface px-3 py-1.5 text-xs hover:bg-surface-2"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={picked.size === 0}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg disabled:opacity-50"
                >
                  노출 추가
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  )
}
