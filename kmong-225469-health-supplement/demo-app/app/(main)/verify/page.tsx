'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '../../components/Toast'

const methods = [
  { id: 'kakaobank', name: '카카오뱅크', desc: '카카오톡 > 카카오뱅크 앱으로 인증', color: '#FEE500', textColor: '#3C1E1E' },
  { id: 'phone', name: '핸드폰 간편인증', desc: 'PASS 앱 또는 SMS 인증번호로 본인확인', color: '#3B82F6', textColor: '#fff' },
  { id: 'naverpay', name: '네이버 PAY 본인인증', desc: '네이버페이 앱으로 간편 본인확인', color: '#03C75A', textColor: '#fff' },
]

export default function VerifyPageWrapper() {
  return <Suspense fallback={<div className="p-8 text-center text-[#64748B]">로딩 중...</div>}><VerifyPage /></Suspense>
}

function VerifyPage() {
  const [step, setStep] = useState<'select' | 'verify' | 'done'>('select')
  const [selected, setSelected] = useState('')
  const [code, setCode] = useState('')
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/my-results'

  const handleVerify = () => {
    if (!code.trim()) { toast('인증번호를 입력해주세요', 'error'); return }
    setStep('done')
    toast('본인인증이 완료되었습니다')
    setTimeout(() => router.push(redirect), 1500)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-2">본인인증</h1>
      <p className="text-sm text-[#64748B] mb-6">건강 데이터 연동을 위해 본인인증이 필요합니다.</p>

      {step === 'select' && (
        <div className="space-y-3">
          {methods.map(m => (
            <button key={m.id} onClick={() => { setSelected(m.id); setStep('verify') }}
              className="w-full rounded-xl p-4 text-left flex items-center gap-4 border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: m.color, color: m.textColor }}>
                {m.name.slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-sm text-[#1E293B]">{m.name}</p>
                <p className="text-xs text-[#64748B]">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 'verify' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <p className="font-bold text-sm text-[#1E293B] mb-1">{methods.find(m => m.id === selected)?.name}</p>
          <p className="text-xs text-[#64748B] mb-4">인증 요청이 발송되었습니다. 인증번호를 입력해주세요.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-700">
            데모: 아무 숫자나 입력하세요
          </div>
          <input type="text" inputMode="numeric" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="인증번호 6자리" maxLength={6}
            className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-center text-lg tracking-widest mb-4 focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
          <div className="flex gap-3">
            <button onClick={() => setStep('select')} className="flex-1 border border-[#E2E8F0] py-3 rounded-lg text-sm hover:bg-[#F8FAFC]">뒤로</button>
            <button onClick={handleVerify} className="flex-1 bg-[#22C55E] text-white py-3 rounded-lg font-bold hover:bg-[#16A34A]">인증 확인</button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <p className="font-bold text-lg text-[#1E293B]">본인인증 완료</p>
          <p className="text-sm text-[#64748B] mt-1">건강 데이터를 불러오는 중...</p>
        </div>
      )}
    </div>
  )
}
