'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import CategoryBadge from '@/components/CategoryBadge';
import BracketView from '@/components/BracketView';
import Modal from '@/components/Modal';
import { getTournamentById, getApplicationsByTournament, getMatchesByTournament, getUserById, formatCurrency, rankings, payments, getCategoryLabel, type TournamentStatus, type Match } from '@/lib/data';
import { useToast } from '@/lib/toast-context';
import { Check, X, GripVertical, Shuffle, RotateCcw, Zap, Search, Pencil, ArrowRight, ChevronDown, ChevronUp, Play, Flag, Lock, Info, Trophy } from 'lucide-react';

// 상태별 안내 메시지
const statusGuide: Record<TournamentStatus, Record<string, { msg: string; active: boolean }>> = {
  upcoming: {
    info: { msg: '대회 정보를 자유롭게 수정할 수 있습니다.', active: true },
    apps: { msg: '접수가 시작되지 않아 신청 내역이 없습니다.', active: false },
    bracket: { msg: '접수 완료 후 대진표를 관리할 수 있습니다.', active: false },
    results: { msg: '대회가 시작된 후 결과를 입력할 수 있습니다.', active: false },
  },
  open: {
    info: { msg: '접수중에는 참가비, 최대 참가자 수를 변경할 수 없습니다.', active: true },
    apps: { msg: '참가 신청을 승인하거나 거절할 수 있습니다.', active: true },
    bracket: { msg: '접수 마감 후 대진표를 관리할 수 있습니다.', active: false },
    results: { msg: '대회가 시작된 후 결과를 입력할 수 있습니다.', active: false },
  },
  closed: {
    info: { msg: '접수가 마감되었습니다. 대진표를 생성해주세요.', active: false },
    apps: { msg: '접수가 마감되어 신청 처리가 불가합니다.', active: false },
    bracket: { msg: '참가자 시드를 배정하고 대진표를 생성하세요.', active: true },
    results: { msg: '대회가 시작된 후 결과를 입력할 수 있습니다.', active: false },
  },
  ongoing: {
    info: { msg: '대회 진행중에는 정보를 수정할 수 없습니다.', active: false },
    apps: { msg: '대회 진행중에는 신청 처리가 불가합니다.', active: false },
    bracket: { msg: '대회 진행중에는 대진표를 변경할 수 없습니다.', active: false },
    results: { msg: '경기 결과를 입력하고 승자를 기록하세요.', active: true },
  },
  finished: {
    info: { msg: '종료된 대회입니다.', active: false },
    apps: { msg: '종료된 대회입니다.', active: false },
    bracket: { msg: '종료된 대회입니다.', active: false },
    results: { msg: '모든 경기가 종료되었습니다.', active: false },
  },
};

