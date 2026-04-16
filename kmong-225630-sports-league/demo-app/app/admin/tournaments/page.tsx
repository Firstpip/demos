'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import Modal from '@/components/Modal';
import { tournaments, formatCurrency, type TournamentStatus } from '@/lib/data';
import { useToast } from '@/lib/toast-context';
import { Plus, Search, Calendar, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const statusCounts = {
  upcoming: { label: '접수예정', icon: Calendar, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  open: { label: '접수중', icon: Clock, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  ongoing: { label: '진행중', icon: PlayCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  finished: { label: '종료', icon: CheckCircle2, color: 'text-gray-600 bg-gray-50 border-gray-200' },
};

export default function TournamentsAdminPage() {
  const { addToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TournamentStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = tournaments.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (search && !t.title.includes(search) && !t.location.includes(search)) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대회 관리</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> 대회 생성
        </button>
      </div>

      {/* Status count cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(Object.entries(statusCounts) as [TournamentStatus, typeof statusCounts.upcoming][]).map(([status, cfg]) => {
          const count = tournaments.filter(t => t.status === status).length;
          return (
            <button key={status} onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                filterStatus === status ? cfg.color + ' ring-2 ring-offset-1 ring-blue-400' : 'bg-white border-gray-100 hover:border-gray-200'
              }`}>
              <cfg.icon className={`w-5 h-5 ${filterStatus === status ? '' : 'text-gray-400'}`} />
              <div className="text-left">
                <div className="text-xs text-gray-500">{cfg.label}</div>
                <div className="text-lg font-bold">{count}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="대회명, 지역 검색"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        {filterStatus !== 'all' && (
          <button onClick={() => setFilterStatus('all')} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            필터 초기화
          </button>
        )}
      </div>

      <div id="admin-tournaments-table" className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-3 font-medium">대회명</th>
              <th className="px-4 py-3 font-medium">카테고리</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">기간</th>
              <th className="px-4 py-3 font-medium text-center">참가</th>
              <th className="px-4 py-3 font-medium text-right">참가비</th>
              <th className="px-4 py-3 font-medium text-center">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.title}</td>
                <td className="px-4 py-3"><CategoryBadge category={t.category} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-500">{t.startDate} ~ {t.endDate}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className={t.currentParticipants >= t.maxParticipants ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {t.currentParticipants}/{t.maxParticipants}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(t.entryFee)}</td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/tournaments/${t.id}`}
                    className="text-blue-600 text-sm hover:text-blue-700 font-medium">상세</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">검색 결과가 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="대회 생성">
        <form onSubmit={e => { e.preventDefault(); addToast('대회가 생성되었습니다.'); setShowCreate(false); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대회명 <span className="text-red-500">*</span></label>
            <input type="text" placeholder="대회명을 입력하세요"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 <span className="text-red-500">*</span></label>
              <select className="custom-select w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white outline-none">
                <option value="amateur">아마추어</option>
                <option value="student">학생</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">참가비 <span className="text-red-500">*</span></label>
              <input type="text" inputMode="numeric" placeholder="30000"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작일 <span className="text-red-500">*</span></label>
              <input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료일 <span className="text-red-500">*</span></label>
              <input type="date" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">지역 <span className="text-red-500">*</span></label>
              <input type="text" placeholder="서울"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">장소 <span className="text-red-500">*</span></label>
              <input type="text" placeholder="올림픽공원 배드민턴장"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최대 참가자 수 <span className="text-red-500">*</span></label>
            <input type="text" inputMode="numeric" placeholder="32"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대회 설명</label>
            <textarea rows={3} placeholder="대회 소개를 입력하세요"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대회 규칙</label>
            <textarea rows={3} placeholder="단식 토너먼트 / 3세트 중 2세트 선승제 / 각 세트 21점 선취"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">취소</button>
            <button type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">생성</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
