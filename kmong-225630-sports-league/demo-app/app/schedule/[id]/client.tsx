'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import { getTournamentById, getApplicationsByTournament, getUserById, formatCurrency } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { Calendar, MapPin, Users, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TournamentDetailClient({ id }: { id: string }) {
  const t = getTournamentById(id);
  const { isLoggedIn } = useAuth();
  const apps = getApplicationsByTournament(id);
  const approvedApps = apps.filter(a => a.status === 'approved');

  if (!t) return <div className="p-8 text-center text-gray-500">대회를 찾을 수 없습니다.</div>;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Poster */}
        <div id="tournament-poster" className={`h-48 md:h-64 bg-gradient-to-br ${t.posterColor} rounded-xl flex items-center justify-center mb-6`}>
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center px-4 drop-shadow">{t.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info */}
          <div id="tournament-info" className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <StatusBadge status={t.status} />
              <CategoryBadge category={t.category} />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{t.startDate} ~ {t.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{t.location} {t.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm">참가 {t.currentParticipants}/{t.maxParticipants}명</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-blue-600">참가비 {formatCurrency(t.entryFee)}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-2">대회 소개</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{t.description}</p>
            </div>

            <div id="tournament-rules" className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> 대회 규칙
              </h2>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{t.rules}</pre>
            </div>

            {/* Participants */}
            <div id="tournament-players" className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">참가 선수 ({approvedApps.length}명)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {approvedApps.map(a => {
                  const user = getUserById(a.userId);
                  return (
                    <div key={a.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {user?.name[0]}
                      </div>
                      <span className="text-sm text-gray-700">{user?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(t.entryFee)}</div>
                <div className="text-sm text-gray-500 mt-1">참가비</div>
              </div>
              <div className="text-sm text-gray-600 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>모집 인원</span>
                  <span className="font-medium">{t.maxParticipants}명</span>
                </div>
                <div className="flex justify-between">
                  <span>현재 참가</span>
                  <span className="font-medium">{t.currentParticipants}명</span>
                </div>
                <div className="flex justify-between">
                  <span>잔여</span>
                  <span className="font-medium text-blue-600">{t.maxParticipants - t.currentParticipants}명</span>
                </div>
              </div>
              {t.status === 'open' ? (
                isLoggedIn ? (
                  <Link href={`/schedule/${t.id}/apply`} id="tournament-apply-btn"
                    className="block w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors">
                    참가 신청
                  </Link>
                ) : (
                  <Link href="/login"
                    className="block w-full py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors">
                    로그인 후 신청
                  </Link>
                )
              ) : (
                <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  {t.status === 'upcoming' ? '접수 예정' : t.status === 'ongoing' ? '진행중' : '접수 마감'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
