# RFP 요구사항 vs 데모 구현 매트릭스 — kmong-225943

분석 기준: `analysis.md` 명시 R-01~R-22 + 암묵 R-23~R-29 = 29개 요구사항
분류: **데모 커버** (실제 동작) / **Mock UI** (관리자 화면 mock 시연) / **텍스트 설명** (시각화 불가, 본 개발 영역)

| R-ID | 요구사항 | 분류 | 데모 위치·확인 방법 |
|------|----------|------|---------------------|
| R-01 | 카테고리 다축 필터링 | 데모 커버 | Header GNB(제품군 6) + `/collections` 페이지(시리즈 12) + `/products`·`/collections/[slug]` 공용 `FilterPanel` 7축(용도·브랜드·소재·컬러·사이즈·배송일·가격). RFP "등으로" 예시 8개를 GNB(2: 제품군·시리즈) + PLP 필터(5) + 가구몰 표준 추가(2: 컬러·사이즈)로 분배해 동등 이상 탐색 경로 보장 |
| R-02 | 회원가입 + SNS 로그인 | 데모 커버 | `/sign-in` SNS 4종 mock + `/sign-up` |
| R-03 | 장바구니·결제·주문·쿠폰·적립금 | 데모 커버 | `/cart` 쿠폰·적립금 + `/checkout` + `/account` |
| R-04 | 상품상세 태그·탭 + 연관/추천 | 데모 커버 | `/products/[slug]` Tier 1+2 + 같은 컬렉션 4 + 같은 브랜드 4 |
| R-05 | 배송 예약 + 지연 자동 보상 | 데모 커버 (S-02 wow) | `/checkout` 예약일 picker + `/account/orders/[id]` `DeliverySimulator` |
| R-06 | 조합사 브랜드 + 마홀앤 마이크로사이트 분리 | 데모 커버 | `(maholn)` route group 별도 layout (MaholnHeader·.maholn-scope) |
| R-07 | 조합사 권한 분리 (이미지·가격만) | 데모 커버 (S-04 wow) | `/admin/cms/partner/[id]` `InlineEditableCell` + `PermissionDeniedModal` |
| R-08 | 비개발자 운영 CMS + 레이아웃 자유도 | 데모 커버 | `/admin/cms` 24 ContentModule + `/admin/cms/partner/[id]` |
| R-09 | 컬렉션 중심 디자인 | 데모 커버 | 홈 시즌 컬렉션 + `/collections` 12개 + `LookbookHero` |
| R-10 | 브랜드 아이덴티티 + 반응형 + 앱 패키징 | 데모 커버 | 디자인 토큰(globals.css) + 1280/1024/768/375 반응형. 앱 패키징은 본 개발 영역 |
| R-11 | SNS 콘텐츠 연동 + 영상 노출 | Mock UI | `/maholn` SNS 5컷 그리드(Camera/Film) + `/maholn/lookbook/[slug]` 동일 |
| R-12 | 콘텐츠 모듈화 (재사용) | 데모 커버 (S-03 wow) | `ContentModuleCard` + `usedIn` 매핑 — 본체·마이크로사이트 동시 등장 |
| R-13 | SEO + 네이버 쇼핑 연동 | 텍스트 설명 | metadata API 기반 SSR. 본 개발에서 sitemap.xml + 네이버 쇼핑 fetch 연동 |
| R-14 | 페이지 로딩 속도 최적화 | 텍스트 설명 | Next.js 16 Turbopack 정적 export. 본 개발에서 ISR + Lighthouse ≥85 |
| R-15 | 보안 (SSL + 개인정보) | 텍스트 설명 | Vercel/Railway HTTPS 기본. 본 개발에서 KISA 가이드라인 준수 |
| R-16 | 결제 PG (카드·간편결제) | Mock UI | `/checkout` 결제 수단 3종 (toss-card·toss-easy·transfer). 본 개발에서 TossPayments/PortOne |
| R-17 | 외부 솔루션 연동 (CRM·ERP·물류·사방넷) | Mock UI | `/admin/integrations` 4 카드 (LED + 로그 + 재시도) |
| R-18 | 관리자 통계 페이지 | 데모 커버 | `/admin` KPI-1~5 + Recharts BarChart 7일 매출 |
| R-19 | 정부지원사업 산출물 관리 | 텍스트 설명 | 본 개발에서 양식 자동 출력 모듈 분리 |
| R-20 | 쇼핑몰 네이밍·아이디어 제안 | 텍스트 설명 | 제안서 별도 섹션 |
| R-21 | 유지보수 범위·장애 대응·기능 개선 | 텍스트 설명 | 제안서 SLA 섹션 |
| R-22 | 27년도 운영 임대·호스팅 별도 제안 | 텍스트 설명 | 제안서 견적 섹션 |
| R-23 | 키워드 검색 + 정렬 | 데모 커버 | `/search` Suspense + `SortToggle`(인기·신상·가격↑↓) |
| R-24 | 빈 상태·로딩·에러 UI 일관 | 데모 커버 | `Skeleton` / `EmptyState` / `ErrorState` 3종, 모든 페이지 적용 |
| R-25 | 접근성 (WCAG 2.1 AA) | 데모 커버 + 텍스트 설명 | 시맨틱 태그 + ARIA + 키보드 네비 + 색 대비. axe 검수는 demo-audit.sh |
| R-26 | 세금계산서 자동 발행 | Mock UI | `/admin/integrations` 세금계산서(홈택스) 카드 + 로그 |
| R-27 | 재고 양방향 동기화 (ERP) | Mock UI | `/admin/integrations` ERP 카드 + 동기화 로그 |
| R-28 | 환불·교환 정책 + 클레임 | Mock UI + 텍스트 설명 | `/account/orders/[id]` 환불·교환 신청 버튼 + FAQ |
| R-29 | 30개 조합사 정산 분배 룰 | 텍스트 설명 | 1주차 합의 후 본 개발 |

