'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TournamentCard from '@/components/TournamentCard';
import { tournaments, rankings, matches, getUserById } from '@/lib/data';
import { Trophy, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const liveTournaments = tournaments.filter(t => t.status === 'ongoing' || t.status === 'open');
  const topRankings = rankings.filter(r => r.category === 'amateur').slice(0, 5);
  const liveMatches = matches.filter(m => m.status === 'ongoing');
  const recentResults = matches.filter(m => m.status === 'finished').slice(-4).reverse();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section id="home-hero" className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">배드민턴리그</h1>
            <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              경기 신청부터 대진표 확인, 실시간 경기 현황까지<br className="hidden md:block" />
              모든 것을 한 곳에서 관리하세요
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/schedule" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                대회 둘러보기
              </Link>
              <Link href="/ranking" className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors">
                랭킹 확인
              </Link>
            </div>
            <div className="flex justify-center gap-8 mt-12 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold">6</div>
                <div className="text-blue-200">등록 대회</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">20</div>
                <div className="text-blue-200">등록 선수</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2</div>
                <div className="text-blue-200">진행중 대회</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <section id="home-live">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900">실시간 경기</h2>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map(m => {
                  const p1 = getUserById(m.player1Id);
                  const p2 = getUserById(m.player2Id);
                  const tournament = tournaments.find(t => t.id === m.tournamentId);
                  return (
                    <Link key={m.id} href={`/bracket/${m.tournamentId}`}
                      className="bg-white rounded-xl border-2 border-green-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-900">{tournament?.title}</span>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          {m.round === 3 ? '결승' : m.round === 2 ? '준결승' : '8강'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <div className="font-semibold text-gray-900">{p1?.name}</div>
                          <div className="text-2xl font-bold text-blue-600 mt-1">{m.player1Score}</div>
                        </div>
                        <div className="text-gray-400 font-bold text-lg px-4">VS</div>
                        <div className="text-center flex-1">
                          <div className="font-semibold text-gray-900">{p2?.name}</div>
                          <div className="text-2xl font-bold text-blue-600 mt-1">{m.player2Score}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tournaments */}
          <section id="home-tournaments">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold text-gray-900">대회 일정</h2>
              </div>
              <Link href="/schedule" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveTournaments.slice(0, 3).map(t => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          </section>

          {/* Ranking Preview */}
          <section id="home-ranking">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">아마추어 랭킹 TOP 5</h2>
              </div>
              <Link href="/ranking" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                전체보기 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-4 py-3 font-medium">순위</th>
                    <th className="px-4 py-3 font-medium">선수</th>
                    <th className="px-4 py-3 font-medium text-center">승</th>
                    <th className="px-4 py-3 font-medium text-center">패</th>
                    <th className="px-4 py-3 font-medium text-right">포인트</th>
                  </tr>
                </thead>
                <tbody>
                  {topRankings.map(r => {
                    const user = getUserById(r.userId);
                    return (
                      <tr key={r.userId} className="border-t border-gray-50">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                            r.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                          }`}>{r.rank}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{user?.name}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{r.wins}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">{r.losses}</td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-600">{r.points.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Results */}
          <section id="home-results">
            <h2 className="text-xl font-bold text-gray-900 mb-4">최근 경기 결과</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentResults.map(m => {
                const p1 = getUserById(m.player1Id);
                const p2 = getUserById(m.player2Id);
                return (
                  <div key={m.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${m.winnerId === m.player1Id ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                        {p1?.name}
                      </span>
                      <span className="text-sm font-mono text-gray-500">
                        {m.player1Score} - {m.player2Score}
                      </span>
                      <span className={`text-sm ${m.winnerId === m.player2Id ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                        {p2?.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
