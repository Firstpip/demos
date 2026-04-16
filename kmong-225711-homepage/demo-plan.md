# 데모 구현 계획: 홈페이지 개발 (kmong-225711)

> 작성일: 2026-04-10

---

## 1. 기술스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.x |
| UI | React + TypeScript | 19.x / 5.x |
| 스타일링 | Tailwind CSS | v4 |
| 스크롤 애니메이션 | GSAP + ScrollTrigger | 3.x |
| 컴포넌트 애니메이션 | Framer Motion | 12.x |
| 스무스 스크롤 | Lenis | latest |
| 배포 | GitHub Pages (output: 'export') | - |

---

## 2. 페이지 목록 및 라우팅

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 메인 (히어로 + 섹션 스크롤) | 풀페이지 스크롤 인터랙션 |
| `/about` | 회사 소개 | 기업 철학, 비전, 연혁 |
| `/services` | 서비스 소개 | 서비스 영역 + 상세 설명 |
| `/portfolio` | 포트폴리오 | 프로젝트 그리드 |
| `/portfolio/[id]` | 포트폴리오 상세 | 프로젝트 상세 페이지 |
| `/contact` | 문의하기 | 상담 신청 폼 (Mock) |

---

## 3. 권한 체계

- **공개**: 모든 페이지 (기업 홈페이지이므로 로그인 불필요)
- 관리자/로그인 기능 없음 (정적 기업 홈페이지)

---

## 4. 디자인 시스템

### 컬러
| 용도 | 컬러 | 코드 |
|------|------|------|
| Background (Primary) | 거의 블랙 | #0A0A0F |
| Background (Secondary) | 다크 네이비 | #12121A |
| Surface | 다크 그레이 | #1C1C28 |
| Accent | 시안 블루 | #00D4FF |
| Accent Hover | 라이트 시안 | #33DDFF |
| Text Primary | 화이트 | #FFFFFF |
| Text Secondary | 라이트 그레이 | #8E8EA0 |
| Text Muted | 미디엄 그레이 | #5A5A6E |
| Border | 다크 보더 | #2A2A3C |
| Gradient Start | 시안 | #00D4FF |
| Gradient End | 퍼플 | #7B61FF |

### 폰트
- **한글**: Pretendard
- **영문**: Space Grotesk (헤드라인), Inter (본문)
- **사이즈 체계**:
  - Hero Title: 72px (모바일 36px)
  - Section Title: 48px (모바일 28px)
  - Subtitle: 24px (모바일 18px)
  - Body: 16px
  - Caption: 14px

### 컴포넌트 스타일
- **카드**: 배경 Surface + 1px Border, hover 시 Accent 보더 + 미묘한 lift
- **버튼**: Accent 배경 + 화이트 텍스트, hover 시 scale(1.05) + glow
- **섹션 구분**: 넉넉한 여백 (py-24 ~ py-32)
- **이미지**: rounded-lg, aspect-ratio 고정
- **그래디언트 텍스트**: Accent gradient (시안 > 퍼플)

---

## 5. 공통 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| `Header` | 로고 + 네비 (데스크탑: 인라인, 모바일: 햄버거) |
| `Footer` | 회사 정보, 링크, 카피라이트 |
| `SmoothScroll` | Lenis 스무스 스크롤 Provider |
| `ScrollReveal` | GSAP ScrollTrigger 기반 페이드인 래퍼 |
| `SplitText` | 글자별 순차 애니메이션 |
| `ParallaxImage` | 스크롤 패럴랙스 이미지 |
| `MagneticButton` | 마그네틱 hover 버튼 |
| `Counter` | 숫자 카운트업 애니메이션 |
| `PageTransition` | 페이지 전환 애니메이션 (AnimatePresence) |
| `SectionTitle` | 섹션 제목 + 서브타이틀 (일관된 스타일) |
| `ProjectCard` | 포트폴리오 프로젝트 카드 |

---

## 6. 페이지별 기능 명세

### 메인 페이지 (`/`)

**히어로 섹션** (id: `hero`)
- 풀스크린 배경 (그래디언트 + 미묘한 노이즈 텍스처)
- 대형 타이포그래피: 기업 슬로건 (은유적 표현)
  - 예: "보이지 않는 연결을, 보이는 가치로" / "Invisible Connections, Visible Value"
