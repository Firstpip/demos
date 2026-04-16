'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { appeals, getUserById, tournaments, type Appeal } from '@/lib/data';
import { useToast } from '@/lib/toast-context';

export default function AppealsAdminPage() {
  const { addToast } = useToast();
  const [selected, setSelected] = useState<Appeal | null>(null);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">이의제기 관리</h1>

      <div id="admin-appeals-table" className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">신청자</th>
              <th className="px-4 py-3 font-medium">대회</th>
              <th className="px-4 py-3 font-medium">사유</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">신청일</th>
              <th className="px-4 py-3 font-medium text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {appeals.map(a => {
              const user = getUserById(a.userId);
              const t = tournaments.find(t => t.id === a.tournamentId);
              return (
                <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{user?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t?.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{a.reason}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{a.submittedAt}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelected(a)} className="text-blue-600 text-sm hover:text-blue-700 font-medium">상세</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="이의제기 상세">
        {selected && (
          <div className="space-y-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">신청자</span><span>{getUserById(selected.userId)?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">대회</span><span>{tournaments.find(t => t.id === selected.tournamentId)?.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">상태</span><StatusBadge status={selected.status} /></div>
              <div className="flex justify-between"><span className="text-gray-500">신청일</span><span>{selected.submittedAt}</span></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">사유</label>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selected.reason}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">관리자 응답</label>
              <textarea rows={3} placeholder="응답을 입력하세요"
                defaultValue={selected.adminResponse || ''}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none resize-none" />
            </div>
            {(selected.status === 'submitted' || selected.status === 'reviewing') && (
              <div className="flex gap-2">
                <button onClick={() => { addToast('이의제기가 승인되었습니다.'); setSelected(null); }}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">승인</button>
                <button onClick={() => { addToast('이의제기가 거절되었습니다.', 'error'); setSelected(null); }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">거절</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
