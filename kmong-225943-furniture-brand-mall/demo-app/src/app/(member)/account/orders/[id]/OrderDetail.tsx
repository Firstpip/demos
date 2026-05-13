'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronRight, MapPin, Receipt, RotateCcw } from 'lucide-react'
import type { Order } from '@/lib/types'
import { productById } from '@/data/products'
import { brandById } from '@/data/brands'
import { OrderStatusStepper } from '@/components/OrderStatusStepper'
import { DeliverySimulator } from '@/components/DeliverySimulator'
import { useRewards } from '@/lib/contexts/rewards'
import { formatKRW, formatDate } from '@/lib/utils'
import { productImage } from '@/lib/imagePath'

export function OrderDetail({ order }: { order: Order }) {
  const { entries, balanceForUser } = useRewards()
  const compensations = entries.filter((e) => e.refOrderId === order.id && e.reason === 'auto-delay-compensation')
  const balance = balanceForUser(order.userId)
  const [lateBy, setLateBy] = useState(0)

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-3 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/account" className="hover:text-text">마이페이지</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">주문 {order.id}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">주문 상세</h1>
          <p className="mt-1 text-sm text-text-muted">주문 번호 {order.id} · {formatDate(order.createdAt)} 주문</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md border bg-surface px-3 py-1.5 text-xs hover:bg-surface-2"
        >
          <Receipt className="h-3.5 w-3.5" /> 영수증
        </button>
      </header>

      <section className="mb-6 rounded-lg border bg-surface p-5">
        <div className="relative">
          <OrderStatusStepper status={order.status} effectiveLateDays={lateBy} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-text">주문 상품 ({order.items.length}건)</h2>
          {order.items.map((it) => {
            const p = productById(it.productId)
            const brand = p ? brandById(p.brandId) : null
            if (!p) return null
            return (
              <div key={`${it.productId}-${it.option}`} className="flex gap-3 rounded-lg border bg-surface p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md bg-surface-2">
                  <img src={productImage(p.axes.category, p.axes.subCategory, p.id, 0, { name: p.name, slug: p.slug })} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">{brand?.name}</p>
                  <Link href={`/products/${p.slug}`} className="text-sm font-medium hover:underline">{p.name}</Link>
                  <p className="text-xs text-text-muted">옵션 {it.option.replace('|', ' / ')} · {it.qty}개</p>
                </div>
                <p className="self-center text-sm font-semibold">{formatKRW(it.unitPrice * it.qty)}</p>
              </div>
            )
          })}

          <div className="rounded-lg border bg-surface p-5">
            <h2 className="mb-2 text-base font-semibold text-text">배송 정보</h2>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-text-muted" />
                <div>
                  <p>김지윤 · 010-2345-6789</p>
                  <p className="text-text-muted">서울특별시 마포구 양화로 12, 101동 502호 (04035)</p>
                </div>
              </li>
              <li className="text-text-muted">예약 도착일 <strong className="text-text">{formatDate(order.scheduledDeliveryAt)}</strong></li>
            </ul>
          </div>

          {compensations.length > 0 && (
            <div className="rounded-lg border border-success/40 bg-success/5 p-4">
              <p className="text-sm font-medium text-success">자동 보상 적립금 지급 내역</p>
              <ul className="mt-2 space-y-1 text-xs text-text">
                {compensations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between">
                    <span className="text-text-muted">{formatDate(c.createdAt)} · 배송 지연 자동 보상</span>
                    <span className="font-medium text-success">+{c.delta.toLocaleString()}P</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button type="button" className="inline-flex items-center gap-1 rounded-md border bg-surface px-3 py-1.5 text-xs hover:bg-surface-2">
              <RotateCcw className="h-3.5 w-3.5" /> 환불·교환 신청
            </button>
            <Link href="/support/contact" className="rounded-md border bg-surface px-3 py-1.5 text-xs hover:bg-surface-2">
              1:1 문의
            </Link>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold text-text">결제 요약</h2>
            <ul className="space-y-1.5 text-sm text-text-muted">
              <li className="flex justify-between"><span>상품 합계</span><span>{formatKRW(order.totalPrice)}</span></li>
              {order.couponDiscount > 0 && <li className="flex justify-between"><span>쿠폰 할인</span><span className="text-danger">-{formatKRW(order.couponDiscount)}</span></li>}
              {order.rewardUsed > 0 && <li className="flex justify-between"><span>적립금 사용</span><span className="text-danger">-{formatKRW(order.rewardUsed)}</span></li>}
            </ul>
            <div className="mt-3 flex items-baseline justify-between border-t pt-3 text-sm">
              <span className="text-text-muted">총 결제 금액</span>
              <span className="text-xl font-semibold text-text">{formatKRW(order.totalPrice - order.couponDiscount - order.rewardUsed)}</span>
            </div>
            <p className="mt-2 text-xs text-text-muted">현재 적립금 잔액 {balance.toLocaleString()}P</p>
          </div>

          <DeliverySimulator order={order} onLateChange={setLateBy} />
        </aside>
      </div>
    </div>
  )
}
