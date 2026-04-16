'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { rankings, getUserById, type Category } from '@/lib/data';
import { Trophy, Medal, Award, Search } from 'lucide-react';

const tabs = [
  { value: 'all', label: '전체' },
  { value: 'amateur', label: '아마추어' },
  { value: 'student', label: '학생' },
];

export default function RankingPage() {
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = (category === 'all'
    ? [...rankings].sort((a, b) => b.points - a.points).map((r, i) => ({ ...r, rank: i + 1 }))
    : rankings.filter(r => r.category === category)
  ).filter(r => {
    if (!search) return true;
    const user = getUserById(r.userId);
    return user?.name.includes(search);
  });

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const medalIcons = [Trophy, Medal, Award];
  const medalColors = ['text-amber-500', 'text-gray-400', 'text-amber-700'];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">랭킹</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div id="ranking-category-tabs" className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map(tab => (
            <button key={tab.value} onClick={() => setCategory(tab.value as Category | 'all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === tab.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}>{tab.label}</button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="선수명 검색"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
        </div>

        {/* Top 3 Cards */}
        <div id="ranking-top3" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {top3.map((r, i) => {
            const user = getUserById(r.userId);
            const Icon = medalIcons[i];
            return (
              <div key={r.userId} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${medalColors[i]}`} />
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 mx-auto mb-2">
                  {user?.name[0]}
                </div>
                <h3 className="font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{r.wins}승 {r.losses}패 (승률 {r.winRate}%)</p>
                <p className="text-lg font-bold text-blue-600 mt-2">{r.points.toLocaleString()}P</p>
              </div>
            );
          })}
        </div>

        {/* Ranking Table */}
        <div id="ranking-table" className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium w-16">순위</th>
                <th className="px-4 py-3 font-medium">선수</th>
                <th className="px-4 py-3 font-medium text-center">승</th>
                <th className="px-4 py-3 font-medium text-center">패</th>
                <th className="px-4 py-3 font-medium text-center">승률</th>
                <th className="px-4 py-3 font-medium text-right">포인트</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const user = getUserById(r.userId);
                return (
                  <tr key={r.userId} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        r.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>{r.rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                          {user?.name[0]}
                        </div>
                        <span className="font-medium text-gray-900">{user?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{r.wins}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{r.losses}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">{r.winRate}%</td>
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">{r.points.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
