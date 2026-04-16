'use client';

import { useState } from 'react';
import { orders, type Order } from '@/data/orders';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { useToast } from '@/contexts/ToastContext';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orderList, setOrderList] = useState(orders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = statusFilter === 'all'
    ? orderList
    : orderList.filter(o => o.status === statusFilter);

  const statuses = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '입금대기' },
    { value: 'confirmed', label: '주문확인' },
    { value: 'shipping', label: '배송중' },
    { value: 'delivered', label: '배송완료' },
    { value: 'cancelled', label: '취소' },
  ];

  const updateStatus = (id: string, newStatus: Order['status']) => {
    setOrderList(prev => prev.map(o =>
      o.id === id ? { ...o, status: newStatus, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : o
    ));
    setSelectedOrder(null);
    const labels: Record<string, string> = {
      confirmed: '주문이 확인되었습니다.',
      shipping: '배송 처리되었습니다.',
      delivered: '배송 완료 처리되었습니다.',
      cancelled: '주문이 취소되었습니다.',
    };
    showToast(labels[newStatus] || '상태가 변경되었습니다.', 'success');
  };

  const confirmPayment = (id: string) => {
    setOrderList(prev => prev.map(o =>
      o.id === id ? { ...o, paymentConfirmed: true, status: 'confirmed' as const } : o
    ));
    setSelectedOrder(null);
    showToast('입금이 확인되었습니다.', 'success');
  };

  const handleExportCSV = () => {
    const headers = ['주문번호', '회사명', '상품', '금액', '상태', '주문일'];
    const rows = filtered.map(o => [
      o.orderNumber,
      o.businessName,
      o.items.map(i => i.productName).join('; '),
      o.finalAmount,
      o.status,
      o.createdAt,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV 파일이 다운로드되었습니다.', 'success');
  };

  return (
    <div id="admin-orders">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">주문관리</h1>
        <button onClick={handleExportCSV} className="btn-outline text-sm">
          📥 엑셀 다운로드
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
              statusFilter === s.value ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {s.label}
            <span className="ml-1 text-xs opacity-70">
              ({s.value === 'all' ? orderList.length : orderList.filter(o => o.status === s.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-striped">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">회사명</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">상품</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">금액</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">입금</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">생성</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">주문일</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.businessName}</td>
                  <td className="px-4 py-3 max-w-[180px] truncate text-neutral-600">
                    {order.items[0].productName}{order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatPrice(order.finalAmount)}원</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`w-2.5 h-2.5 rounded-full inline-block ${order.paymentConfirmed ? 'bg-success' : 'bg-warning'}`} />
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={order.status} type="order" /></td>
                  <td className="px-4 py-3 text-center text-xs text-neutral-400">{order.createdBy === 'admin' ? '관리자' : '회원'}</td>
                  <td className="px-4 py-3 text-center text-xs text-neutral-400">{order.createdAt.split(' ')[0]}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelectedOrder(order)} className="text-primary hover:underline text-xs cursor-pointer">
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="주문 상세" size="lg">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-neutral-400">{selectedOrder.orderNumber}</span>
                <h3 className="font-bold">{selectedOrder.businessName}</h3>
              </div>
              <StatusBadge status={selectedOrder.status} type="order" />
            </div>

            {/* Items */}
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-medium mb-2">주문 상품</h4>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm border-b border-neutral-100">
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-xs text-neutral-400">{item.optionValues} / {item.quantity}개 / @{formatPrice(item.unitPrice)}원</p>
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
              <p><span className="text-neutral-400">입금확인:</span> {selectedOrder.paymentConfirmed ? '확인됨' : '미확인'}</p>
              <p><span className="text-neutral-400">배송지:</span> {selectedOrder.shippingAddress}</p>
              {selectedOrder.shippingMemo && <p><span className="text-neutral-400">배송메모:</span> {selectedOrder.shippingMemo}</p>}
              <p><span className="text-neutral-400">세금계산서:</span> {selectedOrder.taxInvoiceRequested ? '요청' : '-'}</p>
              <p><span className="text-neutral-400">생성:</span> {selectedOrder.createdBy === 'admin' ? '관리자' : '회원'} | {selectedOrder.createdAt}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end border-t border-neutral-200 pt-4 flex-wrap">
              {selectedOrder.status === 'pending' && !selectedOrder.paymentConfirmed && (
                <button onClick={() => confirmPayment(selectedOrder.id)} className="btn-secondary text-sm">
                  입금 확인
                </button>
              )}
              {selectedOrder.status === 'pending' && (
                <button onClick={() => updateStatus(selectedOrder.id, 'confirmed')} className="btn-primary text-sm">
                  주문 확인
                </button>
              )}
              {selectedOrder.status === 'confirmed' && (
                <button onClick={() => updateStatus(selectedOrder.id, 'shipping')} className="btn-primary text-sm">
                  배송 처리
                </button>
              )}
              {selectedOrder.status === 'shipping' && (
                <button onClick={() => updateStatus(selectedOrder.id, 'delivered')} className="btn-primary text-sm">
                  배송 완료
                </button>
              )}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                <button onClick={() => updateStatus(selectedOrder.id, 'cancelled')} className="btn-danger text-sm">
                  취소
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
