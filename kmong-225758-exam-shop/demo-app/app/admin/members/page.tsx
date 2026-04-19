'use client';

import { useMemo, useState } from 'react';
import { Search, Ban, Gift } from 'lucide-react';
import { users, orders } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/lib/context';

function AdminMembersInner() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'전체' | 'user' | 'admin'>('전체');

  const list = useMemo(() => {
    return users
      .filter(u => (role === '전체' ? true : u.role === role))
      .filter(u => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
        );
      });
  }, [search, role]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
        <p className="text-xs text-gray-500 mt-1">전체 {users.length}명</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex gap-2">
          {(['전체', 'user', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                role === r
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
              }`}
            >
              {r === '전체' ? '전체' : r === 'user' ? '일반회원' : '관리자'}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-64">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="이름/이메일/연락처 검색"
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
                <th className="px-3 py-3 text-left">이름</th>
                <th className="px-3 py-3 text-left hidden md:table-cell">이메일</th>
                <th className="px-3 py-3 text-left hidden sm:table-cell">연락처</th>
                <th className="px-3 py-3 text-center">역할</th>
                <th className="px-3 py-3 text-right">적립금</th>
                <th className="px-3 py-3 text-center">주문</th>
                <th className="px-3 py-3 text-right hidden md:table-cell">가입일</th>
                <th className="px-3 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {list.map(u => {
                const orderCount = orders.filter(o => o.userId === u.id).length;
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-900 font-medium">{u.name}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 hidden md:table-cell">{u.email}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 hidden sm:table-cell">{u.phone}</td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role === 'admin' ? '관리자' : '일반'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-gray-700">
                      {u.points.toLocaleString('ko-KR')}P
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-700">{orderCount}</td>
                    <td className="px-3 py-3 text-right text-xs text-gray-500 hidden md:table-cell">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => showToast(`${u.name}님에게 적립금 지급 (Mock)`, 'info')}
                          className="p-1.5 text-gray-500 hover:text-[#E8653A]"
                          aria-label="적립금 지급"
                        >
                          <Gift className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => showToast(`${u.name}님 계정 제재 (Mock)`, 'error')}
                          className="p-1.5 text-gray-500 hover:text-red-500"
                          aria-label="제재"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminMembersPage() {
  return (
    <AdminLayout>
      <AdminMembersInner />
    </AdminLayout>
  );
}
