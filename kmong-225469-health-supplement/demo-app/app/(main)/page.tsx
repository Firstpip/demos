import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* 히어로 */}
      <section id="hero-section" className="bg-[#1B2A4A] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">나만을 위한 완벽한 영양 배합,<br/>의사의 진단에서 시작됩니다</h1>
            <p className="text-white/70 mb-6">DTC 유전자검사와 건강검진 데이터를 분석하여 당신에게 꼭 맞는 건강기능식품을 추천합니다.</p>
            <Link href="/my-results" className="inline-block bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold px-8 py-3 rounded-lg transition-colors">맞춤형 건강기능식품 찾기</Link>
          </div>
          <div className="w-48 h-48 rounded-full border-4 border-[#22C55E]/30 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-2 border-[#22C55E] flex items-center justify-center text-center">
              <span className="text-lg font-bold">DNA<br/>시각화 영역</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2개 입구 */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-6">
        <Link href="/my-results/dtc" className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-shadow" id="banner-dtc">
          <h3 className="font-bold text-lg text-[#1E293B] mb-2">DTC 유전자분석</h3>
          <p className="text-sm text-[#64748B]">한 번의 검체 채취로 42가지 유전자 검사로 특성에 맞는 영양제 설계</p>
        </Link>
        <Link href="/my-results/health-checkup" className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-lg text-[#1E293B] mb-2">건강검진 결과분석</h3>
          <p className="text-sm text-[#64748B]">건강검진 받으셨나요? 혈당, 콜레스테롤, 간수치를 분석. 맞춤 영양제 추천</p>
        </Link>
      </section>

      {/* 배너 3종 */}
      <section className="bg-[#F8FAFC] py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            { title: '나만을 위한 건강식품,', sub: '의사가 직접 진단합니다', desc: 'DTC 유전자검사 + 건강검진결과 이중 분석' },
            { title: '유전자가 알려주는', sub: '나만의 건강 레시피', desc: 'DTC 유전자검사로 타고난 체질을 분석' },
            { title: '영양제, 아무거나', sub: '드시고 계신가요?', desc: 'DTC 유전자검사로 타고난 체질을 분석' },
          ].map((b, i) => (
            <div key={i} className="bg-[#1B2A4A] text-white rounded-xl p-6 hover:bg-[#2A3F6A] transition-colors cursor-pointer">
              <h3 className="font-bold text-lg">{b.title}</h3>
              <h3 className="font-bold text-lg mb-2">{b.sub}</h3>
              <p className="text-xs text-white/60">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 전문의 상담 */}
      <section id="expert-consult" className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8">
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">전문의 1:1 맞춤상담</h2>
          <p className="text-sm text-[#64748B] mb-6">전문의가 검사결과를 직접 분석하고 맞춤형 영양제를 설계 추천 합니다.</p>
          <div className="h-48 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-[#64748B] mb-6">전문의 단체 사진 영역</div>
          <Link href="/consultation" className="inline-block border border-[#E2E8F0] px-6 py-2 rounded-lg text-sm hover:bg-[#F8FAFC]">상담하기</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {['영양제 복용 후 확실히 달라졌어요', '전문의 상담이 정말 도움됐습니다', '맞춤 추천이라 믿고 먹습니다', '정기배송이 편해서 꾸준히 먹어요'].map((r, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <p className="text-xs text-[#64748B]">후기 {i + 1}</p>
              <p className="text-sm text-[#1E293B] mt-1">{r}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
