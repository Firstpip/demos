'use client'
import { useState } from 'react'
import Link from 'next/link'
import { pharmacists, doctors } from '../../data/experts'

export default function ConsultationPage() {
  const [tab, setTab] = useState<'doctor' | 'pharmacist'>('pharmacist')
  const [selectedPharmacist, setSelectedPharmacist] = useState<string | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  const selPharm = pharmacists.find(p => p.id === selectedPharmacist)
  const selDoc = doctors.find(d => d.id === selectedDoctor)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div id="consult-tabs" className="flex gap-4 mb-6">
        <button onClick={() => setTab('doctor')} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'doctor' ? 'bg-[#1B2A4A] text-white' : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'}`}>전문의 상담</button>
        <button onClick={() => setTab('pharmacist')} className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'pharmacist' ? 'bg-[#22C55E] text-white' : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'}`}>약사 상담</button>
      </div>

      {tab === 'pharmacist' && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-bold text-green-700">잠깐! 나의 건강검진 결과는?</p>
            <p className="text-xs text-green-600">3분이면 확인할 수 있어요</p>
          </div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-2">나만의 맞춤 영양제 비대면으로 쉽고 빠르게</h2>
          <p className="text-sm text-[#64748B] mb-4">상담할 약사를 선택해주세요</p>

          <div id="pharmacist-list" className="flex gap-4 overflow-x-auto pb-4 mb-6">
            {pharmacists.map(p => (
              <button key={p.id} onClick={() => setSelectedPharmacist(p.id)}
                className={`bg-white border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-all min-w-[160px] shrink-0 ${selectedPharmacist === p.id ? 'border-[#22C55E] ring-2 ring-[#22C55E]/30 bg-green-50' : 'border-[#E2E8F0]'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 ${selectedPharmacist === p.id ? 'bg-[#22C55E] text-white' : 'bg-[#F8FAFC] border-2 border-[#22C55E] text-[#1B2A4A]'}`}>{p.name[0]}</div>
                <p className="font-bold text-sm text-[#1E293B]">{p.name}</p>
                <p className="text-xs text-[#64748B]">{p.pharmacy}</p>
                <p className="text-xs text-[#64748B]">{p.specialty}</p>
                <p className="text-xs text-[#22C55E] mt-1 font-medium">누적 상담 {p.consultCount}회</p>
              </button>
            ))}
          </div>

          {selPharm ? (
            <div className="bg-white border border-[#22C55E] rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-[#1E293B] mb-1">선택된 약사: {selPharm.name} ({selPharm.pharmacy})</p>
              <p className="text-xs text-[#64748B]">전문 분야: {selPharm.specialty} · 누적 상담 {selPharm.consultCount}회</p>
            </div>
          ) : (
            <p className="text-sm text-[#F59E0B] mb-4">약사를 선택해주세요</p>
          )}

          <div className="flex gap-4">
            <Link href={selPharm ? `/consultation/room?type=chat&expert=${encodeURIComponent(selPharm.name)}` : '#'}
              onClick={e => { if (!selPharm) e.preventDefault() }}
              className={`flex-1 border py-3 rounded-lg font-bold text-center transition-colors ${selPharm ? 'border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]' : 'border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'}`}>채팅상담</Link>
            <Link href={selPharm ? `/consultation/room?type=video&expert=${encodeURIComponent(selPharm.name)}` : '#'}
              onClick={e => { if (!selPharm) e.preventDefault() }}
              className={`flex-1 py-3 rounded-lg font-bold text-center transition-colors ${selPharm ? 'bg-[#22C55E] text-white hover:bg-[#16A34A]' : 'bg-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'}`}>화상상담</Link>
          </div>
        </>
      )}

      {tab === 'doctor' && (
        <>
          <h2 className="text-lg font-bold text-[#1E293B] mb-2">전문의 1:1 맞춤상담</h2>
          <p className="text-sm text-[#64748B] mb-4">상담할 전문의를 선택해주세요</p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {doctors.map(d => (
              <button key={d.id} onClick={() => setSelectedDoctor(d.id)}
                className={`bg-white border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-all ${selectedDoctor === d.id ? 'border-[#1B2A4A] ring-2 ring-[#1B2A4A]/30 bg-blue-50' : 'border-[#E2E8F0]'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-2 ${selectedDoctor === d.id ? 'bg-[#1B2A4A] text-white' : 'bg-[#F8FAFC] border-2 border-[#22C55E] text-[#1B2A4A]'}`}>{d.name[0]}</div>
                <p className="font-bold text-sm text-[#1E293B]">{d.name}</p>
                <p className="text-xs text-[#64748B]">{d.hospital}</p>
                <p className="text-xs text-[#64748B]">{d.specialty}</p>
                <p className="text-xs text-[#22C55E] mt-1 font-medium">추천 환자 {d.patientsReferred}명</p>
              </button>
            ))}
          </div>

          {selDoc ? (
            <div className="bg-white border border-[#1B2A4A] rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-[#1E293B] mb-1">선택된 전문의: {selDoc.name} ({selDoc.hospital})</p>
              <p className="text-xs text-[#64748B]">전문 분야: {selDoc.specialty}</p>
            </div>
          ) : (
            <p className="text-sm text-[#F59E0B] mb-4">전문의를 선택해주세요</p>
          )}

          <div className="flex gap-4">
            <Link href={selDoc ? `/consultation/room?type=chat&expert=${encodeURIComponent(selDoc.name)}` : '#'}
              onClick={e => { if (!selDoc) e.preventDefault() }}
              className={`flex-1 border py-3 rounded-lg font-bold text-center transition-colors ${selDoc ? 'border-[#E2E8F0] text-[#1E293B] hover:bg-[#F8FAFC]' : 'border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'}`}>채팅상담</Link>
            <Link href={selDoc ? `/consultation/room?type=video&expert=${encodeURIComponent(selDoc.name)}` : '#'}
              onClick={e => { if (!selDoc) e.preventDefault() }}
              className={`flex-1 py-3 rounded-lg font-bold text-center transition-colors ${selDoc ? 'bg-[#1B2A4A] text-white hover:bg-[#2A3F6A]' : 'bg-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed'}`}>화상상담</Link>
          </div>
        </>
      )}
    </div>
  )
}
