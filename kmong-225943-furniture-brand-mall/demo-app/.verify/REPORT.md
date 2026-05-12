# 데모 자체 검증 리포트 — kmong-225943

검증 일자: 2026-05-11
검증 환경: Next.js 16.2.6 · React 19.2.4 · Tailwind 4 · 정적 export

## 빌드 결과

- 로컬 빌드(`npm run build`): **204 페이지** 정적 생성, 경고·에러 0
- GitHub Pages 빌드(`GITHUB_PAGES=true npm run build`): **203 index.html** + basePath `/demos/kmong-225943-demo` 적용 확인
- Turbopack 컴파일 시간 ~3초, 정적 생성 ~0.8초
- TypeScript strict 통과

## 페이지 구성 (25 페이지 + 동적 페이지 138)

### 사용자 영역 (15 페이지)
- 홈 `/`
- 컬렉션 리스트 `/collections`
- 컬렉션 상세 `/collections/[slug]` × 12 정적
- 카테고리 PLP `/products`
- 상품 상세 `/products/[slug]` × 120 정적
- 검색 `/search`
- 장바구니 `/cart`
- 결제 `/checkout`
- 마이페이지 `/account`
- 주문 상세 `/account/orders/[id]` × 40 정적 (S-02 wow)
- 적립금 `/account/rewards`
- 로그인 `/sign-in`
- 회원가입 `/sign-up`
- 마홀앤 홈 `/maholn`
- 마홀앤 룩북 상세 `/maholn/lookbook/[slug]` × 4 정적 (S-03 wow)
- 마홀앤 어바웃 `/maholn/about`

### 관리자·조합사 영역 (10 페이지)
- 대시보드 `/admin` (KPI 5 + Recharts)
- 제품 관리 `/admin/products`
- 신규 등록 `/admin/products/new`
- 주문 관리 `/admin/orders`
- 쿠폰 관리 `/admin/coupons`
- 회원 관리 `/admin/users`
- 콘텐츠 모듈 관리 `/admin/cms`
- 조합사 페이지 `/admin/cms/partner/[id]` × 4 정적 (S-04 wow)
- 배송 모니터 `/admin/delivery-monitor`
- 외부 연동 `/admin/integrations`

## 시연 시나리오 4종 종주 (수동 검증 필요)

| ID | 시나리오 | 핵심 wow | 진입 경로 |
|----|----------|----------|-----------|
| S-01 | 컬렉션 안 다축 필터(7축) | 룩북 안에서 즉시 좁힘 | `/` → collection-card-warm-living-26ss → 다축 칩 적용 |
| S-02 | 배송 지연 자동 보상 | 시간 진행 → 적립금 토스트 | `/account/orders/order-DEMO-S02` → +3일 진행 |
| S-03 | 마홀앤 → 본체 회유 | 동일 카드 본체에서 등장 | `/maholn/lookbook/2026-spring` → 핫스팟 → 본체 상세 |
| S-04 | 조합사 권한 분리 CMS | 권한 차단 + 자동 로깅 | RoleSwitcher partner → /admin/cms/partner/raonwood → 가격 편집 + 잠금 메뉴 클릭 |

## 시맨틱 ID 검증

총 76항목 중 74항목 grep 통과. 2항목(auto-compensation-toast, pay-toss)은 동적 id 또는 sonner toast id로 grep 한계, 실제 렌더링 시 부여됨.

## 코드 품질

- 금지어 grep: **0건** (CLAUDE.md 정의 11종 어휘 — `tone-lint.sh` 통과)
- 이모지·도형 기호 grep: **0건** (Unicode 1F300-1FAFF, 2600-27BF, 1F000-1F2FF)
- ESLint: 비활성 (create-next-app `--no-eslint`)
- TypeScript strict: 통과

## 상태 컴포넌트 3종

