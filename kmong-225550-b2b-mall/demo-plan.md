# 데모 구현 계획서

> 작성일: 2026-03-27
> 프로젝트: 크몽 #225550 — B2B 폐쇄몰 전환

---

## 1. 기술스택

| 영역 | 기술 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | 정적 내보내기 지원, GitHub Pages 배포 가능 |
| 스타일링 | Tailwind CSS 3 | 빠른 UI 개발, 반응형 기본 지원 |
| 언어 | TypeScript | 타입 안전성, 데이터 구조 명확화 |
| 상태관리 | React Context + localStorage | 인증 상태, 장바구니 데이터 |
| 빌드 | `output: 'export'` | 정적 사이트 생성 → GitHub Pages |
| 배포 | GitHub Pages | 무료 호스팅, 데모 URL 확보 |

---

## 2. 페이지 목록 및 라우팅

| # | 페이지 | 경로 | 설명 |
|---|--------|------|------|
| 1 | 로그인 | `/login` | 폐쇄몰 게이트, 데모 안내 |
| 2 | 회원가입 | `/signup` | 사업자 전용 3단계 가입 |
| 3 | 홈 | `/` | 배너 + 추천상품 + 카테고리 |
| 4 | 상품 상세 | `/products/[id]` | 옵션/재고/회원가/구매제한 |
| 5 | 장바구니 | `/cart` | 수량조절 + 최소주문 검증 |
| 6 | 주문/결제 | `/checkout` | 무통장/계좌이체 + 현금영수증 |
| 7 | 마이페이지 - 주문내역 | `/mypage/orders` | 주문 목록 + 상태 추적 |
| 8 | 마이페이지 - 회원정보 | `/mypage/profile` | 사업자 정보 + 등급 확인 |
| 9 | 관리자 - 대시보드 | `/admin` | 매출/주문/회원 통계 |
| 10 | 관리자 - 회원관리 | `/admin/members` | 승인/거절/등급 관리 |
| 11 | 관리자 - 상품관리 | `/admin/products` | CRUD + 회원별 공개 설정 |
| 12 | 관리자 - 주문관리 | `/admin/orders` | 주문 목록 + 필터 + 엑셀 |
| 13 | 관리자 - 주문생성 | `/admin/orders/new` | 관리자 직접 주문 생성 |
| 14 | 관리자 - 팝업관리 | `/admin/popups` | 팝업 CRUD + 미리보기 |

---

## 3. 권한 체계

| 권한 | 접근 가능 | 리다이렉트 |
|------|----------|-----------|
| 비로그인 | /login, /signup | 다른 페이지 접근 시 → /login |
| 일반회원 (standard) | /, /products, /cart, /checkout, /mypage | /admin 접근 시 → / |
| VIP회원 (vip) | 일반회원과 동일 + 추가 할인가 표시 | /admin 접근 시 → / |
| 관리자 (admin) | 모든 페이지 | - |

**역할 전환 토글**: 헤더에 배치, 비로그인/일반/VIP/관리자 간 전환 가능

---

## 4. 디자인 시스템

### 컬러

```
Primary: #1B3A5C (Navy Blue) — 메인, 헤더, 사이드바
Primary Dark: #0F2440 — 호버, 활성
Secondary: #0D9488 (Teal) — CTA, 성공, 액센트
Background: #F3F4F6 (Gray 100) — 페이지 배경
Card: #FFFFFF — 카드, 모달
Text: #111827 (Gray 900) — 본문
Text Sub: #4B5563 (Gray 600) — 보조 텍스트
Border: #E5E7EB (Gray 200) — 구분선
Success: #059669 — 승인, 완료
Warning: #D97706 — 대기, 주의
Error: #DC2626 — 거절, 오류
Sale: #DC2626 — 할인가
```

### 폰트

- 한글: Pretendard (400, 500, 600, 700)
- 영문/숫자: Inter (tabular numbers)
- 기본 크기: 16px (본문), 14px (라벨), 12px (캡션)

### 레이아웃

- 최대 너비: 1280px
- 사이드바 (관리자): 240px 고정
- 12 컬럼 그리드, 거터 24px
- 반응형: Desktop(1280+) > Tablet(768~1279) > Mobile(~767)

---

## 5. 공통 컴포넌트

