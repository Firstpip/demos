# 데모 구현 계획: 에너링거 (ENER RINGER)

## 1. 기술스택

- **프레임워크**: Next.js 15 (App Router, Static Export)
- **스타일링**: Tailwind CSS 4
- **언어**: TypeScript
- **배포**: GitHub Pages (Firstpip/kmong-225469-demo)
- **빌드**: `output: 'export'` (정적 생성)

## 2. 페이지 목록 및 라우팅

### 사용자 영역 (모바일 웹 중심)

| # | 경로 | 페이지명 | 설명 | 권한 |
|---|------|---------|------|------|
| 1 | `/` | 메인 홈 | 히어로 배너 + DTC소개 + 맞춤건기식 배너 + 전문의 상담 + 후기 | 공개 |
| 2 | `/login` | 로그인 | 카카오 로그인 Mock + 데모 안내 | 비로그인 |
| 3 | `/register` | 회원가입 | 카카오 간편가입 Mock | 비로그인 |
| 4 | `/register/partner` | 파트너 회원가입 | 전문의/약사 자격증 업로드 Mock | 비로그인 |
| 5 | `/dtc` | DTC 소개 | DTC 유전자검사 소개 + 키트 신청 | 공개 |
| 6 | `/dtc/products` | DTC 상품 | DTC 검사 키트 상품 목록 | 공개 |
| 7 | `/dtc/products/[id]` | DTC 상품 상세 | 키트 상세 + 장바구니/결제 | 공개 |
| 8 | `/my-results` | 내 결과 | DTC결과 불러오기 / 건강검진 불러오기 / 설문 추천 | 로그인 |
| 9 | `/my-results/dtc` | DTC 유전자 결과 | 12개 마커 시각화 + 위험/주의/양호 등급 | 로그인 |
| 10 | `/my-results/health-checkup` | 건강검진 결과 | 13개 항목 + 시계열 차트 + 정상범위 비교 | 로그인 |
| 11 | `/my-results/report` | AI 건강 리포트 | 건강점수 게이지 + 상태등급 + 추천성분 10개 | 로그인 |
| 12 | `/survey` | 건강 설문 | 다단계 설문 (성별/연령/생활습관/복용약물/알레르기) | 로그인 |
| 13 | `/market` | 마켓 | 맞춤형 건강기능식품 목록 + 검색/필터 | 공개 |
| 14 | `/market/[id]` | 상품 상세 | 상품 정보 + 성분 + 리뷰 + 장바구니 | 공개 |
| 15 | `/cart` | 장바구니 | 상품 목록 + 수량 변경 + 결제 진행 | 로그인 |
| 16 | `/checkout` | 결제 | 배송지 + 결제수단 + 정기구독 옵션 | 로그인 |
| 17 | `/consultation` | 상담 | 전문의 상담 / 약사 상담 탭 + 약사 프로필 카드 | 로그인 |
| 18 | `/consultation/booking` | 상담 예약 | 날짜/시간 선택 + 예약 확인 | 로그인 |
| 19 | `/consultation/room` | 상담 대기/진행 | 화상상담 Mock (대기 화면) | 로그인 |
| 20 | `/magazine` | 건강매거진 | 콘텐츠 목록 + 카테고리 | 공개 |
| 21 | `/magazine/[id]` | 매거진 상세 | 글 본문 | 공개 |
| 22 | `/mypage` | 마이페이지 | 검사결과/상담내역/영양제추천/주문배송/정기배송/회원정보 | 로그인 |
| 23 | `/mypage/orders` | 주문/배송 내역 | 주문 목록 + 배송 상태 | 로그인 |
| 24 | `/mypage/subscription` | 정기배송 관리 | 구독 상태/변경/해지 | 로그인 |
| 25 | `/mypage/medication` | 복약 관리 | 섭취 알림 설정 + 복약 이력 | 로그인 |
| 26 | `/cs` | 고객센터 | 공지/FAQ/1:1문의/이용약관 | 공개 |

