'use client'

import { useMemo } from 'react'
import { X } from 'lucide-react'
import type { FilterAxis, Product } from '@/lib/types'
import { brandById, brands } from '@/data/brands'
import { cn } from '@/lib/utils'

export interface FilterState {
  use: string[]
  brand: string[]
  material: string[]
  delivery: string[]
  price: string[]
  color: string[]
  size: string[]
}

export const emptyFilter: FilterState = {
  use: [], brand: [], material: [], delivery: [], price: [], color: [], size: [],
}

const PRICE_RANGES: Array<{ key: string; label: string; min: number; max: number }> = [
  { key: '~30만', label: '~30만원', min: 0, max: 300000 },
  { key: '30~70만', label: '30~70만원', min: 300000, max: 700000 },
  { key: '70~150만', label: '70~150만원', min: 700000, max: 1500000 },
  { key: '150만+', label: '150만원 이상', min: 1500000, max: Infinity },
]

const DELIVERY_BUCKETS: Array<{ key: string; label: string; max: number }> = [
  { key: '3일내', label: '3일 내', max: 3 },
  { key: '1주내', label: '1주 내', max: 7 },
  { key: '2주내', label: '2주 내', max: 14 },
  { key: '한달내', label: '한 달 내', max: 30 },
]

interface AxisDef {
  key: FilterAxis
  label: string
  options: Array<{ key: string; label: string }>
}

export function buildAxes(source: Product[]): AxisDef[] {
  const uniq = (arr: string[]) => Array.from(new Set(arr)).sort()
  const uses = uniq(source.flatMap((p) => p.axes.use))
  const brandList = uniq(source.map((p) => p.brandId))
  const materials = uniq(source.flatMap((p) => p.axes.material))
  const colors = uniq(source.flatMap((p) => p.options.color))
  const sizes = uniq(source.flatMap((p) => p.options.size))
  return [
    { key: 'use', label: '용도', options: uses.map((u) => ({ key: u, label: u })) },
    { key: 'brand', label: '브랜드', options: brandList.map((b) => ({ key: b, label: brandById(b)?.name ?? b })) },
    { key: 'material', label: '소재', options: materials.map((m) => ({ key: m, label: m })) },
    { key: 'color', label: '컬러', options: colors.map((c) => ({ key: c, label: c })) },
    { key: 'size', label: '사이즈', options: sizes.map((s) => ({ key: s, label: s })) },
    { key: 'delivery', label: '배송일', options: DELIVERY_BUCKETS.map((d) => ({ key: d.key, label: d.label })) },
    { key: 'price', label: '가격', options: PRICE_RANGES.map((p) => ({ key: p.key, label: p.label })) },
  ]
}

export function applyFilter(source: Product[], state: FilterState): Product[] {
  return source.filter((p) => {
    if (state.use.length && !p.axes.use.some((u) => state.use.includes(u))) return false
    if (state.brand.length && !state.brand.includes(p.brandId)) return false
    if (state.material.length && !p.axes.material.some((m) => state.material.includes(m))) return false
    if (state.color.length && !p.options.color.some((c) => state.color.includes(c))) return false
    if (state.size.length && !p.options.size.some((s) => state.size.includes(s))) return false
    if (state.delivery.length) {
      const ok = state.delivery.some((key) => {
        const bucket = DELIVERY_BUCKETS.find((b) => b.key === key)
        return bucket ? p.axes.deliveryDays <= bucket.max : true
      })
      if (!ok) return false
    }
    if (state.price.length) {
      const ok = state.price.some((key) => {
        const range = PRICE_RANGES.find((r) => r.key === key)
        return range ? p.priceSale >= range.min && p.priceSale < range.max : true
      })
      if (!ok) return false
    }
    return true
  })
}

interface PanelProps {
  source: Product[]
  state: FilterState
  onChange: (next: FilterState) => void
}

export function FilterPanel({ source, state, onChange }: PanelProps) {
  const axes = useMemo(() => buildAxes(source), [source])

  function toggle(axis: FilterAxis, key: string) {
    const current = state[axis]
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    onChange({ ...state, [axis]: next })
  }

  return (
    <aside aria-label="상품 필터" className="rounded-lg border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-text">필터</p>
        <button
          type="button"
          id="filter-reset-button"
          onClick={() => onChange(emptyFilter)}
          className="text-xs text-text-muted hover:text-text"
        >
          전체 초기화
        </button>
      </div>
      <div className="space-y-4">
        {axes.map((axis) => (
          <div key={axis.key}>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-text-muted">
              {axis.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {axis.options.map((opt) => {
                const active = state[axis.key].includes(opt.key)
                return (
                  <button
                    key={opt.key}
                    type="button"
                    id={`filter-chip-${axis.key}-${opt.key}`}
                    data-rid="R-01"
                    aria-pressed={active}
                    onClick={() => toggle(axis.key, opt.key)}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      active ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export function AppliedChips({ state, onChange }: { state: FilterState; onChange: (next: FilterState) => void }) {
  const all: Array<{ axis: FilterAxis; key: string; label: string }> = []
  ;(Object.keys(state) as FilterAxis[]).forEach((axis) => {
    state[axis].forEach((key) => {
      const label = axis === 'brand' ? brands.find((b) => b.id === key)?.name ?? key : key
      all.push({ axis, key, label })
    })
  })
  if (!all.length) return null
  return (
    <div id="filter-applied-bar" className="mb-3 flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-text-muted">적용 필터</span>
      {all.map((c) => (
        <button
          key={`${c.axis}-${c.key}`}
          type="button"
          onClick={() => onChange({ ...state, [c.axis]: state[c.axis].filter((k) => k !== c.key) })}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20"
        >
          {c.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(emptyFilter)}
        className="ml-1 text-xs text-text-muted hover:text-text"
      >
        모두 지우기
      </button>
    </div>
  )
}
