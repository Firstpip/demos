'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { orders, users } from '@/lib/data';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import { useAuth, useToast } from '@/lib/context';
import AuthGuard from '@/components/AuthGuard';

const STATUS = ['전체', '결제완료', '배송준비', '배송중', '배송완료', '취소'] as const;

function MyOrdersInner() {
  const { userName } = useAuth();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<(typeof STATUS)[number]>('전체');

  const me = users.find(u => u.name === userName) ?? users[0];
  const myOrders = useMemo(() => {
    let list = orders.filter(o => o.userName === userName || o.userId === me.id);
    if (filter !== '전체') list = list.filter(o => o.status === filter);
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [userName, me.id, filter]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4">
        <Link href="/mypage" className="hover:text-[#1B2A4A]">마이페이지</Link> &nbsp;›&nbsp;
        <span className="text-gray-700">주문 내역</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">주문 내역</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              filter === s
                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center text-sm text-gray-500">
          조건에 맞는 주문이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map(o => (
            <article key={o.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <header className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{formatDate(o.createdAt)}</span>
                  <span className="text-xs text-gray-500">{o.orderNumber}</span>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded ${getStatusColor(o.status)}`}>
                  {o.status}
                </span>
              </header>

              <ul className="space-y-2 text-sm text-gray-700 mb-3">
                {o.items.map(it => (
                  <li key={it.productId} className="flex items-center justify-between">
                    <span className="line-clamp-1">
                      {it.title} × {it.quantity}
                    </span>
                    <span className="shrink-0 ml-2">{formatPrice(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {o.shippingAddress}
                  {o.trackingNumber && <span className="ml-2">· 송장 {o.trackingNumber}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#E8653A]">
                    {formatPrice(o.totalAmount + o.shippingFee)}
                  </span>
                  <button
                    onClick={() => showToast(`주문 ${o.orderNumber} 배송 조회 (Mock)`, 'info')}
                    className="px-3 py-1.5 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                  >
                    배송 조회
                  </button>
                  {o.status === '배송완료' && (
                    <button
                      onClick={() => showToast('교환/반품 접수 (Mock)', 'info')}
                      className="px-3 py-1.5 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                    >
                      교환/반품
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <AuthGuard type="loggedIn">
      <MyOrdersInner />
    </AuthGuard>
  );
}
