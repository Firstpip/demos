'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { geneMarkers } from '../../../data/gene-markers'
import { healthCheckupItems } from '../../../data/health-checkup'
import { products } from '../../../data/products'
import { useToast } from '../../../components/Toast'

const chatMessages = [
  { from: 'system', text: '환자와 상담이 시작되었습니다.' },
  { from: 'patient', text: '선생님, 유전자 검사 결과에 대해 상담 받고 싶습니다.' },
  { from: 'expert', text: '네, 검사 결과를 확인했습니다. 몇 가지 주의할 점이 있습니다.' },
  { from: 'expert', text: 'FTO, TCF7L2 유전자에서 고위험 변이가 확인되어, 체중 관리와 혈당 조절이 중요합니다.' },
  { from: 'patient', text: '어떤 건강기능식품이 도움이 될까요?' },
  { from: 'expert', text: '혈당 관리를 위한 바나바잎추출물과 지질 개선을 위한 오메가3를 추천드립니다. 약사 상담을 통해 더 자세한 제품을 안내받으실 수 있습니다.' },
]

function DoctorRoom() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'chat'
  const patientName = searchParams.get('patient') || '환자'
  const [messages, setMessages] = useState(chatMessages.slice(0, 1))
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const { toast } = useToast()

  const indexRef = useRef(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const addNext = useCallback(() => {
    if (indexRef.current < chatMessages.length) {
      const msg = chatMessages[indexRef.current]; indexRef.current++
      setMessages(prev => [...prev, msg])
      timerRef.current = setTimeout(addNext, 1500)
    }
  }, [])
  useEffect(() => {
    if (type === 'chat') { timerRef.current = setTimeout(addNext, 1500) }
    else { timerRef.current = setTimeout(() => setConnected(true), 2000) }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [type, addNext])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'expert', text: input }])
    setInput('')
  }

  const highRisk = geneMarkers.filter(m => m.risk === 'HIGH')
  const abnormal = healthCheckupItems.filter(i => i.status !== 'normal')

  return (
    <div className="flex gap-4 h-[calc(100vh-100px)]">
      {/* 좌측: 환자 데이터 + 검사 권유 패널 */}
      <div className="w-80 bg-white rounded-xl shadow-sm overflow-y-auto shrink-0 hidden lg:block">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="font-bold text-sm">{patientName} 환자</p>
          <p className="text-xs text-[#64748B]">건강점수 55점</p>
        </div>
        <div className="p-4 border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-red-600 mb-2">유전자 고위험 ({highRisk.length})</p>
          {highRisk.map(m => (
            <div key={m.gene} className="flex justify-between text-xs py-1">
              <span>{m.gene} - {m.category}</span>
              <span className="text-red-500 font-medium">위험</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-yellow-600 mb-2">검진 주의/위험 ({abnormal.length})</p>
          {abnormal.slice(0, 4).map(c => (
            <div key={c.name} className="flex justify-between text-xs py-1">
              <span>{c.name}</span>
              <span className={`font-medium ${c.status === 'danger' ? 'text-red-500' : 'text-yellow-500'}`}>{c.value}{c.unit}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-[#1E293B] mb-2">추천 제품</p>
          {products.slice(0, 3).map(p => (
            <div key={p.id} className="text-xs py-1 flex justify-between">
              <span>{p.name}</span>
              <span className="text-[#22C55E]">{p.subscriptionPrice.toLocaleString()}원</span>
            </div>
          ))}
          <button onClick={() => toast('제품 추천이 환자에게 전달되었습니다')} className="mt-2 w-full bg-[#22C55E] text-white text-xs py-1.5 rounded hover:bg-[#16A34A]">제품 추천 발송</button>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold text-[#1E293B] mb-2">DTC 검사 권유</p>
          <button onClick={() => toast('DTC 검사 권유 링크가 환자에게 발송되었습니다')} className="w-full bg-[#1B2A4A] text-white text-xs py-2 rounded hover:bg-[#2A3F6A]">검사 키트 권유 발송</button>
          <p className="text-[10px] text-[#64748B] mt-1">환자에게 DTC 유전자검사 신청 링크가 전달됩니다</p>
        </div>
      </div>

      {/* 우측: 상담 영역 */}
      <div className="flex-1 flex flex-col">
        {type === 'video' ? (
          <div className="flex-1 bg-[#1E293B] rounded-xl overflow-hidden flex flex-col">
            <div className="flex-1 flex items-center justify-center relative">
              {!connected ? (
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-[#22C55E] rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-bold">환자 연결 중...</p>
                </div>
              ) : (
                <>
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-[#2A3F6A] rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">{patientName[0]}</div>
                    <p className="font-bold">{patientName}</p>
                    <p className="text-xs text-[#22C55E] mt-1">화상 상담 진행 중</p>
                  </div>
                  <div className="absolute bottom-4 right-4 w-28 h-20 bg-[#2A3F6A] rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#64748B] rounded-full flex items-center justify-center text-white text-xs">나</div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center gap-4 p-3">
              <button className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">🎤</button>
              <button className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">📷</button>
              <Link href="/partner/consultation" className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">✕</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] mb-3">
              <div className="w-10 h-10 bg-[#F8FAFC] rounded-full flex items-center justify-center font-bold text-[#1B2A4A]">{patientName[0]}</div>
              <div>
                <p className="font-bold text-sm">{patientName} 환자</p>
                <p className="text-xs text-[#22C55E]">상담 중</p>
              </div>
              <Link href="/partner/consultation" className="ml-auto text-sm text-[#64748B] hover:text-red-500">종료</Link>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'expert' ? 'justify-end' : m.from === 'system' ? 'justify-center' : 'justify-start'}`}>
                  {m.from === 'system' ? (
                    <span className="text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full">{m.text}</span>
                  ) : (
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${m.from === 'expert' ? 'bg-[#1B2A4A] text-white rounded-br-md' : 'bg-[#F8FAFC] text-[#1E293B] rounded-bl-md'}`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="환자에게 메시지 입력..." className="flex-1 border border-[#E2E8F0] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
              <button onClick={sendMessage} className="bg-[#1B2A4A] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2A3F6A]">↑</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function DoctorRoomPage() {
  return <Suspense fallback={<div className="p-8 text-center text-[#64748B]">로딩 중...</div>}><DoctorRoom /></Suspense>
}
