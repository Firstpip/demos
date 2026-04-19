# 에듀프레스 모의고사 서점 데모

크몽 #225758 "출판사 모의고사 서적 판매 쇼핑몰" 제안용 데모 앱입니다.

- Next.js 16 (App Router, static export)
- Tailwind CSS v4 / Pretendard
- GitHub Pages 단일 리포 `Firstpip/demos` 배포

## 구조

- `app/` — 사용자 영역 15페이지 + 관리자 영역 11페이지 (총 26 라우트)
- `components/` — Header / Footer / ProductCard / AuthGuard / AdminLayout
- `lib/data.ts` — 상품 24, 주문 12, 회원 8, 후기 20, 자료 10, 공지 6, 배너 3, FAQ 8
- `lib/context.tsx` — Auth / Cart / Toast Provider

## 로컬 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → `out/`
```

## GitHub Pages 배포

basePath는 `next.config.ts`에서 환경변수로 분기합니다.

```bash
GITHUB_PAGES=true npm run build
```

정적 export 결과(`out/`)는 `../../workflow/scripts/deploy-to-demos.sh`를 통해
`Firstpip/demos` 레포의 `kmong-225758-demo/` 서브디렉토리로 복사·푸시됩니다.

배포 URL: https://firstpip.github.io/demos/kmong-225758-demo/

## 데모 조작 팁

- 상단 검은색 바의 "관리자 모드" 토글 클릭으로 사용자/관리자 역할 전환
- 로그인은 아무 이메일/비밀번호나 입력해도 통과 (Mock)
- 장바구니/주문/결제/자료 다운로드는 모두 Mock (실서비스는 토스페이먼츠 + Cloudflare R2 연동)
