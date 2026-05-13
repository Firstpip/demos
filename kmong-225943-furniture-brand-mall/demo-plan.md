# 데모 구현 계획: 가구전문 브랜드 통합 쇼핑몰 (kmong-225943)

> Step 5. 10개 섹션 전수. 상세 규칙은 `.claude/skills/demo-development/SKILL.md` 자동 활성.
> 시나리오(섹션 0)부터 정의 — 페이지·컴포넌트·더미 데이터는 시나리오 클릭 경로가 요구하는 순서로 수렴.

## 0. 시연 시나리오 (4개)

클라이언트가 데모 URL을 처음 열었을 때 좌상단 역할 전환 토글로 **사용자 → 조합사 운영자 → 전체 관리자** 순서로 시점을 바꾸며 4개 시나리오를 종주한다. wow moment 후보 3종(R-05 자동 보상 / R-09 컬렉션 페이지 필터 / R-07 조합사 권한 분리)을 각 시나리오에 분배.

### S-01: 거실 가구 빠른 좁힘 — 컬렉션 안에서 다축 필터로 3개 후보 확정 (P-1)
- 페르소나: P-1 (30~40대 거실·주방 가구 구매 검토자)
- 동기: 이사 일정에 맞춰 "원목 / 오크 컬러 / 2주 내 배송"으로 단번에 좁혀 컬렉션 비교
- 관련 요구사항: R-01, R-09, R-12, R-23, R-24
- 클릭 경로: 1) `/` 홈 진입 → 2) 첫 화면 "이번 주 컬렉션" 카드(`#collection-card-warm-living-26ss`) 클릭 → 3) `/collections/warm-living-26ss` 진입 → 4) 룩북 상단 다축 필터에서 `소재=원목(오크)`·`컬러=오크`·`배송일=2주 내` 칩 선택 → 5) 결과 그리드 좁힘 → 정렬 `인기순` 토글 → 6) 카드 3개 비교 hover → 7) `Quick View` 모달로 1개 옵션 확인
- 예상 소요: 60초
- 기대 반응(wow moment): **컬렉션 페이지에 다축 필터(7축)가 그대로 살아있는 4) 단계** — 한샘몰·오늘의집·West Elm 모두 룩북은 감상용으로 두는데 우리는 룩북 안에서 즉시 좁힐 수 있다(차별화 기회 1, R-01·R-09 묶음). 칩 적용 시 좌측 카드 그리드가 200ms 페이드/슬라이드로 재배치.
- 스크린샷 계획: PDF 데모 소개 첫 컷 = 4) 단계 칩 3개 활성화된 룩북 상단. 두 번째 컷 = 6) Quick View 모달 열린 화면.

### S-02: 배송 지연 자동 보상 시뮬레이션 (P-1)
- 페르소나: P-1 (구매 후 배송 대기자)
- 동기: "지연되면 자동으로 보상받는다"는 제도가 실제로 동작하는지 사전에 눈으로 확인하고 안심하고 결제
- 관련 요구사항: R-03, R-05, R-24
- 클릭 경로: 1) S-01 후 상품 상세에서 `장바구니 → 결제` → 2) `/checkout`에서 배송 예약일 `2026-05-25` 선택 → 3) 결제 완료 → `/account/orders/{id}` 진입 → 4) 우측 "배송 시뮬레이터(데모 전용)" 패널의 `시간 진행 +3일` 버튼 클릭 → 5) 예약일 경과 → "지연 발생" 배지 + 적립금 자동 5,000P 발급 토스트 → 6) `/account/rewards`에서 적립금 내역 자동 반영 확인
- 예상 소요: 45초
- 기대 반응(wow moment): **5) 단계의 자동 보상 토스트** — 4개 경쟁사 어디에도 동일 기능 노출 없음(가구 업종 공통 통증점에도 불구하고). 시간 진행 버튼은 데모 전용 컨트롤로 명시하고 본 개발에선 Cron으로 동일 로직 동작한다는 안내 줄 한 개를 패널 하단에 부착.
- 스크린샷 계획: 한 컷에 5) 토스트 + 우측 적립금 카드 갱신을 함께 캡처.

