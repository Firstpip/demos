'use client'

import { useEffect, useMemo, useState } from 'react'
import { Clock, Sparkles, Truck, Coins } from 'lucide-react'
import { toast } from 'sonner'
import type { Order } from '@/lib/types'
import { useRewards } from '@/lib/contexts/rewards'
import { addDays, formatDate, formatKRW } from '@/lib/utils'

interface Props {
  order: Order
  onLateChange?: (lateBy: number) => void
}

const DAILY_COMPENSATION = 5000

function diffDays(a: string, b: string): number {
  const aMs = new Date(a).getTime()
  const bMs = new Date(b).getTime()
  return Math.floor((aMs - bMs) / (1000 * 60 * 60 * 24))
}

export function DeliverySimulator({ order, onLateChange }: Props) {
  const { addEntry, balanceForUser } = useRewards()
  const [virtualNow, setVirtualNow] = useState(order.virtualNowAt)
  const [issuedDays, setIssuedDays] = useState(0)

  const lateBy = useMemo(() => Math.max(0, diffDays(virtualNow, order.scheduledDeliveryAt)), [virtualNow, order.scheduledDeliveryAt])
  const isLate = lateBy > 0
  const totalIssued = lateBy * DAILY_COMPENSATION

  useEffect(() => {
    onLateChange?.(lateBy)
  }, [lateBy, onLateChange])

  function progress(days: number) {
    const next = addDays(virtualNow, days)
    setVirtualNow(next)
    const nextLate = Math.max(0, diffDays(next, order.scheduledDeliveryAt))
    const newDays = nextLate - issuedDays
    if (newDays > 0) {
      const compensation = newDays * DAILY_COMPENSATION
      addEntry({
        id: `rwd-auto-${Date.now()}`,
        userId: order.userId,
        delta: compensation,
        reason: 'auto-delay-compensation',
        refOrderId: order.id,
        createdAt: next,
      })
      setIssuedDays(nextLate)
      toast.success('지연 보상 적립금이 자동 지급됐어요', {
        id: 'auto-compensation-toast',
        description: `${newDays}일 지연 × ${formatKRW(DAILY_COMPENSATION)} = ${formatKRW(compensation)}P 적립`,
        icon: <Sparkles className="h-4 w-4" aria-hidden />,
      })
    }
  }

  function reset() {
    setVirtualNow(order.virtualNowAt)
    setIssuedDays(0)
    toast.message('배송 시뮬레이터가 초기 상태로 돌아갔어요')
  }

  return (
    <div className="rounded-lg border-2 border-dashed border-accent/40 bg-accent/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden />
        <p className="text-sm font-semibold text-text">배송 시뮬레이터 (데모 전용)</p>
      </div>
      <p className="text-xs text-text-muted">
        본 개발에서는 매일 새벽 Cron이 같은 로직을 실행합니다. 데모에서는 아래 버튼으로 시간을 즉시 진행해 자동 보상이 발급되는 모습을 확인할 수 있습니다.
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md border bg-surface p-2">
          <dt className="text-text-muted">현재 가상시각</dt>
          <dd id="delivery-now-display" className="mt-0.5 font-medium text-text">{formatDate(virtualNow)}</dd>
        </div>
        <div className="rounded-md border bg-surface p-2">
          <dt className="text-text-muted">예약 도착일</dt>
          <dd className="mt-0.5 font-medium text-text">{formatDate(order.scheduledDeliveryAt)}</dd>
        </div>
      </dl>
      <div className="mt-3 flex gap-2">
        <button
          id="delivery-simulate-+1"
          type="button"
          onClick={() => progress(1)}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg hover:opacity-90"
        >
          <Clock className="h-3.5 w-3.5" /> +1일 진행
        </button>
        <button
          id="delivery-simulate-+3"
          type="button"
          onClick={() => progress(3)}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg hover:opacity-90"
        >
          <Clock className="h-3.5 w-3.5" /> +3일 진행
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto rounded-md border bg-surface px-2 py-1.5 text-xs text-text-muted hover:bg-surface-2"
        >
          초기화
        </button>
      </div>

      {isLate && (
        <div id="delivery-late-summary" className="mt-3 rounded-md border border-warn/40 bg-warn/10 p-3 text-xs text-text">
          <p className="inline-flex items-center gap-1 font-medium text-warn">
            <Truck className="h-3.5 w-3.5" /> 배송 지연 {lateBy}일 발생
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-text-muted">
            <Coins className="h-3.5 w-3.5" /> 자동 적립 {formatKRW(totalIssued)}P · 현재 잔액 {balanceForUser(order.userId).toLocaleString()}P
          </p>
        </div>
      )}
    </div>
  )
}
