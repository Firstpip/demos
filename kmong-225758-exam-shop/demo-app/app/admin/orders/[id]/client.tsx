'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { orders } from '@/lib/data';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/lib/context';

const STATUS = ['결제완료', '배송준비', '배송중', '배송완료', '취소'];

function Inner({ id }: { id: string }) {
  const { showToast } = useToast();
  const base = orders.find(o => String(o.id) === id);
  const [status, setStatus] = useState(base?.status ?? '결제완료');
  const [tracking, setTracking] = useState(base?.trackingNumber ?? '');

  if (!base) return notFound();

  return (
    <>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B2A4A] mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        주문 목록
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
          <p className="text-xs text-gray-500 mt-1">{base.orderNumber}</p>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">주문 상품</h2>
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="pb-2 text-left">상품명</th>
                  <th className="pb-2 text-right">단가</th>
                  <th className="pb-2 text-center">수량</th>
                  <th className="pb-2 text-right">합계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {base.items.map(it => (
                  <tr key={it.productId}>
                    <td className="py-3 line-clamp-1">{it.title}</td>
                    <td className="py-3 text-right">{formatPrice(it.price)}</td>
                    <td className="py-3 text-center">{it.quantity}</td>
                    <td className="py-3 text-right font-semibold">
                      {formatPrice(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200">
                  <td colSpan={3} className="pt-3 text-right text-sm text-gray-600">
                    배송비
                  </td>
                  <td className="pt-3 text-right text-sm">
                    {base.shippingFee === 0 ? '무료' : formatPrice(base.shippingFee)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="pt-1 text-right text-base font-bold text-gray-900">
                    총 금액
                  </td>
                  <td className="pt-1 text-right text-base font-bold text-[#E8653A]">
                    {formatPrice(base.totalAmount + base.shippingFee)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">주문자 / 배송 정보</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-gray-500">주문자</dt>
                <dd className="text-gray-900 mt-0.5">
                  {base.userName} ({base.userPhone})
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">주문일</dt>
                <dd className="text-gray-900 mt-0.5">{formatDate(base.createdAt)}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs text-gray-500">배송지</dt>
                <dd className="text-gray-900 mt-0.5">{base.shippingAddress}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs text-gray-500">배송 메모</dt>
                <dd className="text-gray-700 mt-0.5 text-xs">{base.shippingMemo || '—'}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="bg-white border border-gray-200 rounded-lg p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">배송 처리</h2>
            <label className="block mb-3">
              <span className="text-xs font-semibold text-gray-600">주문 상태</span>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="demo-select mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {STATUS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block mb-4">
              <span className="text-xs font-semibold text-gray-600">송장 번호</span>
              <input
                type="text"
                inputMode="numeric"
                value={tracking}
                onChange={e => setTracking(e.target.value.replace(/\D/g, ''))}
                placeholder="운송장 번호 입력"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <button
              onClick={() => showToast(`주문 상태 "${status}" · 송장 ${tracking || '—'} 저장 (Mock)`)}
              className="w-full py-2 bg-[#1B2A4A] text-white text-sm rounded-md hover:bg-[#2D4A7A]"
            >
              변경사항 저장
            </button>
          </section>

          <section className="bg-white border border-gray-200 rounded-lg p-5 text-xs text-gray-600">
            <h3 className="font-bold text-gray-900 mb-2">처리 히스토리</h3>
            <ul className="space-y-1">
              <li>· {formatDate(base.createdAt)} 주문 접수</li>
              <li>· {formatDate(base.createdAt)} 결제완료</li>
              {base.status !== '결제완료' && base.status !== '취소' && (
                <li>· {formatDate(base.createdAt)} 배송준비 시작</li>
              )}
              {(base.status === '배송중' || base.status === '배송완료') && (
                <li>· {formatDate(base.createdAt)} 배송 출고</li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </>
  );
}

export default function AdminOrderDetailClient({ id }: { id: string }) {
  return (
    <AdminLayout>
      <Inner id={id} />
    </AdminLayout>
  );
}
