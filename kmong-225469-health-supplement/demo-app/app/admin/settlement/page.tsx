import { doctors, pharmacists } from '../../data/experts'

export default function AdminSettlementPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">정산 관리</h1>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="font-bold text-[#1E293B] mb-4">의사 파트너 정산</h2>
        <table className="w-full text-sm"><thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-2 px-3 text-left">이름</th><th className="py-2 px-3 text-left">소속</th><th className="py-2 px-3 text-right">추천환자</th><th className="py-2 px-3 text-right">전환율</th><th className="py-2 px-3 text-right">누적수수료</th></tr></thead>
        <tbody>{doctors.map(d => (
          <tr key={d.id} className="border-t border-[#E2E8F0]"><td className="py-2 px-3 font-medium">{d.name}</td><td className="py-2 px-3">{d.hospital}</td><td className="py-2 px-3 text-right">{d.patientsReferred}명</td><td className="py-2 px-3 text-right">{d.conversionRate}%</td><td className="py-2 px-3 text-right text-[#22C55E] font-medium">₩{d.totalRevenue.toLocaleString()}</td></tr>
        ))}</tbody></table>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-[#1E293B] mb-4">약사 정산</h2>
        <table className="w-full text-sm"><thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-2 px-3 text-left">이름</th><th className="py-2 px-3 text-left">소속</th><th className="py-2 px-3 text-right">상담수</th><th className="py-2 px-3 text-right">상태</th></tr></thead>
        <tbody>{pharmacists.map(p => (
          <tr key={p.id} className="border-t border-[#E2E8F0]"><td className="py-2 px-3 font-medium">{p.name}</td><td className="py-2 px-3">{p.pharmacy}</td><td className="py-2 px-3 text-right">{p.consultCount}회</td><td className="py-2 px-3 text-right"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">정산완료</span></td></tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