- 텍스트 스플릿 애니메이션으로 등장
- 스크롤 인디케이터 (하단 화살표 + bounce)
- 스크롤 시 텍스트 페이드아웃 + 패럴랙스

**소개 섹션** (id: `intro`)
- 기업 핵심 메시지 (2~3줄)
- 스크롤 시 좌측에서 텍스트 슬라이드인
- 우측에 추상적 기하학 그래픽 (CSS/SVG)

**서비스 프리뷰 섹션** (id: `services-preview`)
- 3~4개 서비스 카드 가로 스크롤 (또는 그리드)
- 각 카드: 아이콘 + 서비스명 + 한 줄 설명
- hover 시 카드 확대 + 보더 glow

**숫자로 보는 성과 섹션** (id: `stats`)
- 3~4개 숫자 카운터 (프로젝트 수, 클라이언트 수, 년 수 등)
- 스크롤 진입 시 0에서 카운트업 애니메이션

**포트폴리오 프리뷰 섹션** (id: `portfolio-preview`)
- 대표 프로젝트 2~3개 가로 배치
- hover 시 이미지 확대 + 오버레이 텍스트
- "View All" 버튼 > /portfolio 이동

**CTA 섹션** (id: `cta`)
- "함께 만들어갈 다음 프로젝트" 메시지
- 문의하기 버튼 (MagneticButton)
- 배경 그래디언트 애니메이션

### 회사 소개 페이지 (`/about`)

**비전 섹션** (id: `about-vision`)
- 기업 비전/미션 텍스트 (은유적 표현)
- 대형 타이포그래피 + 스크롤 페이드인

**가치 섹션** (id: `about-values`)
- 핵심 가치 3~4개 카드
- 스크롤 시 순차적으로 나타남 (stagger)

**연혁 섹션** (id: `about-history`)
- 타임라인 UI (세로)
- 각 이벤트가 스크롤 시 순차 등장
- 좌우 교차 레이아웃

**팀 섹션** (id: `about-team`)
- 팀 멤버 그리드 (사진 + 이름 + 역할)
- hover 시 사진 컬러 전환 (흑백 > 컬러)

### 서비스 소개 페이지 (`/services`)

**서비스 히어로** (id: `services-hero`)
- 서비스 페이지 타이틀 + 서브타이틀

**서비스 목록** (id: `services-list`)
- 각 서비스별 풀폭 섹션 (아코디언 or 스크롤 섹션)
- 좌측: 서비스명 + 상세 설명
- 우측: 관련 이미지/그래픽
- 스크롤 시 섹션 전환 애니메이션

**프로세스 섹션** (id: `services-process`)
- 작업 프로세스 스텝 (기획 > 디자인 > 개발 > 런칭)
- 가로 스크롤 또는 타임라인 형태

### 포트폴리오 페이지 (`/portfolio`)

**포트폴리오 그리드** (id: `portfolio-grid`)
- 프로젝트 카드 그리드 (2~3열)
- 카테고리 필터 탭 (전체/웹/앱/브랜딩)
- 카드: 썸네일 + 프로젝트명 + 카테고리 태그
- hover 시 이미지 확대 + 오버레이

### 포트폴리오 상세 페이지 (`/portfolio/[id]`)

**프로젝트 상세** (id: `portfolio-detail`)
- 프로젝트명 + 카테고리 + 기간
- 대형 히어로 이미지
- 프로젝트 설명 텍스트
- 상세 이미지 갤러리 (스크롤 시 순차 등장)
- 이전/다음 프로젝트 네비게이션

### 문의하기 페이지 (`/contact`)

**문의 폼** (id: `contact-form`)
- 이름, 이메일, 회사명, 문의 유형 (셀렉트), 메시지
- 커스텀 스타일 인풋 (다크 테마)
- submit 시 토스트 알림 (Mock — 실제 발송 없음)

**연락처 정보** (id: `contact-info`)
- 이메일, 전화, 주소 (가상 데이터)
- 지도 placeholder

---

## 7. 시맨틱 ID 설계

| 페이지 | 섹션 ID | 주요 요소 ID |
|--------|---------|-------------|
| 메인 | `hero`, `intro`, `services-preview`, `stats`, `portfolio-preview`, `cta` | `hero-title`, `hero-subtitle`, `scroll-indicator`, `stats-counter-*` |
| About | `about-vision`, `about-values`, `about-history`, `about-team` | `vision-text`, `value-card-*`, `timeline-item-*`, `team-member-*` |
| Services | `services-hero`, `services-list`, `services-process` | `service-item-*`, `process-step-*` |
| Portfolio | `portfolio-grid` | `portfolio-filter`, `project-card-*` |
| Portfolio Detail | `portfolio-detail` | `detail-hero`, `detail-gallery`, `detail-nav` |
| Contact | `contact-form`, `contact-info` | `input-name`, `input-email`, `input-company`, `input-type`, `input-message`, `submit-btn` |

