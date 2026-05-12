'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Smartphone, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCart } from '@/lib/contexts/cart'
import { productById } from '@/data/products'
import { EmptyState } from '@/components/states'
import { formatKRW, addDays, formatDate, cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(2, '받는 분 이름을 입력해 주세요'),
  phone: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/u, '올바른 휴대폰 번호를 입력해 주세요'),
  zip: z.string().regex(/^\d{5}$/u, '우편번호 5자리'),
  addr1: z.string().min(2, '기본 주소를 입력해 주세요'),
  addr2: z.string().optional(),
  scheduledDate: z.string().min(8, '배송 예약일을 선택해 주세요'),
  request: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const paymentMethods = [
  { key: 'toss-card', label: '토스 결제 (카드)', icon: CreditCard },
  { key: 'toss-easy', label: '토스 간편결제', icon: Smartphone },
  { key: 'transfer', label: '계좌 이체', icon: Building2 },
] as const

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clear, hydrated } = useCart()
  const minDate = formatDate(addDays(new Date().toISOString(), 5))
  const [pay, setPay] = useState<typeof paymentMethods[number]['key']>('toss-card')
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '김지윤',
      phone: '010-2345-6789',
      zip: '04035',
      addr1: '서울특별시 마포구 양화로 12',
      addr2: '101동 502호',
      scheduledDate: minDate,
      request: '',
    },
  })

  const total = useMemo(() => subtotal, [subtotal])

  function onSubmit(values: FormValues) {
    setSubmitting(true)
    setTimeout(() => {
      try {
        sessionStorage.setItem(
          'kmong225943:lastOrder',
          JSON.stringify({
            ...values,
            items,
            total,
            method: pay,
            placedAt: new Date().toISOString(),
            id: `order-${Date.now()}`,
          }),
        )
      } catch { /* ignore */ }
      clear()
      toast.success('결제가 완료됐어요', { description: '주문 상세에서 배송 진행 상황을 확인할 수 있습니다.' })
      router.push('/account/orders/order-DEMO-S02')
    }, 700)
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-[1280px] px-4 py-12 text-sm text-text-muted">불러오는 중...</div>
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <h1 className="mb-6 text-2xl font-semibold text-text">결제</h1>
        <EmptyState
          title="결제할 상품이 없어요"
          description="장바구니에 가구를 담은 후 진행해 주세요."
          ctaLabel="가구 둘러보기"
          onCta={() => router.push('/products')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-text">결제</h1>
      <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold text-text">배송지</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="받는 분" error={form.formState.errors.name?.message}>
                <input {...form.register('name')} className="input" />
              </Field>
              <Field label="휴대폰" error={form.formState.errors.phone?.message}>
                <input {...form.register('phone')} className="input" placeholder="010-1234-5678" />
              </Field>
              <Field label="우편번호" error={form.formState.errors.zip?.message}>
                <input {...form.register('zip')} className="input" />
              </Field>
              <Field label="기본 주소" error={form.formState.errors.addr1?.message}>
                <input {...form.register('addr1')} className="input" />
              </Field>
              <Field label="상세 주소" error={form.formState.errors.addr2?.message} className="sm:col-span-2">
                <input {...form.register('addr2')} className="input" />
              </Field>
              <Field label="배송 요청사항" className="sm:col-span-2">
                <input {...form.register('request')} className="input" placeholder="예: 도착 30분 전 연락 부탁드려요" />
              </Field>
            </div>
          </section>

          <section className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold text-text">배송 예약일</h2>
            <input
              id="delivery-schedule-picker"
              type="date"
              min={minDate}
              {...form.register('scheduledDate')}
              className="input w-60"
            />
            <p className="mt-2 text-xs text-text-muted">
              가구 특성상 ±2일 여유를 두고 잡으시는 것을 권장합니다. 예약일을 초과해 배송이 지연되면 1일당 5,000원 적립금이 자동 지급됩니다.
            </p>
          </section>

          <section className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold text-text">결제 수단</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {paymentMethods.map((m) => {
                const Icon = m.icon
                const id = m.key === 'toss-card' || m.key === 'toss-easy' ? 'pay-toss' : `pay-${m.key}`
                return (
                  <button
                    key={m.key}
                    id={id}
                    type="button"
                    onClick={() => setPay(m.key)}
                    className={cn(
                      'flex flex-col items-start gap-1 rounded-md border bg-surface p-3 text-left text-sm',
                      pay === m.key ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50',
                    )}
                  >
                    <Icon className="h-4 w-4 text-text-muted" />
                    {m.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-text-muted">
              실제 결제는 본 개발에서 TossPayments / PortOne PG로 연동됩니다. 데모에서는 mock 처리.
            </p>
          </section>
        </div>

        <aside className="space-y-3">
          <div className="rounded-lg border bg-surface p-4">
            <h2 className="mb-2 text-sm font-semibold text-text">주문 요약</h2>
            <ul className="space-y-2 text-sm">
              {items.map((it) => {
                const p = productById(it.productId)
                if (!p) return null
                return (
                  <li key={`${it.productId}-${it.option}`} className="flex items-start justify-between gap-2">
                    <span className="flex-1">
                      <span className="block text-text">{p.name}</span>
                      <span className="block text-xs text-text-muted">{it.option.replace('|', ' / ')} · {it.qty}개</span>
                    </span>
                    <span className="font-medium">{formatKRW(it.unitPrice * it.qty)}</span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-3 border-t pt-3 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-text-muted">결제 금액</span>
                <span className="text-xl font-semibold text-text">{formatKRW(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              id="checkout-success"
              disabled={submitting}
              className="mt-4 w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-fg hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? '결제 진행 중...' : `${formatKRW(total)} 결제`}
            </button>
          </div>
        </aside>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 0.5rem 0.75rem;
          font-size: 14px;
          outline: none;
        }
        :global(.input:focus) { border-color: var(--primary); }
      `}</style>
    </div>
  )
}

interface FieldProps { label: string; children: React.ReactNode; error?: string; className?: string }
function Field({ label, children, error, className }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1 block text-xs text-text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-danger">{error}</span>}
    </label>
  )
}
