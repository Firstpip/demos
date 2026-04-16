'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import { payments, getUserById, formatCurrency } from '@/lib/data';
import { useToast } from '@/lib/toast-context';

export default function PaymentsAdminPage() {
  const { addToast } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? payments : payments.filter(p => p.status === filterStatus);
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">결제 관리</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-sm text-gray-500">총 결제 건수</div>
          <div className="text-2xl font-bold text-gray-900">{payments.length}건</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-sm text-gray-500">결제 완료 금액</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCompleted)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-sm text-gray-500">환불 금액</div>
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalRefunded)}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'completed', 'refunded'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s === 'all' ? '전체' : s === 'completed' ? '완료' : '환불'}
          </button>
        ))}
      </div>

      <div id="admin-payments-table" className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">결제자</th>
              <th className="px-4 py-3 font-medium">금액</th>
              <th className="px-4 py-3 font-medium">결제수단</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">일시</th>
              <th className="px-4 py-3 font-medium text-center">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const user = getUserById(p.userId);
              return (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user?.name}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.method}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.paidAt}</td>
                  <td className="px-4 py-3 text-center">
                    {p.status === 'completed' && (
                      <button onClick={() => addToast('환불 처리되었습니다.', 'info')}
                        className="text-orange-600 text-sm hover:text-orange-700 font-medium">환불</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
