'use client'
import { useState } from 'react'
import type { HealthCheckupItem } from '../data/health-checkup'
import HealthChart from './HealthChart'

const statusStyle = { normal: 'bg-green-100 text-green-700', caution: 'bg-yellow-100 text-yellow-700', danger: 'bg-red-100 text-red-700' }
const statusLabel = { normal: '정상', caution: '주의', danger: '위험' }

export default function CheckupItemCard({ item }: { item: HealthCheckupItem }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-[#F8FAFC] transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#1E293B] text-sm">{item.name}</span>
          <span className="text-sm text-[#1E293B]">{item.value} {item.unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusStyle[item.status]}`}>{statusLabel[item.status]}</span>
          <svg width="16" height="16" fill="none" stroke="#64748B" strokeWidth="2" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M4 6l4 4 4-4"/></svg>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 gap-2 text-xs mt-3">
            <div><span className="text-[#64748B]">정상 범위</span><p className="font-medium">{item.normalRange}</p></div>
            <div><span className="text-[#64748B]">주의 기준</span><p className="font-medium">{item.cautionThreshold}</p></div>
            <div><span className="text-[#64748B]">추천 건기식</span><p className="font-medium text-[#22C55E]">{item.nutrient}</p></div>
            <div><span className="text-[#64748B]">핵심 성분</span><p className="font-medium">{item.keyIngredient}</p></div>
          </div>
          <p className="text-xs"><span className="text-[#64748B]">기대 효과: </span><span className="text-[#3B82F6] font-medium">{item.expectedEffect}</span></p>
          {item.history.length > 0 && <HealthChart data={item.history} />}
        </div>
      )}
    </div>
  )
}
