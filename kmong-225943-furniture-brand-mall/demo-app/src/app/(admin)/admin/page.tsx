'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { TrendingUp, Filter, Clock, Sparkles, Globe, Users as UsersIcon } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from 'recharts'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { orders } from '@/data/orders'
import { cmsAuditLogs } from '@/data/cmsAuditLogs'
import { userById } from '@/data/users'
import { formatKRW, formatDate, addDays, cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

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

export default function AdminDashboardPage() {
  const { revenueChart, recentOrders, delayedOrders, kpi3, kpi5 } = useMemo(() => {
    const today = new Date('2026-05-11T00:00:00+09:00')
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      const iso = d.toISOString()
      return { iso, label: `${d.getMonth() + 1}/${d.getDate()}` }
    })
    const revenueChart = days.map((d) => {
      const dayStart = new Date(d.iso).getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000
      const total = orders
        .filter((o) => {
          const t = new Date(o.createdAt).getTime()
          return t >= dayStart && t < dayEnd
        })
        .reduce((acc, o) => acc + (o.totalPrice - o.couponDiscount - o.rewardUsed), 0)
      return { day: d.label, revenue: total || Math.round(800000 + Math.random() * 1500000) }
    })
    const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
    const delayedOrders = orders.filter((o) => o.status === 'delayed')
    const compensated = delayedOrders.filter((o) => o.compensationIssued).length
    const kpi3 = delayedOrders.length === 0 ? 100 : Math.round((compensated / delayedOrders.length) * 100)
    const partnerEdits = cmsAuditLogs.filter((l) => !l.attemptedDeniedAction).length
    const kpi5 = cmsAuditLogs.length === 0 ? 0 : Math.round((partnerEdits / cmsAuditLogs.length) * 100)
    return { revenueChart, recentOrders, delayedOrders, kpi3, kpi5 }
  }, [])

  const kpis = [
    { id: 1, icon: Filter, label: '다축 필터 사용률', value: '67%', target: '≥ 50%', desc: '방문자 중 1개 이상 필터 적용' },
    { id: 2, icon: Clock, label: '상품 상세 평균 체류', value: '78초', target: '≥ 60초', desc: '데모 환경 mock 추정치' },
    { id: 3, icon: Sparkles, label: '배송 지연 자동 보상', value: `${kpi3}%`, target: '100%', desc: `지연 ${delayedOrders.length}건 중 자동 발급` },
    { id: 4, icon: Globe, label: '마홀앤→본체 전환율', value: '6.2%', target: '≥ 5%', desc: '마이크로사이트 진입 → 본체 결제' },
    { id: 5, icon: UsersIcon, label: '조합사 자가 편집', value: `${kpi5}%`, target: '≥ 80%', desc: '권한 차단 시도 제외 비율' },
  ]

  return (
    <div>
      <AdminPageHeader
        title="운영 대시보드"
        description="2026-05-11 기준, 최근 7일. 데모 환경의 mock 추정치가 일부 포함됩니다."
      />

      <section aria-label="KPI" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <article key={k.id} id={`admin-stat-kpi-${k.id}`} className="rounded-lg border bg-surface p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-text-muted" aria-hidden />
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-muted">KPI-{k.id}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-text">{k.value}</p>
              <p className="mt-0.5 text-xs text-text-muted">{k.label}</p>
              <p className="mt-2 text-[11px] text-text-muted">목표 {k.target}</p>
              <p className="mt-1 text-[11px] text-text-muted">{k.desc}</p>
            </article>
          )
        })}
      </section>

      <section className="mb-8 rounded-lg border bg-surface p-5">
        <header className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-text">7일 매출</h2>
            <p className="text-xs text-text-muted">결제 완료 + 배송 중 + 배송 완료 합계 (쿠폰·적립 차감 후)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3.5 w-3.5" /> 전주 대비 +12.4%
          </span>
        </header>
        <div id="admin-revenue-chart" className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
              />
              <Tooltip
                cursor={{ fill: 'var(--surface-2)' }}
                contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                formatter={(v) => formatKRW(typeof v === 'number' ? v : Number(v) || 0)}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div id="admin-recent-orders" className="rounded-lg border bg-surface p-5">
          <h2 className="mb-3 text-base font-semibold text-text">최근 주문</h2>
          <ul className="space-y-2">
            {recentOrders.map((o) => {
              const u = userById(o.userId)
              return (
                <li key={o.id} className="flex items-center justify-between rounded-md border bg-surface-2 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px]', statusColor[o.status])}>{statusLabel[o.status]}</span>
                    <Link href={`/account/orders/${o.id}`} className="font-medium hover:underline">{o.id}</Link>
                    <span className="text-xs text-text-muted">{u?.name ?? '게스트'}</span>
                  </span>
                  <span className="text-text-muted">{formatKRW(o.totalPrice)}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="rounded-lg border border-warn/40 bg-warn/5 p-5">
          <h2 className="mb-3 text-base font-semibold text-warn">지연 알림 ({delayedOrders.length})</h2>
          {delayedOrders.length === 0 ? (
            <p className="text-sm text-text-muted">현재 지연 상태인 주문이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {delayedOrders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm">
                  <span>
                    <Link href={`/account/orders/${o.id}`} className="font-medium hover:underline">{o.id}</Link>
                    <span className="ml-2 text-xs text-text-muted">예약 {formatDate(o.scheduledDeliveryAt)}</span>
                  </span>
                  <span className={cn('text-xs', o.compensationIssued ? 'text-success' : 'text-warn')}>
                    {o.compensationIssued ? '자동 보상 지급됨' : '대기 중'}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-text-muted">매일 새벽 Cron이 예약일을 초과한 주문에 대해 자동 보상 적립금을 지급합니다.</p>
        </div>
      </section>

      <p className="mt-6 text-[11px] text-text-muted">최근 데이터 갱신 {formatDate(addDays(new Date().toISOString(), 0))}</p>
    </div>
  )
}
