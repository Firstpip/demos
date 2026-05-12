'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { orders } from '@/data/orders'
import { userById } from '@/data/users'
import { EmptyState } from '@/components/states'
import { formatKRW, formatDate, cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

const tabs: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'paid', label: '결제 완료' },
  { key: 'preparing', label: '배송 준비' },
  { key: 'shipping', label: '배송 중' },
  { key: 'delivered', label: '배송 완료' },
  { key: 'delayed', label: '지연' },
  { key: 'refunded', label: '환불' },
]

const statusColor: Record<OrderStatus, string> = {
  paid: 'bg-surface-2 text-text',
  preparing: 'bg-accent text-white',
  shipping: 'bg-primary text-white',
  delivered: 'bg-success text-white',
  delayed: 'bg-warn text-white',
  refunded: 'bg-danger text-white',
}
const statusLabel: Record<OrderStatus, string> = {
  paid: '결제 완료',
  preparing: '배송 준비',
  shipping: '배송 중',
  delivered: '배송 완료',
  delayed: '지연',
  refunded: '환불',
}

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<OrderStatus | 'all'>('all')
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const map: Record<OrderStatus | 'all', number> = {
      all: orders.length, paid: 0, preparing: 0, shipping: 0, delivered: 0, delayed: 0, refunded: 0,
    }
    orders.forEach((o) => { map[o.status] += 1 })
    return map
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return orders.filter((o) => {
      if (tab !== 'all' && o.status !== tab) return false
      if (!term) return true
      const u = userById(o.userId)
      return o.id.toLowerCase().includes(term) || (u?.name.toLowerCase().includes(term) ?? false)
    })
  }, [tab, q])

  return (
    <div>
      <AdminPageHeader
        title="주문 관리"
        description={`총 ${orders.length.toLocaleString()}건 · 지연 ${counts.delayed}건`}
      />

      <div className="mb-3 flex flex-wrap gap-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            id={`admin-orders-tab-${t.key}`}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
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

      <div className="mb-3 inline-flex items-center gap-2 rounded-md border bg-surface px-2.5 py-1.5 w-72">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          id="admin-orders-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="주문 ID 또는 회원명 검색"
          className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="해당 조건의 주문이 없어요" description="다른 탭이나 검색어를 시도해 보세요." />
      ) : (
        <div id="admin-orders-table" className="overflow-hidden rounded-lg border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">주문 ID</th>
                <th className="px-3 py-2 font-medium">회원</th>
                <th className="px-3 py-2 font-medium text-right">상품 수</th>
                <th className="px-3 py-2 font-medium text-right">결제 금액</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium">예약 도착</th>
                <th className="px-3 py-2 font-medium">자동 보상</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const u = userById(o.userId)
                return (
                  <tr key={o.id} className="border-t">
                    <td className="px-3 py-2 font-medium">{o.id}</td>
                    <td className="px-3 py-2 text-text-muted">{u?.name ?? '게스트'}</td>
                    <td className="px-3 py-2 text-right text-text-muted">{o.items.length}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatKRW(o.totalPrice - o.couponDiscount - o.rewardUsed)}</td>
                    <td className="px-3 py-2">
                      <span className={cn('rounded px-2 py-0.5 text-[11px]', statusColor[o.status])}>{statusLabel[o.status]}</span>
                    </td>
                    <td className="px-3 py-2 text-text-muted">{formatDate(o.scheduledDeliveryAt)}</td>
                    <td className="px-3 py-2 text-xs">
                      {o.status === 'delayed' ? (
                        o.compensationIssued ? <span className="text-success">지급됨</span> : <span className="text-warn">대기</span>
                      ) : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      <Link href={`/account/orders/${o.id}`} className="text-accent hover:underline">상세</Link>
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