### 의사 파트너센터 (PC웹)

| # | 경로 | 페이지명 | 설명 |
|---|------|---------|------|
| 27 | `/partner` | 파트너 대시보드 | 추천환자수/구매전환율/누적수수료/정산예정일 + 최근 환자 목록 + 월별 수수료 차트 + 추천링크/QR |
| 28 | `/partner/patients` | 환자 목록 | 전체 환자 테이블 (검사상태/결과/추천제품/구매여부/수수료) |
| 29 | `/partner/recommend` | 추천 제품 | 환자별 제품 추천 + 영양소 가이드 |
| 30 | `/partner/settlement` | 수수료 정산 | 월별 정산 내역 + 출금 |
| 31 | `/partner/qr` | QR/링크 설정 | UTM 링크 생성 + QR코드 생성/다운로드 |

### 약사 상담센터 (PC웹)

| # | 경로 | 페이지명 | 설명 |
|---|------|---------|------|
| 32 | `/pharmacist` | 약사 대시보드 | 오늘 상담 일정 + 대기 환자 |
| 33 | `/pharmacist/patients/[id]` | 환자 데이터 뷰어 | DTC결과 + 검진결과 + 설문 + 상담이력 |
| 34 | `/pharmacist/consultation` | 상담 관리 | 예약 목록 + 상담 진행/완료 |
| 35 | `/pharmacist/products` | 제품 조합 | 환자별 맞춤 영양제 조합 구성 |

### 관리자 (PC웹)

| # | 경로 | 페이지명 | 설명 |
|---|------|---------|------|
| 36 | `/admin` | 관리자 대시보드 | 서비스 통계 + 최근 활동 |
| 37 | `/admin/products` | 제품 관리 | 건기식 CRUD |
| 38 | `/admin/surveys` | 설문 관리 | 설문 항목/분기 로직 설정 |
| 39 | `/admin/experts` | 전문가 관리 | 의사/약사 가입 승인 + 자격증 검증 |
| 40 | `/admin/orders` | 주문/배송 관리 | 주문 목록 + 상태 변경 |
| 41 | `/admin/settlement` | 정산 관리 | 전문가별 수수료 정산 |
| 42 | `/admin/magazine` | 매거진 관리 | 콘텐츠 CRUD |
| 43 | `/admin/cs` | CS 관리 | 문의 목록 + 답변 |

## 3. 권한 체계