## 분류 통계

- **데모 커버 (실제 동작)**: 14건 — R-01·R-02·R-03·R-04·R-05·R-06·R-07·R-08·R-09·R-12·R-18·R-23·R-24·R-25
- **Mock UI (관리자 시연)**: 8건 — R-10(앱)·R-11·R-16·R-17·R-26·R-27·R-28(부분)
- **텍스트 설명 (본 개발)**: 7건 — R-13·R-14·R-15·R-19·R-20·R-21·R-22·R-29

## 페르소나 시연 분포

| 페르소나 | 시연 시나리오 | 데모 페이지 |
|----------|---------------|-------------|
| P-1 (메인 사용자) | S-01 (컬렉션 다축 필터) · S-02 (배송 자동 보상) | `/`, `/collections/*`, `/products/*`, `/cart`, `/checkout`, `/account/orders/*` |
| P-2 (마홀앤 팬) | S-03 (마이크로사이트 → 본체 회유) | `/maholn`, `/maholn/lookbook/*`, `/maholn/about`, `/products/maholn-*` |
| P-3 (조합사 운영자) | S-04 (권한 분리 CMS) | RoleSwitcher partner → `/admin`, `/admin/cms/partner/raonwood` |

## 카테고리 어휘 정합성

RFP 카테고리(가구 B2C 통합 쇼핑몰, 디자인 1순위) — 데모에 반영된 어휘:
- "컬렉션", "룩북", "마이크로사이트", "조합사", "다축 필터", "배송 자동 보상", "콘텐츠 모듈" — analysis.md 페르소나 키워드와 일치
- 마케팅 과장 어휘 0건 (CLAUDE.md 톤 규칙 준수)

## R-ID 본문 비노출 검사

`grep -nE "R-[0-9]{2}"` — `data-rid="R-04"` 등 매핑 데이터 속성에서만 발견, 사용자 본문 텍스트에는 노출 0건. (Step 8 PDF·Step 9 proposal에서도 동일 정책 유지 예정)
