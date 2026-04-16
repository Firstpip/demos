'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { applications, tournaments, payments, rankings, getUserById, formatCurrency, getStatusLabel } from '@/lib/data';
import { User, Trophy, CreditCard, BarChart3, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const { isLoggedIn, userName, userEmail, userId } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'history' | 'payments'>('history');

  if (!isLoggedIn) { router.push('/login'); return null; }

  const user = getUserById(userId);
  const myApps = applications.filter(a => a.userId === userId);
  const myPayments = payments.filter(p => p.userId === userId);
  const myRanking = rankings.find(r => r.userId === userId);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="md:col-span-1 space-y-4">
            <div id="mypage-profile" className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mx-auto mb-3">
                {userName[0]}
              </div>
              <h2 className="font-semibold text-gray-900">{userName}</h2>
              <p className="text-sm text-gray-500">{userEmail}</p>
              <div className="mt-3 flex justify-center gap-2">
                <StatusBadge status={user?.verificationStatus || 'approved'} />
              </div>
            </div>

            {/* Record Summary */}
            <div id="mypage-record" className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> 전적 요약
              </h3>
              {myRanking ? (
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-blue-600">{myRanking.wins}</div>
                    <div className="text-xs text-gray-500">승</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-red-500">{myRanking.losses}</div>
                    <div className="text-xs text-gray-500">패</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-gray-900">{myRanking.winRate}%</div>
                    <div className="text-xs text-gray-500">승률</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-amber-600">{myRanking.rank}위</div>
                    <div className="text-xs text-gray-500">랭킹</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">전적 데이터가 없습니다.</p>
              )}
            </div>

            <div className="space-y-2">
              <Link href="/mypage/verify" className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-100 text-sm text-gray-700 hover:bg-gray-50">
                <Shield className="w-4 h-4 text-blue-500" /> 인증 관리
              </Link>
              <Link href="/mypage/appeal" className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-100 text-sm text-gray-700 hover:bg-gray-50">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> 이의제기
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-4">
              <button onClick={() => setTab('history')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}>
                <Trophy className="w-4 h-4" /> 참가 이력
              </button>
              <button onClick={() => setTab('payments')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === 'payments' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}>
                <CreditCard className="w-4 h-4" /> 결제 내역
              </button>
            </div>

            {tab === 'history' && (
              <div id="mypage-history" className="space-y-3">
                {myApps.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>참가 이력이 없습니다.</p>
                    <Link href="/schedule" className="text-blue-600 text-sm mt-2 inline-block hover:text-blue-700">대회 둘러보기 &rarr;</Link>
                  </div>
                ) : myApps.map(app => {
                  const t = tournaments.find(t => t.id === app.tournamentId);
                  return (
                    <div key={app.id} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{t?.title}</h3>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="text-sm text-gray-500">
                        {t?.startDate} ~ {t?.endDate} | {t?.location} | 신청일: {app.appliedAt}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === 'payments' && (
              <div id="mypage-payments" className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-4 py-3 font-medium">대회</th>
                      <th className="px-4 py-3 font-medium">날짜</th>
                      <th className="px-4 py-3 font-medium">금액</th>
                      <th className="px-4 py-3 font-medium">결제수단</th>
                      <th className="px-4 py-3 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPayments.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">결제 내역이 없습니다.</td></tr>
                    ) : myPayments.map(p => {
                      const app = applications.find(a => a.id === p.applicationId);
                      const tourney = app ? tournaments.find(t => t.id === app.tournamentId) : null;
                      return (
                      <tr key={p.id} className="border-t border-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{tourney?.title || '-'}</td>
                        <td className="px-4 py-3 text-sm">{p.paidAt}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(p.amount)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.method}</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
