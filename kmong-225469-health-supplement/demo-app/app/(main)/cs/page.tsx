'use client'
import { useState } from 'react'
import { useToast } from '../../components/Toast'

const faqs = [
  { q: 'DTC 유전자검사는 어떻게 진행되나요?', a: '검사 키트를 신청하시면 택배로 수령 후, 타액 등 검체를 채취하여 반송하시면 2~3주 후 결과를 확인하실 수 있습니다.' },
  { q: '건강검진 결과는 어떻게 불러오나요?', a: '코드에프(CODEF) API를 통해 국민건강보험공단에서 최근 건강검진 기록을 안전하게 연동합니다. 본인인증 후 자동으로 불러옵니다.' },
  { q: '정기구독은 언제든 해지할 수 있나요?', a: '네, 정기구독은 언제든 해지 가능합니다. 마이페이지 > 정기배송 관리에서 직접 해지하실 수 있습니다.' },
  { q: '화상상담은 어떻게 이용하나요?', a: '상담 페이지에서 약사 또는 전문의를 선택한 후, 화상상담 예약을 하시면 됩니다. 예약 시간에 맞춰 웹/앱에서 화상 연결됩니다.' },
  { q: '의사 추천 리워드는 어떻게 받나요?', a: '의사 파트너로 가입 후, 환자에게 추천 링크/QR을 제공하여 가입/구매가 발생하면 자동으로 수수료가 적립됩니다.' },
]

export default function CsPage() {
  const [tab, setTab] = useState<'notice' | 'faq' | 'inquiry'>('faq')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { toast } = useToast()
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">고객센터</h1>
      <div className="flex gap-4 mb-6">
        {[{ k: 'notice' as const, l: '공지사항' }, { k: 'faq' as const, l: 'FAQ' }, { k: 'inquiry' as const, l: '1:1 문의' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm font-bold ${tab === t.k ? 'bg-[#1B2A4A] text-white' : 'bg-[#F8FAFC] text-[#64748B]'}`}>{t.l}</button>
        ))}
      </div>
      {tab === 'notice' && <div className="space-y-3">{['서비스 오픈 안내', '정기구독 할인 이벤트', '앱 업데이트 안내'].map((n, i) => <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4"><p className="font-medium text-sm">{n}</p><p className="text-xs text-[#64748B]">2026-03-{28 - i * 5}</p></div>)}</div>}
      {tab === 'faq' && <div className="space-y-2">{faqs.map((f, i) => (
        <div key={i} className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-4 text-left flex justify-between items-center hover:bg-[#F8FAFC]">
            <span className="text-sm font-medium">{f.q}</span>
            <span className="text-[#64748B]">{openFaq === i ? '−' : '+'}</span>
          </button>
          {openFaq === i && <div className="px-4 pb-4 text-sm text-[#64748B]">{f.a}</div>}
        </div>
      ))}</div>}
      {tab === 'inquiry' && <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
        <input type="text" placeholder="제목" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm" />
        <textarea placeholder="문의 내용을 입력하세요" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm h-32" />
        <button onClick={() => toast('문의가 접수되었습니다')} className="bg-[#22C55E] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#16A34A]">문의 등록</button>
      </div>}
    </div>
  )
}
