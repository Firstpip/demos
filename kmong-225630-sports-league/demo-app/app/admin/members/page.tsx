'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import Modal from '@/components/Modal';
import { users, type User, getCategoryLabel, getVerificationLabel } from '@/lib/data';
import { useToast } from '@/lib/toast-context';
import { Search, Check, X } from 'lucide-react';

export default function MembersPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterVerify, setFilterVerify] = useState('all');
  const [selected, setSelected] = useState<User | null>(null);

  const filtered = users.filter(u => {
    if (search && !u.name.includes(search) && !u.email.includes(search)) return false;
    if (filterCat !== 'all' && u.category !== filterCat) return false;
    if (filterVerify !== 'all' && u.verificationStatus !== filterVerify) return false;
    return true;
  });

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">회원 관리</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="이름, 이메일 검색"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="custom-select px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white outline-none">
          <option value="all">전체 카테고리</option>
          <option value="amateur">아마추어</option>
          <option value="student">학생</option>
        </select>
        <select value={filterVerify} onChange={e => setFilterVerify(e.target.value)}
          className="custom-select px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white outline-none">
          <option value="all">전체 인증상태</option>
          <option value="none">미인증</option>
          <option value="pending">심사중</option>
          <option value="approved">승인</option>
          <option value="rejected">거절</option>
        </select>
      </div>

      <div id="admin-members-table" className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">이름</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">인증</th>
              <th className="px-4 py-3 font-medium">가입일</th>
              <th className="px-4 py-3 font-medium text-center">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(u)}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                <td className="px-4 py-3"><CategoryBadge category={u.category} /></td>
                <td className="px-4 py-3"><StatusBadge status={u.verificationStatus} /></td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.createdAt}</td>
                <td className="px-4 py-3 text-center">
                  {u.verificationStatus === 'pending' && (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={e => { e.stopPropagation(); addToast(`${u.name} 인증이 승인되었습니다.`); }}
                        className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); addToast(`${u.name} 인증이 거절되었습니다.`, 'error'); }}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="회원 상세">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">이름</span><span className="font-medium">{selected.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">이메일</span><span>{selected.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">전화번호</span><span>{selected.phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">카테고리</span><span>{getCategoryLabel(selected.category)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">인증상태</span><span>{getVerificationLabel(selected.verificationStatus)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">가입일</span><span>{selected.createdAt}</span></div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
