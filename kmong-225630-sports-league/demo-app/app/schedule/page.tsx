'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TournamentCard from '@/components/TournamentCard';
import { tournaments, type TournamentStatus, type Category } from '@/lib/data';
import { Search } from 'lucide-react';

const categoryTabs = [
  { value: 'all', label: '전체' },
  { value: 'amateur', label: '아마추어' },
  { value: 'student', label: '학생' },
];

const statusFilters: { value: TournamentStatus | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'upcoming', label: '접수예정' },
  { value: 'open', label: '접수중' },
  { value: 'ongoing', label: '진행중' },
  { value: 'finished', label: '종료' },
];

export default function SchedulePage() {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [status, setStatus] = useState<TournamentStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = tournaments.filter(t => {
    if (category !== 'all' && t.category !== category) return false;
    if (status !== 'all' && t.status !== status) return false;
    if (search && !t.title.includes(search) && !t.location.includes(search)) return false;
    return true;
  });

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">경기 일정</h1>

        {/* Category Tabs */}
        <div id="schedule-category-tabs" className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          {categoryTabs.map(tab => (
            <button key={tab.value} onClick={() => setCategory(tab.value as Category | 'all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === tab.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* Status Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div id="schedule-status-filter" className="flex gap-2 flex-wrap">
            {statusFilters.map(f => (
              <button key={f.value} onClick={() => setStatus(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  status === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{f.label}</button>
            ))}
          </div>
          <div id="schedule-search" className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="대회명, 지역 검색"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
        </div>

        {/* Grid */}
        <div id="schedule-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => <TournamentCard key={t.id} tournament={t} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">검색 결과가 없습니다</p>
            <p className="text-sm mt-1">다른 조건으로 검색해보세요</p>
            <button onClick={() => { setCategory('all'); setStatus('all'); setSearch(''); }}
              className="mt-3 text-blue-600 text-sm hover:text-blue-700">필터 초기화</button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
