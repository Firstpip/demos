# 데모 구현 계획: SafeWorks 랜딩페이지

> 작성일: 2026-04-14
> 구현 범위: 메인 원페이지(9섹션) + 서브페이지 4개 (서비스/요금/자료실/고객지원)
> 데모 URL 예정: `https://firstpip.github.io/demos/kmong-225685-demo/`

---

## 1. 기술스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 마크업 | HTML5 (Semantic) | `<section>`, `<article>`, `<nav>`, `<main>`, `<footer>` |
| 스타일 | CSS3 (Variables, Grid, Flexbox, Container Queries) | 단일 `main.css` + 페이지별 분리 가능 |
| 스크립트 | Vanilla JavaScript (ES6+ Module) | 경량 모듈 구조 |
| 로고 슬라이더 | Swiper.js 11 (CDN) | autoplay, loop |
| 롤링 애니메이션 | GSAP 3 + ScrollTrigger (CDN) | pin + scrub |
| 폰트 | Pretendard (CDN) | 한국어 B2B 표준 |
| 아이콘 | Lucide Icons (CDN, SVG 인라인) | 경량 |
| 빌드 | 없음 (순수 정적) | GitHub Pages 즉시 배포 가능 |
| 배포 | GitHub Pages (Firstpip/demos 리포) | `/kmong-225685-demo/` basepath |

**의뢰인 명시 스택 준수**: HTML/CSS/JS/Node.js/MySQL 중 **프론트 데모는 HTML/CSS/JS 100% 준수**. Node.js/MySQL 백엔드는 실제 납품 시 별도 서버 배포 (데모에서는 Mock).

---

## 2. 페이지 목록 및 라우팅

| 경로 (파일) | 페이지 | 용도 |
|-------------|--------|------|
| `/index.html` | 메인 원페이지 | 히어로→협력사→롤링→플랜→홍보영상→브로슈어→CTA→보안→최종CTA |
| `/service/index.html` | 서비스 소개 | SafeWorks 핵심 기능 상세 |
| `/pricing/index.html` | 요금 안내 | 월간 구독 플랜 상세 비교 + FAQ |
| `/resources/index.html` | 자료실 | 브로슈어/백서/케이스 스터디 다운로드 목록 |
| `/support/index.html` | 고객지원 | FAQ + 도입문의/무료체험 Form |

**네비게이션**: 헤더에 5개 메뉴 (서비스 / 요금 / 자료실 / 고객지원 / 블로그(placeholder)) + 우측 CTA 2개

---

## 3. 권한 체계

**모든 페이지 공개** — 로그인/권한 체계 없음. 랜딩 + 공개 콘텐츠.

**Form 제출**: 클라이언트 측 Mock 동작 (toast 메시지). 실제 납품 시 Node.js API 연동.

---

## 4. 디자인 시스템

### 컬러 (CSS Variables)

```css
:root {
  /* Brand */
  --color-primary: #2B6CDF;          /* 건설 안전 블루 */
  --color-primary-dark: #1E4FAE;
  --color-primary-light: #E8F0FF;
  --color-accent: #FFCC00;           /* 세이프티 옐로우 */
  --color-accent-dark: #E6B800;

  /* Neutrals */
  --color-bg: #FFFFFF;
  --color-bg-soft: #F8FAFC;
  --color-bg-dark: #0F172A;          /* 보안 섹션 다크 네이비 */
  --color-text: #0F172A;
  --color-text-soft: #475569;
  --color-text-mute: #94A3B8;
  --color-border: #E2E8F0;

  /* Feature cards pastel */
  --color-card-pink: #FFE4E6;
  --color-card-mint: #D1FAE5;
  --color-card-lavender: #EDE9FE;
  --color-card-yellow: #FEF3C7;

  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #E0E7FF 0%, #DBEAFE 50%, #FEF3C7 100%);
  --gradient-cta: linear-gradient(135deg, #2B6CDF 0%, #7C3AED 100%);

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(15,23,42,.06);
  --shadow-md: 0 4px 12px rgba(15,23,42,.08);
  --shadow-lg: 0 16px 40px rgba(15,23,42,.12);

  /* Type scale */
  --fs-xs: 12px;
  --fs-sm: 14px;
  --fs-base: 16px;
  --fs-md: 18px;
  --fs-lg: 22px;
  --fs-xl: 28px;
  --fs-2xl: 36px;
  --fs-3xl: 48px;
  --fs-hero: 60px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  /* Layout */
  --max-width: 1200px;
  --radius-button: 999px;
}
```

