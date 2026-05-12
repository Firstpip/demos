# 가구전문 브랜드 통합 쇼핑몰 데모 (kmong-225943)

30개 조합사 통합 쇼핑몰 + 마홀앤 마이크로사이트의 데모 구현. RFP 평가 1순위 디자인·UX에 맞춘 25페이지 데모.

## 시연 시나리오 4종

좌상단 RoleSwitcher로 역할을 전환하며 종주합니다.

- S-01 (사용자) 컬렉션 페이지 안에서 8축 필터로 즉시 좁힘 — `/collections/warm-living-26ss`
- S-02 (사용자) 배송 지연 자동 보상 시뮬레이션 — `/account/orders/{id}` 우측 패널의 시간 진행 버튼
- S-03 (마홀앤 팬) 마이크로사이트 → 본체 자연 회유 — `/maholn` → `/maholn/lookbook/{slug}` → 본체 상세
- S-04 (조합사 운영자) 권한 분리 CMS — 가격 인라인 편집 가능, 제품 등록 차단 + 시도 자동 로깅

자세한 시나리오는 상위 폴더의 `demo-plan.md` 섹션 0 참조.

## 기술 스택

- Next.js 16 (App Router, static export, trailingSlash)
- TypeScript 5, Tailwind 4
- shadcn/ui 패턴, Lucide React, Recharts, sonner
- React Hook Form, Zod
- 더미 데이터: `src/data/*.ts` 정적 모듈 + sessionStorage 영속화

## 로컬 실행

```bash
npm install
npm run dev          # http://localhost:3000
```

## GitHub Pages 배포 빌드

```bash
GITHUB_PAGES=true npm run build
# 결과: out/ → 최종 경로 /demos/kmong-225943-demo
```

상위 워크플로우에서 `./workflow/scripts/deploy-to-demos.sh kmong-225943-demo`로 자동 배포.

## 데모 계정

데모는 RoleSwitcher(좌상단)로 역할을 즉시 전환합니다. 로그인 폼도 동작하며, 비밀번호는 모두 `demo1234`로 통일.

| 역할 | 표시 이름 | 비고 |
|------|-----------|------|
| 비로그인 | guest | 공개 페이지·마이크로사이트 |
| 사용자 | 김지윤 | 장바구니·결제·주문·자동 보상 |
| 조합사 운영자 | 라온우드 매니저 | 본인 브랜드 CMS만 |
| 전체 관리자 | 본체 운영자 | 모든 관리자 페이지 |