### S-03: 마홀앤 마이크로사이트 → 본체 자연 회유 (P-2)
- 페르소나: P-2 (마홀앤 브랜드 팬, 재구매자)
- 동기: 신규 컬렉션·아카이브를 마이크로사이트에서 한 페이지에 보고 그대로 본체에서 결제
- 관련 요구사항: R-06, R-09, R-11, R-12
- 클릭 경로: 1) `/maholn` 진입 (전용 layout: 톤·헤더·타이포 분리) → 2) 메인 영상 + 신상 룩북 카드 → 3) `/maholn/lookbook/2026-spring` 진입, SNS 임베드(인스타 4컷·유튜브 1) 노출 → 4) 룩북 핫스팟 클릭 → 5) 본체 상품 상세 `/products/maholn-oak-sofa-3s`로 이동(같은 ContentModule을 본체에서도 카드 형태로 재사용) → 6) 상세 페이지 하단 "마홀앤 컬렉션 더 보기" 모듈이 마이크로사이트와 동일 카드 컴포넌트로 표시 → 7) 장바구니 추가
- 예상 소요: 50초
- 기대 반응(wow moment): **6) 단계 — 동일 룩북 카드 컴포넌트가 본체 상세 페이지에도 그대로 등장** (차별화 기회 2, 콘텐츠 모듈 재사용 시각화). 헤더는 본체로 전환되었지만 카드 디자인이 동일해 "마홀앤이 본체에 자연스럽게 흡수됐다"는 인상.
- 스크린샷 계획: 좌(3 단계 마이크로사이트 룩북) + 우(6 단계 본체 상세 하단 동일 카드) 2분할 PDF 컷.

### S-04: 조합사 권한 분리 CMS — 가격은 편집 가능, 제품 등록은 차단 (P-3)
- 페르소나: P-3 (조합사 운영자, 입점 브랜드 담당자)
- 동기: 자기 브랜드 페이지 가격·이미지를 직접 수정해 빠른 시장 반응 반영, 단 제품 신규 등록은 본체 관리자 책임이라는 권한 경계가 데모로 검증되어야 함
- 관련 요구사항: R-07, R-08, R-12, R-18
- 클릭 경로: 1) 좌상단 역할 전환 토글에서 `조합사 운영자(라온우드)` 선택 → 2) `/admin` 자동 진입, 좌측 사이드바에 `브랜드 페이지`만 활성·`제품 등록`·`주문`·`통계`는 비활성화/잠금 아이콘 → 3) `/admin/cms/partner/raonwood` 진입 → 4) 가격 셀 인라인 편집(원목 침대 1,200,000원 → 1,140,000원, WYSIWYG 보조 카피 "5월 한정 공동구매" 추가) → 5) 저장 → 본체 `/products/raonwood-oak-bed`에서 변경 즉시 반영 확인 → 6) 사이드바 비활성 항목 `제품 등록` 강제 클릭 시도 → 7) 권한 차단 모달 "조합사 권한으로는 신규 제품 등록이 불가합니다. 본체 관리자에게 요청해주세요." 표시 + 변경 이력 로그에 시도 자동 기록
- 예상 소요: 55초
- 기대 반응(wow moment): **7) 단계 권한 차단 모달 + 변경 이력 자동 기록** — 외부 비교 대상 없는 자체 차별 기능. 권한이 단순 UI 숨김이 아니라 강제 시도까지 차단되고 감사 로그가 남는다는 점을 시연.
- 스크린샷 계획: 4) 인라인 편집 컷 + 7) 차단 모달 + 우측 변경 이력 카드 동시 캡처.

