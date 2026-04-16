# 데모 구현 계획: 인플루언서 역직구 커머스 플랫폼

---

## 1. 기술스택

- **프레임워크**: Next.js 15 (App Router, Static Export)
- **스타일링**: Tailwind CSS 4 + shadcn/ui
- **차트**: Recharts
- **아이콘**: Lucide React
- **배포**: GitHub Pages (Firstpip/demos 리포, `/demos/kmong-225624-demo/`)
- **로컬 PDF 캡처**: localhost (basePath 없음)

> 제안 기술스택은 Next.js + FastAPI + Lightsail이지만, 데모는 GitHub Pages 배포를 위해 Next.js Static Export로 구현.
> 프론트엔드 구조를 그대로 유지하므로 마이그레이션 용이.

---

## 2. 페이지 목록 및 라우팅

### 소비자 웹 (반응형, 모바일 퍼스트)

| # | 경로 | 페이지 | 설명 | 시맨틱 ID |
|---|------|--------|------|-----------|
| 1 | `/` | 메인 | 히어로, 추천 상품, 인기 인플루언서 | `#home-hero`, `#home-products`, `#home-influencers` |
| 2 | `/products` | 상품 목록 | 카테고리/검색/필터/정렬, 그리드 | `#product-list`, `#product-filter`, `#product-search` |
| 3 | `/products/[id]` | 상품 상세 | 이미지, 가격, 리뷰, 관련 인플루언서 | `#product-detail`, `#product-reviews`, `#product-influencer` |
| 4 | `/influencer/[id]` | 인플루언서 브릿지 | 프로필 + 추천상품 리스트 | `#bridge-profile`, `#bridge-products` |
| 5 | `/cart` | 장바구니 | 상품 목록, 수량 조절, 할인코드 적용 | `#cart-items`, `#cart-summary`, `#cart-coupon` |
| 6 | `/checkout` | 주문/결제 | 배송지, 결제수단, 주문요약 | `#checkout-form`, `#checkout-payment`, `#checkout-summary` |
| 7 | `/order-complete` | 주문 완료 | 주문번호, 요약 | `#order-complete` |
| 8 | `/mypage` | 마이페이지 | 주문 내역, 배송 추적, 리뷰 관리 | `#mypage-orders`, `#mypage-tracking`, `#mypage-reviews` |
| 9 | `/login` | 로그인 | 이메일/비밀번호 + 데모 안내 | `#login-form`, `#login-demo-notice` |
| 10 | `/signup` | 회원가입 | 가입 폼 | `#signup-form` |

### 인플루언서 대시보드 (영문, 보라 테마 #6366f1)

| # | 경로 | 페이지 | 설명 | 시맨틱 ID |
|---|------|--------|------|-----------|
| 11 | `/influencer/dashboard` | Dashboard | 매출 차트, KPI 카드, 최근 활동 | `#inf-dashboard`, `#inf-kpi`, `#inf-chart` |
| 12 | `/influencer/earnings` | Earnings | 수수료 상세, 정산 이력, 정산 타임라인 | `#inf-earnings`, `#inf-settlement-history` |
| 13 | `/influencer/links` | My Links | 딥링크 생성/관리, 클릭/전환 통계 | `#inf-links`, `#inf-link-create` |
| 14 | `/influencer/products` | Products | 추천 가능 상품 목록, 커미션율 | `#inf-products` |
| 15 | `/influencer/settings` | Settings | 프로필 설정, Payoneer 연결 | `#inf-settings`, `#inf-payoneer` |

### 공급사 어드민 (틸 테마 #0d9488)

| # | 경로 | 페이지 | 설명 | 시맨틱 ID |
|---|------|--------|------|-----------|
| 16 | `/vendor/dashboard` | 대시보드 | 판매 현황, 매출 차트, 알림 | `#vendor-dashboard`, `#vendor-chart` |
| 17 | `/vendor/products` | 상품 관리 | CRUD, 재고, 상태 관리 | `#vendor-products`, `#vendor-product-form` |
| 18 | `/vendor/orders` | 주문/판매 내역 | 주문 목록, 상태, 배송 관리 | `#vendor-orders` |
| 19 | `/vendor/settlements` | 정산 관리 | 인플루언서별 수수료 컨펌, 정산 명세 | `#vendor-settlements`, `#vendor-confirm` |
| 20 | `/vendor/settings` | 설정 | 업체 정보, 계좌 설정 | `#vendor-settings` |

