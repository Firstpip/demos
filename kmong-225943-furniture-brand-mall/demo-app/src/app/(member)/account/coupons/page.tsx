'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronRight, Tag, Percent, Truck, Layers, Gift } from 'lucide-react'
import { toast } from 'sonner'
import { coupons } from '@/data/coupons'
import { formatKRW, cn } from '@/lib/utils'
import type { Coupon } from '@/lib/types'

const STORAGE_KEY = 'kmong225943:claimedCoupons'

const typeIcon: Record<Coupon['type'], React.ElementType> = {
  fixed: Tag,
  percent: Percent,
  shipping: Truck,
  set: Layers,
}
const typeLabel: Record<Coupon['type'], string> = {
  fixed: '정액 할인',
  percent: '정률 할인',
  shipping: '배송비 면제',
  set: '세트 할인',
}

export default function MyCouponsPage() {
  const [claimed, setClaimed] = useState<Record<string, boolean>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setClaimed(JSON.parse(raw) as Record<string, boolean>)
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(claimed)) } catch { /* ignore */ }
  }, [claimed, hydrated])

  function claim(c: Coupon) {
    setClaimed((prev) => ({ ...prev, [c.id]: true }))
    toast.success(`${c.name} 쿠폰을 받았어요`, { description: `결제 단계에서 ${c.code} 코드로 사용` })
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-3 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/account" className="hover:text-text">마이페이지</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">쿠폰</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-text">쿠폰</h1>
        <p className="mt-1 text-sm text-text-muted">전체 {coupons.length}장 · 받은 쿠폰은 결제 단계에서 자동 적용 가능</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => {
          const Icon = typeIcon[c.type]
          const isClaimed = hydrated && Boolean(claimed[c.id])
          const valueLabel = c.type === 'percent' || c.type === 'set'
            ? `${c.value}% 할인`
            : c.type === 'shipping'
              ? '배송비 면제'
              : `${formatKRW(c.value)} 할인`
          return (
            <article key={c.id} className="flex flex-col gap-3 rounded-lg border bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                  <Icon className="h-3 w-3" /> {typeLabel[c.type]}
                </span>
                {isClaimed && <span className="text-[11px] font-medium text-success">받음</span>}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted">{c.code}</p>
                <p className="mt-0.5 text-sm font-semibold text-text">{c.name}</p>
                <p className="mt-1 text-base font-medium">{valueLabel}</p>
              </div>
              <ul className="space-y-0.5 text-[11px] text-text-muted">
                <li>최소 주문 {formatKRW(c.minOrder)}</li>
                <li>만료 {c.expiresAt}</li>
              </ul>
              <button
                type="button"
                onClick={() => claim(c)}
                disabled={isClaimed}
                className={cn(
                  'mt-auto inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium',
                  isClaimed
                    ? 'cursor-default border bg-surface-2 text-text-muted'
                    : 'bg-primary text-primary-fg hover:opacity-90',
                )}
              >
                <Gift className="h-3.5 w-3.5" /> {isClaimed ? '이미 받음' : '쿠폰 받기'}
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