## 1. 기술스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 16 App Router (static export) |
| 언어 | TypeScript 5 |
| 스타일링 | Tailwind 4 + shadcn/ui (커스텀 테마) |
| 아이콘 | Lucide React |
| 상태관리 | React Context + sessionStorage 영속화 (auth / cart / role / rewards) |
| 폼·검증 | React Hook Form + Zod |
| 더미 데이터 | `src/data/*.ts` 정적 모듈 + JSON, 클라이언트 메모리 mutation |
| 배포 | GitHub Pages (Firstpip/demos, basePath `/kmong-225943-demo`) |
| 시연 보조 | RoleSwitcher (역할 전환), 배송 시뮬레이터(시간 진행 버튼) |

## 2. 페이지 목록 및 라우팅

### 사용자 영역 (15페이지)
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 홈 | 시즌 띠배너 + "이번 주 컬렉션" 카드 + 카테고리 진입로 + MD's Pick + 마홀앤 마이크로사이트 입구 + 후기 모듈 |
| `/collections` | 컬렉션 리스트 | 12개 컬렉션 카드 그리드, 시즌·테마 탭 |
| `/collections/[slug]` | 컬렉션 상세 (룩북 + 다축 필터(7축)) | 룩북 핫스팟 + 좌측 다축 필터(7축) + 카드 그리드 + Quick View 모달 |
| `/products` | 카테고리 PLP | 다축 필터(7축) + 정렬·뷰 토글 + 무한스크롤(데모는 페이지네이션) |
| `/products/[slug]` | 상품 상세 | Tier 1+2 전수 (아래 6번 참조) |
| `/search` | 키워드 검색 결과 | 검색어 + 정렬 + 빈 상태 회유 카피 |
| `/cart` | 장바구니 | 수량 조정·쿠폰 적용·배송지 입력 |
| `/checkout` | 결제 | TossPayments mock 결제창 + 배송 예약일 선택 |
| `/account` | 마이페이지 | 주문·쿠폰·적립금·관심상품 4탭 |
| `/account/orders/[id]` | 주문 상세 + 배송 시뮬레이터 | S-02 wow moment, 배송 단계 + 시간 진행 컨트롤 |
| `/account/rewards` | 적립금 내역 | 자동 보상 발급 내역 강조 |
| `/auth/sign-in` | 로그인 | 이메일 + SNS 4종 mock (카카오·네이버·구글·애플) |
| `/auth/sign-up` | 회원가입 | 이메일·약관·SNS 동시 |
| `/maholn` | 마홀앤 마이크로사이트 홈 | 별도 layout(폰트·컬러·헤더 분리) |
| `/maholn/lookbook/[slug]` | 마홀앤 룩북 상세 | 영상 + SNS 임베드 + 핫스팟 → 본체 상품 |

