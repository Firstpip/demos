// ============================================================
// 더미 데이터
// ============================================================

export type UserRole = 'user' | 'admin';
export type Category = 'amateur' | 'student' | 'pro';
export type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type TournamentStatus = 'upcoming' | 'open' | 'closed' | 'ongoing' | 'finished';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'completed' | 'refunded';
export type AppealStatus = 'submitted' | 'reviewing' | 'approved' | 'rejected';
export type MatchStatus = 'scheduled' | 'ongoing' | 'finished';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: Category;
  verificationStatus: VerificationStatus;
  role: UserRole;
  createdAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  category: Category;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  rules: string;
  posterColor: string;
}

export interface Application {
  id: string;
  tournamentId: string;
  userId: string;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  appliedAt: string;
  processedAt?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  winnerId?: string;
  status: MatchStatus;
}

export interface RankingEntry {
  userId: string;
  category: Category;
  rank: number;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
}

export interface Appeal {
  id: string;
  userId: string;
  tournamentId: string;
  reason: string;
  status: AppealStatus;
  adminResponse?: string;
  submittedAt: string;
  processedAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  applicationId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  paidAt: string;
}

// --- Users ---
export const users: User[] = [
  { id: 'u1', name: '김민수', email: 'minsu@example.com', phone: '010-1234-5678', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-01-15' },
  { id: 'u2', name: '이서연', email: 'seoyeon@example.com', phone: '010-2345-6789', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-01-20' },
  { id: 'u3', name: '박준혁', email: 'junhyuk@example.com', phone: '010-3456-7890', category: 'student', verificationStatus: 'approved', role: 'user', createdAt: '2026-02-01' },
  { id: 'u4', name: '최유진', email: 'yujin@example.com', phone: '010-4567-8901', category: 'student', verificationStatus: 'pending', role: 'user', createdAt: '2026-02-10' },
  { id: 'u5', name: '정다은', email: 'daeun@example.com', phone: '010-5678-9012', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-02-15' },
  { id: 'u6', name: '한지호', email: 'jiho@example.com', phone: '010-6789-0123', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-02-20' },
  { id: 'u7', name: '윤서현', email: 'seohyun@example.com', phone: '010-7890-1234', category: 'student', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-01' },
  { id: 'u8', name: '임태영', email: 'taeyoung@example.com', phone: '010-8901-2345', category: 'amateur', verificationStatus: 'none', role: 'user', createdAt: '2026-03-05' },
  { id: 'u9', name: '송예린', email: 'yerin@example.com', phone: '010-9012-3456', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-10' },
  { id: 'u10', name: '오현우', email: 'hyunwoo@example.com', phone: '010-0123-4567', category: 'student', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-12' },
  { id: 'u11', name: '배수빈', email: 'subin@example.com', phone: '010-1111-2222', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-15' },
  { id: 'u12', name: '조민재', email: 'minjae@example.com', phone: '010-2222-3333', category: 'amateur', verificationStatus: 'rejected', role: 'user', createdAt: '2026-03-18' },
  { id: 'u13', name: '강하은', email: 'haeun@example.com', phone: '010-3333-4444', category: 'student', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-20' },
  { id: 'u14', name: '신동훈', email: 'donghun@example.com', phone: '010-4444-5555', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-22' },
  { id: 'u15', name: '유지원', email: 'jiwon@example.com', phone: '010-5555-6666', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-25' },
  { id: 'u16', name: '권나연', email: 'nayeon@example.com', phone: '010-6666-7777', category: 'student', verificationStatus: 'pending', role: 'user', createdAt: '2026-03-27' },
  { id: 'u17', name: '장우성', email: 'woosung@example.com', phone: '010-7777-8888', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-28' },
  { id: 'u18', name: '문소희', email: 'sohee@example.com', phone: '010-8888-9999', category: 'student', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-29' },
  { id: 'u19', name: '황재민', email: 'jaemin@example.com', phone: '010-9999-0000', category: 'amateur', verificationStatus: 'approved', role: 'user', createdAt: '2026-03-30' },
  { id: 'u20', name: '안수진', email: 'sujin@example.com', phone: '010-0000-1111', category: 'student', verificationStatus: 'approved', role: 'user', createdAt: '2026-04-01' },
];

// --- Tournaments ---
export const tournaments: Tournament[] = [
  {
    id: 't1', title: '2026 봄 시즌 아마추어 배드민턴 오픈', category: 'amateur', status: 'ongoing',
    startDate: '2026-04-01', endDate: '2026-04-15', location: '서울', venue: '올림픽공원 배드민턴장',
    entryFee: 30000, maxParticipants: 32, currentParticipants: 32,
    description: '2026년 봄 시즌 아마추어 배드민턴 오픈 대회입니다. 아마추어 동호인이라면 누구나 참가 가능합니다.',
    rules: '단식 토너먼트 (싱글 엘리미네이션)\n3세트 중 2세트 선승제\n각 세트 21점 선취\n듀스 시 2점차 또는 30점 선취',
    posterColor: 'from-blue-500 to-blue-700',
  },
  {
    id: 't2', title: '제3회 학생 배드민턴 챔피언십', category: 'student', status: 'ongoing',
    startDate: '2026-04-05', endDate: '2026-04-20', location: '부산', venue: '부산시민체육관',
    entryFee: 20000, maxParticipants: 16, currentParticipants: 16,
    description: '학생 선수들을 위한 전국 규모 배드민턴 챔피언십입니다. 학생 인증이 완료된 선수만 참가 가능합니다.',
    rules: '단식 토너먼트 (싱글 엘리미네이션)\n3세트 중 2세트 선승제\n각 세트 21점 선취',
    posterColor: 'from-green-500 to-green-700',
  },
  {
    id: 't3', title: '2026 스프링 리그 아마추어 단식', category: 'amateur', status: 'open',
    startDate: '2026-05-01', endDate: '2026-05-15', location: '인천', venue: '인천도호부관아 체육관',
    entryFee: 35000, maxParticipants: 32, currentParticipants: 18,
    description: '인천 지역 아마추어 배드민턴 단식 대회입니다. 선착순 32명 모집.',
    rules: '단식 토너먼트 (싱글 엘리미네이션)\n3세트 중 2세트 선승제',
    posterColor: 'from-purple-500 to-purple-700',
  },
  {
    id: 't4', title: '학생 배드민턴 페스티벌 2026', category: 'student', status: 'open',
    startDate: '2026-05-10', endDate: '2026-05-20', location: '대전', venue: '대전체육관',
    entryFee: 15000, maxParticipants: 16, currentParticipants: 8,
    description: '학생 선수들의 축제! 실력에 상관없이 즐기는 배드민턴 대회입니다.',
    rules: '단식 토너먼트\n2세트 중 1세트 선승제\n각 세트 21점 선취',
    posterColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 't5', title: '2026 여름 시즌 아마추어 오픈 예선', category: 'amateur', status: 'upcoming',
    startDate: '2026-06-01', endDate: '2026-06-15', location: '광주', venue: '광주실내체육관',
    entryFee: 30000, maxParticipants: 64, currentParticipants: 0,
    description: '여름 시즌 본선 진출을 위한 예선 대회입니다.',
    rules: '단식 토너먼트 (싱글 엘리미네이션)\n3세트 중 2세트 선승제',
    posterColor: 'from-cyan-500 to-teal-600',
  },
  {
    id: 't6', title: '2025 겨울 시즌 아마추어 배드민턴 클래식', category: 'amateur', status: 'finished',
    startDate: '2025-12-01', endDate: '2025-12-15', location: '서울', venue: '장충체육관',
    entryFee: 30000, maxParticipants: 32, currentParticipants: 32,
    description: '2025년 겨울 시즌 마지막 아마추어 대회.',
    rules: '단식 토너먼트\n3세트 중 2세트 선승제',
    posterColor: 'from-slate-500 to-slate-700',
  },
  {
    id: 't7', title: '2026 서울 아마추어 챌린저스컵', category: 'amateur', status: 'closed',
    startDate: '2026-04-20', endDate: '2026-05-05', location: '서울', venue: '잠실실내체육관',
    entryFee: 25000, maxParticipants: 8, currentParticipants: 8,
    description: '서울 지역 아마추어 선수를 위한 챌린저스컵입니다. 접수가 마감되었으며 대진표 생성을 준비중입니다.',
    rules: '단식 토너먼트 (싱글 엘리미네이션)\n3세트 중 2세트 선승제\n각 세트 21점 선취',
    posterColor: 'from-indigo-500 to-violet-700',
  },
];

// --- Applications ---
export const applications: Application[] = [
  // t1 (ongoing, 32 participants - all approved)
  ...['u1','u2','u5','u6','u9','u11','u14','u15','u17','u19','u8','u12'].map((uid, i) => ({
    id: `a${i+1}`, tournamentId: 't1', userId: uid, status: 'approved' as ApplicationStatus,
    paymentStatus: 'completed' as PaymentStatus, paymentAmount: 30000, appliedAt: '2026-03-20',
  })),
  // t2 (ongoing, 16 participants - all approved)
  ...['u3','u7','u10','u13','u18','u20','u4','u16'].map((uid, i) => ({
    id: `a${i+13}`, tournamentId: 't2', userId: uid, status: 'approved' as ApplicationStatus,
    paymentStatus: 'completed' as PaymentStatus, paymentAmount: 20000, appliedAt: '2026-03-25',
  })),
  // t3 (open - mixed statuses)
  { id: 'a21', tournamentId: 't3', userId: 'u1', status: 'approved', paymentStatus: 'completed', paymentAmount: 35000, appliedAt: '2026-04-01' },
  { id: 'a22', tournamentId: 't3', userId: 'u5', status: 'approved', paymentStatus: 'completed', paymentAmount: 35000, appliedAt: '2026-04-01' },
  { id: 'a23', tournamentId: 't3', userId: 'u8', status: 'pending', paymentStatus: 'pending', paymentAmount: 35000, appliedAt: '2026-04-02' },
  { id: 'a24', tournamentId: 't3', userId: 'u12', status: 'rejected', paymentStatus: 'refunded', paymentAmount: 35000, appliedAt: '2026-04-02' },
  // t7 (closed - 8 approved, ready for bracket)
  ...['u1','u2','u5','u6','u9','u11','u14','u15'].map((uid, i) => ({
    id: `a${25+i}`, tournamentId: 't7', userId: uid, status: 'approved' as ApplicationStatus,
    paymentStatus: 'completed' as PaymentStatus, paymentAmount: 25000, appliedAt: '2026-04-10',
  })),
];

// --- Matches (t1: 8강~결승, t2: 8강~결승, t6: 종료) ---
function makeMatches(tournamentId: string, playerIds: string[], finished: boolean): Match[] {
  const matches: Match[] = [];
  const rounds = Math.log2(playerIds.length);
  let matchNum = 1;
  let currentPlayers = [...playerIds];

  for (let r = 1; r <= rounds; r++) {
    const nextPlayers: string[] = [];
    for (let i = 0; i < currentPlayers.length; i += 2) {
      const p1 = currentPlayers[i];
      const p2 = currentPlayers[i + 1];
      const isFinished = finished || r < rounds;
      const p1Score = isFinished ? (Math.random() > 0.5 ? 21 : Math.floor(Math.random() * 19) + 1) : 0;
      const p2Score = isFinished ? (p1Score === 21 ? Math.floor(Math.random() * 19) + 1 : 21) : 0;
      const winner = p1Score > p2Score ? p1 : p2;

      matches.push({
        id: `m-${tournamentId}-${matchNum}`,
        tournamentId,
        round: r,
        matchNumber: matchNum,
        player1Id: p1,
        player2Id: p2,
        player1Score: isFinished ? p1Score : 0,
        player2Score: isFinished ? p2Score : 0,
        winnerId: isFinished ? winner : undefined,
        status: isFinished ? 'finished' : (r === rounds ? 'scheduled' : 'finished'),
      });
      nextPlayers.push(isFinished ? winner : p1);
      matchNum++;
    }
    currentPlayers = nextPlayers;
  }
  return matches;
}

// Pre-generated matches with fixed results for consistency
export const matches: Match[] = [
  // t1: 8강 tournament (8 players from 32 - showing quarterfinals onwards)
  // Quarterfinals
  { id: 'm-t1-1', tournamentId: 't1', round: 1, matchNumber: 1, player1Id: 'u1', player2Id: 'u6', player1Score: 21, player2Score: 18, winnerId: 'u1', status: 'finished' },
  { id: 'm-t1-2', tournamentId: 't1', round: 1, matchNumber: 2, player1Id: 'u2', player2Id: 'u9', player1Score: 21, player2Score: 15, winnerId: 'u2', status: 'finished' },
  { id: 'm-t1-3', tournamentId: 't1', round: 1, matchNumber: 3, player1Id: 'u5', player2Id: 'u11', player1Score: 18, player2Score: 21, winnerId: 'u11', status: 'finished' },
  { id: 'm-t1-4', tournamentId: 't1', round: 1, matchNumber: 4, player1Id: 'u14', player2Id: 'u15', player1Score: 21, player2Score: 19, winnerId: 'u14', status: 'finished' },
  // Semifinals
  { id: 'm-t1-5', tournamentId: 't1', round: 2, matchNumber: 5, player1Id: 'u1', player2Id: 'u2', player1Score: 21, player2Score: 17, winnerId: 'u1', status: 'finished' },
  { id: 'm-t1-6', tournamentId: 't1', round: 2, matchNumber: 6, player1Id: 'u11', player2Id: 'u14', player1Score: 15, player2Score: 21, winnerId: 'u14', status: 'finished' },
  // Final
  { id: 'm-t1-7', tournamentId: 't1', round: 3, matchNumber: 7, player1Id: 'u1', player2Id: 'u14', player1Score: 0, player2Score: 0, status: 'ongoing' },

  // t2: 8강 tournament (8 students)
  { id: 'm-t2-1', tournamentId: 't2', round: 1, matchNumber: 1, player1Id: 'u3', player2Id: 'u10', player1Score: 21, player2Score: 12, winnerId: 'u3', status: 'finished' },
  { id: 'm-t2-2', tournamentId: 't2', round: 1, matchNumber: 2, player1Id: 'u7', player2Id: 'u13', player1Score: 19, player2Score: 21, winnerId: 'u13', status: 'finished' },
  { id: 'm-t2-3', tournamentId: 't2', round: 1, matchNumber: 3, player1Id: 'u18', player2Id: 'u20', player1Score: 21, player2Score: 16, winnerId: 'u18', status: 'finished' },
  { id: 'm-t2-4', tournamentId: 't2', round: 1, matchNumber: 4, player1Id: 'u4', player2Id: 'u16', player1Score: 21, player2Score: 14, winnerId: 'u4', status: 'finished' },
  { id: 'm-t2-5', tournamentId: 't2', round: 2, matchNumber: 5, player1Id: 'u3', player2Id: 'u13', player1Score: 0, player2Score: 0, status: 'scheduled' },
  { id: 'm-t2-6', tournamentId: 't2', round: 2, matchNumber: 6, player1Id: 'u18', player2Id: 'u4', player1Score: 0, player2Score: 0, status: 'scheduled' },
  { id: 'm-t2-7', tournamentId: 't2', round: 3, matchNumber: 7, player1Id: '', player2Id: '', player1Score: 0, player2Score: 0, status: 'scheduled' },

  // t6: finished tournament
  { id: 'm-t6-1', tournamentId: 't6', round: 1, matchNumber: 1, player1Id: 'u1', player2Id: 'u5', player1Score: 21, player2Score: 14, winnerId: 'u1', status: 'finished' },
  { id: 'm-t6-2', tournamentId: 't6', round: 1, matchNumber: 2, player1Id: 'u2', player2Id: 'u6', player1Score: 21, player2Score: 19, winnerId: 'u2', status: 'finished' },
  { id: 'm-t6-3', tournamentId: 't6', round: 1, matchNumber: 3, player1Id: 'u9', player2Id: 'u11', player1Score: 17, player2Score: 21, winnerId: 'u11', status: 'finished' },
  { id: 'm-t6-4', tournamentId: 't6', round: 1, matchNumber: 4, player1Id: 'u14', player2Id: 'u17', player1Score: 21, player2Score: 16, winnerId: 'u14', status: 'finished' },
  { id: 'm-t6-5', tournamentId: 't6', round: 2, matchNumber: 5, player1Id: 'u1', player2Id: 'u2', player1Score: 18, player2Score: 21, winnerId: 'u2', status: 'finished' },
  { id: 'm-t6-6', tournamentId: 't6', round: 2, matchNumber: 6, player1Id: 'u11', player2Id: 'u14', player1Score: 21, player2Score: 19, winnerId: 'u11', status: 'finished' },
  { id: 'm-t6-7', tournamentId: 't6', round: 3, matchNumber: 7, player1Id: 'u2', player2Id: 'u11', player1Score: 21, player2Score: 17, winnerId: 'u2', status: 'finished' },
];

// --- Rankings ---
export const rankings: RankingEntry[] = [
  { userId: 'u2', category: 'amateur', rank: 1, wins: 15, losses: 3, winRate: 83.3, points: 2850 },
  { userId: 'u1', category: 'amateur', rank: 2, wins: 14, losses: 4, winRate: 77.8, points: 2720 },
  { userId: 'u11', category: 'amateur', rank: 3, wins: 12, losses: 5, winRate: 70.6, points: 2580 },
  { userId: 'u14', category: 'amateur', rank: 4, wins: 11, losses: 5, winRate: 68.8, points: 2450 },
  { userId: 'u5', category: 'amateur', rank: 5, wins: 10, losses: 6, winRate: 62.5, points: 2320 },
  { userId: 'u6', category: 'amateur', rank: 6, wins: 9, losses: 7, winRate: 56.3, points: 2180 },
  { userId: 'u9', category: 'amateur', rank: 7, wins: 8, losses: 7, winRate: 53.3, points: 2050 },
  { userId: 'u15', category: 'amateur', rank: 8, wins: 7, losses: 8, winRate: 46.7, points: 1920 },
  { userId: 'u17', category: 'amateur', rank: 9, wins: 6, losses: 9, winRate: 40.0, points: 1780 },
  { userId: 'u19', category: 'amateur', rank: 10, wins: 5, losses: 10, winRate: 33.3, points: 1650 },
  { userId: 'u8', category: 'amateur', rank: 11, wins: 4, losses: 11, winRate: 26.7, points: 1520 },
  { userId: 'u12', category: 'amateur', rank: 12, wins: 3, losses: 12, winRate: 20.0, points: 1380 },
  { userId: 'u3', category: 'student', rank: 1, wins: 12, losses: 2, winRate: 85.7, points: 2900 },
  { userId: 'u18', category: 'student', rank: 2, wins: 10, losses: 3, winRate: 76.9, points: 2650 },
  { userId: 'u13', category: 'student', rank: 3, wins: 9, losses: 4, winRate: 69.2, points: 2480 },
  { userId: 'u7', category: 'student', rank: 4, wins: 8, losses: 5, winRate: 61.5, points: 2300 },
  { userId: 'u10', category: 'student', rank: 5, wins: 7, losses: 6, winRate: 53.8, points: 2150 },
  { userId: 'u20', category: 'student', rank: 6, wins: 6, losses: 7, winRate: 46.2, points: 2000 },
  { userId: 'u4', category: 'student', rank: 7, wins: 5, losses: 8, winRate: 38.5, points: 1850 },
  { userId: 'u16', category: 'student', rank: 8, wins: 3, losses: 10, winRate: 23.1, points: 1500 },
];

// --- Appeals ---
export const appeals: Appeal[] = [
  { id: 'ap1', userId: 'u12', tournamentId: 't3', reason: '인증 서류 업데이트 후 재심사 요청합니다. 이전에 제출한 서류에 오류가 있었습니다.', status: 'submitted', submittedAt: '2026-04-02' },
  { id: 'ap2', userId: 'u8', tournamentId: 't1', reason: '경기 중 심판 판정에 이의가 있습니다. 해당 포인트에서 셔틀콕이 라인 안에 떨어졌습니다.', status: 'submitted', submittedAt: '2026-04-03' },
  { id: 'ap3', userId: 'u6', tournamentId: 't1', reason: '상대 선수의 서브 폴트 미판정에 대한 이의제기입니다.', status: 'reviewing', submittedAt: '2026-04-01', },
  { id: 'ap4', userId: 'u9', tournamentId: 't6', reason: '대회 결과 포인트 반영이 누락된 것 같습니다.', status: 'approved', submittedAt: '2025-12-16', processedAt: '2025-12-18' },
  { id: 'ap5', userId: 'u17', tournamentId: 't6', reason: '경기 시간 변경 통보가 늦어 불참 처리된 건에 대한 이의제기입니다.', status: 'rejected', submittedAt: '2025-12-15', processedAt: '2025-12-17' },
];

// --- Payments ---
export const payments: Payment[] = [
  ...applications.filter(a => a.paymentStatus === 'completed').map((a, i) => ({
    id: `p${i+1}`, userId: a.userId, applicationId: a.id, amount: a.paymentAmount,
    method: i % 3 === 0 ? '카드' : i % 3 === 1 ? '계좌이체' : '카카오페이',
    status: 'completed' as PaymentStatus, paidAt: a.appliedAt,
  })),
  ...applications.filter(a => a.paymentStatus === 'refunded').map((a, i) => ({
    id: `pr${i+1}`, userId: a.userId, applicationId: a.id, amount: a.paymentAmount,
    method: '카드', status: 'refunded' as PaymentStatus, paidAt: a.appliedAt,
  })),
];

// --- Helper functions ---
export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find(t => t.id === id);
}

export function getMatchesByTournament(tournamentId: string): Match[] {
  return matches.filter(m => m.tournamentId === tournamentId);
}

export function getApplicationsByTournament(tournamentId: string): Application[] {
  return applications.filter(a => a.tournamentId === tournamentId);
}

export function getRankingsByCategory(category: Category | 'all'): RankingEntry[] {
  if (category === 'all') return [...rankings].sort((a, b) => b.points - a.points);
  return rankings.filter(r => r.category === category);
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
}

export function getStatusLabel(status: TournamentStatus): string {
  const labels: Record<TournamentStatus, string> = {
    upcoming: '접수예정', open: '접수중', closed: '접수완료', ongoing: '진행중', finished: '종료',
  };
  return labels[status];
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = { pro: '프로', amateur: '아마추어', student: '학생' };
  return labels[category];
}

export function getVerificationLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    none: '미인증', pending: '심사중', approved: '인증완료', rejected: '인증거절',
  };
  return labels[status];
}
