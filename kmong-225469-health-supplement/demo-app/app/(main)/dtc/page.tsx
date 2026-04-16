import Link from 'next/link'

const steps = [
  { num: '1', title: '병원 방문', desc: '의사로부터 DTC 검사 안내' },
  { num: '2', title: '회원가입', desc: '홈페이지 접속 회원가입/로그인' },
  { num: '3', title: '검사 신청', desc: 'DTC 유전자검사 OR 건강검진 키트 신청' },
  { num: '4', title: '키트 수령', desc: '검사 키트 택배 수령' },
  { num: '5', title: '검체 채취', desc: '타액 등 검체 채취' },
  { num: '6', title: '검체 발송', desc: '검체를 검사센터에 회신' },
  { num: '7', title: '결과 확인', desc: '유전자 검사 OR 건강검진 결과 확인' },
  { num: '8', title: '전문가 상담 및 제품 구매', desc: '개인 맞춤형 건강기능식품 제공' },
]

export default function DtcPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1E293B] mb-2">DTC 유전자검사 소개</h1>
      <p className="text-[#64748B] mb-8">DTC(Direct-To-Consumer) 유전자 검사를 통해 당신의 유전적 특성을 파악하고, 맞춤형 건강기능식품을 추천받으세요.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {steps.map(s => (
          <div key={s.num} className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-[#1B2A4A] text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">{s.num}</div>
            <h3 className="font-bold text-sm text-[#1E293B] mb-1">{s.title}</h3>
            <p className="text-xs text-[#64748B]">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link href="/dtc/products" className="inline-block bg-[#22C55E] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#16A34A]">유전자 검사하기</Link>
      </div>
    </div>
  )
}
