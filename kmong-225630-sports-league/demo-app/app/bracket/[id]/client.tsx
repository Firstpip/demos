'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BracketView from '@/components/BracketView';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { getTournamentById, getMatchesByTournament } from '@/lib/data';

export default function BracketDetailClient({ id }: { id: string }) {
  const t = getTournamentById(id);
  const tMatches = getMatchesByTournament(id);

  if (!t) return <div className="p-8 text-center text-gray-500">대회를 찾을 수 없습니다.</div>;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <StatusBadge status={t.status} />
            <CategoryBadge category={t.category} />
          </div>
          <p className="text-sm text-gray-500">{t.startDate} ~ {t.endDate} | {t.location} {t.venue}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-900">토너먼트 대진표</h2>
          </div>
          <BracketView matches={tMatches} tournamentId={id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
