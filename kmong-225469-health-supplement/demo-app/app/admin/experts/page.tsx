'use client'
import { useState } from 'react'
import { doctors, pharmacists } from '../../data/experts'
import { useToast } from '../../components/Toast'

export default function AdminExpertsPage() {
  const [tab, setTab] = useState<'approved' | 'pending'>('approved')
  const { toast } = useToast()
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">전문가 관리</h1>
      <div className="flex gap-2 mb-4">{[{k:'approved' as const,l:'승인완료'},{k:'pending' as const,l:'승인대기'}].map(t => (
        <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm ${tab === t.k ? 'bg-[#1B2A4A] text-white' : 'bg-[#F8FAFC] text-[#64748B]'}`}>{t.l}</button>
      ))}</div>
      {tab === 'approved' && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-3 px-4 text-left">이름</th><th className="py-3 px-4 text-left">유형</th><th className="py-3 px-4 text-left">소속</th><th className="py-3 px-4 text-left">전문분야</th></tr></thead>
            <tbody>
              {doctors.map(d => <tr key={d.id} className="border-t border-[#E2E8F0]"><td className="py-3 px-4 font-medium">{d.name}</td><td className="py-3 px-4"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">의사</span></td><td className="py-3 px-4">{d.hospital}</td><td className="py-3 px-4">{d.specialty}</td></tr>)}
              {pharmacists.map(p => <tr key={p.id} className="border-t border-[#E2E8F0]"><td className="py-3 px-4 font-medium">{p.name}</td><td className="py-3 px-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">약사</span></td><td className="py-3 px-4">{p.pharmacy}</td><td className="py-3 px-4">{p.specialty}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
      {tab === 'pending' && (
        <div className="space-y-3">
          {['최약사 (도봉약국)', '정의사 (강남병원)'].map((name, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div><p className="font-medium text-sm">{name}</p><p className="text-xs text-[#64748B]">2026-03-{28 - i * 3} 가입 신청</p></div>
              <div className="flex gap-2">
                <button onClick={() => toast('승인되었습니다')} className="text-xs bg-[#22C55E] text-white px-3 py-1 rounded">승인</button>
                <button onClick={() => toast('거절되었습니다')} className="text-xs bg-red-500 text-white px-3 py-1 rounded">거절</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