### 통합 관리자 (블루 테마 #0d6efd)

| # | 경로 | 페이지 | 설명 | 시맨틱 ID |
|---|------|--------|------|-----------|
| 21 | `/admin/dashboard` | 대시보드 | 전체 GMV, 주문수, 사용자수, 차트 | `#admin-dashboard`, `#admin-kpi`, `#admin-chart` |
| 22 | `/admin/users` | 사용자 관리 | 소비자/인플루언서/공급사 목록, 상태 | `#admin-users` |
| 23 | `/admin/products` | 상품 관리 | 전체 상품 목록, 승인/반려 | `#admin-products` |
| 24 | `/admin/matching` | 매칭 관리 | 인플루언서-상품-공급사 매칭 | `#admin-matching` |
| 25 | `/admin/orders` | 주문 관리 | 전체 주문 목록, 상태 관리 | `#admin-orders` |
| 26 | `/admin/settlements` | 정산 관리 | 환율 설정, 글로벌 정산, Step Indicator | `#admin-settlements`, `#admin-exchange-rate` |
| 27 | `/admin/promotions` | 프로모션 관리 | 할인코드 CRUD, 사용 현황 | `#admin-promotions` |
| 28 | `/admin/reports` | 리포트 | 일자별/인플루언서별/공급사별 매출 | `#admin-reports`, `#admin-report-filter` |
| 29 | `/admin/categories` | 카테고리 관리 | 카테고리 트리 CRUD | `#admin-categories` |

**총 29페이지**

---

## 3. 권한 체계

| 라우트 패턴 | 접근 권한 | AuthGuard |
|------------|----------|-----------|
| `/login`, `/signup` | 비로그인 전용 | guest-only (로그인 시 리다이렉트) |
| `/`, `/products`, `/products/[id]`, `/influencer/[id]` | 공개 | none |
| `/cart`, `/checkout`, `/order-complete`, `/mypage` | 로그인 필요 | auth-required |
| `/influencer/dashboard~settings` | 인플루언서 역할 | role:influencer |
| `/vendor/dashboard~settings` | 공급사 역할 | role:vendor |
| `/admin/dashboard~categories` | 관리자 역할 | role:admin |

**역할 전환 토글**: 헤더 우측에 역할 전환 드롭다운 (consumer/influencer/vendor/admin)

---

## 4. 디자인 시스템

### 컬러 팔레트

| 용도 | 소비자 웹 | 인플루언서 | 공급사 | 관리자 |
|------|-----------|-----------|--------|--------|
| Primary | #2563EB (블루) | #6366F1 (인디고) | #0D9488 (틸) | #0D6EFD (로열블루) |
| Background | #FFFFFF | #F8FAFC | #F8FAFC | #F8FAFC |
| Sidebar | — | #1E1B4B (다크인디고) | #134E4A (다크틸) | #1E3A5F (다크블루) |
| Text | #111827 | #1E293B | #1E293B | #1E293B |
| Muted | #6B7280 | #64748B | #64748B | #64748B |
| Border | #E5E7EB | #E2E8F0 | #E2E8F0 | #E2E8F0 |
| Success | #10B981 | #10B981 | #10B981 | #10B981 |
| Warning | #F59E0B | #F59E0B | #F59E0B | #F59E0B |
| Error | #EF4444 | #EF4444 | #EF4444 | #EF4444 |

### 폰트
- 한글: Pretendard (지그재그 참고)
- 영문/숫자: Inter
- 금액 (테이블): JetBrains Mono (monospace)

### 타이포그래피 스케일
- h1: 28px/700, h2: 24px/700, h3: 20px/600, h4: 16px/600
- body: 14px/400, small: 12px/400, caption: 11px/400

---

## 5. 공통 컴포넌트

