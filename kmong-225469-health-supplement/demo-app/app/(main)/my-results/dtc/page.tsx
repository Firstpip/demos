'use client'
import Link from 'next/link'
import HealthScoreGauge from '../../../components/HealthScoreGauge'
import GeneMarkerCard from '../../../components/GeneMarkerCard'
import { geneMarkers } from '../../../data/gene-markers'
import { healthScore, healthGrades, recommendedNutrients } from '../../../data/health-checkup'
import { products } from '../../../data/products'
import { useAuth } from '../../../contexts/auth-context'

export default function DtcResultPage() {
  const { userName } = useAuth()
  const displayName = userName || '이환규'
  // AI 추천: HIGH 마커의 영양소와 매칭되는 제품
  const highMarkers = geneMarkers.filter(m => m.risk === 'HIGH')
  const recommended = products.filter(p =>
    highMarkers.some(m => m.nutrients.some(n => p.ingredients.some(ing => ing.toLowerCase().includes(n.split('(')[0].toLowerCase()))))
  ).slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-1">{displayName}님의 유전자정보를 분석한 결과에요!</h1>
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
      <div id="recommended-nutrients" className="mb-8">
        <p className="text-sm font-bold text-[#3B82F6] mb-2">추천 성분 {recommendedNutrients.length}</p>
        <div className="flex flex-wrap gap-2">{recommendedNutrients.map(n => <span key={n} className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">{n}</span>)}</div>
      </div>
      <div id="gene-markers">
        <h2 className="text-lg font-bold text-[#1E293B] mb-4">유전자 마커별 분석</h2>
        <div className="grid md:grid-cols-2 gap-4">{geneMarkers.map(m => <GeneMarkerCard key={m.gene} marker={m} />)}</div>
      </div>
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-bold text-green-700 mb-2">생활 습관 개선 팁</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>- 정제 탄수화물 섭취 줄이기</li><li>- 유산소 운동 주 3회 이상</li><li>- 혈당 지수 낮은 식품 선택</li>
        </ul>
      </div>
      {/* 추천 제품 섹션 */}
      {recommended.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">유전자 분석 기반 추천 제품</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommended.map(p => (
              <Link key={p.id} href={`/market/${p.id}`} className="bg-white border border-[#E2E8F0] rounded-xl p-3 hover:shadow-md text-center">
                <div className="h-16 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-xs text-[#64748B] mb-2">{p.category}</div>
                <p className="text-xs font-bold text-[#1E293B] line-clamp-1">{p.name}</p>
                <p className="text-xs text-[#22C55E]">{p.subscriptionPrice.toLocaleString()}원</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 flex gap-3 justify-center">
        <Link href="/consultation" className="bg-[#22C55E] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#16A34A]">결과지 영양제 추천 상담</Link>
        <Link href="/my-results" className="border border-[#E2E8F0] px-6 py-3 rounded-lg text-sm hover:bg-[#F8FAFC]">건강검진 업데이트</Link>
      </div>
    </div>
  )
}
