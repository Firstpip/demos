'use client'
import { useState } from 'react'
import Link from 'next/link'
import { consultations } from '../../data/consultations'
import { useToast } from '../../components/Toast'

export default function PharmacistConsultationPage() {
  const [filter, setFilter] = useState('전체')
  const { toast } = useToast()
  const filtered = filter === '전체' ? consultations : consultations.filter(c => c.status === filter)
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">상담 관리</h1>
      <div className="flex gap-2 mb-4">{['전체','예약완료','상담완료','취소'].map(f => (
        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs ${filter === f ? 'bg-[#1B2A4A] text-white' : 'bg-[#F8FAFC] text-[#64748B]'}`}>{f}</button>
      ))}</div>
      <div className="space-y-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <div><p className="font-medium text-sm">{c.notes}</p><p className="text-xs text-[#64748B]">{c.date} {c.time} · {c.type === 'video' ? '화상' : '채팅'}</p></div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === '예약완료' ? 'bg-blue-100 text-blue-700' : c.status === '상담완료' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
            </div>
            {c.status === '예약완료' && <Link href={`/pharmacist/consultation/room?type=${c.type}&id=${c.id}&patient=${encodeURIComponent(c.notes.split(' ')[0])}`} className="text-xs bg-[#22C55E] text-white px-3 py-1 rounded hover:bg-[#16A34A] inline-block">상담 시작</Link>}
          </div>
        ))}
      </div>
    </div>
  )
}
