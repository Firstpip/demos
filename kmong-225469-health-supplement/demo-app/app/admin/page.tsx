import StatCard from '../components/StatCard'
import { orders } from '../data/orders'

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">관리자 대시보드</h1>
      <div id="admin-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="총 회원수" value="1,247명" subText="+82 이번 달" color="#3B82F6" />
        <StatCard label="총 주문수" value="3,891건" subText="+234 이번 달" color="#22C55E" />
        <StatCard label="이번 달 매출" value="₩15.2M" subText="전월대비 +12%" color="#F59E0B" />
        <StatCard label="활성 구독" value="892건" subText="전환율 72%" color="#8B5CF6" />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-[#1E293B] mb-4">최근 주문</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-2 px-3 text-left">주문번호</th><th className="py-2 px-3 text-left">날짜</th><th className="py-2 px-3 text-left">상품</th><th className="py-2 px-3 text-right">금액</th><th className="py-2 px-3 text-right">상태</th></tr></thead>
            <tbody>{orders.slice(0, 5).map(o => (
              <tr key={o.id} className="border-t border-[#E2E8F0]"><td className="py-2 px-3 font-medium">{o.id}</td><td className="py-2 px-3">{o.date}</td><td className="py-2 px-3 text-xs">{o.products.map(p => p.name).join(', ')}</td><td className="py-2 px-3 text-right">{o.total.toLocaleString()}원</td><td className="py-2 px-3 text-right"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{o.status}</span></td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
