import { orders } from '../../../data/orders'

const statusColor: Record<string, string> = { '결제완료': 'bg-blue-100 text-blue-700', '배송준비': 'bg-yellow-100 text-yellow-700', '배송중': 'bg-orange-100 text-orange-700', '배송완료': 'bg-green-100 text-green-700', '정기배송': 'bg-purple-100 text-purple-700' }

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">주문/배송 내역</h1>
      {orders.length === 0 && <p className="text-center text-[#64748B] py-12">주문 내역이 없습니다.</p>}
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-[#64748B]">{o.date}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[o.status] || ''}`}>{o.status}</span>
            </div>
            {o.products.map((p, i) => <p key={i} className="text-sm text-[#1E293B]">{p.name} x {p.quantity}</p>)}
            <p className="text-sm font-bold text-[#1E293B] mt-2">{o.total.toLocaleString()}원</p>
          </div>
        ))}
      </div>
    </div>
  )
}
