import { CheckCircle2, Circle, Truck, PackageCheck, AlertTriangle, RotateCcw } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const steps: Array<{ key: Exclude<OrderStatus, 'delayed' | 'refunded'>; label: string }> = [
  { key: 'paid', label: '결제 완료' },
  { key: 'preparing', label: '배송 준비' },
  { key: 'shipping', label: '배송 중' },
  { key: 'delivered', label: '배송 완료' },
]

const order: Record<string, number> = { paid: 0, preparing: 1, shipping: 2, delivered: 3 }

interface Props {
  status: OrderStatus
  effectiveLateDays?: number
}

export function OrderStatusStepper({ status, effectiveLateDays = 0 }: Props) {
  if (status === 'refunded') {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border bg-surface px-3 py-2 text-sm text-text-muted">
        <RotateCcw className="h-4 w-4" /> 환불 처리됨
      </div>
    )
  }
  const isDelayed = status === 'delayed' || effectiveLateDays > 0
  const current = order[status] ?? 0
  return (
    <div className="space-y-2">
      {isDelayed && (
        <div
          id="order-stepper-delay-banner"
          className="inline-flex items-center gap-2 rounded-md border border-warn/40 bg-warn/10 px-3 py-1.5 text-xs font-medium text-warn"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {effectiveLateDays > 0 ? `배송 지연 ${effectiveLateDays}일 발생 — 자동 보상 적용` : '배송 지연 처리됨'}
        </div>
      )}
      <ol className="flex w-full items-center justify-between gap-2">
        {steps.map((s, i) => {
          const done = i <= current
          const Icon = i === 2 ? Truck : i === 3 ? PackageCheck : done ? CheckCircle2 : Circle
          return (
            <li key={s.key} className="flex flex-1 flex-col items-center gap-1">
              <Icon
                className={cn(
                  'h-5 w-5',
                  done ? (isDelayed && i === 2 ? 'text-warn' : 'text-primary') : 'text-text-muted/40',
                )}
                aria-hidden
              />
              <p className={cn('text-[11px]', done ? 'font-medium text-text' : 'text-text-muted')}>{s.label}</p>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    'absolute mt-2.5 h-px w-full',
                    done && i < current ? (isDelayed ? 'bg-warn/60' : 'bg-primary') : 'bg-border',
                  )}
                  aria-hidden
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
