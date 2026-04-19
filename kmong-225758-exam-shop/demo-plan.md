# 데모 구현 계획: 모의고사 서적 판매 쇼핑몰

## 1. 기술스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 15 (App Router, static export) |
| 스타일링 | Tailwind CSS + shadcn/ui |
| 상태관리 | React Context (장바구니, 인증) |
| 배포 | GitHub Pages (Firstpip/demos) |
| 아이콘 | Lucide React |

## 2. 페이지 목록 및 라우팅

### 사용자 영역
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 메인 | 배너, 베스트셀러, 신간, 후기 |
| `/products` | 상품 리스트 | 과목별/학년별 필터, 검색, 정렬 |
| `/products/[id]` | 상품 상세 | 정보, 이미지, 후기, 관련 상품 |
| `/cart` | ��바구니 | 수량 변경, 삭제, 총액 계산 |
| `/checkout` | 주문/결제 | 배송지 입력, PG 결제 Mock |
| `/order-complete` | 주문 완료 | 주문 확인 정보 |
| `/login` | 로그인 | 데모 안내 문구, 헤더 숨김 |
| `/signup` | 회원가입 | Mock 회원가입 폼 |
| `/mypage` | 마이페이지 | 주문내역, 회원정보, 후기관리 |
| `/mypage/orders` | 주문내역 | 주문 목록, 상태 표시 |
| `/mypage/reviews` | 내 후기 | 작성한 후기 관리 |
| `/resources` | 자료실 | 교재별 보충자료 다운로드 목록 |
| `/notice` | 공지사항 | 공지 목록 |
| `/notice/[id]` | 공지 상세 | 공지 내용 |
| `/faq` | FAQ | 아코디언 FAQ |

### 관리자 영역
| 경로 | 페���지 | 설명 |
|------|--------|------|
| `/admin` | 대시보드 | 매출, 주문, 회원 통계 차��� |
| `/admin/products` | 상품 관리 | 상품 CRUD 테이블 |
| `/admin/products/new` | 상품 등록 | 상품 등록 폼 |
| `/admin/products/[id]` | 상품 수정 | 상품 수정 폼 |
| `/admin/orders` | 주문 관리 | 주문 목록, 상태 변경 |
| `/admin/orders/[id]` | 주문 상세 | 주문 상세 + 배송 처리 |
| `/admin/members` | 회원 관리 | 회원 목록, 검색 |
| `/admin/reviews` | 후��� 관리 | 후기 승인/삭제 |
| `/admin/resources` | 자료실 관리 | 자료 업로드/삭제 |
| `/admin/notices` | 공지 관리 | 공지 CRUD |
| `/admin/settings` | 쇼핑몰 설정 | PG 연동 상태(Mock), 기본 설정 |

**총 26페이지** (사용자 15 + 관리자 11)

## 3. 권한 체계

| 권한 | 라우트 | 동작 |
|------|--------|------|
| 공개 | `/`, `/products`, `/products/[id]`, `/resources`, `/notice`, `/faq` | 누구나 접근 |
| 비로그인 전용 | `/login`, `/signup` | 로그인 시 메인으로 리다이렉트 |
| 로그인 필요 | `/cart`, `/checkout`, `/mypage/**` | 미로그인 시 로그인 페이지로 |
| 관리자 전용 | `/admin/**` | 관리자 역할만 접근 |

- 헤더에 역할 전환 토글: 일반회원 / 관리자

## 4. 디자인 시스템

### 컬러
| 용도 | 색상 | 코드 |
|------|------|------|
| Primary | 네이비 | #1B2A4A |
| Primary Light | 밝은 네이비 | #2D4A7A |
| Accent | 코랄 오렌지 | #E8653A |
| Success | 그린 | #22C55E |
| Warning | 옐로우 | #F59E0B |
| Error | 레드 | #EF4444 |
| Background | 화이트 | #FFFFFF |
| Surface | 밝은 그레이 | #F8FAFC |
| Border | 그레이 | #E2E8F0 |
| Text Primary | 다크 그레이 | #1E293B |
| Text Secondary | 미디엄 그레이 | #64748B |

### 폰트
- 기본: Pretendard (한글 가독성)
- 숫자/가격: Pretendard (탭 숫자 지원)

### 컴포넌트 스타일
- 카드: 둥근 모서리(8px), 그림자(sm), hover 시 그림자 확대
- 버튼: Primary(네이비), Accent(코랄), Ghost, 둥근 모서리(6px)
- 인풋: 보더 스타일, focus 시 Primary 보더
- 테이블: 스트라이프 행, 정렬된 헤더

## 5. 공통 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| Header | 로고, 네비게이션, 검색, 장바구니 아이콘, 로그인/사용자명, 역할 전환 |
| Footer | 회사정보, 고객센터, 링크, 저작권 |
| AuthGuard | 권한별 라우트 보호 |
| AdminLayout | 관리자 사이드바 + 헤더 |
| ProductCard | 상품 썸네일, 제목, 가격, 할인율 |
| ReviewCard | 별점, 작성자, 내용, 날짜 |
| Pagination | 페이지네이션 |
| SearchBar | 검색 인풋 + 카테고리 필터 |
| Badge | 상태 뱃지 (배송중, 결제완료 등) |
| Toast | 알림 토스트 |
| Modal | 확인/취소 모달 |
| CustomSelect | 커스텀 스타일 셀렉트 |

## 6. 페이지별 기능 명세

### 메인 (/)
- 히어로 배너 슬라이더 (3장)
- 베스트셀러 섹션 (8개 상품 그리드)
- 신간 교재 섹션 (8개 상품 그리드)
- 과목별 카테고리 아이콘 그리드
- 최신 후기 섹션 (4개)
- 공지사항 미리보기 (3개)