| 컴포넌트 | ID | 역할 |
|----------|----|------|
| Header | `#header` | 로고, 검색, 장바구니, 마이페이지, 역할 전환 토글 |
| Footer | `#footer` | 사업자 정보, 약관 링크 |
| AuthGuard | - | 권한 체크 + 리다이렉트 |
| AdminLayout | `#admin-layout` | 사이드바 + 헤더 + 콘텐츠 영역 |
| Toast | `#toast` | 알림 팝업 (성공/에러/정보) |
| Modal | `#modal` | 확인/삭제/상세보기 |
| DataTable | - | 필터+정렬+페이지네이션 |
| StatusBadge | - | 상태 표시 (대기/승인/거절/활성/정지) |
| FileUpload | - | 파일 업로드 UI (사업자등록증 등) |
| PopupOverlay | `#popup-overlay` | 팝업 표시 (단일/슬라이드) |

---

## 6. 페이지별 기능 명세

### 6-1. 로그인 (`/login`)
- **ID**: `#login-page`
- 폐쇄몰 안내 문구: "B2B 전용 쇼핑몰입니다"
- 로그인 폼 (아이디/비밀번호)
- 데모 안내: "데모 버전입니다. 아무 값이나 입력하여 로그인할 수 있습니다."
- 회원가입 링크
- 공식홈페이지 이동 배너 (`#official-site-banner`)
- 헤더 숨김

### 6-2. 회원가입 (`/signup`)
- **ID**: `#signup-page`
- 3단계 스텝 인디케이터 (`#signup-steps`)
- Step 1 (`#signup-step-1`): 기본정보 (아이디, 비밀번호, 담당자명, 연락처, 이메일)
- Step 2 (`#signup-step-2`): 사업자정보 (회사명, 사업자등록번호 + 검증 버튼, 대표자명, 업태, 종목, 주소, 사업자등록증 업로드, 소매인지정서 업로드)
- Step 3 (`#signup-step-3`): 약관동의 + "관리자 승인 후 이용 가능합니다" 안내
- 모든 필수 입력 유효성 검증
- 헤더 숨김

### 6-3. 홈 (`/`)
- **ID**: `#home-page`
- 팝업 오버레이 (활성 팝업 있을 시)
- 메인 배너 슬라이더 (`#main-banner`)
- 카테고리 바로가기 (`#category-shortcuts`)
- 추천 상품 (`#recommended-products`) — 4개 그리드
- 신상품 (`#new-products`) — 4개 그리드
- 인기 상품 (`#popular-products`) — 4개 그리드

### 6-4. 상품 상세 (`/products/[id]`)
- **ID**: `#product-detail`
- 상품 이미지 갤러리 (`#product-gallery`)
- 상품 정보: 이름, 카테고리, 설명
- 가격 표시 (`#product-price`): 회원 등급별 할인가 + 정가(취소선)
- 옵션 선택 (`#product-options`): 드롭다운, 선택 시 재고 표시
- 구매 제한 안내 (`#purchase-limit`): 최소금액/수량/기간
- 수량 선택 + 장바구니/바로주문 버튼
- 상품 상세 설명 탭 (`#product-tabs`)

### 6-5. 장바구니 (`/cart`)
- **ID**: `#cart-page`
- 장바구니 아이템 목록 (`#cart-items`)
- 수량 조절 + 옵션 표시
- 개별/전체 선택 삭제
- 최소 주문 금액/수량 검증 메시지
- 주문 요약 (`#cart-summary`): 상품금액, 할인금액, 합계
- 주문하기 버튼 (최소 조건 미충족 시 비활성)

### 6-6. 주문/결제 (`/checkout`)
- **ID**: `#checkout-page`
- 배송지 정보 (`#shipping-info`): 회사명, 주소, 담당자, 연락처
- 주문 상품 목록 (`#order-items`)
- 결제 방식 선택 (`#payment-method`): 무통장입금 / 계좌이체
- 입금 계좌 안내 (은행명, 계좌번호, 예금주)
- 현금영수증 (`#cash-receipt`): 회원 프로필에서 자동 입력된 번호
- 세금계산서 발행 요청 체크박스
- 주문 요약 + 주문하기 버튼

### 6-7. 마이페이지 - 주문내역 (`/mypage/orders`)
- **ID**: `#mypage-orders`
- 주문 목록 테이블 (`#order-list`): 주문번호, 날짜, 상품, 금액, 상태
- 상태 필터 (전체/결제대기/입금확인/배송중/배송완료)
- 주문 상세 모달 (`#order-detail-modal`)
- 기간 검색 (시작일~종료일)

