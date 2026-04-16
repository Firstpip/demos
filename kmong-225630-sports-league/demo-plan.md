# 데모 구현 계획: 스포츠리그 경기신청 및 대진표 플랫폼

## 1. 기술스택

- 프레임워크: Next.js 15 (App Router, Static Export)
- 스타일링: Tailwind CSS
- 상태관리: React Context + useState
- 아이콘: Lucide React
- 배포: GitHub Pages (Firstpip/demos 리포)
- 데모 URL: https://firstpip.github.io/demos/kmong-225630-demo/

## 2. 페이지 목록 및 라우팅

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 홈 | 대회 일정 요약, 진행중 경기, 랭킹 미리보기 |
| `/login` | 로그인 | 데모 로그인 (아무 값 입력 가능) |
| `/register` | 회원가입 | 회원가입 폼 |
| `/schedule` | 경기 일정 | 대회 목록 (카테고리 필터, 상태 필터) |
| `/schedule/[id]` | 대회 상세 | 대회 정보, 참가 신청 버튼 |
| `/schedule/[id]/apply` | 경기 신청 | 신청 폼 + 결제 (Mock) |
| `/bracket` | 대진표 목록 | 진행중/완료 대회 대진표 목록 |
| `/bracket/[id]` | 대진표 상세 | 토너먼트 대진표 시각화 |
| `/ranking` | 랭킹 | 카테고리별 선수 랭킹 |
| `/mypage` | 마이페이지 | 프로필, 참가 이력, 전적, 결제 내역 |
| `/mypage/verify` | 인증 관리 | 카테고리 인증 (학생-나이, 프로-선수증) |
| `/mypage/appeal` | 이의제기 | 이의제기 신청/현황 |
| `/admin` | 관리자 대시보드 | 통계 요약 |
| `/admin/members` | 회원 관리 | 회원 목록, 인증 승인/거절 |
| `/admin/tournaments` | 대회 관리 | 대회 CRUD |
| `/admin/tournaments/[id]` | 대회 상세 관리 | 신청 관리, 결과 입력, 대진표 관리 |
| `/admin/appeals` | 이의제기 관리 | 이의제기 목록, 처리 |
| `/admin/payments` | 결제 관리 | 결제 내역, 환불 처리 (Mock) |

## 3. 권한 체계

| 라우트 | 접근 권한 |
|--------|-----------|
| `/`, `/schedule`, `/bracket`, `/bracket/[id]`, `/ranking` | 공개 |
| `/login`, `/register` | 비로그인 전용 |
| `/schedule/[id]`, `/schedule/[id]/apply`, `/mypage`, `/mypage/*` | 로그인 필요 |
| `/admin`, `/admin/*` | 관리자 전용 |

역할 전환 토글: 헤더에 관리자/일반 사용자 전환 버튼 제공

## 4. 디자인 시스템

### 컬러
- Primary: #2563EB (블루 600) — 신뢰감, 스포츠
- Primary Light: #3B82F6 (블루 500)
- Primary Dark: #1D4ED8 (블루 700)
- Accent: #F59E0B (앰버 500) — 에너지, 활동성
- Success: #10B981 (에메랴드 500)
- Warning: #F59E0B (앰버 500)
- Error: #EF4444 (레드 500)
- Background: #F8FAFC (슬레이트 50)
- Surface: #FFFFFF
- Text Primary: #1E293B (슬레이트 800)
- Text Secondary: #64748B (슬레이트 500)

### 상태 배지 컬러
- 접수예정: bg-yellow-100 text-yellow-800
- 접수중: bg-blue-100 text-blue-800
- 접수완료: bg-purple-100 text-purple-800
- 진행중: bg-green-100 text-green-800
- 종료: bg-gray-100 text-gray-800

### 폰트
- 한글: Pretendard (또는 시스템 폰트)
- 영문: Inter

### 컴포넌트 스타일
- 카드: rounded-xl shadow-sm border border-gray-100
- 버튼: rounded-lg px-4 py-2, Primary/Secondary/Outline/Danger
- 배지: rounded-full px-3 py-1 text-sm font-medium
- 인풋: rounded-lg border border-gray-300 px-3 py-2
- 모달: backdrop-blur + centered card
- 토스트: bottom-right, 자동 사라짐

## 5. 공통 컴포넌트

- `Header` — 로고, 네비게이션, 로그인/사용자 메뉴, 역할 전환 토글
- `Footer` — 간단한 카피라이트
- `AuthGuard` — 권한 체크 + 리다이렉트
- `AdminLayout` — 사이드바 + 메인 콘텐츠 (관리자 페이지용)
- `TournamentCard` — 대회 카드 (상태 배지, 카테고리, 날짜)
- `BracketView` — 토너먼트 대진표 시각화 (트리 구조)
- `RankingTable` — 랭킹 테이블
- `StatusBadge` — 상태 배지
- `CategoryBadge` — 카테고리 배지 (프로/아마추어/학생)
- `Toast` — 토스트 알림
- `Modal` — 모달 다이얼로그
- `CustomSelect` — 커스텀 셀렉트 (네이티브 스타일 제거)
- `NumericInput` — 숫자 전용 인풋 (type="text" + inputMode="numeric")