- **ConsumerHeader**: 로고, 검색, 카테고리, 장바구니, 로그인/사용자명, 역할 전환 토글
- **ConsumerFooter**: 회사 정보, 약관, 카테고리 링크
- **MobileBottomNav**: 홈/카테고리/검색/장바구니/마이페이지 (모바일 전용)
- **AdminLayout**: 다크 사이드바 + 라이트 콘텐츠, 사이드바 메뉴, 헤더(알림/프로필)
- **AuthGuard**: 역할 기반 라우트 보호
- **DataTable**: TanStack Table 패턴 (정렬, 필터, 페이지네이션, 벌크 액션)
- **KPICard**: 아이콘 + 수치 + 변화율 + 스파크라인
- **StatusBadge**: 초록(완료)/노랑(대기)/빨강(오류)/회색(취소)
- **CustomSelect**: 네이티브 select 대체 커스텀 드롭다운
- **Toast**: 액션 피드백 알림
- **Modal**: 확인/취소 모달, 폼 모달

---

## 6. 페이지별 기능 명세

### 소비자 웹

**1. 메인 (`/`)**
- 히어로 배너 (프로모션/이벤트 슬라이드)
- 인기 인플루언서 PICK 상품 (가로 캐러셀)
- 카테고리별 추천 상품 (2x2 그리드)
- 인기 인플루언서 프로필 카드 (가로 스크롤)

**2. 상품 목록 (`/products`)**
- 카테고리 필터 (탭 또는 사이드)
- 검색 바 (실시간 필터링)
- 정렬 (인기순/최신순/가격순/할인율순)
- 상품 카드: 이미지 + 브랜드 + 상품명 + 가격 + 할인율 + 추천 인플루언서 뱃지
- 무한 스크롤 또는 페이지네이션

**3. 상품 상세 (`/products/[id]`)**
- 상품 이미지 갤러리 (슬라이더)
- 가격, 할인, 옵션 선택
- 장바구니 추가 / 바로 구매
- 상품 설명 탭
- 리뷰/평점 (별점 + 텍스트)
- "이 상품을 추천한 인플루언서" 섹션

**4. 인플루언서 브릿지 (`/influencer/[id]`)**
- 인플루언서 프로필 (프로필 이미지, 이름, 소개, SNS 링크)
- 추천 상품 리스트 (그리드)
- "OOO's PICK" 스타일 큐레이션

**5. 장바구니 (`/cart`)**
- 상품 목록 (이미지, 이름, 옵션, 수량 +--, 가격, 삭제)
- 할인코드 입력 + 적용
- 주문 요약 (소계, 배송비, 할인, 총액)
- 결제하기 버튼

**6. 주문/결제 (`/checkout`)**
- 배송지 입력 (이름, 전화번호, 주소, 우편번호)
- 결제수단 선택 (카드/간편결제 Mock)
- 주문 상품 요약
- 최종 결제 금액
- 결제하기 버튼 → 결제 시뮬레이션 → 주문완료로 이동

**7. 주문 완료 (`/order-complete`)**
- 주문번호, 결제 완료 안내
- 주문 상품 요약
- 마이페이지/계속 쇼핑 버튼

**8. 마이페이지 (`/mypage`)**
- 탭: 주문 내역 / 배송 추적 / 리뷰 관리
- 주문 내역: 주문 목록 테이블 (날짜, 상품, 금액, 상태)
- 배송 추적: 주문별 배송 상태 스텝 (주문확인 > 준비중 > 배송중 > 배송완료)
- 리뷰 관리: 작성 가능/작성 완료 리뷰

### 인플루언서 대시보드 (영문)

**11. Dashboard**
- KPI 카드: Total Earnings, Clicks, Conversions, Conversion Rate
- 매출 차트 (월별 선그래프)
- 최근 주문 목록
- 상위 상품 TOP 5

**12. Earnings**
- 정산 이력 테이블 (기간, 금액, 상태, 환율)
- 정산 타임라인 Step Indicator (Pending > Processing > Completed)
- 수수료 상세 (상품별 커미션율, 판매수량, 수수료액)

**13. My Links**
- 딥링크 목록 (URL, 생성일, 클릭수, 전환수, 수익)
- 새 딥링크 생성 모달 (상품 선택 → URL 생성)
- 링크 복사 버튼

