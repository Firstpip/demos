'use client'
import { orders } from '../../../data/orders'
import { useToast } from '../../../components/Toast'

export default function SubscriptionPage() {
  const subs = orders.filter(o => o.isSubscription)
  const { toast } = useToast()
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">정기배송 관리</h1>
      <div className="space-y-4">
        {subs.map(s => (
          <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
            {s.products.map((p, i) => <p key={i} className="font-bold text-sm">{p.name}</p>)}
            <p className="text-xs text-[#64748B] mt-1">다음 배송: 2026-04-{String(15 + Number(s.id.slice(-3)) % 10).padStart(2, '0')}</p>
            <p className="text-sm text-[#22C55E] font-medium">{s.total.toLocaleString()}원/월</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => toast('배송일이 변경되었습니다')} className="text-xs border border-[#E2E8F0] px-3 py-1 rounded hover:bg-[#F8FAFC]">배송일 변경</button>
              <button onClick={() => toast('구독이 해지되었습니다')} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50">해지</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