### 폰트

- `Pretendard` (CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/pretendardvariable.css`)
- Weights: 400 / 500 / 600 / 700 / 800

### 버튼 스타일

- **Primary CTA**: 파란 솔리드 (`--color-primary`), 흰 텍스트, pill radius
- **Secondary CTA**: 아웃라인 (`--color-primary` 텍스트/보더)
- **Accent CTA**: 옐로우 솔리드 (`--color-accent`), 다크 텍스트 — 본문 반복 CTA에 사용
- Hover: translateY(-1px) + shadow 증가
- Focus: outline 2px `--color-primary` + offset 2px

### 컴포넌트 스타일

- **섹션 padding**: 데스크톱 `96px 0`, 모바일 `64px 0`
- **카드**: `border-radius: 20px`, padding 32px, `shadow-md`, hover 시 `shadow-lg + translateY(-4px)`
- **Form input**: border 1px `--color-border`, radius 12px, padding 14px 16px, focus 시 border `--color-primary`

---

## 5. 공통 컴포넌트

| 컴포넌트 | 파일 | 설명 |
|----------|------|------|
| Header | `partials/header.html` (fetch 삽입) | 로고 + 메뉴 5개 + CTA 2개. 스크롤 시 background blur |
| Footer | `partials/footer.html` | 회사정보, 연락처, SNS, 법적 링크 |
| FloatingBanner | 메인만 | 스크롤 500px 이후 우측 하단 고정 (브로슈어 다운로드 + 도입문의) |
| VideoModal | 메인만 | YouTube 임베드 lazy 로드 |
| FAQAccordion | pricing/support | `<details>` + 커스텀 스타일 |
| PricingTable | 메인/pricing | 3 컬럼 플랜 비교, 반응형에서 세로 스택 |
| LogoSlider | 메인/service | Swiper 기반, autoplay |
| FeatureRolling | 메인/service | GSAP pin + scrub, 좌측 고정 설명 + 우측 이미지 전환 |
| SecuritySection | 메인 | 다크 네이비, 카드 그리드 (암호화/인증/권한/감사) |
| ContactForm | support | name/email/phone/company/message + 동의 체크 + Mock submit |
| Toast | 전역 | fixed top-right, 3초 자동 닫힘 |

**모든 페이지 공통 초기 스크립트** (`js/common.js`):
- 헤더/푸터 fetch → include
- 스크롤 이벤트(헤더 스타일, 플로팅 배너)
- 햄버거 메뉴 토글
- Toast 유틸

---

## 6. 페이지별 기능 명세

### 6.1 메인 (`/`)

9개 섹션 순서 고정. 각 섹션 시맨틱 id:

| id | 섹션 | 주요 동작 |
|------|------|-----------|
| `#section-hero` | 히어로 | 그라데이션 배경 + 좌측 카피 + 우측 대시보드 스크린샷 + CTA 2개(도입문의/무료체험) |
| `#section-partners` | 영신디엔씨 + 협력사 로고 슬라이더 | Swiper autoplay, loop, 10+ 로고 더미 |
| `#section-features` | 세이프웍스 기능소개 (롤링) | GSAP pin + 좌측 설명 전환 + 우측 이미지 전환 (4개 기능) |
| `#section-pricing` | 월간 구독 플랜 | 3개 플랜 카드 (Starter/Pro/Enterprise), 월/년 토글 |
| `#section-video` | 홍보동영상 바로가기 | 썸네일 클릭 → YouTube 모달 오픈 |
| `#section-brochure` | 브로슈어 다운로드 | 썸네일 + 다운로드 버튼 (Mock PDF) |
| `#section-cta-middle` | 도입문의/무료체험 CTA (반복) | 그라데이션 배경 + CTA 2개 |
| `#section-security` | 엔터프라이즈 보안 섹션 | 다크 네이비 + 4개 보안 카드 + 인증 배지 |
| `#section-cta-final` | 그라데이션 최종 CTA | 큰 카피 + CTA 1개 |

**상시 UI**: 헤더(고정), 플로팅 배너(스크롤 500px 이후 표시), 푸터

### 6.2 서비스 소개 (`/service`)

- Hero (페이지 제목 + 서브카피)
- 핵심 가치 3개 카드 (안전/효율/비용절감 ROI 문구)
- 기능 상세 4~6개 (각 기능: 제목/설명/스크린샷 이미지)
- 사용 시나리오 타임라인
- CTA 섹션

### 6.3 요금 안내 (`/pricing`)

- Hero (페이지 제목)
- 월/년 토글
- 3개 플랜 상세 비교 테이블 (전체 기능 리스트)
- 비교 매트릭스 (기능별 ✓/✗)
- FAQ 아코디언 (8~10문항)
- CTA

### 6.4 자료실 (`/resources`)

- Hero
- 카테고리 필터 (전체/브로슈어/백서/케이스 스터디)
- 자료 카드 그리드 (썸네일 + 제목 + 설명 + 다운로드 버튼 + 다운로드 수 Mock)
- 페이지네이션 (더미, 실제 동작 without reload)

### 6.5 고객지원 (`/support`)

- Hero
- 탭: FAQ / 도입문의 / 무료체험
- FAQ 아코디언 (10~15문항)
- 도입문의 Form (name/company/phone/email/message + 동의 체크)
- 무료체험 신청 Form (name/company/phone/email + 동의 체크)
- Form 제출 시 Toast → "문의가 접수되었습니다 (데모). 실제 배포 시 DB에 저장됩니다"
- 연락처 정보 (전화/이메일/주소)

---

## 7. 시맨틱 ID 설계 (Puppeteer 캡처용)

### 글로벌
- `#site-header` — 헤더
- `#site-footer` — 푸터
- `#floating-banner` — 플로팅 배너
- `#video-modal` — 동영상 모달
- `#mobile-menu` — 모바일 햄버거 메뉴
- `#toast-container` — 토스트 컨테이너

### 메인 섹션
- `#section-hero` / `#section-partners` / `#section-features` / `#section-pricing` / `#section-video` / `#section-brochure` / `#section-cta-middle` / `#section-security` / `#section-cta-final`

### 주요 버튼
- `#cta-hero-contact` / `#cta-hero-trial`
- `#cta-mid-contact` / `#cta-mid-trial`
- `#cta-final`
- `#btn-brochure-download`
- `#btn-video-play`
- `#btn-floating-brochure` / `#btn-floating-contact`
- `#header-cta-contact` / `#header-cta-trial`

### 서브페이지 주요 요소
- `#service-features-grid` / `#service-scenario-timeline`
- `#pricing-plans` / `#pricing-compare` / `#pricing-faq`
- `#resources-filter` / `#resources-grid`
- `#support-tabs` / `#inquiry-form` / `#trial-form` / `#support-faq`

---

## 8. 데이터 구조 (더미)

### 기능 (FeatureRolling)
```js
features = [
  { id: 'worker-safety', title: '작업자 안전 모니터링', desc: '...', image: '/img/feat-1.png' },
  { id: 'entry-control', title: '현장 출입 관리', desc: '...', image: '/img/feat-2.png' },
  { id: 'realtime-alert', title: '실시간 이벤트 알림', desc: '...', image: '/img/feat-3.png' },
  { id: 'analytics', title: '안전 데이터 분석 대시보드', desc: '...', image: '/img/feat-4.png' },
]
```

### 요금 플랜
```js
plans = [
  { id: 'starter', name: 'Starter', priceMonthly: 1900, priceYearly: 1600, limits: ['현장 1개', '작업자 50명'], features: [...] },
  { id: 'pro', name: 'Pro', priceMonthly: 2400, priceYearly: 2000, limits: ['현장 5개', '작업자 300명'], features: [...], recommended: true },
  { id: 'enterprise', name: 'Enterprise', price: '문의', limits: ['무제한', '전담 지원'], features: [...] },
]
```

### 협력사 로고 (10개)
```js
partners = ['영신디엔씨', '현대건설', 'DL이앤씨', '삼성물산', '포스코이앤씨', 'GS건설', 'HDC현대산업개발', '롯데건설', '한화건설', '계룡건설']
```

### 자료실 (12개)
```js
resources = [
  { id: 'brochure-main', type: 'brochure', title: 'SafeWorks 소개서', size: '4.2MB', downloads: 1240, thumb: ... },
  { type: 'whitepaper', title: '건설현장 안전 관리 백서 2026', size: '3.1MB', downloads: 890, ... },
  { type: 'case', title: '[사례] 영신디엔씨 현장 도입 6개월 결과', ... },
  ...
]
```

### FAQ (15문항)
- 도입 관련 / 요금 / 기술 / 보안 / 지원 카테고리

---

## 9. 더미 데이터 구성 (생성 규칙)

- **협력사 로고**: 10개 (SVG 텍스트 로고로 자체 생성 — 표절 리스크 방지, placeholder 표시)
- **대시보드 스크린샷**: Figma에서 건설 안전 대시보드 UI 목업 생성 또는 SVG placeholder (차트/지도/리스트 조합)
- **기능 이미지**: 4개 — SVG illustration 또는 generic 3D 아이콘 플레이스홀더
- **브로슈어 PDF**: 1~2페이지 Mock PDF (단순 회사 소개)
- **홍보영상 썸네일**: YouTube 제공 썸네일 또는 자체 placeholder
- **고객사 로고**: 10개 (회색 placeholder text-logo)
- **FAQ**: 건설 안전 도메인 현실감 있는 질문 15개 작성
- **자료실**: 12개 (브로슈어 2, 백서 3, 케이스 5, 기타 2)

---

## 10. GitHub Pages 배포 구성

- 리포: `Firstpip/demos` (단일 통합 리포)
- 경로: `/kmong-225685-demo/`
- `.github/workflows/deploy.yml` — 기존 워크플로우 재사용
- 데모 URL: `https://firstpip.github.io/demos/kmong-225685-demo/`
- **HTML 정적 파일이므로 basePath 분기 불필요** — 링크는 상대 경로 사용 (`./service/`, `../index.html`)

---

## 11. 구현 순서

1. 공통: 디렉토리 구조, CSS variables, 헤더/푸터 partial, 공통 JS
2. 메인 섹션 9개 (순서대로)
3. 서브페이지 4개 (서비스 → 요금 → 자료실 → 고객지원)
4. 반응형 폴리싱 (768px / 375px)
5. 인터랙션 검증 (Puppeteer 테스트)
6. GitHub Pages 배포

---

## 12. 인터랙션 목록 (Step 6 자체 검증용)

### 메인
- [ ] 히어로 CTA 2개 클릭 → 각각 지원 페이지 해당 탭으로 이동
- [ ] 로고 슬라이더 autoplay 동작
- [ ] 기능 롤링 스크롤 시 전환 동작 (GSAP pin)
- [ ] 요금 월/년 토글 → 가격 변경
- [ ] 요금 카드 CTA 클릭 → 지원 페이지 이동
- [ ] 홍보영상 썸네일 클릭 → 모달 오픈, 닫기 버튼 동작
- [ ] 브로슈어 다운로드 버튼 → Mock 파일 다운로드 (또는 토스트)
- [ ] 중간 CTA 2개 동작
- [ ] 보안 섹션 카드 hover
- [ ] 최종 CTA 클릭 → 지원 페이지 이동
- [ ] 플로팅 배너: 스크롤 500px 이후 표시, 2개 버튼 동작, 닫기 버튼

### 공통
- [ ] 헤더 메뉴 5개 모두 동작
- [ ] 헤더 CTA 2개 동작
- [ ] 스크롤 시 헤더 blur/shadow 적용
- [ ] 모바일 햄버거 토글
- [ ] 푸터 링크 (최소 시각적 동작)
- [ ] 반응형 768px / 375px 레이아웃 깨짐 없음

### 서비스 페이지
- [ ] 기능 카드 hover
- [ ] 하단 CTA

### 요금 페이지
- [ ] 월/년 토글
- [ ] 비교 테이블 반응형
- [ ] FAQ 아코디언 펼침/접힘

### 자료실 페이지
- [ ] 카테고리 필터 (전체/브로슈어/백서/케이스)
- [ ] 자료 카드 다운로드 버튼 → 토스트

### 고객지원 페이지
- [ ] 탭 전환 (FAQ/문의/체험)
- [ ] FAQ 아코디언
- [ ] 문의 Form 유효성 검증 + 제출 시 토스트
- [ ] 체험 Form 유효성 검증 + 제출 시 토스트