**14. Products**
- 추천 가능 상품 목록 (이미지, 이름, 가격, 커미션율)
- 카테고리 필터
- "Generate Link" 버튼

**15. Settings**
- Profile: 이름, 이메일, SNS 링크
- Payout: Payoneer 연결 상태 (Mock UI), 계좌 정보
- Notifications: 이메일/알림 설정

### 공급사 어드민

**16. 대시보드**
- KPI 카드: 총 매출, 주문수, 인플루언서 수, 평균 수수료율
- 매출 차트 (일별/월별)
- 최근 주문
- 인플루언서별 매출 TOP 5

**17. 상품 관리**
- 상품 테이블 (이미지, 이름, 카테고리, 가격, 재고, 상태)
- 상품 추가/수정 모달 (이미지 업로드 Mock, 이름, 설명, 가격, 카테고리, 재고)
- 상태 변경 (판매중/품절/숨김)

**18. 주문/판매 내역**
- 주문 테이블 (주문번호, 고객, 상품, 금액, 상태, 날짜)
- 주문 상세 모달
- 배송 상태 업데이트

**19. 정산 관리**
- 인플루언서별 수수료 테이블 (인플루언서, 매출, 수수료율, 수수료액, 상태)
- 수수료 컨펌 버튼 (승인/거부)
- 정산 명세서 미리보기 (Gross - 반품 = Net * 수수료율)

**20. 설정**
- 업체 정보 (회사명, 사업자번호, 대표자)
- 계좌 정보 (은행, 계좌번호)
- 알림 설정

### 통합 관리자

**21. 대시보드**
- KPI 카드: 총 GMV, 총 주문수, 활성 인플루언서, 활성 공급사
- GMV 추이 차트 (월별)
- 인플루언서별/공급사별 매출 파이 차트
- 최근 활동 로그

**22. 사용자 관리**
- 탭: 소비자 / 인플루언서 / 공급사
- 사용자 테이블 (이름, 이메일, 역할, 가입일, 상태)
- 상태 변경 (활성/비활성/정지)
- 상세 모달

**23. 상품 관리**
- 전체 상품 테이블 (공급사명 포함)
- 승인/반려 액션

**24. 매칭 관리**
- 인플루언서-상품-공급사 매칭 테이블
- 새 매칭 생성 (인플루언서 선택 → 상품 선택 → 수수료율 설정)
- 매칭 상태 (활성/비활성)

**25. 주문 관리**
- 전체 주문 테이블
- 필터: 날짜, 상태, 인플루언서, 공급사
- 주문 상세 (인플루언서 귀속 정보 포함)

**26. 정산 관리**
- Step Indicator: 매출집계 > 수수료산정 > 공급사컨펌 > 관리자승인 > 지급실행
- 환율 설정 (USD/KRW, 수동/자동)
- 정산 배치 목록 (기간, 대상, 총액, 상태)
- Payoneer 정산 처리 (Mock UI: 정산 대상 목록 → 일괄 지급 실행)
- Reconciliation (매칭율, 불일치 항목)

**27. 프로모션 관리**
- 할인코드 테이블 (코드, 할인율/금액, 유효기간, 사용횟수)
- 할인코드 생성/수정 모달
- 인플루언서 전용 코드 자동 생성

**28. 리포트**
- 필터: 기간, 인플루언서, 공급사
- 탭: 일자별 / 인플루언서별 / 공급사별
- 매출/주문/수수료 차트 + 테이블
- 리포트 다운로드 (Mock)

**29. 카테고리 관리**
- 카테고리 트리 (드래그로 순서 변경 Mock)
- 추가/수정/삭제

---

## 7. 시맨틱 ID 설계

위 페이지 목록의 시맨틱 ID 열 참조. 추가 규칙:
- 페이지 컨테이너: `#page-{페이지명}` (예: `#page-home`, `#page-admin-dashboard`)
- 섹션: `#{영역}-{섹션명}` (예: `#home-hero`, `#inf-kpi`)
- 버튼: `#btn-{액션}` (예: `#btn-add-to-cart`, `#btn-generate-link`)
- 모달: `#modal-{이름}` (예: `#modal-product-form`, `#modal-order-detail`)
- 테이블: `#table-{이름}` (예: `#table-orders`, `#table-settlements`)

