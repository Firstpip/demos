import Link from 'next/link'
import HealthScoreGauge from '../../../components/HealthScoreGauge'
import { healthScore, healthCheckupItems, recommendedNutrients } from '../../../data/health-checkup'
import { geneMarkers } from '../../../data/gene-markers'
import { products } from '../../../data/products'

// AI 추천 로직: 유전자 HIGH 마커 + 검진 caution/danger 항목 → 매칭 제품
function getRecommendedProducts() {
  const highRiskGenes = geneMarkers.filter(m => m.risk === 'HIGH')
  const abnormalCheckups = healthCheckupItems.filter(i => i.status !== 'normal')
  const neededNutrients = new Set<string>()
  highRiskGenes.forEach(g => g.nutrients.forEach(n => neededNutrients.add(n.toLowerCase())))
  abnormalCheckups.forEach(c => c.keyIngredient.split(', ').forEach(n => neededNutrients.add(n.toLowerCase())))

  return products.map(p => {
    const matchCount = p.ingredients.filter(ing =>
      Array.from(neededNutrients).some(n => ing.toLowerCase().includes(n) || n.includes(ing.toLowerCase().split(' ')[0]))
    ).length
    const reasons: string[] = []
    highRiskGenes.forEach(g => {
      if (g.nutrients.some(n => p.ingredients.some(ing => ing.toLowerCase().includes(n.split('(')[0].toLowerCase()))))
        reasons.push(`${g.gene} 유전자 변이 (${g.category})`)
    })
    abnormalCheckups.forEach(c => {
      if (c.keyIngredient.split(', ').some(n => p.ingredients.some(ing => ing.toLowerCase().includes(n.toLowerCase().split(' ')[0]))))
        reasons.push(`${c.name} ${c.status === 'danger' ? '위험' : '주의'} (${c.value}${c.unit})`)
    })
    return { product: p, matchCount, reasons }
  }).filter(r => r.matchCount > 0 || r.reasons.length > 0).sort((a, b) => b.reasons.length - a.reasons.length).slice(0, 6)
}

export default function ReportPage() {
  const recommended = getRecommendedProducts()
  const highRisk = geneMarkers.filter(m => m.risk === 'HIGH')
  const abnormal = healthCheckupItems.filter(i => i.status !== 'normal')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-1">AI 건강 리포트</h1>
      <p className="text-sm text-[#64748B] mb-6">유전자 검사 + 건강검진 + 설문 결과를 종합 분석한 결과입니다.</p>

      <div className="flex flex-col items-center mb-8"><HealthScoreGauge score={healthScore} /></div>

      {/* 종합 분석 */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <h2 className="font-bold text-[#1E293B] mb-3">종합 분석</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-red-600 mb-1">유전자 고위험 마커 ({highRisk.length}개)</p>
            <div className="flex flex-wrap gap-2">
              {highRisk.map(g => <span key={g.gene} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">{g.gene} — {g.category}: {g.symptom}</span>)}
            </div>
          </div>
          <div>
            <p className="font-medium text-yellow-600 mb-1">건강검진 주의/위험 항목 ({abnormal.length}개)</p>
            <div className="flex flex-wrap gap-2">
              {abnormal.map(c => (
                <span key={c.name} className={`text-xs px-2 py-1 rounded-full ${c.status === 'danger' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {c.name}: {c.value}{c.unit} ({c.status === 'danger' ? '위험' : '주의'})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 부족 영양소 */}
      <div className="mb-6">
        <h2 className="font-bold text-[#1E293B] mb-3">부족 영양소 분석</h2>
        <div className="flex flex-wrap gap-2">{recommendedNutrients.map(n => <span key={n} className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">{n}</span>)}</div>
      </div>

      {/* AI 추천 제품 */}
      <div className="mb-6">
        <h2 className="font-bold text-[#1E293B] mb-3">맞춤 추천 건기식 조합</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {recommended.map(r => (
            <Link key={r.product.id} href={`/market/${r.product.id}`} className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-xs text-[#64748B] shrink-0">{r.product.category}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#1E293B]">{r.product.name}</p>
                  <p className="text-xs text-[#22C55E] font-medium">구독 {r.product.subscriptionPrice.toLocaleString()}원/월</p>
                  {r.reasons.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-[#64748B]">추천 근거:</p>
                      {r.reasons.slice(0, 2).map((reason, i) => <p key={i} className="text-xs text-[#3B82F6]">- {reason}</p>)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 다음 단계 */}
      <div className="bg-[#F8FAFC] rounded-xl p-6">
        <h2 className="font-bold text-[#1E293B] mb-3">다음 단계</h2>
        <div className="space-y-3 text-sm">
          <p>1. 전문가 상담을 통해 추천 조합을 확정하세요</p>
          <p>2. 정기구독으로 꾸준히 복용하세요 (최대 20% 할인)</p>
          <p>3. 3개월 후 재검사로 개선 효과를 확인하세요</p>
        </div>
        <div className="flex gap-3 mt-4">
          <Link href="/consultation" className="inline-block bg-[#22C55E] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#16A34A]">전문가 상담 예약</Link>
          <Link href="/my-results" className="inline-block border border-[#E2E8F0] px-6 py-2 rounded-lg text-sm hover:bg-white">건강검진 업데이트</Link>
        </div>
      </div>
    </div>
  )
}
