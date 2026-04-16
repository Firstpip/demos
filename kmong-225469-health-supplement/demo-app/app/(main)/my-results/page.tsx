import Link from 'next/link'

const entries = [
  { title: 'DTC유전자 결과 불러오기', desc: 'DTC 유전자검사 결과를 불러와 42가지 유전자 특성에 맞는 영양제를 추천받으세요.', href: '/verify?redirect=/my-results/dtc', id: 'dtc-entry', needsAuth: true },
  { title: '건강검진 기록 불러오기', desc: '국민건강보험공단 건강검진 기록을 불러와 검진 수치 기반 맞춤 영양제를 추천받으세요. CODEF API를 통해 안전하게 연동됩니다.', href: '/verify?redirect=/my-results/health-checkup', id: 'checkup-entry', needsAuth: true },
  { title: '설문조사로 추천 받기', desc: '간단한 건강 설문으로 생활습관과 건강 고민에 맞는 영양제를 추천받으세요.', href: '/survey', id: 'survey-entry', needsAuth: false },
]

export default function MyResultsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1E293B] mb-2">유전자가 알려주는 나만의 건강 레시피</h1>
      <p className="text-[#64748B] mb-8">아래 방법 중 하나를 선택하여 맞춤형 건강기능식품을 추천받으세요.</p>
      <div className="space-y-4">
        {entries.map(e => (
          <Link key={e.id} id={e.id} href={e.href} className="block bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg hover:border-[#22C55E] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#1E293B] mb-1">{e.title}</h3>
                <p className="text-sm text-[#64748B]">{e.desc}</p>
              </div>
              {e.needsAuth && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">본인인증 필요</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
