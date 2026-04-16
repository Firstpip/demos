'use client'
import Link from 'next/link'
import HealthScoreGauge from '../../../components/HealthScoreGauge'
import CheckupItemCard from '../../../components/CheckupItemCard'
import { healthCheckupItems, healthScore, healthGrades, recommendedNutrients } from '../../../data/health-checkup'
import { useAuth } from '../../../contexts/auth-context'

export default function HealthCheckupPage() {
  const { userName } = useAuth()
  const displayName = userName || '이환규'
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-1">{displayName}님의 건강정보를 분석한 결과에요!</h1>
      <p className="text-sm text-[#64748B] mb-8">최근 결과 만44세 | 남성 &nbsp; 2025-11-15 기준</p>
      <div className="flex flex-col items-center mb-8"><HealthScoreGauge score={healthScore} /></div>
      <div id="health-grades" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm font-bold text-green-700 mb-2">건강해요</p>
          <div className="flex flex-wrap gap-1">{healthGrades.good.map(g => <span key={g} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{g}</span>)}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-bold text-yellow-700 mb-2">주의가 필요해요</p>
          <div className="flex flex-wrap gap-1">{healthGrades.caution.map(g => <span key={g} className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{g}</span>)}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm font-bold text-red-700 mb-2">질환이 의심돼요</p>
          <div className="flex flex-wrap gap-1">{healthGrades.danger.map(g => <span key={g} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">{g}</span>)}</div>
        </div>
      </div>
      <div className="mb-8">
        <p className="text-sm font-bold text-[#3B82F6] mb-2">추천 성분 {recommendedNutrients.length}</p>
        <div className="flex flex-wrap gap-2">{recommendedNutrients.map(n => <span key={n} className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">{n}</span>)}</div>
      </div>
      <div id="checkup-detail">
        <h2 className="text-lg font-bold text-[#1E293B] mb-4">검진 항목별 상세</h2>
        <div className="space-y-3">{healthCheckupItems.map(item => <CheckupItemCard key={item.name} item={item} />)}</div>
      </div>
      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/consultation" className="bg-[#22C55E] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#16A34A]">결과지 영양제 추천 상담</Link>
        <Link href="/survey" className="border border-[#E2E8F0] px-6 py-3 rounded-lg text-sm hover:bg-[#F8FAFC]">건강설문 다시하기</Link>
      </div>
    </div>
  )
}
