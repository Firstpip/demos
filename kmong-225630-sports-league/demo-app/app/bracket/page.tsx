'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { tournaments, matches } from '@/lib/data';
import Link from 'next/link';

export default function BracketListPage() {
  const bracketTournaments = tournaments.filter(t => t.status === 'ongoing' || t.status === 'finished');

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">대진표</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bracketTournaments.map(t => {
            const tMatches = matches.filter(m => m.tournamentId === t.id);
            const finishedCount = tMatches.filter(m => m.status === 'finished').length;
            const totalCount = tMatches.length;
            return (
              <Link key={t.id} href={`/bracket/${t.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{t.title}</h3>
                  <div className="flex gap-1.5">
                    <StatusBadge status={t.status} />
                    <CategoryBadge category={t.category} />
                  </div>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {t.startDate} ~ {t.endDate} | {t.location}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 rounded-full h-2 transition-all"
                      style={{ width: `${totalCount > 0 ? (finishedCount / totalCount) * 100 : 0}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{finishedCount}/{totalCount} 경기 완료</span>
                </div>
              </Link>
            );
          })}
        </div>
        {bracketTournaments.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p>진행중이거나 종료된 대회가 없습니다.</p>
            <a href="/schedule" className="text-blue-600 text-sm mt-2 inline-block hover:text-blue-700">예정된 대회 보기 &rarr;</a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
