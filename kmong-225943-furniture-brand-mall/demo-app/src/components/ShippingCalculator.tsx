'use client'

import { useMemo, useState } from 'react'
import { Truck } from 'lucide-react'
import { addDays, formatDate } from '@/lib/utils'

export function ShippingCalculator({ deliveryDays }: { deliveryDays: number }) {
  const [zip, setZip] = useState('')
  const trimmed = zip.replace(/[^0-9]/g, '').slice(0, 5)

  const eta = useMemo(() => {
    if (trimmed.length !== 5) return null
    const prefix = parseInt(trimmed.slice(0, 2), 10)
    let extra = 0
    if (prefix >= 0 && prefix <= 7) extra = 0
    else if (prefix >= 60 && prefix <= 69) extra = 2
    else if (prefix >= 30 && prefix <= 33) extra = 1
    else extra = 1
    return addDays(new Date().toISOString(), deliveryDays + extra)
  }, [trimmed, deliveryDays])

  return (
    <div className="rounded-lg border bg-surface-2 p-4">
      <div className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-text">
        <Truck className="h-4 w-4 text-text-muted" /> 예상 도착일 계산
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="우편번호 5자리"
          inputMode="numeric"
          className="w-32 rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
          aria-label="우편번호"
        />
        <p className="text-sm text-text-muted">기본 출고 {deliveryDays}일 + 권역별 0~2일</p>
      </div>
      {eta && (
        <p className="mt-2 text-sm">
          <strong className="text-text">{formatDate(eta)}</strong> 도착 예상
        </p>
      )}
      <ul className="mt-3 space-y-1 text-xs text-text-muted">
        <li>· 서울·경기 무료 설치, 그 외 권역 4~10만원 별도</li>
        <li>· 단순 변심 환불은 도착 7일 이내 미사용 상태에서만 가능합니다</li>
        <li>· 파손·하자는 24시간 이내 사진 동봉 1:1 문의 시 무상 회수·재배송</li>
      </ul>
    </div>
  )
}
