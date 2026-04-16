'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { appeals, tournaments } from '@/lib/data';
import { useRouter } from 'next/navigation';

export default function AppealPage() {
  const { isLoggedIn, userId } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [tournamentId, setTournamentId] = useState('');
  const [reason, setReason] = useState('');

  if (!isLoggedIn) { router.push('/login'); return null; }

  const myAppeals = appeals.filter(a => a.userId === userId);
  const availableTournaments = tournaments.filter(t => t.status === 'ongoing' || t.status === 'finished');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId) { addToast('대회를 선택해주세요', 'error'); return; }
    if (!reason.trim()) { addToast('사유를 입력해주세요', 'error'); return; }
    addToast('이의제기가 접수되었습니다.');
    setTournamentId('');
    setReason('');
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">이의제기</h1>

        <div className="bg-blue-50 rounded-lg p-3 mb-6 text-sm text-blue-700">
          이의제기는 경기 종료 후 7일 이내에 신청 가능합니다. 관리자 검토 후 결과를 알려드립니다.
        </div>

        <div id="appeal-form" className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">이의제기 신청</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">대상 대회 <span className="text-red-500">*</span></label>
              <select value={tournamentId} onChange={e => setTournamentId(e.target.value)}
                className="custom-select w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="">대회를 선택하세요</option>
                {availableTournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이의제기 사유 <span className="text-red-500">*</span></label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4}
                placeholder="이의제기 사유를 상세히 작성해주세요"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              이의제기 신청
            </button>
          </form>
        </div>

        <div id="appeal-list">
          <h2 className="font-semibold text-gray-900 mb-3">이의제기 현황</h2>
          {myAppeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">이의제기 내역이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {myAppeals.map(a => {
                const t = tournaments.find(t => t.id === a.tournamentId);
                return (
                  <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{t?.title}</h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{a.reason}</p>
                    <p className="text-xs text-gray-400">신청일: {a.submittedAt}</p>
                    {a.adminResponse && (
                      <div className="mt-2 bg-gray-50 rounded-lg p-2 text-sm text-gray-600">
                        관리자 응답: {a.adminResponse}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