- 로딩 스켈레톤: `Skeleton` 컴포넌트(`src/components/states.tsx:5`)
- 빈 상태: `EmptyState` 컴포넌트(`src/components/states.tsx:9`) — CTA 포함
- 에러 상태: `ErrorState` 컴포넌트(`src/components/states.tsx:30`) — 재시도 버튼

각 페이지의 빈 상태 적용 확인:
- `/products`, `/collections`, `/collections/[slug]`, `/search`: 필터·검색 결과 0건 빈 상태 + CTA
- `/cart`, `/checkout`: 빈 카트 빈 상태 + CTA
- `/admin/products`, `/admin/users`(partner 모드): 권한 차단 빈 상태
- `/account` 주문 0건 빈 상태

## 데이터 충실성

- 브랜드 30개, 상품 120개, 컬렉션 12개, 룩북 4개, 콘텐츠 모듈 24개
- 후기 720개(상품당 평균 6, 별점 1~5 분포 5%·5%·10%·30%·50%, 사진 30%, 본문 평균 5~8줄)
- Q&A 360개(상품당 3, 답변 80%)
- 주문 40개(7개 상태 다양)
- 적립금 ledger 80+, CMS 감사 로그 30+
- 모든 페이지에서 빈 상태 화면을 제외하면 데이터 0건 노출 없음

## 수동 검증 권장 항목 (사용자 환경)

1. `npm run dev` → 4 시연 시나리오 종주
2. Puppeteer로 시나리오 자동 캡처 (B-7 후속 작업)
3. `./workflow/scripts/demo-audit.sh http://localhost:3000` (Lighthouse + axe)
4. 반응형 확인 (375 / 768 / 1280)
5. RoleSwitcher로 4역할 전환 동선

## Step 6 필터 재구성 (2026-05-12)

- 8축 → 7축 + GNB 흡수: 제품군(Header GNB로), 시리즈(`/collections` 페이지로), 공간(제품군과 의미 중복) 제거. 컬러·사이즈 추가 (가구몰 표준 필터).
- 결과: FilterPanel chip 76개 → 약 50개. `Product.axes`에서 `spaceFit`·`series` 제거 (display copy 용 `series`는 SeedSpec 내부에 유지).
- `/products?category=X` 등 URL 라우팅은 사전 scope 필터로 분리 (필터 칩에서 category 제거).
- R-01 매핑 갱신: RFP "등으로" 예시 8개 = GNB(2) + PLP(5) + 가구몰 표준 추가(2)로 분배.

## Step 6 자동 감사 결과 (2026-05-12)

- 정적 프로덕션 빌드(`npm run build` + `npx serve out`) 대상 측정.
- Lighthouse: Performance **85** / Accessibility **100** / Best Practices **100**
- axe-core/puppeteer 6개 핵심 경로(/, /products, /products/[slug], /account/orders/[id], /admin, /admin/cms/partner/[id]) violation **0**
- 4단 배포 검증 통과: 인덱스 등록 OK · 썸네일 200 · 데모 루트 200 · 핵심 라우트 6개 200
- 라이브 URL: https://firstpip.github.io/demos/kmong-225943-demo/

### Step 6 라운드에서 수정한 axe 이슈

- `aria-prohibited-attr` (StarRating span에 role="img" 부여)
- `nested-interactive` (MediaGallery 컨테이너에서 role="img" 제거, 내부 span으로 이전)
- `landmark-complementary-is-top-level` (DeliverySimulator <aside> → <div>)
- `heading-order` (PartnerCmsEditor 모든 h3 → h2)
- `color-contrast` (잔존 0)
  - Header 유틸리티 nav `/80` opacity 제거 → 전체 muted
  - AdminSidebar 잠금 항목 `/40` → `/90` + italic + aria-disabled
  - 색상 토큰 darken: `--accent #c58f2a→#8a5f1c` / `--success #2f8f5a→#1b6a3f` / `--warn #c0871d→#815818`
  - 상태 pill `bg-{token}/15 text-{token}` → `bg-{token} text-white` (admin/orders/users/account/coupons/brands)