### 6-8. 마이페이지 - 회원정보 (`/mypage/profile`)
- **ID**: `#mypage-profile`
- 사업자 정보 표시 (회사명, 사업자번호, 대표자 등)
- 회원 등급 + 할인율 표시 (`#member-grade`)
- 현금영수증 번호 설정 (`#cash-receipt-setting`)
- 비밀번호 변경
- 사업자등록증/소매인지정서 재업로드

### 6-9. 관리자 - 대시보드 (`/admin`)
- **ID**: `#admin-dashboard`
- 요약 카드 (`#dashboard-cards`): 오늘 주문, 미확인 입금, 대기 회원, 월 매출
- 매출 차트 (`#sales-chart`): 일별/주별 매출 그래프
- 최근 주문 (`#recent-orders`): 5건
- 승인 대기 회원 (`#pending-members`): 3건
- 재고 부족 상품 알림 (`#low-stock`)

### 6-10. 관리자 - 회원관리 (`/admin/members`)
- **ID**: `#admin-members`
- 회원 목록 테이블 (`#member-list`): 회사명, 사업자번호, 등급, 상태, 가입일
- 상태 필터: 전체/대기/승인/거절/정지
- 회원 상세 모달 (`#member-detail-modal`): 사업자등록증/소매인지정서 미리보기, 승인/거절 버튼
- 등급 변경 (일반/VIP/프리미엄)
- 할인율 설정

### 6-11. 관리자 - 상품관리 (`/admin/products`)
- **ID**: `#admin-products`
- 상품 목록 테이블 (`#product-list`): 이미지, 상품명, 가격, 재고, 공개 상태
- 상품 추가/수정 모달 (`#product-form-modal`)
- 옵션별 재고 설정 (`#stock-settings`)
- 회원별 상품 공개 설정 (`#visibility-settings`): 등급별 토글
- 구매 제한 설정 (`#purchase-limit-settings`)

### 6-12. 관리자 - 주문관리 (`/admin/orders`)
- **ID**: `#admin-orders`
- 주문 목록 테이블 (`#admin-order-list`): 주문번호, 회원, 금액, 상태, 결제상태
- 필터: 상태, 결제상태, 기간, 회원
- 주문 상세 (`#admin-order-detail`): 수정 가능 (확정 전)
- 입금 확인 버튼
- 엑셀 다운로드 버튼 (`#excel-download`): 필터 적용된 데이터

### 6-13. 관리자 - 주문생성 (`/admin/orders/new`)
- **ID**: `#admin-order-create`
- 회원 검색/선택 (`#member-select`)
- 상품 추가 (`#product-add`): 검색 → 선택 → 옵션/수량 입력
- 상품 목록 테이블 (추가된 상품)
- 할인 적용: 회원등급 자동 / 수동 입력
- 결제 방식 선택
- 배송 메모
- 합계 표시 + 주문 생성 버튼

### 6-14. 관리자 - 팝업관리 (`/admin/popups`)
- **ID**: `#admin-popups`
- 팝업 목록 (`#popup-list`): 제목, 유형, 기간, 상태
- 팝업 추가/수정 (`#popup-form`): 제목, 유형(단일/슬라이드), 이미지 업로드, 링크, 노출기간, 활성 상태
- 팝업 미리보기 (`#popup-preview`)

---

## 7. 시맨틱 ID 설계

### 글로벌
- `#header`, `#footer`, `#toast`, `#modal`, `#popup-overlay`
- `#role-toggle` — 역할 전환 토글

### 로그인/가입
- `#login-page`, `#login-form`, `#official-site-banner`, `#demo-notice`
- `#signup-page`, `#signup-steps`, `#signup-step-1`, `#signup-step-2`, `#signup-step-3`

### 쇼핑
- `#home-page`, `#main-banner`, `#category-shortcuts`, `#recommended-products`, `#new-products`, `#popular-products`
- `#product-detail`, `#product-gallery`, `#product-price`, `#product-options`, `#purchase-limit`, `#product-tabs`
- `#cart-page`, `#cart-items`, `#cart-summary`
- `#checkout-page`, `#shipping-info`, `#order-items`, `#payment-method`, `#cash-receipt`

### 마이페이지
- `#mypage-orders`, `#order-list`, `#order-detail-modal`
- `#mypage-profile`, `#member-grade`, `#cash-receipt-setting`

