'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { ShoppingBag, Tag, Coins, Heart } from 'lucide-react'
import { TabsPanel } from '@/components/TabsPanel'
import { useAuth } from '@/lib/contexts/auth'
import { useRewards } from '@/lib/contexts/rewards'
import { ordersByUser } from '@/data/orders'
import { coupons } from '@/data/coupons'
import { products } from '@/data/products'
import { brandById } from '@/data/brands'
import { formatKRW, formatDate, cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'
import { EmptyState } from '@/components/states'

const statusLabel: Record<OrderStatus, string> = {
  paid: '결제 완료',
  preparing: '배송 준비',
  shipping: '배송 중',
  delivered: '배송 완료',
  delayed: '지연',
  refunded: '환불',
}
const statusColor: Record<OrderStatus, string> = {
  paid: 'bg-surface-2 text-text',
  preparing: 'bg-accent text-white',
  shipping: 'bg-primary text-white',
  delivered: 'bg-success text-white',
  delayed: 'bg-warn text-white',
  refunded: 'bg-danger text-white',
}

export default function AccountPage() {
  const { user, userId } = useAuth()
  const { balanceForUser, entries } = useRewards()
  const orders = useMemo(() => {
    const own = ordersByUser(userId)
    if (own.length > 0) return own
    return ordersByUser('user-member-1').slice(0, 8)
  }, [userId])
  const balance = balanceForUser(userId) || balanceForUser('user-member-1')
  const wishlist = products.slice(0, 6)
  const myCoupons = coupons.slice(0, 4)
  const recent = entries
    .filter((e) => e.userId === userId || e.userId === 'user-member-1')
    .slice(0, 6)

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">{user.name}님의 마이페이지</h1>
          <p className="mt-1 text-sm text-text-muted">주문·쿠폰·적립금·관심 가구를 한 자리에서 관리하세요.</p>
        </div>
      </header>

      <section aria-label="요약 카드" className="mb-8 grid gap-3 sm:grid-cols-4">
        <SummaryCard icon={ShoppingBag} label="진행 중 주문" value={orders.filter((o) => o.status !== 'delivered' && o.status !== 'refunded').length.toString() + '건'} href="#tab-orders" />
        <SummaryCard icon={Tag} label="보유 쿠폰" value={`${myCoupons.length}장`} href="#tab-coupons" />
        <SummaryCard icon={Coins} label="적립금 잔액" value={`${balance.toLocaleString()}P`} href="/account/rewards" />
        <SummaryCard icon={Heart} label="관심 가구" value={`${wishlist.length}점`} href="#tab-wishlist" />
      </section>

      <TabsPanel
        items={[
          {
            key: 'orders',
            label: '주문 내역',
            count: orders.length,
            content: orders.length === 0 ? (
              <EmptyState
                title="아직 주문이 없어요"
                description="컬렉션이나 가구 페이지에서 둘러보세요."
                ctaLabel="가구 둘러보기"
                onCta={() => (window.location.href = '/products')}
              />
            ) : (
              <ul className="space-y-2">
                {orders.slice(0, 12).map((o) => (
                  <li key={o.id} className="rounded-md border bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', statusColor[o.status])}>
                          {statusLabel[o.status]}
                        </span>
                        <Link href={`/account/orders/${o.id}`} className="text-sm font-medium hover:underline">
                          {o.id}
                        </Link>
                        <span className="text-xs text-text-muted">{formatDate(o.createdAt)} 주문</span>
                      </div>
                      <p className="text-sm font-semibold">{formatKRW(o.totalPrice - o.couponDiscount - o.rewardUsed)}</p>
                    </div>
                    <p className="mt-1.5 text-xs text-text-muted">
                      {o.items.length}개 상품 · 예약 도착 {formatDate(o.scheduledDeliveryAt)}
                      {o.compensationIssued && ' · 자동 보상 적립금 지급됨'}
                    </p>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            key: 'coupons',
            label: '쿠폰',
            count: myCoupons.length,
            content: (
              <ul className="grid gap-3 sm:grid-cols-2">
                {myCoupons.map((c) => (
                  <li key={c.id} className="rounded-md border bg-surface p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{c.code}</p>
                    <p className="mt-0.5 text-sm font-semibold text-text">{c.name}</p>
                    <p className="mt-1 text-xs text-text-muted">최소 주문 {formatKRW(c.minOrder)} · 만료 {c.expiresAt}</p>
                  </li>
                ))}
              </ul>
            ),
          },
          {
            key: 'rewards',
            label: '적립금',
            count: recent.length,
            content: (
              <div>
                <p className="mb-3 text-sm">현재 잔액 <strong className="text-text">{balance.toLocaleString()}P</strong></p>
                <ul className="space-y-1.5 text-sm">
                  {recent.map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-md border bg-surface px-3 py-2">
                      <span className="text-text-muted">{formatDate(r.createdAt)} · {r.reason === 'auto-delay-compensation' ? '배송 지연 자동 보상' : r.reason === 'purchase' ? '구매 적립' : r.reason === 'coupon' ? '쿠폰 사용' : '수동 조정'}</span>
                      <span className={cn('font-medium', r.delta >= 0 ? 'text-success' : 'text-danger')}>
                        {r.delta >= 0 ? '+' : ''}{r.delta.toLocaleString()}P
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/account/rewards" className="mt-3 inline-block text-xs text-accent hover:underline">
                  전체 내역 보기
                </Link>
              </div>
            ),
          },
          {
            key: 'wishlist',
            label: '관심 가구',
            count: wishlist.length,
            content: (
              <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {wishlist.map((p) => {
                  const brand = brandById(p.brandId)
                  return (
                    <li key={p.id} className="rounded-md border bg-surface p-3">
                      <p className="text-[11px] uppercase tracking-wide text-text-muted">{brand?.name}</p>
                      <Link href={`/products/${p.slug}`} className="text-sm font-medium hover:underline">
                        {p.name}
                      </Link>
                      <p className="mt-1 text-sm font-semibold">{formatKRW(p.priceSale)}</p>
                    </li>
                  )
                })}
              </ul>
            ),
          },
        ]}
      />
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-lg border bg-surface p-4 hover:bg-surface-2">
      <span className="rounded-md bg-surface-2 p-2 text-text-muted">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block text-[11px] text-text-muted">{label}</span>
        <span className="block text-base font-semibold text-text">{value}</span>
      </span>
    </Link>
  )
}