## 6. 페이지별 기능 명세

### 홈 (/)
- 진행중/접수중 대회 슬라이더 (최대 5개)
- 오늘의 경기 현황 카드
- 랭킹 TOP 5 미리보기
- 최근 경기 결과

### 로그인 (/login)
- 이메일/비밀번호 입력
- 소셜 로그인 버튼 (구글, 카카오, 네이버 — Mock)
- "데모 안내: 아무 값이나 입력하여 로그인 가능합니다"
- 헤더 숨김

### 회원가입 (/register)
- 이름, 이메일, 비밀번호, 비밀번호 확인, 전화번호
- 카테고리 선택 (아마추어/학생)
- 필수/선택 표시 + 유효성 검증
- 헤더 숨김

### 경기 일정 (/schedule)
- 카테고리 탭 (전체/아마추어/학생)
- 상태 필터 (접수예정/접수중/진행중/종료)
- 대회 카드 그리드 (이미지, 제목, 날짜, 장소, 상태배지, 카테고리배지)
- 검색 기능

### 대회 상세 (/schedule/[id])
- 대회 포스터 이미지
- 대회 정보 (이름, 카테고리, 기간, 장소, 참가비, 참가 인원/정원)
- 참가 신청 버튼 (접수중일 때만 활성)
- 참가 선수 목록
- 대회 규칙/안내

### 경기 신청 (/schedule/[id]/apply)
- 선수 정보 확인
- 카테고리 인증 상태 확인
- 참가비 결제 (Mock — 토스페이먼츠 UI)
- 동의 체크박스
- 신청 완료 토스트

### 대진표 목록 (/bracket)
- 진행중/완료 대회 리스트
- 대회별 대진표 미리보기 카드

### 대진표 상세 (/bracket/[id])
- 토너먼트 대진표 트리 시각화 (싱글 엘리미네이션)
- 라운드별 매치 카드 (선수명, 점수)
- 승자 하이라이트
- 현재 진행 매치 표시
- 결과 확정된 매치 vs 대기중 매치 구분

### 랭킹 (/ranking)
- 카테고리 탭 (전체/아마추어/학생)
- 순위 테이블 (순위, 선수명, 승, 패, 승률, 포인트)
- TOP 3 하이라이트 카드
- 검색/필터

### 마이페이지 (/mypage)
- 프로필 카드 (이름, 이메일, 카테고리, 인증 상태)
- 참가 이력 탭 (진행중/완료)
- 전적 요약 (총 경기, 승, 패, 승률)
- 최근 경기 결과
- 결제 내역 탭

### 인증 관리 (/mypage/verify)
- 현재 인증 상태 표시
- 학생 인증: 나이 인증 폼 (생년월일 입력)
- 프로 인증: 선수증 업로드 (파일 선택 UI)
- 인증 심사 상태 (대기중/승인/거절)

### 이의제기 (/mypage/appeal)
- 이의제기 신청 폼 (대상 대회 선택, 사유 입력)
- 이의제기 현황 목록 (상태: 접수/심사중/승인/거절)
- 이의제기 기간 안내

### 관리자 대시보드 (/admin)
- 통계 카드 (총 회원, 진행중 대회, 이번달 매출, 대기중 인증)
- 최근 신청 목록
- 이의제기 알림
- 월별 대회/매출 차트 (간단한 바 차트)

### 회원 관리 (/admin/members)
- 회원 테이블 (이름, 이메일, 카테고리, 인증 상태, 가입일)
- 인증 승인/거절 버튼
- 검색/필터 (카테고리, 인증 상태)
- 회원 상세 모달

### 대회 관리 (/admin/tournaments)
- 대회 목록 테이블
- 대회 생성 버튼 → 생성 모달/폼
- 대회 수정/삭제

### 대회 상세 관리 (/admin/tournaments/[id])
- 탭: 기본정보 / 신청관리 / 대진표관리 / 결과입력
- 신청 목록 + 승인/거절 버튼
- 대진표 편집 (매치 결과 입력)
- 참가비 현황

### 이의제기 관리 (/admin/appeals)
- 이의제기 목록 테이블
- 상세 보기 모달
- 승인/거절 + 사유 입력

### 결제 관리 (/admin/payments)
- 결제 내역 테이블 (Mock)
- 환불 처리 버튼
- 필터 (기간, 상태)

