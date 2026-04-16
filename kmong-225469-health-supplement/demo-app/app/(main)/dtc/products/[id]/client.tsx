'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../../components/Toast'

const kits: Record<string, { name: string; price: number; desc: string; items: string[]; duration: string }> = {
  basic: { name: '기본 검사 (42종)', price: 99000, desc: '비만/체중, 혈당, 지질 등 42가지 유전자 검사', items: ['비만/체중', '혈당 대사', '지질 대사', '카페인 대사', '비타민D 대사', '엽산 대사', '항산화', '유당 분해', '근력/운동', '면역/염증', '알코올 대사', '스트레스'], duration: '약 2~3주' },
  premium: { name: '프리미엄 검사 (70종)', price: 189000, desc: '기본 42종 + 피부/모발, 운동능력, 식습관, 개인특성 등 70가지', items: ['기본 42종 전체', '피부 노화/탄력', '모발 굵기/탈모', '운동 능력/회복력', '식습관/포만감', '수면 품질', '카페인 민감도', '니코틴 의존성', '비타민 흡수율'], duration: '약 3~4주' },
}

export default function DtcProductClient({ id }: { id: string }) {
  const kit = kits[id]
  const { toast } = useToast()
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'address' | 'done'>('info')
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!kit) return <div className="p-8 text-center">상품을 찾을 수 없습니다.</div>

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = '이름을 입력해주세요'
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요'
    if (!form.address.trim()) e.address = '배송지를 입력해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePurchase = () => {
    if (!validate()) return
    setStep('done')
    toast('검사 키트 결제가 완료되었습니다')
    setTimeout(() => router.push('/mypage/orders'), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {step === 'info' && (
        <>
          <div className="h-48 bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#64748B] mb-6">
            <div className="text-center">
              <p className="text-lg font-bold">HL GEN CHECK</p>
              <p className="text-xs mt-1">GENETIC TEST SERVICE - DTC KIT</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2">{kit.name}</h1>
          <p className="text-2xl font-bold text-[#22C55E] mb-4">{kit.price.toLocaleString()}원</p>
          <p className="text-[#64748B] mb-6">{kit.desc}</p>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-sm text-[#1E293B] mb-3">검사 항목</h3>
            <div className="flex flex-wrap gap-2">
              {kit.items.map(item => (
                <span key={item} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">{item}</span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-sm text-[#1E293B] mb-3">검사 절차</h3>
            <div className="space-y-3 text-sm text-[#64748B]">
              <div className="flex gap-3"><span className="w-6 h-6 bg-[#1B2A4A] text-white rounded-full flex items-center justify-center text-xs shrink-0">1</span><span>키트 결제 후 검사 키트가 자택으로 배송됩니다 (1~2일)</span></div>
              <div className="flex gap-3"><span className="w-6 h-6 bg-[#1B2A4A] text-white rounded-full flex items-center justify-center text-xs shrink-0">2</span><span>동봉된 설명서에 따라 타액 검체를 채취합니다</span></div>
              <div className="flex gap-3"><span className="w-6 h-6 bg-[#1B2A4A] text-white rounded-full flex items-center justify-center text-xs shrink-0">3</span><span>동봉된 반송 봉투로 검체를 발송합니다</span></div>
              <div className="flex gap-3"><span className="w-6 h-6 bg-[#1B2A4A] text-white rounded-full flex items-center justify-center text-xs shrink-0">4</span><span>분석 완료 후 앱에서 결과를 확인합니다 ({kit.duration})</span></div>
            </div>
          </div>

          <p className="text-sm font-bold text-[#1E293B] mb-3">소요 기간: {kit.duration}</p>
          <button onClick={() => setStep('address')} className="w-full bg-[#22C55E] text-white font-bold py-4 rounded-lg hover:bg-[#16A34A] text-lg">바로 신청하기 — {kit.price.toLocaleString()}원</button>
        </>
      )}

      {step === 'address' && (
        <>
          <h1 className="text-xl font-bold text-[#1E293B] mb-2">검사 키트 배송 정보</h1>
          <p className="text-sm text-[#64748B] mb-6">결제 완료 후 1~2일 내 키트가 배송됩니다.</p>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-xs text-[#64748B]">KIT</div>
            <div className="flex-1">
              <p className="font-bold text-sm">{kit.name}</p>
              <p className="text-sm text-[#22C55E] font-bold">{kit.price.toLocaleString()}원</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">이름 <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                placeholder="수령인 이름" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.name ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">연락처 <span className="text-red-500">*</span></label>
              <input type="text" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                placeholder="010-0000-0000" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.phone ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">배송지 <span className="text-red-500">*</span></label>
              <input type="text" value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))}
                placeholder="키트 수령 주소" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.address ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6">
            <h3 className="font-bold text-sm mb-3">결제 수단</h3>
            <div className="flex gap-3">
              {['카드 결제', '계좌이체'].map(m => (
                <button key={m} className="flex-1 border border-[#E2E8F0] py-3 rounded-lg text-sm hover:border-[#22C55E] focus:border-[#22C55E] focus:bg-green-50">{m}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('info')} className="flex-1 border border-[#E2E8F0] py-3 rounded-lg font-bold hover:bg-[#F8FAFC]">뒤로</button>
            <button onClick={handlePurchase} className="flex-1 bg-[#22C55E] text-white py-3 rounded-lg font-bold hover:bg-[#16A34A]">결제하기</button>
          </div>
        </>
      )}

      {step === 'done' && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">검사 키트 신청 완료</h2>
          <p className="text-[#64748B] mb-1">{kit.name}</p>
          <p className="text-lg font-bold text-[#22C55E] mb-4">{kit.price.toLocaleString()}원 결제 완료</p>
          <p className="text-sm text-[#64748B]">1~2일 내 키트가 배송됩니다.</p>
          <p className="text-sm text-[#64748B]">검체 발송 후 {kit.duration} 내 결과를 확인하실 수 있습니다.</p>
        </div>
      )}
    </div>
  )
}
