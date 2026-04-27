# ARTWORK Demo App (kmong-225834)

예술인 채용·공연·협업 플랫폼 ARTWORK의 MVP 시연 데모.

## 기술스택
- Next.js 16 (App Router, Static Export)
- TypeScript
- TailwindCSS 4
- Framer Motion
- Lucide Icons

## 로컬 실행
```bash
npm install
npm run dev
# http://localhost:3000
```

## GitHub Pages 배포용 빌드
```bash
GITHUB_PAGES=true npm run build
# out/ 디렉토리에 정적 파일 생성
```

basePath는 `next.config.ts`에서 `GITHUB_PAGES` 환경변수로 분기됨. 로컬에서 PDF 캡처 시에는 `npm run build`만 실행.

## 데모 계정 안내
- 로그인 페이지에서 역할 전환 토글로 `일반 회원 / 기업 회원 / 관리자` 데모 계정 선택
- 비밀번호 없이 전환, sessionStorage에 저장되어 새로고침·페이지 이동에도 유지

## 시연 시나리오
`demo-plan.md` 섹션 0 참고. S-01 ~ S-04 순서로 재현 가능.