### 관리자·조합사 영역 (10페이지)
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/admin` | 통계 대시보드 | KPI 5종 카드 + 7일 매출 차트 + 최근 주문/지연 알림 (조합사는 자기 브랜드만) |
| `/admin/products` | 제품 관리 (전체 관리자 전용) | 30개 조합사·120개 상품 테이블, 필터·검색 |
| `/admin/products/new` | 제품 등록 | RichTextEditor 기반 상세 설명, 다중 이미지 업로드 mock |
| `/admin/orders` | 주문 관리 | 상태별 탭, 일괄 처리 |
| `/admin/coupons` | 쿠폰 관리 | 정액/정률/배송비/세트 4종 |
| `/admin/delivery-monitor` | 배송 지연 자동 보상 모니터 | 지연 발생 건 + 자동 발급 적립금 로그 |
| `/admin/integrations` | 외부 연동 상태 | ERP·사방넷·세금계산서·물류 mock 카드 (연동 상태·동기화 로그·재시도 버튼) |
| `/admin/cms` | 페이지·콘텐츠 모듈 편집 | 홈·마이크로사이트·카테고리에서 재사용되는 ContentModule 24개 관리 |
| `/admin/cms/partner/[id]` | 조합사 페이지 편집 (조합사·전체 모두 접근, 조합사는 본인 한정) | 가격·이미지·보조 카피만 편집, 제품 등록/삭제 잠금 |
| `/admin/users` | 회원 관리 (전체 관리자 전용) | 사용자·조합사·관리자 권한 부여 |

**총 25페이지** (사용자 15 + 관리자·조합사 10)

## 3. 권한 체계

| 경로 패턴 | 비로그인 | 사용자 | 조합사 운영자 | 전체 관리자 |
|-----------|----------|--------|----------------|-------------|
| `/`, `/collections/*`, `/products/*`, `/search`, `/maholn/*` | 가능 | 가능 | 가능 | 가능 |
| `/auth/*` | 가능(guestOnly) | 차단 → `/account` | 차단 → `/admin` | 차단 → `/admin` |
| `/cart`, `/checkout`, `/account/*` | 차단 → `/auth/sign-in` (intended URL 복원) | 가능 | 가능(개인 구매 분리) | 가능 |
| `/admin` | 차단 | 차단 → `/` | 가능(자기 브랜드 통계만) | 가능 |
| `/admin/products`, `/admin/products/new`, `/admin/users` | 차단 | 차단 | 차단 → 권한 모달 | 가능 |
| `/admin/orders`, `/admin/coupons`, `/admin/integrations`, `/admin/delivery-monitor`, `/admin/cms` | 차단 | 차단 | 차단 → 권한 모달 | 가능 |
| `/admin/cms/partner/[id]` | 차단 | 차단 | 본인 브랜드만 가능 | 가능(전체) |

- AuthGuard: route group `(public)` / `(auth)` / `(member)` / `(admin)` / `(partner)` 5종
- `hydrated === true`까지 redirect 보류 (sessionStorage 복원 대기, demo-development SKILL §5 준수)
- 데모 전용 RoleSwitcher: 좌상단 토글로 비로그인 / 사용자 김지윤 / 조합사 라온우드 / 전체 관리자 4역할 즉시 전환 (시연 흐름 단축, 본 개발에서는 제거)

## 4. 디자인 시스템

기획서에 와이어프레임 없음 → Step 4 리서치(West Elm 톤 일관 + 오늘의집 친근 + 한샘몰 정보 밀도) 종합. 마홀앤 마이크로사이트는 본체보다 한 단계 더 차분·여백 넓힘으로 분리.

- 컬러
  - 본체 primary: `#5C4632` (딥 우드), accent: `#C58F2A` (머스타드)
  - 본체 neutral: bg `#FAF7F2` (off-white), text `#2A2520` (차콜), border `#E8DCC8` (웜 베이지)
  - 마홀앤 primary: `#1F1E1B` (블랙), accent: `#A89272` (샌드 골드), bg `#F5F3EE`
  - status: success `#2F8F5A`, warn `#C0871D`, error `#B23A3A` (자동 보상 토스트는 success)
- 타이포: Pretendard Variable (한글), Geist Sans (영문 보조). 제목 32/24/20/16, 본문 14, 보조 12. 행간 1.55. 마홀앤은 제목에 `letter-spacing: 0.04em` 추가.
- 톤: 라이프스타일 + 신뢰감 + 친근. 마케팅 과장 어휘 금지(CLAUDE.md 톤 규칙), 빈 상태도 회유 카피("비슷한 결과가 있는지 찾아볼게요").
- 레이아웃: max-width 1280, gutter 24/16/12 (PC/태블릿/모바일), 섹션 간격 96/64/48
- 컴포넌트 variant: Button(primary·secondary·ghost·danger), Card(elevated·outlined·flat), Input(text·search·date), Modal(default·side-drawer)
- 반응형 브레이크포인트: 1280 / 1024 / 768 / 375 (Tailwind 기본 + xl 1280)

## 5. 공통 컴포넌트

- `Header` — 시즌 띠배너 + GNB(컬렉션·카테고리·마홀앤·고객센터) + 검색 입력 + 장바구니 + 로그인 상태 + RoleSwitcher
- `MaholnHeader` — 마이크로사이트 전용 (로고·메뉴 4개·본체로 가기 링크)
- `Footer` — 회사 정보, 이용약관, 사업자 정보, SNS 4종
- `AuthGuard` — 권한 체크 + hydrated 대기 (`(member)` / `(admin)` / `(partner)` route group 적용)
- `RoleSwitcher` — 데모 전용 4역할 토글 (좌상단 sticky)
- `ProductCard` — 이미지 + 브랜드 + 제목 + 원가/할인가/쿠폰가 + 배송 뱃지 + Quick View 버튼
- `CollectionCard` — 룩북 썸네일 + 시즌·테마 라벨 + "탐색하기" CTA
- `LookbookHotspot` — 이미지 위 absolute 핫스팟 + 클릭 시 상품 모달
- `FilterPanel` — 8축 chip-button 그룹, 적용 칩 상단에 한 줄로 누적 표시 + 전체 초기화
- `SortToggle` — 인기·신상·가격↑↓ 4종
- `QuickViewModal` — PLP 카드에서 옵션 확인 + 장바구니 즉시 추가
- `ContentModule` — 마이크로사이트·본체에서 재사용되는 카드(헤드라인+이미지+CTA)
- `DeliverySimulator` — 주문 상세 우측 패널, "시간 진행 +1/+3일" 버튼 + 현재 가상시각 표시
- `RichTextEditor` — `contentEditable` 기반 경량(상품·콘텐츠 모듈·조합사 보조 카피 입력)
- `Skeleton` / `Empty` / `ErrorState` — 3종 상태 컴포넌트
- `Toast` / `Modal` / `Drawer` / `Sheet` — shadcn 기반 공통

## 6. 페이지별 기능 명세

### 홈 `/`
- 시즌 띠배너 (자동 슬라이드 3종)
- 이번 주 컬렉션 카드 4개 (S-01 진입로)
- 카테고리 진입로 8축 (소재·공간 카드)
- MD's Pick 12개
- 마홀앤 마이크로사이트 진입 배너 (S-03 진입로)
- 후기 콘텐츠 모듈 6개

### 컬렉션 상세 `/collections/[slug]` (S-01 핵심)
- 룩북 영상 또는 메인 이미지
- 룩북 핫스팟 (이미지 위 5~10개 점)
- 좌측 다축 필터(7축) 패널 (`R-01`) — 칩 적용 시 카드 페이드/슬라이드 200ms
- 결과 카드 그리드 + 정렬 + 뷰 토글
- Quick View 모달
- 빈 상태(필터 결과 0): "조건을 한 단계 풀어볼까요?" + 추천 칩 3개

### 상품 상세 `/products/[slug]` — Tier 1 + Tier 2 전수
**Tier 1 (필수)**
1. 미디어 갤러리: 메인 + 썸네일 5개 (클릭 시 메인 교체, 좌우 화살표 + 키보드 ←/→)
2. 브레드크럼: 홈 > 카테고리 > 브랜드 > 상품명
3. 기본 정보: 제목, 부제, NEW/BEST/한정 뱃지, 브랜드 링크
4. 가격: 정가·할인가·할인율·쿠폰 적용가·적립금 5종 동시 표기
5. 옵션·수량: 색상 칩 + 사이즈 드롭다운 + 수량 ± (조합 시 가격·재고 실시간 갱신, 품절 조합 비활성화)
6. CTA 2종: `장바구니`(secondary) / `바로구매`(primary)
7. 탭 4개: 상세 설명(rich-content) / 후기 / Q&A / 배송·환불
8. 관련·추천 8개 (같은 컬렉션 4 + 같은 브랜드 4)

**Tier 2 (커머스 필수)**
9. 평균 별점 + 1~5 분포 막대 그래프
10. 후기 정렬(최신·평점·도움순) + 사진 후기만 토글 + 유용해요 버튼
11. Q&A 아코디언 + `문의하기` 버튼
12. 배송·환불: 예상 도착일 계산기(우편번호 입력) + 반품·교환 조건 + A/S 안내 + 설치 옵션 가격
13. 재고: "남은 수량 N개" 표시, 5개 이하 시 "마지막 N개" 긴급성 강조, 품절 시 입고 알림 신청
14. 공유: 카카오톡 / X / 링크 복사 + 토스트
15. 구매 혜택 박스: 무료 배송 진행률 막대(70,000원 이상 무료) + 적용 가능 쿠폰 칩

**도메인 추가**
- 마홀앤 등 자체 브랜드는 하단 "브랜드 스토리" 박스 + 마이크로사이트 링크
- 룩북에서 진입한 경우 상단에 "룩북 {제목}에서 본 상품" 배지

### 주문 상세 `/account/orders/[id]` (S-02 핵심)
- 주문 단계 진행 인디케이터 (결제 → 배송 준비 → 배송 중 → 배송 완료)
- 우측 `DeliverySimulator` 패널: 현재 가상시각, +1/+3일 버튼, 데모 전용 안내
- 배송 예약일 경과 시 "지연 발생" 배지 + 자동 보상 5,000P 발급 토스트 + 적립금 카드 갱신
- 환불·교환 신청 모달

### 마홀앤 마이크로사이트 `/maholn` (S-03 핵심)
- 별도 `MaholnHeader` + `MaholnFooter` (본체와 시각 분리)
- 메인 영상 + 신상 룩북 카드 + SNS 임베드(인스타 4컷·유튜브 1)
- 본체 ContentModule 카드를 동일 컴포넌트로 표시 (브랜드 일관성)

### 조합사 CMS `/admin/cms/partner/[id]` (S-04 핵심)
- 좌측 사이드바: 권한별 활성/잠금 (조합사는 `브랜드 페이지`만 활성)
- 가격 셀 인라인 편집 (Enter 저장, Esc 취소)
- 이미지 드래그앤드롭 교체 (mock 미리보기)
- 보조 카피 RichTextEditor
- 변경 이력 카드 (시각·필드·이전값·새값)
- 차단된 메뉴 클릭 시 권한 모달 + 시도 자동 로깅

### 관리자 통계 `/admin`
- KPI 5종 카드 (analysis.md KPI-1~5)
- 7일 매출 차트 (Recharts)
- 최근 주문 10건 + 지연 알림 카드

### 외부 연동 `/admin/integrations`
- 4개 카드 (ERP·사방넷·세금계산서·물류) — 연결 상태 LED + 마지막 동기화 시각 + 동기화 로그 모달 + 재시도 버튼

### 그 외 페이지
- `/products`(카테고리 PLP), `/search`, `/cart`, `/checkout`, `/account`, `/account/rewards`, `/auth/*`, `/admin/products`, `/admin/products/new`, `/admin/orders`, `/admin/coupons`, `/admin/delivery-monitor`, `/admin/cms`, `/admin/users`, `/maholn/lookbook/[slug]`, `/collections`, `/maholn/about` — 위 핵심 5페이지의 컴포넌트·디자인 토큰을 재사용해 작성. 각 페이지는 로딩·빈·에러 상태 3종 전수 + 시맨틱 id 부여.

## 7. 시맨틱 ID 설계

스크린샷 자동화·Puppeteer 종주·시연 가이드 매핑.

| 영역 | id |
|------|-----|
| 헤더 GNB | `header-nav`, `header-search`, `cart-button`, `role-switcher` |
| 홈 컬렉션 카드 | `collection-card-{slug}` (예 `collection-card-warm-living-26ss`) |
| 마홀앤 진입 배너 | `maholn-entry-banner` |
| 다축 필터(7축) 칩 | `filter-chip-{axis}-{value}` (axis: use·brand·material·color·size·delivery·price) — 제품군은 Header GNB, 시리즈는 `/collections` 네비로 분리 |
| 적용 칩 누적 바 | `filter-applied-bar`, `filter-reset-button` |
| 정렬 토글 | `sort-toggle`, `sort-option-{key}` |
| 상품 카드 | `product-card-{slug}`, `quick-view-button-{slug}` |
| Quick View 모달 | `quick-view-modal`, `quick-view-add-cart` |
| 룩북 핫스팟 | `lookbook-hotspot-{slug}-{n}` |
| 상세 탭 | `detail-tab-description`, `detail-tab-review`, `detail-tab-qna`, `detail-tab-shipping` |
| 옵션·CTA | `option-color-{value}`, `option-size-{value}`, `qty-input`, `add-to-cart`, `buy-now` |
| 배송 시뮬레이터 | `delivery-schedule-picker`, `delivery-simulate-+1`, `delivery-simulate-+3`, `delivery-now-display`, `auto-compensation-toast` |
| 적립금 카드 | `rewards-card-balance`, `rewards-history-row-{id}` |
| 조합사 CMS | `partner-cms-edit-image`, `partner-cms-edit-price-{sku}`, `partner-cms-save`, `partner-cms-history` |
| 권한 차단 | `permission-denied-modal`, `permission-denied-action-back` |
| 통계 KPI | `admin-stat-kpi-{1..5}`, `admin-revenue-chart` |
| 외부 연동 | `integration-card-{erp|sabangnet|tax|logistics}`, `integration-sync-log` |

## 8. 데이터 구조

```ts
type Role = 'guest' | 'member' | 'partner' | 'admin'

interface Brand {
  id: string; slug: string; name: string;
  isMicrosite: boolean;       // true = maholn
  primaryColor: string; logoUrl: string;
  partnerUserIds: string[];   // 조합사 운영자 매핑
}

interface Collection {
  id: string; slug: string; title: string;
  season: '26SS' | '26FW' | 'EVERGREEN';
  heroVideoUrl?: string; heroImageUrl: string;
  hotspots: Array<{ x: number; y: number; productId: string }>;
  productIds: string[];
}

interface Product {
  id: string; slug: string; brandId: string;
  name: string; subtitle: string;
  badges: Array<'NEW' | 'BEST' | 'LIMITED'>;
  priceRegular: number; priceSale: number; rewardPoint: number;
  options: { color: string[]; size: string[] };
  stock: Record<string, number>;       // `${color}|${size}` -> qty
  axes: {
    category: string; subCategory: string;  // 네비 분류 (필터 아님)
    use: string[]; material: string[];
    deliveryDays: number;
  };
  // 필터 축 7개: use·brand(brandId)·material·color(options.color)·size(options.size)·delivery(deliveryDays)·price(priceSale)
  images: string[];
  descriptionHtml: string;             // RichTextEditor output
  rating: number; reviewCount: number;
  collectionIds: string[];
}

interface CartItem { productId: string; option: string; qty: number }

interface Order {
  id: string; userId: string;
  items: Array<CartItem & { unitPrice: number }>;
  totalPrice: number; couponDiscount: number; rewardUsed: number;
  status: 'paid' | 'preparing' | 'shipping' | 'delivered' | 'delayed' | 'refunded';
  scheduledDeliveryAt: string;        // ISO
  virtualNowAt: string;               // 데모 시뮬레이터용
  compensationIssued: boolean;
}

interface RewardLedger {
  id: string; userId: string; delta: number;
  reason: 'purchase' | 'auto-delay-compensation' | 'coupon' | 'manual';
  refOrderId?: string; createdAt: string;
}

interface Coupon {
  id: string; code: string;
  type: 'fixed' | 'percent' | 'shipping' | 'set';
  value: number; minOrder: number; expiresAt: string;
}

interface ContentModule {
  id: string; type: 'lookbook-card' | 'story' | 'banner' | 'review-quote';
  payload: Record<string, unknown>;
  usedIn: Array<'home' | 'maholn-home' | 'product-detail' | 'collection-detail'>;
}

interface CmsAuditLog {
  id: string; partnerId: string; userId: string;
  field: string; before: unknown; after: unknown;
  attemptedDeniedAction?: string;     // 권한 차단 시도 기록
  at: string;
}

interface IntegrationStatus {
  key: 'erp' | 'sabangnet' | 'tax' | 'logistics';
  state: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSyncedAt: string; logs: Array<{ at: string; level: 'info' | 'error'; msg: string }>;
}

interface User {
  id: string; role: Role; name: string; email: string;
  partnerBrandId?: string;            // partner 일 때만
}
```

## 9. 더미 데이터 구성

| 도메인 | 양 | 비고 |
|--------|----|------|
| Brand | 30 (마홀앤 포함) | 30개 조합사. 4개는 자체 브랜드, 26개는 협력 브랜드 |
| User | 22 | 사용자 15 (다양한 구매 이력) + 조합사 운영자 4 + 전체 관리자 1 + guest 토글 |
| Collection | 12 | 26SS 6 + 26FW 4 + EVERGREEN 2. 각 룩북 핫스팟 5~10 |
| Product | 120 | 브랜드당 평균 4개. 각 옵션 색상 2~4 + 사이즈 1~3 |
| Review | 평균 6/상품 = 720 | 별점 1~5 골고루 분포 (1·2점 5%·5%, 3점 10%, 4점 30%, 5점 50%), 사진 첨부 30%, 본문 평균 5~8줄 |
| Q&A | 평균 3/상품 = 360 | 답변 80% 완료 |
| Order | 40 | 상태 paid 8 / preparing 6 / shipping 8 / delivered 12 / delayed 4 / refunded 2 |
| RewardLedger | 약 80건 | 그 중 자동 보상 발급 4건은 S-02 시연용 사전 데이터 |
| Coupon | 8 | 정액 3 / 정률 2 / 배송비 2 / 세트 1 |
| ContentModule | 24 | 홈 8 + 마홀앤 6 + 상세 6 + 카테고리 4. usedIn으로 재사용 매핑 |
| Lookbook (Maholn) | 4 | 각 SNS 임베드 4컷 + 영상 1 |
| CmsAuditLog | 30 | 가격 변경 18 + 이미지 교체 8 + 권한 차단 시도 4 |
| IntegrationStatus | 4 (ERP·사방넷·세금계산서·물류) | 각 sync log 5~10건, 일부 error 상태 포함 |
| 공지 | 12 | 제목 + 본문 5~8줄 |
| FAQ | 12 | 카테고리 4종 (주문·배송·환불·계정) |

콘텐츠 충실성: 상품 설명·후기 본문·공지·FAQ 모두 평균 5~8줄, 빈 상태 화면을 제외한 어떤 페이지에서도 데이터 0건 노출 없음.

---

## 검수 전 확인

- [x] 10개 섹션(0번 시나리오 포함) 작성 완료
- [x] 시나리오 4개, 각 7항목(페르소나/동기/R-ID/클릭 경로/소요/wow moment/스크린샷 계획) 전수
- [x] wow moment 후보 3종(R-05·R-09·R-07) 시나리오에 분배
- [x] 페르소나 분포: P-1×2 / P-2×1 / P-3×1
- [x] 상품 상세 Tier 1 (1~8) + Tier 2 (9~15) 전수 항목 단위 명세
- [x] 시연 시나리오 클릭 경로 상의 모든 요소에 시맨틱 id 부여 (`#collection-card-`, `#filter-chip-`, `#delivery-simulate-`, `#partner-cms-`, `#permission-denied-modal` 등)
- [x] 더미 데이터 양 명시 (브랜드 30·상품 120·리뷰 720·주문 40 등 1~2개 샘플 금지)
- [x] R-ID 매핑: R-01·R-03·R-04·R-05·R-06·R-07·R-08·R-09·R-11·R-12·R-18·R-23·R-24가 시나리오·페이지·컴포넌트에 분배. 미커버 R-ID는 PDF·proposal에서 텍스트 설명(R-13·R-14·R-15·R-19·R-20·R-21·R-22·R-25·R-27·R-28·R-29) 또는 본 개발 영역(R-02·R-10·R-16·R-17·R-26·R-29)
- [x] 톤: 마케팅 과장 어휘 0건, 이모지 0건 (검수 명령으로 재확인 예정)
