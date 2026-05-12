'use client'

import { useState } from 'react'
import { Tag, Percent, Truck, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { coupons } from '@/data/coupons'
import { formatKRW, cn } from '@/lib/utils'
import type { Coupon } from '@/lib/types'

const typeLabel: Record<Coupon['type'], string> = {
  fixed: '정액 할인',
  percent: '정률 할인',
  shipping: '배송비 면제',
  set: '세트 할인',
}
const typeIcon: Record<Coupon['type'], React.ElementType> = {
  fixed: Tag,
  percent: Percent,
  shipping: Truck,
  set: Layers,
}

export default function AdminCouponsPage() {
  const [issued, setIssued] = useState<Record<string, boolean>>({})

  function issueAll(id: string) {
    setIssued((v) => ({ ...v, [id]: true }))
    toast.success('전체 회원에게 일괄 발급됐어요 (mock)')
  }

  function revoke(id: string) {
    setIssued((v) => ({ ...v, [id]: false }))
    toast.message('쿠폰을 회수했어요 (mock)')
  }

  return (
    <div>
      <AdminPageHeader
        title="쿠폰 관리"
        description={`총 ${coupons.length}종 · 발급/회수와 사용률 모니터링`}
        actions={
          <button type="button" className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg">
            신규 쿠폰 만들기
          </button>
        }
      />

      <div id="admin-coupons-grid" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => {
          const Icon = typeIcon[c.type]
          const valueLabel = c.type === 'percent' || c.type === 'set'
            ? `${c.value}% 할인`
            : c.type === 'shipping'
              ? '배송비 면제'
              : `${formatKRW(c.value)} 할인`
          return (
            <article
              key={c.id}
              id={`admin-coupon-card-${c.id}`}
              className="flex flex-col gap-3 rounded-lg border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                  <Icon className="h-3 w-3" /> {typeLabel[c.type]}
                </span>
                <span className={cn('text-[11px]', issued[c.id] ? 'text-success' : 'text-text-muted')}>
                  {issued[c.id] ? '발급 진행 중' : '준비'}
                </span>
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
              <div className="mt-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => issueAll(c.id)}
                  className="flex-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-fg"
                >
                  전체 발급
                </button>
                <button
                  type="button"
                  onClick={() => revoke(c.id)}
                  className="flex-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs font-medium hover:bg-surface-2"
                >
                  회수
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
