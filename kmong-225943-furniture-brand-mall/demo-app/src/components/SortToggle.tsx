'use client'

import { cn } from '@/lib/utils'

export type SortKey = 'popular' | 'new' | 'price-asc' | 'price-desc'

const options: Array<{ key: SortKey; label: string }> = [
  { key: 'popular', label: '인기순' },
  { key: 'new', label: '신상순' },
  { key: 'price-asc', label: '가격 낮은순' },
  { key: 'price-desc', label: '가격 높은순' },
]

export function SortToggle({ value, onChange }: { value: SortKey; onChange: (key: SortKey) => void }) {
  return (
    <div id="sort-toggle" role="tablist" className="inline-flex items-center gap-1 rounded-md border bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.key}
          id={`sort-option-${o.key}`}
          type="button"
          role="tab"
          aria-selected={value === o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            'rounded px-2.5 py-1 text-xs font-medium',
            value === o.key ? 'bg-primary text-primary-fg' : 'text-text-muted hover:text-text',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function sortProducts<T extends { priceSale: number; reviewCount: number; id: string }>(arr: T[], key: SortKey): T[] {
  const sorted = [...arr]
  if (key === 'popular') sorted.sort((a, b) => b.reviewCount - a.reviewCount)
  if (key === 'new') sorted.sort((a, b) => a.id.localeCompare(b.id))
  if (key === 'price-asc') sorted.sort((a, b) => a.priceSale - b.priceSale)
  if (key === 'price-desc') sorted.sort((a, b) => b.priceSale - a.priceSale)
  return sorted
}
