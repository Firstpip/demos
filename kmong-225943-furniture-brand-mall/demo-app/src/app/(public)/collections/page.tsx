'use client'

import { useMemo, useState } from 'react'
import { CollectionCard } from '@/components/CollectionCard'
import { EmptyState } from '@/components/states'
import { collections } from '@/data/collections'
import { cn } from '@/lib/utils'

const seasons = ['ALL', '26SS', '26FW', 'EVERGREEN'] as const

export default function CollectionsPage() {
  const [season, setSeason] = useState<(typeof seasons)[number]>('ALL')
  const list = useMemo(
    () => (season === 'ALL' ? collections : collections.filter((c) => c.season === season)),
    [season],
  )

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-text">컬렉션</h1>
        <p className="mt-1 text-sm text-text-muted">
          시즌·테마 컬렉션 12개. 컬렉션 안에서 다축 필터로 후보를 좁힐 수 있습니다.
        </p>
      </header>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="시즌 필터">
        {seasons.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={season === s}
            onClick={() => setSeason(s)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium',
              season === s
                ? 'border-primary bg-primary text-primary-fg'
                : 'border-border bg-surface text-text-muted hover:border-primary',
            )}
          >
            {s === 'ALL' ? '전체' : s}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState
          title="해당 시즌의 컬렉션이 없습니다"
          description="다른 시즌 탭을 눌러 보세요."
          ctaLabel="전체 보기"
          onCta={() => setSeason('ALL')}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      )}
    </div>
  )
}
