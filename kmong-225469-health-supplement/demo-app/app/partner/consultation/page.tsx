'use client'
import { useState } from 'react'
import Link from 'next/link'
import { consultations } from '../../data/consultations'
import { patients } from '../../data/patients'

export default function PartnerConsultationPage() {
  const [filter, setFilter] = useState('전체')
  const doctorConsults = consultations.filter(c => c.expertType === 'doctor')
  const filtered = filter === '전체' ? doctorConsults : doctorConsults.filter(c => c.status === filter)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">상담 관리</h1>
        <Link href="/partner/consultation/room?type=chat&patient=홍OO" className="bg-[#22C55E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#16A34A]">새 상담 시작</Link>
      </div>

      <div className="flex gap-2 mb-4">
        {['전체', '예약완료', '상담완료'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs ${filter === f ? 'bg-[#1B2A4A] text-white' : 'bg-[#F8FAFC] text-[#64748B]'}`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#64748B] py-12">해당 상담이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{c.notes}</p>
                  <p className="text-xs text-[#64748B]">{c.date} {c.time} · {c.type === 'video' ? '화상' : '채팅'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === '예약완료' ? 'bg-blue-100 text-blue-700' : c.status === '상담완료' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
              </div>
              {c.status === '예약완료' && (
                <Link href={`/partner/consultation/room?type=${c.type}&patient=환자`} className="text-xs bg-[#22C55E] text-white px-3 py-1 rounded hover:bg-[#16A34A] inline-block">상담 시작</Link>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-[#1E293B] mb-4">DTC 검사 권유 대기 환자</h2>
        <div className="space-y-2">
          {patients.filter(p => p.testStatus === '키트발송' || p.testStatus === '분석 중').map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-[#64748B]">{p.testStatus}</p>
              </div>
              <Link href={`/partner/consultation/room?type=chat&patient=${p.name}`} className="text-xs bg-[#1B2A4A] text-white px-3 py-1 rounded hover:bg-[#2A3F6A]">상담하기</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
