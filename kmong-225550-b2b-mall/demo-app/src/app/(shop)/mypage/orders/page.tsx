'use client';

import { useState } from 'react';
import { orders } from '@/data/orders';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import type { Order } from '@/data/orders';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function MypageOrdersPage() {
  const { currentUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Show orders for current user (or all for demo)
  const myOrders = currentUser
    ? orders.filter(o => o.memberId === currentUser.id || o.businessName === currentUser.businessName)
    : orders.slice(0, 5);

  const filteredOrders = statusFilter === 'all'
    ? myOrders
    : myOrders.filter(o => o.status === statusFilter);

  const statuses = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '입금대기' },
    { value: 'confirmed', label: '주문확인' },
    { value: 'shipping', label: '배송중' },
    { value: 'delivered', label: '배송완료' },
    { value: 'cancelled', label: '취소' },
  ];

  return (
    <div id="mypage-orders">
      <h2 className="text-lg font-bold text-neutral-900 mb-4">주문내역</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
              statusFilter === s.value
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card p-8 text-center text-neutral-400">주문 내역이 없습니다.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-striped">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">주문번호</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">상품</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">금액</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">상태</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">주문일</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">상세</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3 text-primary font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span className="truncate block max-w-[200px]">
                        {order.items[0].productName}
                        {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(order.finalAmount)}원</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={order.status} type="order" />
                    </td>
                    <td className="px-4 py-3 text-center text-neutral-400">{order.createdAt.split(' ')[0]}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:underline text-xs cursor-pointer"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="주문 상세"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-400">{selectedOrder.orderNumber}</span>
              <StatusBadge status={selectedOrder.status} type="order" />
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-medium text-neutral-900 mb-2">주문 상품</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm border-b border-neutral-100">
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-xs text-neutral-400">{item.optionValues} / {item.quantity}개</p>
                  </div>
                  <span className="font-medium">{formatPrice(item.totalPrice)}원</span>
                </div>
              ))}
            </div>
            <div className="bg-neutral-100 rounded-lg p-4 text-sm space-y-1">
              <div className="flex justify-between"><span>상품 합계</span><span>{formatPrice(selectedOrder.totalAmount)}원</span></div>
              <div className="flex justify-between text-error"><span>할인</span><span>-{formatPrice(selectedOrder.discountAmount)}원</span></div>
              <div className="flex justify-between font-bold border-t border-neutral-200 pt-1 mt-1">
                <span>결제 금액</span><span className="text-primary">{formatPrice(selectedOrder.finalAmount)}원</span>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-neutral-400">결제방식:</span> {selectedOrder.paymentMethod}</p>
              <p><span className="text-neutral-400">배송지:</span> {selectedOrder.shippingAddress}</p>
              {selectedOrder.shippingMemo && <p><span className="text-neutral-400">배송메모:</span> {selectedOrder.shippingMemo}</p>}
              <p><span className="text-neutral-400">주문일:</span> {selectedOrder.createdAt}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
