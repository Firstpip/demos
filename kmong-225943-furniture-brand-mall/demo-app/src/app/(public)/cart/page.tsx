'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/lib/contexts/cart'
import { useAuth } from '@/lib/contexts/auth'
import { useRewards } from '@/lib/contexts/rewards'
import { productById } from '@/data/products'
import { brandById } from '@/data/brands'
import { coupons } from '@/data/coupons'
import { EmptyState } from '@/components/states'
import { formatKRW } from '@/lib/utils'
import { productImage } from '@/lib/imagePath'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQty, removeItem, subtotal, hydrated } = useCart()
  const { userId } = useAuth()
  const { balanceForUser } = useRewards()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [usingPoints, setUsingPoints] = useState(0)

  const balance = balanceForUser(userId)

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0
    const c = coupons.find((cc) => cc.code === appliedCoupon)
    if (!c || subtotal < c.minOrder) return 0
    if (c.type === 'fixed' || c.type === 'shipping') return c.value
    if (c.type === 'percent' || c.type === 'set') return Math.round(subtotal * c.value / 100)
    return 0
  }, [appliedCoupon, subtotal])

  const finalPrice = Math.max(0, subtotal - couponDiscount - usingPoints)

  function applyCoupon() {
    const c = coupons.find((cc) => cc.code.toUpperCase() === couponCode.trim().toUpperCase())
    if (!c) {
      toast.error('일치하는 쿠폰 코드가 없습니다.')
      return
    }
    if (subtotal < c.minOrder) {
      toast.error(`최소 ${formatKRW(c.minOrder)} 이상 주문 시 사용 가능합니다.`)
      return
    }
    setAppliedCoupon(c.code)
    toast.success(`${c.name} 적용됐어요`)
  }

  function proceedToCheckout() {
    if (items.length === 0) return
    router.push('/checkout')
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-12 text-sm text-text-muted">불러오는 중...</div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <h1 className="mb-6 text-2xl font-semibold text-text">장바구니</h1>
        <EmptyState
          title="장바구니가 비어 있어요"
          description="컬렉션이나 가구 페이지에서 마음에 드는 상품을 담아 보세요."
          ctaLabel="전체 가구"
          onCta={() => router.push('/products')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-text">장바구니</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((item) => {
            const product = productById(item.productId)
            const brand = product ? brandById(product.brandId) : null
            if (!product) return null
            return (
              <div
                key={`${item.productId}-${item.option}`}
                id={`cart-row-${item.productId}-${item.option.replace(/[^a-zA-Z0-9-]/g, '_')}`}
                className="flex gap-3 rounded-lg border bg-surface p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-2">
                  <img
                    src={productImage(product.axes.category, product.axes.subCategory, product.id, 0, { name: product.name, slug: product.slug })}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-[11px] uppercase tracking-wide text-text-muted">{brand?.name}</p>
                  <Link href={`/products/${product.slug}`} className="text-sm font-medium text-text hover:underline">
                    {product.name}
                  </Link>
                  <p className="text-xs text-text-muted">옵션 {item.option.replace('|', ' / ')}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md border bg-surface">
                      <button type="button" onClick={() => updateQty(item.productId, item.option, item.qty - 1)} className="px-2 py-1 text-sm" aria-label="수량 감소">-</button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.productId, item.option, item.qty + 1)} className="px-2 py-1 text-sm" aria-label="수량 증가">+</button>
                    </div>
                    <p className="text-sm font-semibold">{formatKRW(item.unitPrice * item.qty)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.option)}
                  className="self-start rounded-md p-1.5 text-text-muted hover:bg-surface-2"
                  aria-label="삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-surface p-4">
            <p className="mb-2 text-sm font-medium text-text">쿠폰</p>
            <div className="flex gap-2">
              <input
                id="cart-coupon-input"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="쿠폰 코드"
                className="flex-1 rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg"
              >
                적용
              </button>
            </div>
            {appliedCoupon && (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-success">
                <Tag className="h-3.5 w-3.5" /> {appliedCoupon} 적용 중
              </p>
            )}
            <details className="mt-3 text-xs text-text-muted">
              <summary className="cursor-pointer hover:text-text">사용 가능한 쿠폰 보기</summary>
              <ul className="mt-2 space-y-1">
                {coupons.slice(0, 6).map((c) => (
                  <li key={c.id} className="flex items-center justify-between">
                    <span>{c.name}</span>
                    <button type="button" className="text-accent hover:underline" onClick={() => { setCouponCode(c.code); applyCoupon() }}>
                      {c.code}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <div className="rounded-lg border bg-surface p-4">
            <p className="mb-2 text-sm font-medium text-text">적립금 사용</p>
            <input
              type="number"
              value={usingPoints}
              max={Math.min(balance, subtotal)}
              min={0}
              onChange={(e) => setUsingPoints(Math.min(balance, Math.max(0, parseInt(e.target.value || '0', 10))))}
              className="w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
            />
            <p className="mt-1 text-xs text-text-muted">사용 가능 적립금 {balance.toLocaleString()}P</p>
          </div>

          <div className="rounded-lg border bg-surface p-4 text-sm">
            <div className="flex items-center justify-between text-text-muted">
              <span>상품 합계</span>
              <span>{formatKRW(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="mt-1 flex items-center justify-between text-text-muted">
                <span>쿠폰 할인</span>
                <span className="text-danger">-{formatKRW(couponDiscount)}</span>
              </div>
            )}
            {usingPoints > 0 && (
              <div className="mt-1 flex items-center justify-between text-text-muted">
                <span>적립금 사용</span>
                <span className="text-danger">-{formatKRW(usingPoints)}</span>
              </div>
            )}
            <div className="mt-3 flex items-baseline justify-between border-t pt-3">
              <span className="text-text-muted">결제 예정 금액</span>
              <span className="text-xl font-semibold text-text">{formatKRW(finalPrice)}</span>
            </div>
            <button
              id="cart-checkout-button"
              type="button"
              onClick={proceedToCheckout}
              className="mt-4 w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-fg hover:opacity-90"
            >
              결제 진행
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
