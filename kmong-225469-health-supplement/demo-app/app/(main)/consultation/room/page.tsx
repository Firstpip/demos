'use client'
import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const CHAT_SCRIPT = [
  { from: 'system' as const, text: '{expertName}님과 상담이 시작되었습니다.' },
  { from: 'expert' as const, text: '안녕하세요. 유전자 검사 결과를 확인했습니다.' },
  { from: 'expert' as const, text: 'FTO, TCF7L2, APOE 유전자에서 고위험 변이가 발견되어, 체중 관리와 혈당/지질 관리가 필요합니다.' },
  { from: 'expert' as const, text: '건강검진에서도 공복혈당 105, 총콜레스테롤 215로 주의 수준이네요.' },
  { from: 'user' as const, text: '그러면 어떤 영양제를 먹으면 좋을까요?' },
  { from: 'expert' as const, text: '바나바잎추출물(혈당), rTG오메가3(콜레스테롤), 밀크씨슬(간건강)을 추천드립니다. 3개월 이상 꾸준히 복용하시면 효과를 보실 수 있습니다.' },
]

export default function ConsultationRoomPage() {
  return <Suspense fallback={<div className="p-8 text-center text-[#64748B]">상담 연결 중...</div>}><ConsultationRoom /></Suspense>
}

function ConsultationRoom() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'chat'
  const expertName = searchParams.get('expert') || '전문가'
  type ChatMsg = { from: 'system' | 'expert' | 'user'; text: string }
  const [messages, setMessages] = useState<ChatMsg[]>([{ from: 'system', text: `${expertName}님과 상담이 시작되었습니다.` }])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const indexRef = useRef(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addNextMessage = useCallback(() => {
    if (indexRef.current < CHAT_SCRIPT.length) {
      const msg = CHAT_SCRIPT[indexRef.current]
      indexRef.current++
      setMessages(prev => [...prev, msg])
      timerRef.current = setTimeout(addNextMessage, 1500)
    }
  }, [])

  useEffect(() => {
    if (type === 'chat') {
      timerRef.current = setTimeout(addNextMessage, 1500)
    } else {
      timerRef.current = setTimeout(() => setConnected(true), 2000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [type, addNextMessage])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { from: 'user' as const, text: input }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'expert' as const, text: '네, 추가 궁금하신 점이 있으시면 말씀해주세요.' }])
    }, 1000)
  }

  if (type === 'video') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#1E293B] rounded-xl overflow-hidden">
          <div className="aspect-video flex items-center justify-center relative">
            {!connected ? (
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/30 border-t-[#22C55E] rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-lg">상담 연결 중...</p>
                <p className="text-sm text-white/60">약사가 곧 연결됩니다</p>
              </div>
            ) : (
              <>
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-[#2A3F6A] rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">{expertName[0]}</div>
                  <p className="font-bold">{expertName}</p>
                  <p className="text-sm text-white/60">올리브영약국</p>
                  <p className="text-xs text-[#22C55E] mt-2">화상 상담 진행 중</p>
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-[#2A3F6A] rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">나</div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-center gap-4 p-4">
            <button className="w-12 h-12 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">🎤</button>
            <button className="w-12 h-12 bg-[#64748B] rounded-full flex items-center justify-center text-white text-sm">📷</button>
            <Link href="/consultation" className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">✕</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] mb-3">
        <div className="w-10 h-10 bg-[#F8FAFC] rounded-full flex items-center justify-center font-bold text-[#1B2A4A]">{expertName[0]}</div>
        <div>
          <p className="font-bold text-sm">{expertName}</p>
          <p className="text-xs text-[#22C55E]">상담 중</p>
        </div>
        <Link href="/my-results/report" className="ml-auto text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100">추천 제품 보기</Link>
        <Link href="/consultation" className="text-sm text-[#64748B] hover:text-red-500">종료</Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : m.from === 'system' ? 'justify-center' : 'justify-start'}`}>
            {m.from === 'system' ? (
              <span className="text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full">{m.text}</span>
            ) : (
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${m.from === 'user' ? 'bg-[#22C55E] text-white rounded-br-md' : 'bg-[#F8FAFC] text-[#1E293B] rounded-bl-md'}`}>
                {m.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..." className="flex-1 border border-[#E2E8F0] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
        <button onClick={sendMessage} className="bg-[#22C55E] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#16A34A]">↑</button>
      </div>
    </div>
  )
}