## 7. 시맨틱 ID 설계

### 공통
- `#header` — 헤더
- `#nav-menu` — 네비게이션 메뉴
- `#role-toggle` — 역할 전환 토글
- `#footer` — 푸터
- `#toast-container` — 토스트 컨테이너

### 홈
- `#home-hero` — 히어로 섹션
- `#home-tournaments` — 대회 슬라이더
- `#home-live` — 오늘의 경기 현황
- `#home-ranking` — 랭킹 미리보기
- `#home-results` — 최근 결과

### 로그인
- `#login-form` — 로그인 폼
- `#login-demo-notice` — 데모 안내
- `#login-social` — 소셜 로그인

### 경기 일정
- `#schedule-category-tabs` — 카테고리 탭
- `#schedule-status-filter` — 상태 필터
- `#schedule-search` — 검색
- `#schedule-grid` — 대회 카드 그리드
- `#tournament-card-{id}` — 대회 카드

### 대회 상세
- `#tournament-poster` — 포스터
- `#tournament-info` — 대회 정보
- `#tournament-apply-btn` — 참가 신청 버튼
- `#tournament-players` — 참가 선수 목록
- `#tournament-rules` — 대회 규칙

### 경기 신청
- `#apply-player-info` — 선수 정보
- `#apply-verify-status` — 인증 상태
- `#apply-payment` — 결제 (Mock)
- `#apply-submit` — 신청 버튼

### 대진표
- `#bracket-tree` — 대진표 트리
- `#bracket-round-{n}` — 라운드
- `#bracket-match-{id}` — 매치 카드
- `#bracket-winner` — 우승자

### 랭킹
- `#ranking-category-tabs` — 카테고리 탭
- `#ranking-top3` — TOP 3 카드
- `#ranking-table` — 랭킹 테이블

### 마이페이지
- `#mypage-profile` — 프로필 카드
- `#mypage-history` — 참가 이력
- `#mypage-record` — 전적 요약
- `#mypage-payments` — 결제 내역

### 인증 관리
- `#verify-status` — 인증 상태
- `#verify-student-form` — 학생 인증 폼
- `#verify-pro-form` — 프로 인증 폼

### 이의제기
- `#appeal-form` — 이의제기 폼
- `#appeal-list` — 이의제기 목록

### 관리자
- `#admin-sidebar` — 사이드바
- `#admin-stats` — 통계 카드
- `#admin-recent` — 최근 신청
- `#admin-members-table` — 회원 테이블
- `#admin-tournaments-table` — 대회 테이블
- `#admin-tournament-tabs` — 대회 상세 탭
- `#admin-appeals-table` — 이의제기 테이블
- `#admin-payments-table` — 결제 테이블

## 8. 데이터 구조

### User (사용자)
```
{
  id, name, email, phone, category (amateur|student),
  profileImage, verificationStatus (none|pending|approved|rejected),
  verificationDoc, role (user|admin),
  createdAt
}
```

### Tournament (대회)
```
{
  id, title, category (pro|amateur|student), status (upcoming|open|closed|ongoing|finished),
  startDate, endDate, location, venue, entryFee, maxParticipants, currentParticipants,
  description, rules, posterImage,
  createdAt
}
```

### Application (신청)
```
{
  id, tournamentId, userId, status (pending|approved|rejected),
  paymentStatus (pending|paid|refunded), paymentAmount,
  appliedAt, processedAt, processedBy
}
```

### Match (매치)
```
{
  id, tournamentId, round, matchNumber,
  player1Id, player2Id, player1Score, player2Score,
  winnerId, status (scheduled|ongoing|finished),
  scheduledAt
}
```

### Ranking (랭킹)
```
{
  userId, category, rank, wins, losses, winRate, points
}
```

### Appeal (이의제기)
```
{
  id, userId, tournamentId, applicationId,
  reason, status (submitted|reviewing|approved|rejected),
  adminResponse, submittedAt, processedAt
}
```

### Payment (결제)
```
{
  id, userId, applicationId, amount,
  method (card|transfer), status (pending|completed|refunded),
  paidAt
}
```

## 9. 더미 데이터 구성

| 엔티티 | 수량 | 내용 |
|--------|------|------|
| 사용자 | 20명 | 아마추어 12명, 학생 8명 |
| 대회 | 6개 | 접수예정 1, 접수중 2, 진행중 2, 종료 1 |
| 신청 | 30건 | 승인 20, 대기 5, 거절 5 |
| 매치 | 진행중 대회 15매치, 종료 대회 15매치 | 8강~결승 토너먼트 |
| 랭킹 | 20명 | 카테고리별 정렬 |
| 이의제기 | 5건 | 접수 2, 심사중 1, 승인 1, 거절 1 |
| 결제 | 30건 | 완료 25, 환불 5 |
