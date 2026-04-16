import { monthlyRevenue } from '../../data/patients'

export default function SettlementPage() {
  const total = monthlyRevenue.reduce((a, m) => a + m.value, 0)
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">수수료 정산</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <p className="text-sm text-[#64748B]">총 누적 수수료</p>
        <p className="text-3xl font-bold text-[#22C55E]">₩{total.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-3 px-4 text-left">월</th><th className="py-3 px-4 text-right">수수료</th><th className="py-3 px-4 text-right">상태</th></tr></thead>
          <tbody>{monthlyRevenue.map((m, i) => (
            <tr key={i} className="border-t border-[#E2E8F0]"><td className="py-3 px-4">{m.month}</td><td className="py-3 px-4 text-right font-medium">₩{m.value.toLocaleString()}</td><td className="py-3 px-4 text-right"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">정산완료</span></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
