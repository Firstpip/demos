import { orders } from '../../data/orders'

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">주문/배송 관리</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-3 px-4 text-left">주문번호</th><th className="py-3 px-4 text-left">날짜</th><th className="py-3 px-4 text-left">상품</th><th className="py-3 px-4 text-right">금액</th><th className="py-3 px-4 text-center">구독</th><th className="py-3 px-4 text-center">상태</th></tr></thead>
          <tbody>{orders.map(o => (
            <tr key={o.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
              <td className="py-3 px-4 font-medium">{o.id}</td><td className="py-3 px-4">{o.date}</td><td className="py-3 px-4 text-xs">{o.products.map(p => p.name).join(', ')}</td><td className="py-3 px-4 text-right">{o.total.toLocaleString()}원</td>
              <td className="py-3 px-4 text-center">{o.isSubscription ? <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">정기</span> : '-'}</td>
              <td className="py-3 px-4 text-center"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{o.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
