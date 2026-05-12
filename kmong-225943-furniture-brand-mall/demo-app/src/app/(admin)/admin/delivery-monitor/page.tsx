'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { toast } from 'sonner'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from 'recharts'
import { Sparkles, Truck } from 'lucide-react'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { orders } from '@/data/orders'
import { userById } from '@/data/users'
import { formatKRW, formatDate, cn } from '@/lib/utils'

const DAILY_COMPENSATION = 5000

function diffDays(a: string, b: string): number {
  const aMs = new Date(a).getTime()
  const bMs = new Date(b).getTime()
  return Math.max(0, Math.floor((aMs - bMs) / (1000 * 60 * 60 * 24)))
}

export default function DeliveryMonitorPage() {
  const { delayedOrders, kpis, chart } = useMemo(() => {
    const delayed = orders.filter((o) => o.status === 'delayed')
    const totalCompensation = delayed
      .filter((o) => o.compensationIssued)
      .reduce((acc, o) => acc + diffDays(o.virtualNowAt, o.scheduledDeliveryAt) * DAILY_COMPENSATION, 0)
    const avgDelay = delayed.length === 0 ? 0 : Math.round(
      delayed.reduce((acc, o) => acc + diffDays(o.virtualNowAt, o.scheduledDeliveryAt), 0) / delayed.length,
    )
    const today = new Date('2026-05-11T00:00:00+09:00')
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      return { iso: d.toISOString(), label: `${d.getMonth() + 1}/${d.getDate()}` }
    })
    const chart = days.map((d) => ({
      day: d.label,
      compensation: Math.round(20000 + Math.random() * 80000),
    }))
    return {
      delayedOrders: delayed,
      kpis: {
        totalOrders: orders.length,
        delayedCount: delayed.length,
        totalCompensation,
        avgDelay,
      },
      chart,
    }
  }, [])

  function retry(orderId: string) {
    toast.success(`${orderId} 자동 보상 발급을 재시도했어요 (mock)`)
  }

  return (
    <div>
      <AdminPageHeader
        title="배송 지연 자동 보상 모니터"
        description="매일 새벽 Cron이 예약일 초과 주문에 적립금을 자동 지급합니다. 데모는 mock 추정치 일부 포함."
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-4">
        <Card label="총 주문" value={`${kpis.totalOrders}건`} hint="최근 60일" />
        <Card label="현재 지연" value={`${kpis.delayedCount}건`} hint="자동 보상 대상" />
        <Card label="누적 자동 보상" value={formatKRW(kpis.totalCompensation)} hint="현재까지 지급액" />
        <Card label="평균 지연일" value={`${kpis.avgDelay}일`} hint="지연 주문 기준" />
      </section>

      <section className="mb-6 rounded-lg border bg-surface p-5">
        <header className="mb-3">
          <h2 className="text-base font-semibold text-text">7일 자동 보상 발급 추이</h2>
          <p className="text-xs text-text-muted">데모 환경의 mock 추정치</p>
        </header>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                cursor={{ fill: 'var(--surface-2)' }}
                contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                formatter={(v) => formatKRW(typeof v === 'number' ? v : Number(v) || 0)}
              />
              <Bar dataKey="compensation" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-lg border bg-surface">
        <header className="border-b p-4">
          <h2 className="text-base font-semibold text-text">지연 주문 ({delayedOrders.length})</h2>
        </header>
        <div id="delivery-monitor-table" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs text-text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">주문 ID</th>
                <th className="px-3 py-2 font-medium">회원</th>
                <th className="px-3 py-2 font-medium">예약 도착</th>
                <th className="px-3 py-2 font-medium">현재(가상)</th>
                <th className="px-3 py-2 font-medium text-right">지연일</th>
                <th className="px-3 py-2 font-medium text-right">자동 보상</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium text-right" />
              </tr>
            </thead>
            <tbody>
              {delayedOrders.map((o) => {
                const u = userById(o.userId)
                const lateBy = diffDays(o.virtualNowAt, o.scheduledDeliveryAt)
                return (
                  <tr key={o.id} className="border-t">
                    <td className="px-3 py-2 font-medium">
                      <Link href={`/account/orders/${o.id}`} className="hover:underline">{o.id}</Link>
                    </td>
                    <td className="px-3 py-2 text-text-muted">{u?.name ?? '게스트'}</td>
                    <td className="px-3 py-2 text-text-muted">{formatDate(o.scheduledDeliveryAt)}</td>
                    <td className="px-3 py-2 text-text-muted">{formatDate(o.virtualNowAt)}</td>
                    <td className="px-3 py-2 text-right text-warn">+{lateBy}일</td>
                    <td className="px-3 py-2 text-right">{formatKRW(lateBy * DAILY_COMPENSATION)}</td>
                    <td className="px-3 py-2 text-xs">
                      {o.compensationIssued
                        ? <span className="inline-flex items-center gap-1 text-success"><Sparkles className="h-3.5 w-3.5" /> 지급됨</span>
                        : <span className="inline-flex items-center gap-1 text-warn"><Truck className="h-3.5 w-3.5" /> 대기</span>}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        id={`delivery-monitor-retry-${o.id}`}
                        type="button"
                        onClick={() => retry(o.id)}
                        className="rounded-md border bg-surface px-2 py-1 text-xs hover:bg-surface-2"
                      >
                        재시도
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className={cn('rounded-lg border bg-surface p-4')}>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-text">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-text-muted">{hint}</p>}
    </article>
  )
}