| 역할 | 접근 가능 영역 | 전환 방법 |
|------|-------------|----------|
| 비로그인 | 메인, DTC소개, 마켓(열람), 매거진, 고객센터 | - |
| 일반 사용자 | 위 + 내결과, 설문, 장바구니, 결제, 상담, 마이페이지 | 로그인 |
| 의사 파트너 | 위 + /partner/* | 역할 전환 토글 |
| 약사 | 위 + /pharmacist/* | 역할 전환 토글 |
| 관리자 | 모든 페이지 | 역할 전환 토글 |

- 데모 로그인: 아무 값 입력하여 로그인 가능
- 역할 전환: 헤더에 토글 버튼 (일반사용자/의사/약사/관리자)

## 4. 디자인 시스템 (기획서 와이어프레임 기반)

### 컬러
- **Primary (네이비)**: #1B2A4A — 헤더, 히어로 배경, Admin 사이드바 (기획서 p10, 19)
- **Accent (그린)**: #22C55E — 화상상담 버튼, CTA, 양호 뱃지 (기획서 p15, 17)
- **Background**: #FFFFFF / #F8FAFC
- **Text**: #1E293B (본문) / #64748B (서브)
- **Risk Red**: #EF4444 — 위험 뱃지 (기획서 p15)
- **Caution Yellow**: #F59E0B — 주의 뱃지 (기획서 p15)
- **Safe Green**: #22C55E — 양호 뱃지 (기획서 p15)
- **Info Blue**: #3B82F6 — 건강점수 게이지 테두리
- **Admin Stats**: 상단 보더 4색 (파랑/초록/노랑/빨강) (기획서 p19)

### 폰트
- Pretendard (한글/영문 통합)

### 레이아웃
- **모바일**: 하단 탭바 5개 (홈/마켓/내결과/상담/MY) — 기획서 p12
- **PC**: 상단 네비게이션 (ENER RINGER 로고 | DTC소개 | DTC유전자검사 | 맞춤형건강기능식품) + 우측 (로그인/회원가입/고객센터/주문배송) — 기획서 p10
- **파트너/약사/Admin**: 좌측 사이드바 + 메인 콘텐츠 — 기획서 p19

### 컴포넌트
- 건강점수 게이지: 원형 프로그레스 (55/100, 색상별 등급) — 기획서 p14
- 유전자 마커 카드: 마커명 + SNP + 위험/주의/양호 뱃지 + 설명 — 기획서 p15
- 검진항목 카드: 드롭다운 + 정상범위/검진결과/현재상태/권고사항 + 시계열 차트 — 기획서 p17
- 추천 성분 태그: 파란 배경 둥근 태그 리스트 — 기획서 p14
- 약사 프로필 카드: 사진 + 이름 + 약국명 + 누적 상담수 — 기획서 p15
- Admin 통계 카드: 숫자 + 전월 대비 + 상단 컬러 보더 — 기획서 p19
- 추천링크/QR 박스: URL + 링크복사/QR생성 버튼 — 기획서 p19

## 5. 공통 컴포넌트

- `Header`: PC(상단 네비) / 모바일(로고 + 햄버거)
- `MobileTabBar`: 하단 탭바 5개 (모바일만 표시)
- `Footer`: 회사정보, 약관, 고객센터
- `AuthGuard`: 권한별 라우트 보호
- `RoleToggle`: 역할 전환 토글 (헤더 내)
- `Sidebar`: 파트너/약사/Admin 좌측 사이드바
- `Toast`: 알림 메시지
- `Modal`: 공통 모달

## 6. 페이지별 기능 명세

### 메인 홈 (/)
- 히어로: "나만을 위한 완벽한 영양 배합, 의사의 진단에서 시작됩니다" + DNA 시각화 원형 (기획서 p10)
- 맞춤형 건기식 찾기 CTA 버튼
- 배너 3종: DTC유전자검사+검진결과 이중분석 / 유전자 건강 레시피 / 영양제 아무거나 (기획서 p10)
- 전문의 1:1 맞춤상담 섹션: 전문의 단체 사진 + 상담하기 + 후기 4개 (기획서 p11)

### 내 결과 (/my-results)
- 3개 입구: DTC유전자 결과 불러오기 / 건강검진 기록 불러오기 / 설문조사로 추천 받기 (기획서 p13)
- 각 클릭 시 본인인증 Mock > 결과 페이지로 이동

### DTC 유전자 결과 (/my-results/dtc)
- 건강점수 원형 게이지 (55점, 경고 뱃지) (기획서 p14)
- 3단 건강 등급: 건강해요(민혈, 시력) / 주의가 필요해요(고혈압, 당뇨, 신장질환) / 질환이 의심돼요(체중관리, 이상지질혈증, 간건강) (기획서 p14)
- 추천 성분 10개 태그 (밀크씨슬추출물, 오메가3 등) (기획서 p14)
- 유전자 마커별 상세 카드 (CYO17A1 위험, FGF5 주의, GUCY1A3 양호) (기획서 p15)
- 생활습관 개선 팁 (기획서 p15)
- "결과지 영양제 추천 상담" CTA 버튼

### 건강검진 결과 (/my-results/health-checkup)
- 동일한 건강점수/등급/추천성분 표시 (기획서 p16)
- 검진항목별 상세: 드롭다운(고혈압 등) + 정상범위/검진결과/현재상태/권고사항 (기획서 p17)
- 시계열 라인 차트 (2017~2025, 수축기 혈압 추이) (기획서 p17)
- "결과지 영양제 추천 상담" CTA 버튼

### 상담 (/consultation)
- 탭: 전문의 상담 / 약사 상담 (기획서 p15, 17)
- "잠깐! 나의 건강검진 결과는? 3분이면 확인할 수 있어요" 배너 (기획서 p17)
- "나만의 맞춤 영양제 비대면으로 쉽고 빠르게" 안내
- 약사 프로필 슬라이더 (올리브영약국 강정환 약사, 누적 상담 14회 등) (기획서 p15, 17)
- 채팅상담 / 화상상담 버튼 (기획서 p15)

### 의사 파트너센터 (/partner)
- 대시보드 통계 4개: 이번 달 추천 환자 24명 / 구매 전환율 62% / 누적 수수료 ₩186,000 / 정산 예정일 3월 25일 (기획서 p19)
- 최근 환자 목록 테이블: 환자명/검사상태/결과/추천제품/구매여부/수수료 (기획서 p19)
- 월별 수수료 추이 바 차트 (기획서 p19)
- 나의 추천 링크: https://genetichealth.co.kr/?ref=DR0042 + 링크 복사 / QR 코드 생성 (기획서 p19)

## 7. 시맨틱 ID 설계

| 페이지 | ID | 용도 |
|--------|-----|------|
| 메인 | `#hero-section`, `#banner-dtc`, `#banner-gene`, `#banner-supplement`, `#expert-consult` | 히어로, 배너3종, 전문의상담 |
| 내결과 | `#dtc-entry`, `#checkup-entry`, `#survey-entry` | 3개 입구 버튼 |
| DTC결과 | `#health-score`, `#health-grades`, `#recommended-nutrients`, `#gene-markers` | 점수, 등급, 추천성분, 마커 |
| 건강검진 | `#checkup-score`, `#checkup-detail`, `#checkup-chart` | 점수, 상세, 차트 |
| 마켓 | `#product-grid`, `#search-bar`, `#filter-panel` | 상품그리드, 검색, 필터 |
| 상담 | `#consult-tabs`, `#pharmacist-list`, `#chat-btn`, `#video-btn` | 탭, 약사목록, 상담버튼 |
| 파트너 | `#dashboard-stats`, `#patient-table`, `#revenue-chart`, `#referral-link`, `#qr-section` | 통계, 테이블, 차트, 링크, QR |
| Admin | `#admin-stats`, `#admin-sidebar` | 통계, 사이드바 |

## 8. 데이터 구조

### 사용자
```ts
{ id, name, email, phone, role: 'user'|'doctor'|'pharmacist'|'admin', profileImage, createdAt }
```

### DTC 유전자 결과
```ts
{ userId, healthScore: 55, markers: [{ gene: 'FTO', snp: 'rs9939609', category: '비만/체중', risk: 'HIGH', description, recommendation }], recommendedNutrients: string[] }
```

### 건강검진 결과
```ts
{ userId, date, items: [{ name: '공복혈당', value: 105, unit: 'mg/dL', normalRange: '70~99', status: 'caution', recommendation }], history: [{ date, value }] }
```

### 상품
```ts
{ id, name, description, price, subscriptionPrice, image, category, ingredients: string[], reviews: [] }
```

### 상담
```ts
{ id, userId, expertId, expertType: 'doctor'|'pharmacist', type: 'chat'|'video', date, status, notes }
```

### 정산
```ts
{ expertId, month, referralCount, conversionRate, totalRevenue, settlementDate, status }
```

## 9. 더미 데이터

- 사용자: 3명 (일반/의사/약사)
- DTC 유전자 결과: 12개 마커 (기획서 p6 매핑표 기반)
- 건강검진 결과: 13개 항목 (기획서 p7 매핑표 기반) + 3개년 이력
- 상품: 10개 건기식 (밀크씨슬, 오메가3, 비타민D 등)
- 약사: 5명 (프로필 + 누적 상담수)
- 의사: 3명
- 상담 예약: 5건
- 주문: 8건
- 매거진 글: 6개
- 환자 목록 (의사 대시보드): 10명
