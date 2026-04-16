'use client'
import Link from 'next/link'
import { useToast } from '../components/Toast'
import StatCard from '../components/StatCard'
import BarChart from '../components/BarChart'
import { patients, monthlyRevenue } from '../data/patients'

export default function PartnerDashboard() {
  const { toast } = useToast()
  const totalPatients = patients.length
  const purchased = patients.filter(p => p.purchaseStatus === '구매완료')
  const conversionRate = totalPatients > 0 ? Math.round((purchased.length / totalPatients) * 100) : 0
  const totalCommission = patients.reduce((a, p) => a + p.commission, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">대시보드</h1>
        <span className="text-sm text-[#64748B]">2026년 3월 기준</span>
      </div>
      <div id="dashboard-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="이번 달 추천 환자" value={`${totalPatients}명`} subText={`완료 ${purchased.length}명`} color="#3B82F6" />
        <StatCard label="구매 전환율" value={`${conversionRate}%`} color="#22C55E" />
        <StatCard label="누적 수수료" value={`₩${totalCommission.toLocaleString()}`} color="#F59E0B" />
        <StatCard label="정산 예정일" value="3월 25일" subText="D-21" color="#EF4444" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1E293B]">최근 환자 목록</h2>
            <Link href="/partner/patients" className="text-xs text-[#3B82F6]">전체 보기 →</Link>
          </div>
          <div id="patient-table" className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs">
                <th className="py-2 px-3 text-left">환자명</th><th className="py-2 px-3 text-left">검사 상태</th><th className="py-2 px-3 text-left">결과</th><th className="py-2 px-3 text-left">추천 제품</th><th className="py-2 px-3 text-left">구매여부</th><th className="py-2 px-3 text-right">수수료</th>
              </tr></thead>
              <tbody>{patients.slice(0, 5).map(p => (
                <tr key={p.id} className="border-b border-[#E2E8F0]">
                  <td className="py-2 px-3">{p.name}</td>
                  <td className="py-2 px-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.testStatus === '결과 완료' ? 'bg-green-100 text-green-700' : p.testStatus === '분석 중' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{p.testStatus}</span></td>
                  <td className="py-2 px-3 text-xs">{p.result}</td>
                  <td className="py-2 px-3 text-xs">{p.recommendedProduct}</td>
                  <td className="py-2 px-3"><span className={`text-xs font-medium ${p.purchaseStatus === '구매완료' ? 'text-[#22C55E]' : 'text-[#64748B]'}`}>{p.purchaseStatus}</span></td>
                  <td className="py-2 px-3 text-right font-medium">{p.commission > 0 ? `₩${p.commission.toLocaleString()}` : '-'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-bold text-[#1E293B] mb-4" id="revenue-chart">월별 수수료 추이</h2>
          <BarChart data={monthlyRevenue.map(m => ({ label: m.month, value: m.value }))} />
        </div>
      </div>
      <div id="referral-link" className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-[#1E293B] mb-4">나의 추천 링크</h2>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <code className="text-sm flex-1 break-all">https://genetichealth.co.kr/?ref=DR0042</code>
          <div className="flex gap-2">
            <button onClick={() => { navigator.clipboard?.writeText('https://genetichealth.co.kr/?ref=DR0042'); toast('링크가 복사되었습니다') }} className="bg-[#22C55E] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#16A34A]">링크 복사</button>
            <button onClick={() => toast('QR 코드가 생성되었습니다')} className="bg-[#1B2A4A] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#2A3F6A]">QR 코드 생성</button>
          </div>
        </div>
        <div id="qr-section" className="mt-4 w-32 h-32 border-2 border-dashed border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#64748B] text-sm">QR</div>
      </div>
    </div>
  )
}