export default function TournamentAdminClient({ id }: { id: string }) {
  const { addToast } = useToast();
  const [tab, setTab] = useState<'info' | 'apps' | 'bracket' | 'results'>('info');
  const [editing, setEditing] = useState(false);
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [appSearch, setAppSearch] = useState('');
  const [checkedApps, setCheckedApps] = useState<Set<string>>(new Set());
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [openRounds, setOpenRounds] = useState<Set<number>>(new Set([1, 2, 3]));
  const [scores, setScores] = useState<Record<string, { p1: string; p2: string }>>({});
  const [generatedMatches, setGeneratedMatches] = useState<Match[]>([]);
  const [bracketGenerated, setBracketGenerated] = useState(false);
  const [seedOrder, setSeedOrder] = useState<string[] | null>(null);
  const [swapTarget, setSwapTarget] = useState<number | null>(null);
  const [seedMode, setSeedMode] = useState<'ranking' | 'random' | 'manual'>('ranking');
  const [bracketConfirmed, setBracketConfirmed] = useState(false);
  const [statusConfirmModal, setStatusConfirmModal] = useState(false);

  const t = getTournamentById(id);
  const apps = getApplicationsByTournament(id);
  const staticMatches = getMatchesByTournament(id);
  const tMatches = bracketGenerated ? generatedMatches : staticMatches;
  const tournamentPayments = payments.filter(p => apps.some(a => a.id === p.applicationId));

  if (!t) return <AdminLayout><div className="text-center py-8 text-gray-500">대회를 찾을 수 없습니다.</div></AdminLayout>;

  const s = t.status; // shorthand
  const guide = statusGuide[s];
  const canEditInfo = s === 'upcoming' || s === 'open';
  const canManageApps = s === 'open';
  const canManageBracket = s === 'closed';
  const canInputResults = s === 'ongoing';
  const isFinished = s === 'finished';

  // Revenue
  const totalRevenue = tournamentPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = tournamentPayments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);

  // Status workflow
  const statusFlow: Record<string, { label: string; next: string; color: string }> = {
    upcoming: { label: '접수 시작', next: 'open', color: 'bg-blue-600 hover:bg-blue-700' },
    open: { label: '접수 마감', next: 'closed', color: 'bg-purple-600 hover:bg-purple-700' },
    closed: { label: '대회 시작', next: 'ongoing', color: 'bg-green-600 hover:bg-green-700' },
    ongoing: { label: '대회 종료', next: 'finished', color: 'bg-red-600 hover:bg-red-700' },
  };
  const nextStatus = statusFlow[s];

  // App helpers
  const filteredApps = apps.filter(a => {
    if (appFilter !== 'all' && a.status !== appFilter) return false;
    if (appSearch) {
      const user = getUserById(a.userId);
      if (!user?.name.includes(appSearch) && !user?.email.includes(appSearch)) return false;
    }
    return true;
  });
  const appCounts = { all: apps.length, approved: apps.filter(a => a.status === 'approved').length, pending: apps.filter(a => a.status === 'pending').length, rejected: apps.filter(a => a.status === 'rejected').length };

  // Match helpers
  const maxRound = tMatches.length > 0 ? Math.max(...tMatches.map(m => m.round)) : 0;
  const roundNames: Record<number, string> = { 1: '8강', 2: '준결승', 3: '결승' };
  const toggleRound = (r: number) => setOpenRounds(prev => { const n = new Set(prev); n.has(r) ? n.delete(r) : n.add(r); return n; });
  const getScore = (mid: string, p: 'p1' | 'p2', def: number) => scores[mid]?.[p] ?? (def || '');
  const setScore2 = (mid: string, p: 'p1' | 'p2', v: string) => setScores(prev => ({ ...prev, [mid]: { p1: prev[mid]?.p1 ?? '', p2: prev[mid]?.p2 ?? '', [p]: v } }));
  const getWinner = (mid: string, m: { player1Id: string; player2Id: string; player1Score: number; player2Score: number }) => {
    const a = parseInt(scores[mid]?.p1) || m.player1Score, b = parseInt(scores[mid]?.p2) || m.player2Score;
    return a > b ? m.player1Id : b > a ? m.player2Id : null;
  };

  // Guide banner component
  const GuideBanner = ({ tabKey }: { tabKey: string }) => {
    const g = guide[tabKey];
    if (!g) return null;
    return (
      <div className={`rounded-lg p-3 mb-4 flex items-start gap-2 text-sm ${g.active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
        {g.active ? <Info className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />}
        {g.msg}
      </div>
    );
  };

  // Finished result summary
  const finalMatch = tMatches.find(m => m.round === maxRound && m.winnerId);
  const champion = finalMatch ? getUserById(finalMatch.winnerId!) : null;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h1>
      <div className="flex items-center gap-2 mb-4">
        <StatusBadge status={t.status} />
        <CategoryBadge category={t.category} />
        <span className="text-sm text-gray-500">{t.startDate} ~ {t.endDate}</span>
      </div>

      {/* Status workflow bar */}
      {nextStatus && (() => {
        // Validation per transition
        const approvedCount = apps.filter(a => a.status === 'approved').length;
        const pendingCount = apps.filter(a => a.status === 'pending').length;
        const hasBracket = tMatches.length > 0 || bracketGenerated;
        const allMatchesFinished = tMatches.length > 0 && tMatches.every(m => m.status === 'finished');
        const hasOngoingMatch = tMatches.some(m => m.status === 'ongoing');

        type Issue = { type: 'error' | 'warning'; msg: string };
        const issues: Issue[] = [];

        if (s === 'open') {
          if (approvedCount < 2) issues.push({ type: 'error', msg: `승인된 참가자가 ${approvedCount}명입니다. 최소 2명 이상이어야 합니다.` });
          if (pendingCount > 0) issues.push({ type: 'warning', msg: `미처리 신청 ${pendingCount}건이 남아있습니다.` });
        }
        if (s === 'closed') {
          if (!hasBracket) issues.push({ type: 'error', msg: '대진표가 생성되지 않았습니다. 대진표관리 탭에서 생성해주세요.' });
          else if (!bracketConfirmed && !staticMatches.length) issues.push({ type: 'error', msg: '대진표가 확정되지 않았습니다. 대진표관리 탭에서 확정해주세요.' });
        }
        if (s === 'ongoing') {
          if (hasOngoingMatch) issues.push({ type: 'error', msg: '진행중인 경기가 있습니다. 모든 경기를 종료해주세요.' });
          if (!allMatchesFinished) issues.push({ type: 'warning', msg: `미완료 경기 ${tMatches.filter(m => m.status !== 'finished').length}건이 있습니다.` });
        }

        const hasError = issues.some(i => i.type === 'error');
        const canTransition = !hasError;

        return (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {['접수예정', '접수중', '접수완료', '진행중', '종료'].map((label, i) => {
                      const statuses: TournamentStatus[] = ['upcoming', 'open', 'closed', 'ongoing', 'finished'];
                      const idx = statuses.indexOf(s);
                      const isCurrent = i === idx;
                      const isPast = i < idx;
                      return (
                        <span key={label} className="flex items-center gap-1">
                          {i > 0 && <span className={`w-4 h-0.5 ${isPast ? 'bg-blue-400' : 'bg-gray-200'}`} />}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCurrent ? 'bg-blue-600 text-white' : isPast ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                            {label}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={() => canTransition ? setStatusConfirmModal(true) : addToast('전환 조건을 먼저 충족해주세요.', 'error')}
                  className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-sm font-medium ${canTransition ? nextStatus.color : 'bg-gray-300 cursor-not-allowed'}`}>
                  {nextStatus.label} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {issues.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {issues.map((issue, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs rounded-lg px-3 py-2 ${
                      issue.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <span className="font-medium flex-shrink-0">{issue.type === 'error' ? '필수' : '주의'}</span>
                      {issue.msg}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Modal isOpen={statusConfirmModal} onClose={() => setStatusConfirmModal(false)} title="상태 전환 확인">
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  대회 상태를 <strong>{nextStatus.label}</strong> 하시겠습니까?
                </p>
                {s === 'open' && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                    <p>승인된 참가자: <strong>{approvedCount}명</strong></p>
                    <p>접수 마감 후에는 신규 신청을 받을 수 없습니다.</p>
                  </div>
                )}
                {s === 'closed' && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                    <p>대진표: <strong>{bracketConfirmed || staticMatches.length ? '확정됨' : '미확정'}</strong></p>
                    <p>대회 시작 후에는 대진표를 변경할 수 없습니다.</p>
                  </div>
                )}
                {s === 'ongoing' && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                    <p>완료 경기: <strong>{tMatches.filter(m => m.status === 'finished').length}/{tMatches.length}</strong></p>
                    <p>대회 종료 후에는 결과를 수정할 수 없습니다.</p>
                  </div>
                )}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setStatusConfirmModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">취소</button>
                  <button onClick={() => { setStatusConfirmModal(false); addToast(`대회 상태가 변경되었습니다.`); }}
                    className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${nextStatus.color}`}>
                    {nextStatus.label}
                  </button>
                </div>
              </div>
            </Modal>
          </>
        );
      })()}

      {/* Finished champion banner */}
      {isFinished && champion && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-5 mb-6 flex items-center gap-4">
          <Trophy className="w-10 h-10 text-amber-500" />
          <div>
            <div className="text-sm text-amber-700 font-medium">대회 우승자</div>
            <div className="text-xl font-bold text-gray-900">{champion.name}</div>
          </div>
        </div>
      )}

      <div id="admin-tournament-tabs" className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit overflow-x-auto">
        {([
          { key: 'info', label: '기본정보' },
          { key: 'apps', label: `신청관리 (${apps.length})` },
          { key: 'bracket', label: '대진표관리' },
          { key: 'results', label: '결과입력' },
        ] as const).map(({ key, label }) => {
          const isActive = guide[key]?.active;
          return (
            <button key={key} onClick={() => setTab(key as typeof tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap relative ${
                tab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}>
              {label}
              {isActive && tab !== key && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* ===== 기본정보 탭 ===== */}
      {tab === 'info' && (
        <div className="space-y-6">
          <GuideBanner tabKey="info" />

          {/* Revenue summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">총 수입</div>
              <div className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">환불</div>
              <div className="text-lg font-bold text-orange-600">{formatCurrency(totalRefunded)}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-xs text-gray-500">순수입</div>
              <div className="text-lg font-bold text-blue-600">{formatCurrency(totalRevenue - totalRefunded)}</div>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">대회 정보</h3>
              {canEditInfo && (
                <button onClick={() => { if (editing) addToast('대회 정보가 저장되었습니다.'); setEditing(!editing); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    editing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {editing ? <><Check className="w-3.5 h-3.5" /> 저장</> : <><Pencil className="w-3.5 h-3.5" /> 수정</>}
                </button>
              )}
            </div>
            <div className="p-5">
              {editing && canEditInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">대회명</label>
                      <input type="text" defaultValue={t.title} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <select defaultValue={t.category} disabled={s === 'open'}
                        className={`custom-select w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white outline-none ${s === 'open' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <option value="amateur">아마추어</option>
                        <option value="student">학생</option>
                      </select>
                      {s === 'open' && <p className="text-xs text-amber-600 mt-1">접수중에는 변경 불가</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                      <input type="date" defaultValue={t.startDate} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                      <input type="date" defaultValue={t.endDate} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                      <input type="text" defaultValue={`${t.location} ${t.venue}`} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">참가비</label>
                      <input type="text" inputMode="numeric" defaultValue={t.entryFee} disabled={s === 'open'}
                        className={`w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none ${s === 'open' ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`} />
                      {s === 'open' && <p className="text-xs text-amber-600 mt-1">접수중에는 변경 불가</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최대 참가자</label>
                    <input type="text" inputMode="numeric" defaultValue={t.maxParticipants} disabled={s === 'open'}
                      className={`w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none ${s === 'open' ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`} />
                    {s === 'open' && <p className="text-xs text-amber-600 mt-1">접수중에는 변경 불가</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">대회 설명</label>
                    <textarea rows={3} defaultValue={t.description} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">대회 규칙</label>
                    <textarea rows={3} defaultValue={t.rules} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-gray-500">대회명</span><p className="font-medium mt-0.5">{t.title}</p></div>
                    <div><span className="text-gray-500">카테고리</span><p className="font-medium mt-0.5">{getCategoryLabel(t.category)}</p></div>
                    <div><span className="text-gray-500">기간</span><p className="font-medium mt-0.5">{t.startDate} ~ {t.endDate}</p></div>
                    <div><span className="text-gray-500">장소</span><p className="font-medium mt-0.5">{t.location} {t.venue}</p></div>
                    <div><span className="text-gray-500">참가비</span><p className="font-medium mt-0.5">{formatCurrency(t.entryFee)}</p></div>
                    <div><span className="text-gray-500">참가 현황</span><p className="font-medium mt-0.5">{t.currentParticipants}/{t.maxParticipants}명</p></div>
                  </div>
                  <div><span className="text-gray-500">대회 설명</span><p className="mt-0.5 leading-relaxed">{t.description}</p></div>
                  <div><span className="text-gray-500">대회 규칙</span><pre className="mt-0.5 whitespace-pre-wrap font-sans leading-relaxed">{t.rules}</pre></div>
                </div>
              )}
            </div>
          </div>

          {canEditInfo && (
            <button onClick={() => addToast('대회가 삭제되었습니다.', 'error')}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 border border-red-200">대회 삭제</button>
          )}
        </div>
      )}

      {/* ===== 신청관리 탭 ===== */}
      {tab === 'apps' && (
        <div className="space-y-4">
          <GuideBanner tabKey="apps" />

          <div className="flex gap-2 flex-wrap">
            {(['all', 'approved', 'pending', 'rejected'] as const).map(sf => (
              <button key={sf} onClick={() => setAppFilter(sf)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  appFilter === sf ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {sf === 'all' ? '전체' : sf === 'approved' ? '승인' : sf === 'pending' ? '대기' : '거절'} ({appCounts[sf]})
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={appSearch} onChange={e => setAppSearch(e.target.value)}
                placeholder="선수명, 이메일 검색"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            {canManageApps && checkedApps.size > 0 && (
              <button onClick={() => { addToast(`${checkedApps.size}건 일괄 승인되었습니다.`); setCheckedApps(new Set()); }}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                {checkedApps.size}건 일괄 승인
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  {canManageApps && (
                    <th className="px-4 py-3 font-medium w-10">
                      <input type="checkbox"
                        checked={filteredApps.filter(a => a.status === 'pending').length > 0 && filteredApps.filter(a => a.status === 'pending').every(a => checkedApps.has(a.id))}
                        onChange={e => { const ids = filteredApps.filter(a => a.status === 'pending').map(a => a.id); setCheckedApps(e.target.checked ? new Set(ids) : new Set()); }}
                        className="rounded" />
                    </th>
                  )}
                  <th className="px-4 py-3 font-medium">선수</th>
                  <th className="px-4 py-3 font-medium">카테고리</th>
                  <th className="px-4 py-3 font-medium">신청일</th>
                  <th className="px-4 py-3 font-medium">결제</th>
                  <th className="px-4 py-3 font-medium">상태</th>
                  {canManageApps && <th className="px-4 py-3 font-medium text-center">처리</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(a => {
                  const user = getUserById(a.userId);
                  return (
                    <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50">
                      {canManageApps && (
                        <td className="px-4 py-3">
                          {a.status === 'pending' && (
                            <input type="checkbox" checked={checkedApps.has(a.id)}
                              onChange={e => { const n = new Set(checkedApps); e.target.checked ? n.add(a.id) : n.delete(a.id); setCheckedApps(n); }}
                              className="rounded" />
                          )}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={user?.category || 'amateur'} />
                        <div className="mt-1"><StatusBadge status={user?.verificationStatus || 'none'} /></div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{a.appliedAt}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.paymentStatus} />
                        <div className="text-xs text-gray-500 mt-0.5">{formatCurrency(a.paymentAmount)}</div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      {canManageApps && (
                        <td className="px-4 py-3 text-center">
                          {a.status === 'pending' && (
                            <div className="flex justify-center gap-1">
                              <button onClick={() => addToast(`${user?.name} 승인`)} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200" title="승인"><Check className="w-4 h-4" /></button>
                              <button onClick={() => { setRejectModal(a.id); setRejectReason(''); }} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200" title="거절"><X className="w-4 h-4" /></button>
                            </div>
                          )}
                          {a.status === 'approved' && a.paymentStatus === 'completed' && (
                            <button onClick={() => addToast(`${user?.name} 환불 처리`, 'info')} className="text-xs text-orange-600 hover:text-orange-700 font-medium">환불</button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
                {filteredApps.length === 0 && (
                  <tr><td colSpan={canManageApps ? 7 : 6} className="px-4 py-8 text-center text-gray-500">신청 내역이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal isOpen={!!rejectModal} onClose={() => setRejectModal(null)} title="신청 거절">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">거절 사유 <span className="text-red-500">*</span></label>
                <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="거절 사유를 입력하세요"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setRejectModal(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">취소</button>
                <button onClick={() => { if (!rejectReason.trim()) { addToast('거절 사유를 입력해주세요', 'error'); return; } addToast('신청이 거절되었습니다.', 'error'); setRejectModal(null); }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">거절</button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ===== 대진표관리 탭 ===== */}
      {tab === 'bracket' && (() => {
        // Build participant list from approved apps
        const approvedApps = apps.filter(a => a.status === 'approved');
        const allParticipants = approvedApps.map(a => {
          const user = getUserById(a.userId);
          const rank = rankings.find(r => r.userId === a.userId);
          return { userId: a.userId, name: user?.name || '', points: rank?.points || 0, wins: rank?.wins || 0, losses: rank?.losses || 0, winRate: rank?.winRate || 0 };
        });

        // Initialize seed order if not yet set
        const currentSeedOrder = seedOrder || allParticipants.sort((a, b) => b.points - a.points).map(p => p.userId);
        const seededParticipants = currentSeedOrder.map((uid, i) => {
          const p = allParticipants.find(x => x.userId === uid);
          return p ? { ...p, seed: i + 1 } : null;
        }).filter(Boolean) as (typeof allParticipants[0] & { seed: number })[];

        // Seed tier colors - only meaningful in ranking mode
        const isRankingMode = seedMode === 'ranking';
        const tierColor = (seed: number, total: number) => {
          if (!isRankingMode) return 'bg-blue-600';
          if (seed <= 2) return 'bg-amber-500';
          if (seed <= Math.ceil(total / 2)) return 'bg-blue-600';
          return 'bg-gray-500';
        };

        // Seed actions
        const autoSeedByRanking = () => {
          const sorted = [...allParticipants].sort((a, b) => b.points - a.points).map(p => p.userId);
          setSeedOrder(sorted);
          setSwapTarget(null);
          setSeedMode('ranking');
          addToast('랭킹 포인트 기준으로 시드가 배정되었습니다.');
        };

        const shuffleSeeds = () => {
          const shuffled = [...currentSeedOrder];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          setSeedOrder(shuffled);
          setSwapTarget(null);
          setSeedMode('random');
          setBracketGenerated(false);
          setGeneratedMatches([]);
          addToast('시드가 랜덤으로 셔플되었습니다.');
        };

        const handleSeedClick = (idx: number) => {
          if (!canManageBracket) return;
          if (swapTarget === null) {
            setSwapTarget(idx);
          } else if (swapTarget === idx) {
            setSwapTarget(null);
          } else {
            const newOrder = [...currentSeedOrder];
            [newOrder[swapTarget], newOrder[idx]] = [newOrder[idx], newOrder[swapTarget]];
            setSeedOrder(newOrder);
            setSwapTarget(null);
            setSeedMode('manual');
            if (bracketGenerated) { setBracketGenerated(false); setGeneratedMatches([]); }
            const name1 = getUserById(currentSeedOrder[swapTarget])?.name;
            const name2 = getUserById(currentSeedOrder[idx])?.name;
            addToast(`${name1} (시드 ${swapTarget + 1}) <> ${name2} (시드 ${idx + 1}) 교환`);
          }
        };

        const moveSeed = (idx: number, dir: -1 | 1) => {
          const target = idx + dir;
          if (target < 0 || target >= currentSeedOrder.length) return;
          const newOrder = [...currentSeedOrder];
          [newOrder[idx], newOrder[target]] = [newOrder[target], newOrder[idx]];
          setSeedOrder(newOrder);
          setSeedMode('manual');
          if (bracketGenerated) { setBracketGenerated(false); setGeneratedMatches([]); }
        };

        // Standard tournament seeding placement
        // Places seeds so top seeds meet latest (1vs8, 4vs5, 3vs6, 2vs7 for 8-player bracket)
        const getStandardBracketOrder = (numPlayers: number): number[] => {
          const totalRounds = Math.ceil(Math.log2(numPlayers));
          const bracketSize = Math.pow(2, totalRounds);
          // Recursive placement: seed 1 top, seed 2 bottom, then fill halves
          let positions = [0, 1]; // seeds for 2-player bracket (indices)
          while (positions.length < bracketSize) {
            const next: number[] = [];
            const len = positions.length;
            for (const pos of positions) {
              next.push(pos);
              next.push(2 * len - 1 - pos);
            }
            positions = next;
          }
          return positions;
        };

        const getBracketMatchups = () => {
          const n = currentSeedOrder.length;
          const totalRounds = Math.ceil(Math.log2(n));
          const bracketSize = Math.pow(2, totalRounds);
          const order = getStandardBracketOrder(n);
          // Map seed indices to player IDs (pad with empty for byes)
          const padded = [...currentSeedOrder];
          while (padded.length < bracketSize) padded.push('');
          return order.map(seedIdx => padded[seedIdx]);
        };

        // Generate bracket from current seed order
        const generateBracket = () => {
          const playerIds = currentSeedOrder;
          if (playerIds.length < 2) { addToast('참가자가 2명 이상이어야 합니다.', 'error'); return; }
          const totalRounds = Math.ceil(Math.log2(playerIds.length));
          const placed = getBracketMatchups();

          const newMatches: Match[] = [];
          let matchNum = 1;
          let currentPlayers = [...placed];

          for (let r = 1; r <= totalRounds; r++) {
            const nextPlayers: string[] = [];
            for (let i = 0; i < currentPlayers.length; i += 2) {
              const p1 = currentPlayers[i];
              const p2 = currentPlayers[i + 1];
              const isBye = r === 1 && (!p1 || !p2);
              const winner = isBye ? (p1 || p2) : undefined;
              newMatches.push({
                id: `gen-${id}-${matchNum}`, tournamentId: id, round: r, matchNumber: matchNum,
                player1Id: r === 1 ? p1 : '', player2Id: r === 1 ? p2 : '',
                player1Score: 0, player2Score: 0, winnerId: winner,
                status: isBye ? 'finished' : 'scheduled',
              });
              nextPlayers.push(winner || '');
              matchNum++;
            }
            currentPlayers = nextPlayers;
          }
          setGeneratedMatches(newMatches);
          setBracketGenerated(true);
          addToast(`대진표가 생성되었습니다! (${totalRounds}라운드, ${newMatches.length}경기)`);
        };

        const resetBracket = () => {
          setGeneratedMatches([]);
          setBracketGenerated(false);
          setBracketConfirmed(false);
          addToast('대진표가 초기화되었습니다.', 'info');
        };

        const displayMatches = tMatches;
        const total = seededParticipants.length;

        return (
          <div className="space-y-6">
            <GuideBanner tabKey="bracket" />

            {/* Seed assignment */}
            <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden ${!canManageBracket ? 'opacity-75' : ''}`}>
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">참가자 시드 배정 ({total}명)</h3>
                  {canManageBracket && (
                    <div className="flex gap-2">
                      <button onClick={autoSeedByRanking}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        <Zap className="w-3.5 h-3.5" /> 랭킹순
                      </button>
                      <button onClick={shuffleSeeds}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                        <Shuffle className="w-3.5 h-3.5" /> 랜덤
                      </button>
                      <button onClick={() => { setSeedOrder(null); setSwapTarget(null); setSeedMode('ranking'); setBracketGenerated(false); setGeneratedMatches([]); addToast('시드가 초기화되었습니다.', 'info'); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                        <RotateCcw className="w-3.5 h-3.5" /> 초기화
                      </button>
                    </div>
                  )}
                </div>
                {canManageBracket && (
                  <p className="text-xs text-gray-500">
                    {swapTarget !== null
                      ? <span className="text-blue-600 font-medium">시드 {swapTarget + 1}번 선택됨 - 교환할 선수를 클릭하세요 (ESC로 취소)</span>
                      : '선수를 클릭하여 시드를 교환할 수 있습니다. 화살표로 순서를 조절하세요.'}
                  </p>
                )}
              </div>
              <div className="p-4">
                {/* Seed tier legend - only in ranking mode */}
                {canManageBracket && total > 0 && isRankingMode && (
                  <div className="flex gap-4 mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500" /> 상위 시드 (1-2)</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600" /> 중위 시드 (3-{Math.ceil(total / 2)})</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-500" /> 하위 시드 ({Math.ceil(total / 2) + 1}-{total})</span>
                  </div>
                )}
                {canManageBracket && total > 0 && !isRankingMode && (
                  <div className="mb-3 text-xs text-gray-500">
                    {seedMode === 'random' ? '랜덤 배치' : '수동 배치'} - 배치 순서대로 번호가 부여됩니다
                  </div>
                )}
                <div className="space-y-1.5">
                  {seededParticipants.map((p, idx) => {
                    const isSwapSource = swapTarget === idx;
                    const isSwapCandidate = swapTarget !== null && swapTarget !== idx;
                    return (
                      <div key={p.userId}
                        onClick={() => handleSeedClick(idx)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                          isSwapSource ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md' :
                          isSwapCandidate ? 'border-blue-300 bg-blue-50/50 cursor-pointer hover:border-blue-400' :
                          canManageBracket ? 'border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-300' :
                          'border-gray-200 bg-gray-50'
                        }`}>
                        <span className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ${tierColor(p.seed, total)}`}>
                          {p.seed}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{p.name}</span>
                            {isRankingMode && p.seed <= 2 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">TOP SEED</span>}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span>{p.points.toLocaleString()}P</span>
                            <span>{p.wins}승 {p.losses}패</span>
                            <span>승률 {p.winRate}%</span>
                          </div>
                        </div>
                        {canManageBracket && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={e => { e.stopPropagation(); moveSeed(idx, -1); }}
                              disabled={idx === 0}
                              className={`p-1 rounded ${idx === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}>
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button onClick={e => { e.stopPropagation(); moveSeed(idx, 1); }}
                              disabled={idx === total - 1}
                              className={`p-1 rounded ${idx === total - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-200'}`}>
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {total === 0 && <p className="text-center text-gray-500 text-sm py-4">승인된 참가자가 없습니다.</p>}

                {/* Matchup preview - standard tournament seeding */}
                {canManageBracket && total >= 2 && !bracketGenerated && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">1라운드 대진 미리보기 (표준 시드 배치)</h4>
                    <p className="text-xs text-gray-400 mb-2">상위 시드끼리 최대한 늦게 만나도록 배치됩니다</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(() => {
                        const placed = getBracketMatchups();
                        const matchups: { p1Uid: string; p2Uid: string }[] = [];
                        for (let i = 0; i < placed.length; i += 2) {
                          matchups.push({ p1Uid: placed[i], p2Uid: placed[i + 1] });
                        }
                        return matchups.map((m, i) => {
                          const p1 = seededParticipants.find(p => p.userId === m.p1Uid);
                          const p2 = seededParticipants.find(p => p.userId === m.p2Uid);
                          return (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm">
                              {p1 ? (
                                <>
                                  <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${tierColor(p1.seed, total)}`}>{p1.seed}</span>
                                  <span className="font-medium text-gray-900">{p1.name}</span>
                                </>
                              ) : <span className="text-gray-400 italic">BYE</span>}
                              <span className="text-gray-400 mx-1">vs</span>
                              {p2 ? (
                                <>
                                  <span className="font-medium text-gray-900">{p2.name}</span>
                                  <span className={`w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${tierColor(p2.seed, total)}`}>{p2.seed}</span>
                                </>
                              ) : <span className="text-gray-400 italic">BYE</span>}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bracket view */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  대진표
                  {bracketGenerated && <span className="ml-2 text-xs text-green-600 font-normal bg-green-50 px-2 py-0.5 rounded-full">생성 완료</span>}
                </h3>
                {canManageBracket && (
                  <div className="flex gap-2">
                    {!bracketGenerated && displayMatches.length === 0 ? (
                      <button onClick={generateBracket}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Shuffle className="w-4 h-4" /> 대진표 생성
                      </button>
                    ) : (
                      <>
                        <button onClick={() => { resetBracket(); setTimeout(generateBracket, 100); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                          <Shuffle className="w-3.5 h-3.5" /> 재생성
                        </button>
                        <button onClick={resetBracket}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                          <RotateCcw className="w-3.5 h-3.5" /> 초기화
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {displayMatches.length > 0 ? (
                <>
                  <BracketView matches={displayMatches} tournamentId={id} />
                  {canManageBracket && bracketGenerated && !bracketConfirmed && (
                    <div className="p-4 border-t border-gray-100 bg-amber-50 flex items-center justify-between">
                      <p className="text-sm text-amber-700">대진표가 생성되었습니다. 확정해야 대회를 시작할 수 있습니다.</p>
                      <button onClick={() => { setBracketConfirmed(true); addToast('대진표가 확정되었습니다. 이제 "대회 시작" 버튼을 눌러주세요.'); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                        대진표 확정
                      </button>
                    </div>
                  )}
                  {canManageBracket && bracketConfirmed && (
                    <div className="p-4 border-t border-gray-100 bg-green-50 flex items-center justify-between">
                      <p className="text-sm text-green-700 font-medium">대진표가 확정되었습니다. 상단에서 "대회 시작" 버튼을 눌러주세요.</p>
                      <button onClick={() => { setBracketConfirmed(false); addToast('대진표 확정이 취소되었습니다.', 'info'); }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">
                        확정 취소
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <Shuffle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">대진표가 아직 생성되지 않았습니다</p>
                  <p className="text-sm mt-1">{canManageBracket ? '시드를 배정한 후 "대진표 생성" 버튼을 클릭하세요' : '접수 완료 후 생성할 수 있습니다'}</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ===== 결과입력 탭 ===== */}
      {tab === 'results' && (
        <div className="space-y-4">
          <GuideBanner tabKey="results" />

          {tMatches.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-500">
              대진표를 먼저 생성해주세요.
            </div>
          ) : (
            Array.from({ length: maxRound }, (_, i) => i + 1).map(round => {
              const roundMatches = tMatches.filter(m => m.round === round);
              const finishedCount = roundMatches.filter(m => m.status === 'finished').length;
              const isOpen = openRounds.has(round);

              return (
                <div key={round} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button onClick={() => toggleRound(round)}
                    className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{roundNames[round] || `라운드 ${round}`}</h3>
                      <span className="text-xs text-gray-500">({finishedCount}/{roundMatches.length} 경기 완료)</span>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className={`rounded-full h-1.5 transition-all ${finishedCount === roundMatches.length ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${roundMatches.length > 0 ? (finishedCount / roundMatches.length) * 100 : 0}%` }} />
                      </div>
                      {finishedCount === roundMatches.length && <span className="text-xs text-green-600 font-medium">완료</span>}
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {isOpen && (
                    <div className="divide-y divide-gray-50">
                      {roundMatches.map(m => {
                        const p1 = getUserById(m.player1Id);
                        const p2 = getUserById(m.player2Id);
                        const p1Score = getScore(m.id, 'p1', m.player1Score);
                        const p2Score = getScore(m.id, 'p2', m.player2Score);
                        const winner = getWinner(m.id, m);
                        const editable = canInputResults && m.status !== 'finished';

                        return (
                          <div key={m.id} className={`p-4 ${!editable && !isFinished ? 'opacity-60' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs text-gray-500">매치 {m.matchNumber}</span>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={m.status} />
                                {canInputResults && m.status === 'scheduled' && m.player1Id && m.player2Id && (
                                  <button onClick={() => addToast('경기가 시작되었습니다.')}
                                    className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                                    <Play className="w-3 h-3" /> 경기 시작
                                  </button>
                                )}
                                {canInputResults && m.status === 'ongoing' && (
                                  <button onClick={() => addToast('경기가 종료되었습니다.')}
                                    className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">
                                    <Flag className="w-3 h-3" /> 경기 종료
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`flex-1 text-right py-2 px-3 rounded-lg transition-colors ${winner === m.player1Id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                <span className={`text-sm ${winner === m.player1Id ? 'font-bold text-blue-700' : 'text-gray-700'}`}>{p1?.name || 'TBD'}</span>
                                {winner === m.player1Id && <span className="ml-1.5 text-xs text-blue-500">WIN</span>}
                              </div>
                              <input type="text" inputMode="numeric" disabled={!editable}
                                value={String(p1Score)} onChange={e => setScore2(m.id, 'p1', e.target.value.replace(/[^0-9]/g, ''))}
                                className={`w-14 text-center px-2 py-2 rounded-lg border border-gray-300 text-sm font-bold outline-none ${editable ? 'focus:ring-2 focus:ring-blue-500' : 'bg-gray-100 cursor-not-allowed'}`} placeholder="-" />
                              <span className="text-gray-400 text-sm font-medium">:</span>
                              <input type="text" inputMode="numeric" disabled={!editable}
                                value={String(p2Score)} onChange={e => setScore2(m.id, 'p2', e.target.value.replace(/[^0-9]/g, ''))}
                                className={`w-14 text-center px-2 py-2 rounded-lg border border-gray-300 text-sm font-bold outline-none ${editable ? 'focus:ring-2 focus:ring-blue-500' : 'bg-gray-100 cursor-not-allowed'}`} placeholder="-" />
                              <div className={`flex-1 py-2 px-3 rounded-lg transition-colors ${winner === m.player2Id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                <span className={`text-sm ${winner === m.player2Id ? 'font-bold text-blue-700' : 'text-gray-700'}`}>{p2?.name || 'TBD'}</span>
                                {winner === m.player2Id && <span className="ml-1.5 text-xs text-blue-500">WIN</span>}
                              </div>
                              {editable && (
                                <button onClick={() => addToast('결과가 저장되었습니다.')}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex-shrink-0">저장</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </AdminLayout>
  );
}
