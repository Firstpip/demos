'use client';

import { dashboardSummary, dailySales, lowStockProducts } from '@/data/dashboard';
import { orders } from '@/data/orders';
import { members } from '@/data/members';
import StatusBadge from '@/components/StatusBadge';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function AdminDashboardPage() {
  const recentOrders = orders.slice(0, 5);
  const pendingMembers = members.filter(m => m.status === 'pending').slice(0, 3);
  const maxSales = Math.max(...dailySales.map(d => d.amount));

  const summaryCards = [
    { label: '오늘 주문', value: `${dashboardSummary.todayOrders}건`, color: 'bg-primary', icon: '📋' },
    { label: '미확인 입금', value: `${dashboardSummary.pendingPayments}건`, color: 'bg-warning', icon: '💰' },
    { label: '대기 회원', value: `${dashboardSummary.pendingMembers}명`, color: 'bg-error', icon: '👤' },
    { label: '월 매출', value: `${formatPrice(dashboardSummary.monthlySales)}원`, color: 'bg-success', icon: '📈' },
  ];

  return (
    <div id="admin-dashboard">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">대시보드</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(card => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-400">{card.label}</span>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sales chart */}
      <div className="card p-6 mb-8">
        <h2 className="font-bold text-neutral-900 mb-4">월간 매출 추이</h2>
        <div className="flex items-end gap-1 h-40 overflow-x-auto pb-2">
          {dailySales.map((day, i) => (
            <div key={i} className="flex flex-col items-center min-w-[20px] flex-1">
              <div
                className="w-full bg-primary/20 hover:bg-primary/40 rounded-t transition-colors min-h-[4px]"
                style={{ height: `${(day.amount / maxSales) * 100}%` }}
                title={`${day.date}: ${formatPrice(day.amount)}원`}
              />
              {(i % 5 === 0) && (
                <span className="text-[10px] text-neutral-400 mt-1">{day.date.slice(8)}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
          <span>3월 1일</span>
          <span>3월 30일</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent orders */}
        <div className="card p-6">
          <h2 className="font-bold text-neutral-900 mb-4">최근 주문</h2>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.businessName}</p>
                  <p className="text-xs text-neutral-400">{order.orderNumber} | {order.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(order.finalAmount)}원</p>
                  <StatusBadge status={order.status} type="order" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending members */}
        <div className="card p-6">
          <h2 className="font-bold text-neutral-900 mb-4">승인 대기 회원</h2>
          {pendingMembers.length === 0 ? (
            <p className="text-neutral-400 text-sm py-4 text-center">대기 중인 회원이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {pendingMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{member.businessName}</p>
                    <p className="text-xs text-neutral-400">{member.ownerName} | {member.businessNumber}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={member.status} />
                    <p className="text-xs text-neutral-400 mt-1">{member.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low stock */}
      <div className="card p-6">
        <h2 className="font-bold text-neutral-900 mb-4">재고 부족 상품</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left px-4 py-2 font-medium text-neutral-600">상품명</th>
                <th className="text-left px-4 py-2 font-medium text-neutral-600">옵션</th>
                <th className="text-right px-4 py-2 font-medium text-neutral-600">현재 재고</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr key={`${product.id}-${product.option}`} className="border-b border-neutral-100">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2 text-neutral-400">{product.option}</td>
                  <td className="px-4 py-2 text-right">
                    <span className="text-error font-bold">{product.currentStock}개</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