---

## 8. 데이터 구조

### 주요 엔티티

```typescript
// 사용자
User { id, name, email, role: 'consumer'|'influencer'|'vendor'|'admin', avatar, createdAt }

// 인플루언서 프로필
InfluencerProfile { userId, bio, snsLinks: {instagram, youtube, tiktok}, followers, payoneerStatus }

// 공급사
Vendor { id, companyName, businessNumber, representative, bankAccount }

// 카테고리
Category { id, name, parentId, order }

// 상품
Product { id, vendorId, name, description, price, discountRate, images[], categoryId, stock, status }

// 딥링크
DeepLink { id, influencerId, productId, url, shortUrl, clicks, conversions, createdAt }

// 주문
Order { id, userId, items: OrderItem[], shippingAddress, totalAmount, discountAmount, status, influencerId, createdAt }
OrderItem { productId, vendorId, quantity, price, influencerId }

// 정산
Settlement { id, period, type: 'influencer'|'vendor', targetId, grossSales, returns, netSales, commissionRate, commission, exchangeRate, status }

// 할인코드
Promotion { id, code, type: 'percentage'|'fixed', value, influencerId, validFrom, validTo, usageCount, maxUsage }

// 리뷰
Review { id, userId, productId, rating, content, createdAt }
```

---

## 9. 더미 데이터 구성

| 엔티티 | 수량 | 비고 |
|--------|:---:|------|
| 소비자 | 10명 | 한국어 이름 |
| 인플루언서 | 6명 | 영문 이름, SNS 프로필 |
| 공급사 | 4개 | 한국 업체명 |
| 카테고리 | 8개 | 패션, 뷰티, 식품, 전자기기, 홈리빙, 스포츠, 키즈, 기타 |
| 상품 | 40개 | 카테고리별 5개, 이미지(placeholder) |
| 딥링크 | 20개 | 인플루언서별 3~4개 |
| 주문 | 30건 | 다양한 상태 |
| 정산 | 12건 | 월별, 다양한 상태 |
| 할인코드 | 8개 | 인플루언서 전용 4개 + 일반 4개 |
| 리뷰 | 25개 | 상품별 2~5개, 별점 3~5 |

---

## 10. 인터랙션 목록 (검증용)

### 소비자 웹
- [ ] 히어로 배너 슬라이드 (자동/수동)
- [ ] 상품 카드 클릭 → 상품 상세 이동
- [ ] 인플루언서 카드 클릭 → 브릿지 페이지 이동
- [ ] 카테고리 탭 클릭 → 상품 필터링
- [ ] 검색 입력 → 실시간 필터링
- [ ] 정렬 드롭다운 변경 → 정렬 적용
- [ ] 장바구니 추가 → 토스트 + 카운트 업데이트
- [ ] 장바구니 수량 변경 → 금액 재계산
- [ ] 할인코드 적용 → 할인액 반영
- [ ] 결제하기 → 결제 시뮬레이션 → 주문완료
- [ ] 마이페이지 탭 전환
- [ ] 리뷰 작성 모달
- [ ] 로그인/회원가입 폼 제출
- [ ] 역할 전환 드롭다운

### 인플루언서 대시보드
- [ ] 차트 기간 변경 (7d/30d/90d)
- [ ] 딥링크 생성 모달 → URL 생성 → 복사
- [ ] 정산 이력 상세 보기
- [ ] 프로필 수정 폼
- [ ] Payoneer 연결 버튼 (Mock)

### 공급사 어드민
- [ ] 상품 추가/수정 모달
- [ ] 상품 상태 변경
- [ ] 주문 상세 모달
- [ ] 배송 상태 업데이트
- [ ] 수수료 승인/거부

### 통합 관리자
- [ ] 사용자 탭 전환 (소비자/인플루언서/공급사)
- [ ] 사용자 상태 변경
- [ ] 매칭 생성 모달
- [ ] 환율 설정 폼
- [ ] 정산 Step 진행
- [ ] 할인코드 생성/수정 모달
- [ ] 리포트 필터 변경 → 차트/테이블 업데이트
- [ ] 카테고리 추가/수정/삭제
- [ ] 상품 승인/반려