---

## 8. 데이터 구조

### Company (가상 기업 정보)
```typescript
interface Company {
  name: string;           // "넥스트비전" (가상)
  nameEn: string;         // "NextVision"
  slogan: string;         // "보이지 않는 연결을, 보이는 가치로"
  description: string;
  vision: string;
  mission: string;
  founded: string;        // "2015"
  industry: string;       // "정보통신 / B2B 전문 서비스"
}
```

### Service
```typescript
interface Service {
  id: string;
  title: string;          // "디지털 트랜스포메이션", "데이터 인텔리전스" 등
  description: string;
  icon: string;
  features: string[];
}
```

### Project (포트폴리오)
```typescript
interface Project {
  id: string;
  title: string;
  category: 'web' | 'app' | 'branding' | 'consulting';
  client: string;
  year: string;
  thumbnail: string;      // placeholder 이미지
  images: string[];
  description: string;
  tags: string[];
}
```

### TeamMember
```typescript
interface TeamMember {
  name: string;
  role: string;
  image: string;          // placeholder
}
```

### Stats
```typescript
interface Stat {
  label: string;          // "완료 프로젝트"
  value: number;          // 150
  suffix: string;         // "+"
}
```

---

## 9. 더미 데이터 구성

| 엔티티 | 수량 | 설명 |
|--------|------|------|
| Service | 4개 | 디지털 트랜스포메이션, 데이터 인텔리전스, 클라우드 솔루션, IT 컨설팅 |
| Project | 6개 | 웹 2개, 앱 2개, 브랜딩 1개, 컨설팅 1개 |
| TeamMember | 6명 | CEO, CTO, 디자인 리드, 개발 리드, PM, 컨설턴트 |
| Stat | 4개 | 프로젝트 수(150+), 클라이언트(80+), 경력(10+년), 만족도(98%) |
| History | 5개 | 2015~2025 주요 연혁 이벤트 |
| Value | 4개 | 혁신, 신뢰, 전문성, 파트너십 |

---

## 10. 인터랙션 목록 (전수 테스트 체크리스트)

| 페이지 | 요소 | 인터랙션 | 기대 동작 |
|--------|------|----------|----------|
| 공통 | Header 로고 | 클릭 | / 이동 |
| 공통 | Header 네비 링크 | 클릭 | 해당 페이지 이동 |
| 공통 | Header 햄버거 (모바일) | 클릭 | 모바일 메뉴 오픈/클로즈 |
| 공통 | 모바일 메뉴 링크 | 클릭 | 해당 페이지 이동 + 메뉴 닫힘 |
| 메인 | 스크롤 인디케이터 | 클릭 | 다음 섹션 스크롤 |
| 메인 | 서비스 카드 | hover | 확대 + glow |
| 메인 | 서비스 카드 | 클릭 | /services 이동 |
| 메인 | 포트폴리오 카드 | hover | 이미지 확대 + 오버레이 |
| 메인 | 포트폴리오 카드 | 클릭 | /portfolio/[id] 이동 |
| 메인 | CTA 버튼 | 클릭 | /contact 이동 |
| About | 타임라인 | 스크롤 | 순차 등장 |
| About | 팀 멤버 사진 | hover | 흑백 > 컬러 전환 |
| Services | 서비스 섹션 | 스크롤 | 섹션 전환 애니메이션 |
| Portfolio | 필터 탭 | 클릭 | 카테고리 필터링 |
| Portfolio | 프로젝트 카드 | 클릭 | /portfolio/[id] 이동 |
| Portfolio Detail | 이전/다음 | 클릭 | 다른 프로젝트로 이동 |
| Contact | 폼 입력 | 입력 | 유효성 검증 |
| Contact | 유형 셀렉트 | 클릭 | 커스텀 드롭다운 |
| Contact | Submit | 클릭 | 토스트 알림 (성공) |
| 모든 페이지 | 스크롤 | 스크롤 | ScrollReveal 애니메이션 |