### 상품 리스트 (/products)
- 과목별 필터 탭 (국어, 영어, 수학, 사회, 과학, 기타)
- 학년별 필터 (고1, 고2, 고3)
- 정렬 (인기순, 최신순, 가격순, 할인순)
- 검색 바
- 상품 그리드 (4열) + 페이지네이션
- 필터 적용 시 URL 파라미터 업데이트

### 상품 상세 (/products/[id])
- 상품 이미지 (메인 + 썸네일)
- 상품 정보 (제목, 저자, 출판사, 가격, 할인가, 적립금)
- 수량 선택 + 장바구니/바로구매 버튼
- 탭: 상세 설명 / 후기 / 배송 안내
- 후기 목록 + 별점 평균
- 관련 상품 추천 (4개)

### 장바구니 (/cart)
- 상품 목록 (이미지, 제목, 수량 변경, 가격)
- 전체 선택/개별 선택 체크박스
- 선택 삭제
- 총 결제금액 계산 (상품금액 + 배송비)
- 주문하기 버튼

### 주문/결제 (/checkout)
- 배송 정보 폼 (이름, 연락처, 주소, 메모)
- 주문 상품 요약
- 결제 수단 선택 (카드/계좌이체/가상계좌) — Mock
- 총 결제금액
- 결제하기 버튼 → 주문 완료 페이지로 이동

### 마이페이지 (/mypage)
- 회원 정보 요약
- 주문 현황 (최근 5건)
- 적립금/쿠폰
- 최근 본 상품

### 관리자 대시보드 (/admin)
- 오늘 매출/주문/신규회원 카드
- 주간 매출 차트 (막대)
- 월간 주문 추이 (라인)
- 최근 주문 5건 테이블
- 인기 상품 Top 5

### 관리자 상품 관리 (/admin/products)
- 상품 테이블 (이미지, 제목, 가격, 재고, 상태)
- 검색/필터
- 상품 등록/수정/삭제
- 재고 상태 뱃지

### 관리자 주문 관리 (/admin/orders)
- 주문 테이블 (주문번호, 주문자, 금액, 상태, 날짜)
- 상태 필터 (전체/결제완료/배송준비/배송중/배송완료)
- 주문 상세 → 배송 상태 변경, 운송장 입력(Mock)

### 관리자 쇼핑몰 설정 (/admin/settings)
- PG 연동 상태 (Mock: 토스페이먼츠 연동됨)
- 기본 설정 (배송비, 적립금 비율 등)

## 7. 시맨틱 ID 설계

### 메인 페이지
- `#hero-banner` — 히어로 배너
- `#best-sellers` — 베스트셀러 섹���
- `#new-releases` — 신간 섹션
- `#categories` — 카테고리 그리드
- `#recent-reviews` — 최신 후기
- `#notices` — 공지사항

### 상품 리스트
- `#product-filters` — 필터 영��
- `#product-grid` — 상품 그리드
- `#product-pagination` — 페이지네이션

### 상품 상세
- `#product-image` — 상품 이미지
- `#product-info` — 상품 정보
- `#product-actions` — 수량/장바구니/구매 버튼
- `#product-tabs` — 탭 (상세/후기/배송)
- `#product-reviews` — 후기 섹션
- `#related-products` — 관련 상품

### 장바구니
- `#cart-items` — 장바구니 상품 목록
- `#cart-summary` — 결제 요약

### 결제
- `#shipping-form` — 배송 정보 폼
- `#payment-method` — 결제 수단
- `#order-summary` — 주문 요약

### 관리자
- `#admin-stats` — 통계 카드
- `#admin-chart` — 차트
- `#admin-table` — 데이터 테이블
- `#admin-sidebar` — 사이드바 네비게이션

## 8. 데이터 구조

### 상품 (Product)
```
- id, title, author, publisher
- price, discountRate, salePrice
- category (국어/영어/수학/사회/과학/기타)
- grade (고1/고2/고3)
- image, description
- stock, soldCount
- rating, reviewCount
- isNew, isBest
- createdAt
```

### 주문 (Order)
```
- id, orderNumber
- userId, userName, userPhone
- items: [{productId, title, price, quantity}]
- totalAmount, shippingFee
- status (결제완료/배송준비/배송중/배송완료/취소)
- shippingAddress, shippingMemo
- trackingNumber
- createdAt
```

### 회원 (User)
```
- id, name, email, phone
- role (user/admin)
- points, orderCount
- createdAt
```

### 후기 (Review)
```
- id, productId, userId, userName
- rating (1-5), content
- createdAt
```

### 자료 (Resource)
```
- id, productId, title
- fileType (PDF/HWP/ZIP)
- fileSize
- downloadCount
- createdAt
```

### 공지 (Notice)
```
- id, title, content
- category (공지/이벤트/안내)
- createdAt
```

## 9. 더미 데이터 구성

| 엔티티 | 개수 | 내용 |
|--------|------|------|
| 상품 | 24개 | 과목별 4개씩 (국어/영어/수학/사회/과학/기타), 학년 분포 |
| 주문 | 12개 | 다양한 상태 (결제완료 3, 배송준비 2, 배송중 3, 배송완료 3, 취소 1) |
| 회원 | 8명 | 일반회원 7 + 관리자 1 |
| 후기 | 20개 | 별점 분포 (1~5점), 상품별 2~4개 |
| 자료 | 10개 | 교재별 보충자료 (PDF, HWP) |
| 공지 | 6개 | 공지 3, 이벤트 2, 안내 1 |
| 배너 | 3개 | 히어로 슬라이더용 |
