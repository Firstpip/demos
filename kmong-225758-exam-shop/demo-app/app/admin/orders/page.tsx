'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { orders } from '@/lib/data';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';

const STATUS = ['전체', '결제완료', '배송준비', '배송중', '배송완료', '취소'] as const;

function AdminOrdersInner() {
  const [status, setStatus] = useState<(typeof STATUS)[number]>('전체');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (status !== '전체') list = list.filter(o => o.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [status, search]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
        <p className="text-xs text-gray-500 mt-1">전체 {orders.length}건 · 필터 {filtered.length}건</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {STATUS.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                status === s
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-64">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="주문번호/주문자 검색"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-3 py-3 text-left">주문번호</th>
                <th className="px-3 py-3 text-left">주문자</th>
                <th className="px-3 py-3 text-left hidden md:table-cell">상품</th>
                <th className="px-3 py-3 text-right">금액</th>
                <th className="px-3 py-3 text-center">상태</th>
                <th className="px-3 py-3 text-right hidden sm:table-cell">주문일</th>
                <th className="px-3 py-3 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-xs text-gray-700">{o.orderNumber}</td>
                  <td className="px-3 py-3">
                    <p className="text-sm text-gray-900">{o.userName}</p>
                    <p className="text-[11px] text-gray-500">{o.userPhone}</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-700 hidden md:table-cell max-w-xs">
                    <p className="line-clamp-1">
                      {o.items[0].title}
                      {o.items.length > 1 && ` 외 ${o.items.length - 1}건`}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-semibold">
                    {formatPrice(o.totalAmount + o.shippingFee)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`px-2 py-0.5 text-[10px] rounded ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-gray-500 hidden sm:table-cell">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-xs text-[#1B2A4A] hover:text-[#E8653A]"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <AdminOrdersInner />
    </AdminLayout>
  );
}