### 관리자
- `#admin-layout`, `#admin-sidebar`
- `#admin-dashboard`, `#dashboard-cards`, `#sales-chart`, `#recent-orders`, `#pending-members`, `#low-stock`
- `#admin-members`, `#member-list`, `#member-detail-modal`
- `#admin-products`, `#product-list`, `#product-form-modal`, `#stock-settings`, `#visibility-settings`, `#purchase-limit-settings`
- `#admin-orders`, `#admin-order-list`, `#admin-order-detail`, `#excel-download`
- `#admin-order-create`, `#member-select`, `#product-add`
- `#admin-popups`, `#popup-list`, `#popup-form`, `#popup-preview`

---

## 8. 데이터 구조

### Member (회원)
```typescript
interface Member {
  id: string;
  loginId: string;
  businessName: string;      // 회사명
  businessNumber: string;    // 사업자등록번호
  ownerName: string;         // 대표자명
  managerName: string;       // 담당자명
  email: string;
  phone: string;
  address: string;
  businessType: string;      // 업태
  businessItem: string;      // 종목
  businessLicense: string;   // 사업자등록증 파일명
  retailDesignation: string; // 소매인지정서 파일명
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  memberGroup: 'standard' | 'vip' | 'premium';
  discountRate: number;      // 할인율 (%)
  cashReceiptNumber: string; // 현금영수증 번호
  createdAt: string;
  approvedAt?: string;
}
```

### Product (상품)
```typescript
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  detailDescription: string;
  images: string[];
  basePrice: number;
  options: ProductOption[];
  visibleToGroups: ('standard' | 'vip' | 'premium')[];
  purchaseLimit: {
    minAmount: number;       // 최소 주문금액
    maxQuantity: number;     // 최대 주문수량
    periodDays?: number;     // 주문 가능 기간 (일)
  };
  isActive: boolean;
  createdAt: string;
}

interface ProductOption {
  name: string;              // 옵션명 (예: "사이즈")
  values: {
    label: string;           // 옵션값 (예: "L")
    stock: number;           // 재고
    additionalPrice: number; // 추가금액
  }[];
}
```

### Order (주문)
```typescript
interface Order {
  id: string;
  memberId: string;
  memberName: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: 'bankTransfer' | 'deposit';
  paymentStatus: 'pending' | 'confirmed';
  cashReceiptIssued: boolean;
  taxInvoiceIssued: boolean;
  createdBy: 'member' | 'admin';
  isEditable: boolean;
  shippingAddress: string;
  memo: string;
  createdAt: string;
  confirmedAt?: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  optionValues: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
```

### Popup (팝업)
```typescript
interface Popup {
  id: string;
  title: string;
  type: 'single' | 'slide';
  images: { url: string; link?: string }[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}
```

---

## 9. 더미 데이터 구성

| 데이터 | 수량 | 내용 |
|--------|------|------|
| 회원 | 8명 | 대기 2, 승인(일반) 3, 승인(VIP) 2, 정지 1 |
| 상품 카테고리 | 4개 | 식품/음료, 생활용품, 사무용품, 패션잡화 |
| 상품 | 12개 | 카테고리별 3개씩, 옵션 2~3개, 재고 다양 |
| 주문 | 15건 | 상태별 분포 (대기3, 확인3, 배송중3, 완료4, 취소2) |
| 팝업 | 3개 | 활성 1, 예약 1, 종료 1 |
| 매출 데이터 | 30일 | 일별 매출 차트용 |

---

## 10. 인터랙션 목록

| 인터랙션 | 동작 |
|----------|------|
| 로그인 | 아무 값 입력 → 일반회원으로 로그인 + 토스트 |
| 역할 전환 | 토글로 비로그인/일반/VIP/관리자 전환 |
| 회원가입 | 단계별 폼 → 유효성 검증 → 완료 토스트 |
| 상품 옵션 선택 | 재고 표시 변경 + 가격 변경 |
| 장바구니 추가 | 토스트 + 헤더 장바구니 수량 변경 |
| 수량 변경 | +/- 버튼 + 합계 재계산 |
| 주문하기 | 폼 검증 → 주문 완료 페이지 |
| 관리자 회원 승인 | 상태 변경 + 토스트 |
| 관리자 주문 수정 | 확정 전 주문 수정 모달 |
| 관리자 주문 생성 | 회원 선택 → 상품 추가 → 주문 생성 |
| 엑셀 다운로드 | CSV 파일 다운로드 |
| 팝업 미리보기 | 모달로 팝업 미리보기 |
| 팝업 표시 | 홈 진입 시 활성 팝업 오버레이 |
| 폼 유효성 검증 | 필수 입력 미입력 시 에러 표시 + submit 차단 |
