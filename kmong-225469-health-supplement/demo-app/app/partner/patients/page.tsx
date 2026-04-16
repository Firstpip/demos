import { patients } from '../../data/patients'

export default function PartnerPatientsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">환자 목록</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs">
            <th className="py-3 px-4 text-left">환자명</th><th className="py-3 px-4 text-left">검사 상태</th><th className="py-3 px-4 text-left">결과</th><th className="py-3 px-4 text-left">추천 제품</th><th className="py-3 px-4 text-left">구매 여부</th><th className="py-3 px-4 text-right">수수료</th>
          </tr></thead>
          <tbody>{patients.map(p => (
            <tr key={p.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
              <td className="py-3 px-4 font-medium">{p.name}</td>
              <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full ${p.testStatus === '결과 완료' ? 'bg-green-100 text-green-700' : p.testStatus === '분석 중' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{p.testStatus}</span></td>
              <td className="py-3 px-4 text-xs">{p.result}</td>
              <td className="py-3 px-4 text-xs">{p.recommendedProduct}</td>
              <td className="py-3 px-4"><span className={`text-xs ${p.purchaseStatus === '구매완료' ? 'text-[#22C55E] font-medium' : 'text-[#64748B]'}`}>{p.purchaseStatus}</span></td>
              <td className="py-3 px-4 text-right font-medium">{p.commission > 0 ? `₩${p.commission.toLocaleString()}` : '-'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
