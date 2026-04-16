'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { geneMarkers } from '../../../data/gene-markers'
import { healthCheckupItems, recommendedNutrients } from '../../../data/health-checkup'
import { products } from '../../../data/products'
import { useToast } from '../../../components/Toast'

const chatMessages = [
  { from: 'system', text: '환자와 상담이 시작되었습니다.' },
  { from: 'patient', text: '안녕하세요, 검사 결과가 나왔다고 해서 상담 신청했습니다.' },
  { from: 'expert', text: '네, 홍OO님 안녕하세요. 유전자 검사와 건강검진 결과를 확인했습니다.' },
  { from: 'expert', text: 'FTO, TCF7L2, APOE 유전자에서 고위험 변이가 발견되었고, 공복혈당 105, 총콜레스테롤 215로 주의 수준입니다.' },
  { from: 'patient', text: '어떤 영양제를 먹으면 좋을까요?' },
  { from: 'expert', text: '바나바잎추출물(혈당관리), rTG오메가3(콜레스테롤), 밀크씨슬(간건강)을 추천드립니다.' },
]

function PharmacistRoom() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'chat'
  const patientName = searchParams.get('patient') || '홍OO'
  const [messages, setMessages] = useState(chatMessages.slice(0, 1))
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
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

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])
  }

  const highRisk = geneMarkers.filter(m => m.risk === 'HIGH')
  const abnormal = healthCheckupItems.filter(i => i.status !== 'normal')

  return (
    <div className="flex gap-4 h-[calc(100vh-100px)]">
      {/* 좌측: 환자 데이터 패널 */}
      <div className="w-80 bg-white rounded-xl shadow-sm overflow-y-auto shrink-0 hidden lg:block">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="font-bold text-sm">{patientName} 환자 데이터</p>
          <p className="text-xs text-[#64748B]">만44세 | 남성 | 건강점수 55점</p>
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
          {abnormal.slice(0, 5).map(c => (
            <div key={c.name} className="flex justify-between text-xs py-1">
              <span>{c.name}</span>
              <span className={`font-medium ${c.status === 'danger' ? 'text-red-500' : 'text-yellow-500'}`}>{c.value}{c.unit}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-b border-[#E2E8F0]">
          <p className="text-xs font-bold text-blue-600 mb-2">추천 성분</p>
          <div className="flex flex-wrap gap-1">
            {recommendedNutrients.slice(0, 6).map(n => (
              <span key={n} className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full">{n}</span>
            ))}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-bold text-[#1E293B] mb-2">제품 추천 (선택)</p>
          {products.slice(0, 5).map(p => (
            <label key={p.id} className="flex items-center gap-2 py-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleProduct(p.id)} className="w-3.5 h-3.5 accent-[#22C55E]" />
              <span className="flex-1">{p.name}</span>
              <span className="text-[#22C55E]">{p.subscriptionPrice.toLocaleString()}</span>
            </label>
          ))}
          {selectedProducts.length > 0 && (
            <button onClick={() => { toast(`${selectedProducts.length}개 제품이 환자에게 추천되었습니다`); setMessages(prev => [...prev, { from: 'expert', text: `[제품 추천] ${selectedProducts.map(id => products.find(p => p.id === id)?.name).join(', ')}` }]) }} className="mt-2 w-full bg-[#22C55E] text-white text-xs py-1.5 rounded hover:bg-[#16A34A]">
              {selectedProducts.length}개 제품 추천 발송
            </button>
          )}
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
                    <div className="w-20 h-20 bg-[#2A3F6A] rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">홍</div>
                    <p className="font-bold">홍OO 환자</p>
                    <p className="text-xs text-[#22C55E] mt-1">화상 상담 진행 중</p>
                  </div>
                  <div className="absolute bottom-4 right-4 w-28 h-20 bg-[#2A3F6A] rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#64748B] rounded-full flex items-center justify-center text-white text-xs">나</div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-center gap-4 p-3 bg-[#1E293B]/80">
              <button className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">🎤</button>
              <button className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">📷</button>
              <button className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">🖥</button>
              <Link href="/pharmacist/consultation" className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">✕</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] mb-3">
              <div className="w-10 h-10 bg-[#F8FAFC] rounded-full flex items-center justify-center font-bold text-[#1B2A4A]">홍</div>
              <div>
                <p className="font-bold text-sm">홍OO 환자</p>
                <p className="text-xs text-[#22C55E]">채팅 상담 중</p>
              </div>
              <Link href="/pharmacist/consultation" className="ml-auto text-sm text-[#64748B] hover:text-red-500">종료</Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'expert' ? 'justify-end' : m.from === 'system' ? 'justify-center' : 'justify-start'}`}>
                  {m.from === 'system' ? (
                    <span className="text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full">{m.text}</span>
                  ) : (
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${m.from === 'expert' ? 'bg-[#22C55E] text-white rounded-br-md' : 'bg-[#F8FAFC] text-[#1E293B] rounded-bl-md'}`}>
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="환자에게 메시지 입력..." className="flex-1 border border-[#E2E8F0] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
              <button onClick={sendMessage} className="bg-[#22C55E] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#16A34A]">↑</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function PharmacistRoomPage() {
  return <Suspense fallback={<div className="p-8 text-center text-[#64748B]">로딩 중...</div>}><PharmacistRoom /></Suspense>
}
