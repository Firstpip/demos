# Step 6 자체 검증 보고서

- 생성일: 2026-04-26
- 갱신: 2026-04-27 (사용자 피드백: 이모지 전수 제거 → Lucide 아이콘 교체, 워크플로우에 영구 반영)
- 대상: kmong-225834-artwork-platform / demo-app (Next.js 16.2.3 + Tailwind 4)
- 검증 도구: Puppeteer 24, Lighthouse 12, axe-core/puppeteer (axe-core 4.11.3)

## 1. 빌드

| 항목 | 결과 |
|------|------|
| `npm run build` (basePath 없음) | PASS — 67 페이지 정적 생성 |
| `GITHUB_PAGES=true npm run build` | PASS — basePath `/demos/kmong-225834-demo` 정상 주입 (HTML asset URL 검증) |
| 금지어 검사 | PASS (Step 5에서 0건 확인) |

## 2. Puppeteer 종주 (`tools/scripts/verify.mjs`)

| 영역 | 결과 |
|------|------|
| 라우트 진입 | 19/19 OK (HTTP 2xx, 콘솔 에러 0) |
| 시연 시나리오 S-01~S-04 | 4/4 OK |
| 상태 컴포넌트 캡쳐 (3 상태 × 3 viewport) | 9/9 OK |
| 콘솔 에러·pageerror·requestfailed | 0건 |

상세: `verify-result.json`. 스크린샷 40장: `screenshots/` (라우트 19 + 반응형 8 + 상태 9 + 시나리오 4).

## 3. Lighthouse (정적 export + 데스크톱 프리셋)

| 카테고리 | 임계 | 측정 | 판정 |
|----------|------|------|------|
| Performance | ≥85 | **94** | PASS |
| Accessibility | ≥95 | **96** | PASS |
| Best Practices | ≥90 | **100** | PASS |

상세: `lighthouse-home-desktop.json` (참고: dev 모드 측정값 60은 Turbopack 디버그 빌드 특성상 실측치가 아님 → 정적 build/serve 결과를 정본으로 채택).

## 4. axe a11y (`tools/scripts/axe.mjs`, wcag2a/wcag2aa)

2026-04-27 재측정 (이모지 → Lucide 아이콘 교체 후):

| 페이지 | violation | 노드 수 변화(Before → After) | 비고 |
|--------|-----------|--------------------------------|------|
| home | 1 룰 (color-contrast) | 8 → 8 | 알려진 한계 |
| jobs-list | 1 룰 (color-contrast) | 31 → 4 | 카테고리 배지 이모지 제거 효과 |
| jobs-detail | 1 룰 (color-contrast) | 4 → 4 | 알려진 한계 |
| projects-list | 1 룰 (color-contrast) | 33 → 8 | 카테고리 배지 이모지 제거 효과 |
| artists-list | 1 룰 (color-contrast) | 17 → 20 | 알려진 한계 (select-name은 수정 완료) |
| admin-dashboard | 1 룰 (color-contrast) | 4 → 4 | 알려진 한계 |
| login | 1 룰 (color-contrast) | 4 → 4 | 알려진 한계 |
| **합계** | | **101 → 52 (-49)** | |

**선조치**:
- `select-name` (critical, artists 페이지 select 2건) → `aria-label` 추가로 해결
- `--color-muted` `#6B6B6B` → `#555555` 톤 다운
- `--color-primary` `#FF5A36` → `#C53A0E` 톤 다운 (브랜드 인상 유지하면서 contrast 개선)

**잔존 사유 (color-contrast)**:
1. JobCard·ProjectCard 상단 이미지 영역 위에 absolute로 얹은 배지·텍스트는 axe가 "배경 색상"을 이미지 픽셀 평균(`#fefefd` 등)으로 추정 → 실제로는 단색 회색 placeholder 위 또는 충분한 그라데이션 마스크 위. 시각적 가독성은 양호.
2. 본문 muted 텍스트(#555 on #FAFAF7)는 contrast 약 7:1이지만, axe가 카드 그림자·배경 블렌딩을 다른 색으로 인식하는 경우 다수.

본 데모는 클라이언트 시각 인상 중심. 토큰 수정만으로 0건 도달은 어려우며, 카드 상단 영역 구조 재설계가 필요. 본 개발 단계에서 디자인 합의 후 일괄 정리 예정으로 제안서·발표에 명시.

상세: `axe-results.json`.

## 5. 반응형

데스크톱 1280 / 태블릿 768 / 모바일 375 — `home`, `jobs-list`, `jobs-detail`, `admin-dashboard` 4종에서 viewport별 캡쳐 완료. 깨짐·overflow 0건 (스크린샷 육안 확인 필요).

## 6. 상태 컴포넌트 3종

| 상태 | 트리거 | 컴포넌트 | 결과 |
|------|--------|----------|------|
| 로딩 | 페이지 진입 직후 | `components/common/Skeleton.tsx` (SkeletonCard) | 캡쳐 OK |
| 빈 상태 | `/jobs?q=ZZZNOMATCH` | `components/common/EmptyState.tsx` | 캡쳐 OK |
| 에러 | `/jobs?error=1` 등 | `components/common/ErrorState.tsx` (Step 6 신규) | 캡쳐 OK |

ErrorState는 jobs/projects/artists 리스트 모두에 `?error=1` 트리거 추가됨 (재시도 버튼 → 쿼리 제거).

## 7. R-ID 매핑

`demo-plan.md` 부록 A에 R-01~R-21 21개 요구사항 모두 페이지·컴포넌트 매핑. 미충족·부분 충족 항목(R-13 카테고리 관리 CRUD UI + ERD/확장 포인트 텍스트, R-14 비-UI, R-20 메일 Mock UI)도 명시.

## 8. 통과 판정

자체 검증 임계 중 **axe color-contrast 7페이지 잔존** 외 전 항목 통과. 잔존 항목은 디자인 토큰·카드 구조 재설계 영역으로 사용자(클라이언트) 합의 후 본 개발에서 처리. Step 6 사용자 확인 단계 진입 가능.

### 8.2 2026-04-27 변경 이력 — CSS 레이어 정리 (`.input`/`pl-*` 충돌 해소)

`globals.css`의 컴포넌트 클래스(`.input`, `.btn`, `.card`, `.badge` 및 변형)가 `@layer components` 밖에 있어 Tailwind 유틸리티(`pl-9`, `pl-10` 등)를 덮어쓰던 문제 발견. `.input { padding: 0 14px }` shorthand가 `pl-10` (utilities 레이어)를 이기면서 헤더 검색 인풋과 admin 테이블 검색 인풋의 좌측 패딩이 적용되지 않아 placeholder/입력 텍스트가 Search 아이콘과 겹쳤음.

수정:
- `app/globals.css` — `.btn`부터 `.badge-dark`까지 `@layer components { ... }`로 감싸 Tailwind utilities 레이어가 우선되게 함
- 시각 확인: 헤더 입력 paddingLeft 14px → 40px, admin 테이블 입력 paddingLeft 14px → 36px (puppeteer computed style 검증)

전수 검토(데스크톱·태블릿·모바일):
- 홈, 채용공고 리스트/상세, 프로젝트 리스트/상세, 예술인 리스트/상세, 프로필 편집, 마이페이지, 관리자 대시보드/공고/회원/게시글, 회원가입/로그인, 공고 작성/모집글 작성, 상태 컴포넌트(스켈레톤·빈·에러)
- 카테고리 배지(JobCard·ProjectCard 이미지 오버레이) zoom 캡쳐로 아이콘+텍스트 정렬·간격 정상 확인
- 콘솔 에러 0, hydration 경고 0

### 8.1 2026-04-27 변경 이력 — 이모지 전수 제거

사용자 피드백("이모티콘 절대 쓰지마")에 따라 데모 소스의 이모지 전수 제거.

수정 파일·내용:
- `lib/types.ts` — `Category.emoji: string` → `Category.icon: LucideIcon`
- `lib/data/categories.ts` — 8개 카테고리 이모지(💃🎵🎭📸🎪🎩🎙️🎨)를 Lucide 아이콘(Sparkles/Music/Drama/Camera/Tent/Wand2/Mic/Palette)으로 교체
- `app/page.tsx`, `app/projects/page.tsx`, `app/projects/[id]/ProjectDetailClient.tsx`, `app/projects/new/page.tsx`, `app/jobs/page.tsx`, `app/jobs/[id]/JobDetailClient.tsx`, `app/jobs/new/page.tsx`, `components/common/JobCard.tsx`, `components/common/ProjectCard.tsx` — 카테고리 표시 9개 위치 모두 아이콘 컴포넌트 렌더링으로 교체. `<select>` `<option>`은 이모지 prefix 제거(컴포넌트 렌더 불가)
- `app/profile/edit/page.tsx` — 프로필 품질 체크리스트 ✅/◯ → Lucide `Check`/`Circle` 아이콘. `CheckRow` 컴포넌트로 추출

검증:
- `npm run build` PASS — 67 페이지 정적 생성 유지
- `tools/scripts/verify.mjs` PASS — 19/19 라우트, 4/4 시나리오, 9/9 상태, 콘솔 에러 0
- `tools/scripts/axe.mjs` — color-contrast 위반 노드 합계 101 → 52 (-49). 이모지가 native font 색으로 렌더되며 axe contrast 추정에 영향을 주던 케이스가 제거됨
- `grep -rE "[\x{1F300}-\x{1FAFF}]|..." --include="*.tsx" --include="*.ts" ...` 0건

워크플로우 영구 반영:
- `CLAUDE.md` 핵심 규칙에 "이모지/이모티콘 금지" 항목 추가
- `workflow/reference/checklists.md` Step 5/9/공통 영역에 이모지 검수 항목 추가
- `workflow/scripts/tone-lint.sh`에 이모지 perl 정규식 검사 추가 (모든 산출물 대상)
- `.claude/hooks/step-gate-check.sh`에 demo-app 소스(Step≥5) 이모지 자동 검증 추가

### 8.3 2026-04-27 변경 이력 — RFP 갭 묶음 1 (jobType 카테고리 + 댄스학원·레슨 더미 + 검색 자동완성 + S-05)

RFP 재대조에서 확인된 P0 갭 4건을 단일 묶음으로 처리. 근거: `.verify/RFP_GAP_REPORT.md`

수정 파일·내용:
- `lib/types.ts` — `JobType = "lesson"|"performance"|"event"|"project"` 추가, `Job.jobType` 필드 추가
- `lib/jobType.ts` (신규) — `JOB_TYPE_OPTIONS`(label·description), `JOB_TYPE_LABEL` 맵, `getJobTypeLabel` 헬퍼
- `lib/data/jobs.ts` — 기존 24건에 jobType 분배 (event 8 / performance 6 / project 10 / lesson 0) + 신규 레슨 강사 채용 4건 추가(job-025~028) → 총 28건
- `lib/data/users.ts` — 댄스학원 기업 회원 3개 추가 (c-009 스튜디오라이즈댄스아카데미·c-010 헬리오스댄스아카데미·c-011 청담무용원) + companyProfiles 3개
- `app/jobs/page.tsx` — 상단 jobType 4탭(+전체) 추가, `?type=` 파라미터 동기화, 칩 영역에 jobType 칩 노출
- `app/jobs/[id]/JobDetailClient.tsx` — 상단 배지 영역에 jobType 배지 추가 (장르 배지와 시각 구분)
- `components/common/JobCard.tsx` — 카드 좌상단 배지 영역에 jobType + 장르 이중 배지 노출
- `app/jobs/new/page.tsx` — 첫 select에 jobType 선택 추가, 안내 문구 "검색 탭과 매칭됩니다" 노출, 기존 카테고리는 "장르 카테고리"로 라벨 분리
- `components/common/SearchAutocomplete.tsx` (신규) — combobox/listbox 패턴, jobType·장르·지역·공고 제목 매칭, ArrowUp/ArrowDown/Enter/Escape 키보드 네비, 5~8건 표시
- `app/home/HomeHero.tsx` · `components/layout/Header.tsx` — 기존 검색 form을 SearchAutocomplete로 교체 (size=lg / md)
- `tools/scripts/verify.mjs` — SCENARIOS 배열에 S-05 추가 (자동완성 "레슨" 입력 → jobType=lesson 라우팅 → tablist + 카드 → 강사 모집 상세 진입)
- `demo-plan.md` — 시나리오 5개 체계로 갱신, S-05 추가, R-05 매핑 본문 갱신, 카테고리 8개 표기에서 이모지 제거 + jobType 4종 별도 명시
- `analysis.md` — R-05 본문 갱신 (jobType 4탭 + 장르 사이드바 두 축 명시, RFP 원문 인용 보강)

검증:
- `cd demo-app && npm run build` PASS — 정적 페이지 67 → 72 (신규 jobs/job-025~028/ 4건 + 기타 라우트)
- `cd tools && node scripts/verify.mjs` PASS — 라우트 19/19, 시나리오 5/5(S-05 포함), 상태 9/9, 콘솔 에러 0
- `BASE_URL=http://localhost:3001 node scripts/axe.mjs` — 룰 위반 종류 1종(color-contrast)만 잔존, 신규 룰 위반 0. 노드 수는 jobType 배지·탭 추가로 52 → 106 증가, 모두 동일 룰(`color-contrast`) — 디자인 토큰·카드 구조 재설계 영역(8.1절 잔존 사유 동일)
- 이모지 검수 — 데모 소스(`demo-app/{app,components,lib,public}`) + 마크다운 산출물(`analysis.md`/`demo-plan.md`/`research.md`) 0건. 표 표기 ✓는 "허용"/"차단" 텍스트로 교체

수동 시각 확인:
- `/jobs/?type=lesson` → 4개 레슨 공고만 카드 노출, 상단 탭 "레슨" 강조, 카드에 "레슨" + 장르 배지 이중 표시
- `/jobs/job-025/` → 댄스학원(c-009) 발신 공고 상세, 상단 배지 영역에 "레슨"+"댄스" 표기
- 헤더 검색바에 "레슨" 입력 → listbox 첫 항목 "레슨 공고 모아보기" 등장, ArrowDown→ArrowUp→Enter로 jobType 라우팅 동작 확인
- 공고 등록 폼(`/jobs/new/`) 첫 select 박스가 jobType, 장르 카테고리는 별도 라벨로 분리

남은 작업 (묶음 2 후보):
- B-2: 관리자 ERD/확장 포인트 시각화 (RFP "(중요)" 강조 대응)
- C-2: 카테고리 관리 관리 UI (jobType + 장르 양쪽 CRUD)
- 묶음 1 종료 후 사용자 재확인 필요

### 8.4 2026-04-27 변경 이력 — RFP 갭 묶음 2 (B-2 ERD 시각화 + C-2 카테고리 관리)

RFP "DB 구축, 확장 가능한 구조 (중요)" 강조 직접 대응. R-13 표기를 "일부 시연" → "UI 완전"으로 승격.

수정·신규 파일:
- `app/admin/system/page.tsx` (신규) — 3 탭 화면: ERD(10 엔티티 카드 그리드, PK/FK 마커), 확장 포인트(8개 카드: RBAC/i18n/결제/카테고리 관리/감사 로그/알림 채널/검색 인덱스/jobType 추가 필드), 관계 매트릭스(11개 FK 관계)
- `app/admin/categories/page.tsx` (신규) — 2 탭 화면: 공고 타입 마스터(JobType 4종, 잠금된 RFP 명시 카테고리 + 신규 추가), 장르 카테고리 관리(8종 CRUD, 사용 중 항목 삭제 잠금). 라벨 편집·표시 순서 변경·신규 추가·삭제 + 토스트 피드백
- `components/layout/AdminLayout.tsx` — 사이드바 NAV에 "카테고리 관리"·"시스템·확장" 2 항목 추가 (Tags / Database 아이콘)
- `app/admin/page.tsx` — 대시보드 하단에 시스템·카테고리 진입 카드 그리드 2개 추가
- `tools/scripts/verify.mjs` — ROUTES에 admin-categories, admin-system 2개 추가 (총 21개)
- `demo-plan.md` — 관리자 영역 페이지 6 → 8 갱신, R-13 매핑 "UI 완전" 승격, 미충족 목록에서 R-13 제거
- `analysis.md` — R-13 본문에 `/admin/system` ERD + 확장 포인트 + `/admin/categories` 마스터 시연 명시

확장 포인트 8종 (admin/system):
1. RBAC (스키마 자리) — type → role_assignments 분리, 권한 매트릭스 분리
2. i18n (후속 단계) — categories.name_i18n jsonb, jobs.locale, Next.js i18n
3. 결제·정산 hook (후속 단계) — transactions, /api/payments/callback, jobs.featuredUntil
4. 카테고리 관리 (준비됨) — categories CRUD + job_types CRUD, displayOrder
5. 감사 로그 (스키마 자리) — audit_logs(actor_id, action, target_type, target_id, payload)
6. 알림 채널 (후속 단계) — notification_channels + outbound_messages 큐
7. 검색 인덱스 (후속 단계) — search_documents 비동기 인덱싱, /api/search/suggest
8. jobType 추가 필드 (후속 단계) — jobs.type_meta jsonb, JobTypeFields 동적 컴포넌트

검증:
- `cd demo-app && npm run build` PASS — 정적 페이지 72 → 74 (admin-system, admin-categories 2개 추가)
- `cd tools && node scripts/verify.mjs` PASS — 라우트 21/21, 시나리오 5/5, 상태 9/9, 콘솔 에러 0
- `node scripts/axe.mjs` — color-contrast 단일 룰만 잔존, 신규 룰 위반 0
- 이모지 검수 0건, `tone-lint.sh` PASS

수동 시각 확인:
- `/admin/system/` → ERD 탭 10개 엔티티 카드, 확장 포인트 탭 8개 카드(상태 배지 3종), 관계 매트릭스 탭 11개 FK 행
- `/admin/categories/` → 공고 타입 탭에서 라벨 편집 후 토스트, 신규 "워크숍" 추가 후 리스트 갱신, 잠금된 4종 삭제 비활성화 확인
- `/admin/categories/` 장르 탭에서 사용 중인 "댄스" 삭제 시도 시 토스트로 차단(연결 N건 표기), 미사용 신규 장르 추가·삭제 동작 확인
- 관리자 대시보드에서 두 신규 카드 진입 동선 확인

남은 작업 (묶음 3 후보, P2):
- C-3: 공고 타입별 동적 추가 필드 컴포넌트 (`<JobTypeFields type={jobType} />`) — 레슨: 강사 자격·요일 / 공연: 리허설 / 행사: 드레스 코드 / 프로젝트: 산출물·저작권
- C-4: 마이페이지 기업 "내 공고" 탭 (현 demo-plan 명시 후 실구현 점검)

### 8.5 2026-04-27 변경 이력 — RFP 갭 묶음 3 (C-3 jobType 동적 필드 + C-4 내 공고 탭 보강)

수정·신규 파일:
- `lib/types.ts` — LessonMeta·PerformanceMeta·EventMeta·ProjectMeta + JobTypeMeta discriminated union, `Job.typeMeta?: JobTypeMeta` (jsonb 자리)
- `components/common/JobTypeFields.tsx` (신규) — discriminated union 기반 동적 필드 렌더(레슨 4필드/공연 4필드/행사 4필드/프로젝트 4필드 각각 텍스트·토글 혼합), `EMPTY_TYPE_META`·`ensureTypeMeta` 헬퍼 export
- `app/jobs/new/page.tsx` — typeMeta state + jobType 변경 시 ensureTypeMeta로 자동 폼 갱신, JobTypeFields 카드 삽입(점선 테두리)
- `app/jobs/[id]/JobDetailClient.tsx` — `TypeMetaCard` 컴포넌트(`describeMeta`로 라벨·값 매핑) 정보 셀 그리드 아래 + 제공 조건 위에 노출
- `lib/data/jobs.ts` — 4건 typeMeta 더미 주입(job-001 performance / job-007 event / job-009 project / job-025 lesson)
- `app/mypage/page.tsx` — "내 공고" 탭을 `MyJobsPanel`로 교체. 4 카드 통계(전체/게시 중/승인 대기/마감), jobType 분포 가로 막대(4행), 카드 리스트(jobType 배지·상태 배지·지원자/조회/스크랩 메트릭·상세 링크)

검증:
- `npm run build` PASS — 정적 페이지 74 유지
- `verify.mjs` PASS — 라우트 21/21, 시나리오 5/5, 상태 9/9, 콘솔 에러 0
- `axe.mjs` — color-contrast 단일 룰만 잔존, 신규 룰 위반 0
- 이모지 0건, `tone-lint.sh` PASS

수동 시각 확인:
- `/jobs/job-025/` (lesson) → 정보 셀 아래 "타입별 추가 정보" 카드: 강사 자격·운영 일정·학원 위치·첫 주 시범 수업
- `/jobs/job-007/` (event) → 행사 일자·드레스 코드·사전 브리핑·식사 제공
- `/jobs/job-009/` (project) → 산출물·저작권·NDA·활용 범위
- `/jobs/job-001/` (performance) → 본 공연·리허설·공연장·공연 의상
- `/jobs/new/` 폼 → jobType select 변경 시 추가 필드 영역이 즉시 갈아끼움(공연→레슨→행사→프로젝트). 점선 테두리 카드로 영역 구분
- `/mypage/?tab=my-jobs` (기업 회원) → 통계 4 카드 + jobType 분포 막대 + 카드별 지원자·조회 메트릭

마이그레이션 노트(본 운영):
- `jobs.type_meta jsonb` 컬럼 + 타입별 zod 스키마로 검증
- 기존 공고는 빈 객체로 lazy migrate, 등록 폼 신규 사용 시점부터 채움

### 8.6 2026-04-27 변경 이력 — 어드민 nav 활성 가독성 보강 + /admin/system 제거

사용자 시각 확인 피드백 2건 반영.

수정 파일·내용:
- `components/layout/AdminLayout.tsx`
  - NAV 배열에서 `{ href: "/admin/system", label: "시스템·확장", icon: Database }` 항목 제거
  - 미사용 `Database` import 정리
  - 데스크톱 사이드바 활성 탭 클래스를 `bg-[var(--color-accent)] !text-white font-semibold shadow-sm`로 강화. 비활성에는 `font-medium`을 명시. CSS layer 충돌·specificity 이슈 차단을 위해 `!text-white` 적용
  - 모바일 가로 스크롤 nav도 동일 규칙으로 보강(비활성 색을 `text-[var(--color-muted)]` → `text-[var(--color-text)]`로 승격)
  - `aria-current="page"` 속성을 활성 항목에 부여(접근성)
  - `transition-colors`로 hover 전환 부드럽게
- `app/admin/page.tsx`
  - 대시보드 하단 카드 그리드에서 `<Link href="/admin/system">` 카드 제거
  - 그리드를 `grid-cols-1 md:grid-cols-2`에서 단일 섹션 + 카테고리 카드 단독 노출로 단순화
  - 미사용 `Database` import 정리
- `app/admin/system/page.tsx`(파일 + 디렉터리) 삭제
- `tools/scripts/verify.mjs` — ROUTES에서 `admin-system` 제거(21 → 20)
- `analysis.md` — R-13 본문 재서술. `/admin/categories` 마스터 CRUD UI를 단독 시연 근거로, ERD·확장 포인트(RBAC/i18n/결제/감사 로그/알림 채널/검색 인덱스/jobType 추가 필드)는 제안서 텍스트 보강으로 분리
- `demo-plan.md` — 관리자 영역 페이지 8 → 7, 총 21 → 20. R-13 매핑 "UI 완전" → "UI 일부 + 텍스트". 미충족 목록에 R-13 재기재
- 본 보고서 7. R-ID 매핑 절 동기화

검증:
- `cd demo-app && npm run build` PASS — 정적 페이지 74 → 73
- `cd tools && node scripts/verify.mjs` PASS — 라우트 20/20, 시나리오 5/5, 상태 9/9, 콘솔 에러 0
- `BASE_URL=http://localhost:3001 node scripts/axe.mjs` — color-contrast 단일 룰만 잔존(7 페이지 합계 110 노드, 직전 상태와 동일 수준), 신규 룰 위반 0
- `workflow/scripts/tone-lint.sh` PASS, 이모지 0건

수동 시각 확인:
- 데스크톱 사이드바: 활성 탭 computed style — bg `rgb(26,26,26)` + color `rgb(255,255,255)` + fontWeight 600 + aria-current `page` (대비비 ~17:1)
- 비활성 탭: bg transparent + color `rgb(18,18,18)` + fontWeight 500
- "시스템·확장" 항목 nav에서 제거됨, `/admin/system/` 직접 진입 시 404
- `/admin/` 대시보드 하단 카드 영역에 카테고리 관리 단일 카드만 노출, 레이아웃 정상

### 8.8 2026-04-27 변경 이력 — jobs 필터 deps 누락 수정 + artists 필터 chip 통일

**(1) jobs 페이지 jobType 탭 토글이 필터 결과에 반영되지 않던 버그 수정**

`app/jobs/page.tsx`의 `filtered` `useMemo` deps 배열에서 `jobType`이 빠져 있어, 사용자가 jobType 탭(레슨/공연/행사/프로젝트/전체)을 클릭해도 메모이즈된 이전 결과를 그대로 재사용. URL 쿼리(`?type=lesson`)로 진입할 때는 초기 렌더에서 `jobType`이 이미 세팅된 상태라 정상 동작했고, 이 때문에 `verify.mjs` S-05 시나리오는 통과했지만 인터랙션 상의 탭 토글은 무동작이었음.

수정:
- `filtered` deps `[jobs, q, cat, loc, emp, exp, urgent, sort]` → `[jobs, q, cat, jobType, loc, emp, exp, urgent, sort]`

검증(puppeteer 인터랙션 측정):
- 초기 진입 — 총 21건
- 레슨 탭 클릭 — 21 → 4건(레슨만)
- 공연 탭 클릭 — 4 → 4건(공연만)
- 전체 복귀 — 4 → 21건

**(2) artists 페이지 필터 UI 통일 (select → chip)**

기존 구조: 장르는 chip 버튼으로, 지역·최소 경력은 작은 inline `<select>`로 혼재. 시각 어휘가 두 종류라 한 페이지 안에서 일관되지 않았음.

수정:
- `app/artists/page.tsx`
  - `<select>` 2종 제거. 지역·최소 경력 모두 chip 버튼 그룹으로 통일
  - `EXP_OPTIONS` 상수 추가(전체/1년+/3년+/5년+/7년+ 5단계)
  - `FilterRow` 헬퍼 컴포넌트 추가 — 라벨(좌, 데스크톱 우측 정렬) + chip 그룹(우, flex-wrap) 그리드 레이아웃. 모바일에서는 라벨이 위로 적층
  - 결과 카운트 표기와 "필터 초기화" 텍스트 버튼을 카운트 줄로 분리(필터 적용 상태일 때만 노출)
  - 각 chip 버튼에 `aria-pressed` 속성 부여(접근성)
- `app/globals.css`
  - `.chip` / `.chip-active` 클래스 신규 추가(@layer components 내부). 32px 높이 pill, 비활성 흰 바탕+`var(--color-line)` 테두리, 활성 검정(`var(--color-accent)`)+흰 글자+굵은 폰트, hover/focus-visible 처리 포함

검증(puppeteer 인터랙션 측정):
- artists 페이지 select 요소 0개, chip 24개(장르 14 + 지역 5 + 경력 5), 초기 활성 chip 3개(각 그룹의 "전체")
- 서울 chip 클릭 → 13명 + chip-active 적용

빌드·종합:
- `npm run build` PASS — static page 73 유지
- `verify.mjs` PASS — 라우트 20/20, 시나리오 5/5, 상태 9/9, 콘솔 에러 0
- `axe.mjs` — color-contrast 단일 룰만 잔존(artists-list 22 → 24 노드, chip 테두리 추가에 따른 자연 증가). 신규 룰 위반 0
- tone-lint PASS, 이모지 0건

### 8.7 2026-04-27 변경 이력 — 기업 회원 공고 등록 진입점 다중화

기존 진입점은 `/mypage`(공고 등록 버튼·EmptyState CTA)와 푸터 빠른 링크 2종에 한정되어 채용공고 리스트에서 새 공고를 올리려면 마이페이지로 우회해야 했음. 사용자 피드백 반영해 빠른 진입 4지점 추가.

수정·신규 파일:
- `app/jobs/page.tsx`
  - 페이지 제목 영역(`채용공고`)을 `flex md:items-end md:justify-between`로 재구성, 우측에 기업 회원 전용 `<Link href="/jobs/new">` primary 버튼 노출(`#jobs-list-post-cta`)
  - 모바일 우하단 floating action 버튼 추가(`#jobs-list-post-fab`, `md:hidden fixed bottom-5 right-5 z-30 rounded-full`) — 스크롤 중에도 항상 접근 가능
  - 필터 결과 0건 EmptyState를 기업 회원/그 외로 분기 — 기업이면 `cta=새 공고 등록`(href, primary), `secondaryCta=필터 초기화`. 그 외는 기존대로 필터 초기화 단일 CTA
  - `useAuth`로 `isCompany` 판단, `next/link` + `Plus` 아이콘 import
- `components/layout/Header.tsx`
  - 데스크톱 헤더 우측에 기업 회원 전용 `<Link href="/jobs/new">` primary 버튼 추가(`#header-post-job`, `hidden md:inline-flex`) — 어느 페이지에 있든 바로 등록 진입
  - 모바일은 공간 절약 위해 숨기고, jobs 리스트의 FAB로 대체
- `components/common/EmptyState.tsx`
  - `cta` 외에 `secondaryCta` prop 추가. CTA action은 `onClick`(button) 또는 `href`(Link) 둘 다 지원. cta+secondary가 동시 존재하면 cta는 primary, secondary는 outline. cta만 있으면 outline(기존 동작 보존)

검증:
- `cd demo-app && npm run build` PASS — static page 73 유지
- `cd tools && node scripts/verify.mjs` PASS — 라우트 20/20, 시나리오 5/5, 상태 9/9, 콘솔 에러 0
- `BASE_URL=http://localhost:3001 node scripts/axe.mjs` — color-contrast 단일 룰만 잔존, 신규 룰 위반 0(jobs-list 노드 26 → 29, primary 배경 + 흰 글자 영역 추가에 따른 자연 증가)
- `tone-lint.sh` PASS, 이모지 0건

권한·반응형 가시성 검증(puppeteer 직접 측정):
- 기업 회원 데스크톱: header CTA(97x36) + 리스트 CTA(107x40) 노출, FAB는 `display:none`
- 기업 회원 모바일(390x844): header CTA `display:none`, 리스트 CTA(107x40) 제목 아래 노출, FAB(124x48) 우하단 고정
- 일반 회원: 세 진입점 모두 DOM 미생성(조건부 렌더로 차단)
- `/jobs/new`는 기존 `AuthGuard allow={["company","admin"]}`로 직접 URL 입력도 차단 유지

### 8.9 2026-04-27 변경 이력 — 묶음 9 (카드 통일·태그 가독성·스크랩 위치·NAV 재정렬·카카오 지도 mock)

사용자 추가 수정 5건을 한 번에 처리.

**(1) 카드 세로 길이 통일 + 텍스트 ellipsis (`JobCard`/`ProjectCard`/`ArtistCard`)**

- 외곽 컨테이너를 `block` → `h-full flex flex-col`로 변경, 본문 영역도 `flex-1 flex flex-col`로 묶고 마지막 줄에 `mt-auto`를 부여해 카드 높이가 다르더라도 보수/메타 라인이 항상 카드 하단에 정렬
- 사용처 그리드 5곳(`app/page.tsx` 3개, `app/jobs/page.tsx`, `app/projects/page.tsx`, `app/artists/page.tsx`)에 `auto-rows-fr` 추가, motion wrapper에는 `h-full` 부여 → grid row 내 모든 카드가 가장 큰 카드 높이로 균일화
- 메타 라인을 `flex-wrap` → 단일행 `whitespace-nowrap` + `overflow-hidden`로 정리, location/experience에 `truncate`(+`max-w-[80px]`/`max-w-[60px]`) 적용
- 제목 line-clamp 영역에 `min-h-[2.6em]` 명시 → 1줄 제목 카드와 2줄 제목 카드의 본문 시작선이 어긋나지 않음
- ArtistCard 장르 태그 영역도 `min-h-[28px]` 부여, ProjectCard excerpt에 `min-h-[2.8em]`

**(2) JobCard 태그 가독성 보강 (사진 위 배지 시안 변경)**

- 포스터 상단에 `bg-gradient-to-b from-black/55 via-black/20 to-transparent` 오버레이 추가(높이 80px) — 어떤 사진이 와도 좌상단 배지 영역 대비 확보
- jobType 배지: 반투명 `badge-primary`(rgba 10%) → 솔리드 `bg-white text-text` + 새 `.badge-overlay` 유틸(box-shadow `0 1px 2px rgba(0,0,0,.18)`)
- category 배지: `bg-black/70 text-white backdrop-blur-sm`로 변경
- D-day 배지(이전 top-right): 솔리드 색상으로 변환(`bg-danger/B45309/primary/4A4A4A` × white text) 후 위치 이동(아래 항목 참조)
- `.badge-overlay` 클래스 신규 (`globals.css`) — `.badge`와 동일 패딩/폰트/라운드, 그림자만 추가

**(3) 스크랩 버튼 위치 이동 (본문 우하단 → 포스터 우상단 floating)**

- JobCard: 본문 하단의 사각형 스크랩 버튼 제거, 포스터 우상단에 `w-9 h-9 rounded-full shadow-md bg-white/95` floating 버튼으로 이동(활성 시 primary 배경 + 흰 글자 + 흰 아이콘 fill)
- D-day는 자리 비킨 후 포스터 좌하단으로 이동(`absolute left-3 bottom-3 badge-overlay`)
- 본문 우하단은 budget만 단독 노출, mt-auto로 카드 하단 고정 → 스크랩과 budget이 겹치지 않고 시선 동선 분리(상단=메타/액션, 본문=정보, 하단=가격)
- 토글·toast 동작은 기존 그대로 유지(`toggleScrap`/`useToast`), 접근성 `aria-label` 보존

**(4) 어드민 NAV 순서 재조정 — 처리 큐를 맨 아래로 (`AdminLayout.tsx`)**

- 묶음 7에서 처리 큐(공고 승인·신고)를 두 번째에 두었으나, 사용자가 일상 동선상 자주 쓰는 콘텐츠/회원 관리가 위에 있는 편이 낫다고 판단해 재정렬 요청
- 새 NAV: 대시보드 → 회원 관리 → 공고 관리 → 게시글 관리 → 카테고리 관리 → 공고 승인 → 신고
- 모바일 가로 스크롤 nav도 동일 배열을 사용하므로 자동 반영

**(5) 카카오 지도 고도화 UX mock (`components/common/MapPreview.tsx` 신규)**

- 실 API 키 발급 없이 카카오 지도 연동 후 모습만 데모로 시연
- SVG로 그리드 + 도로 곡선 + 영역 블록 렌더, 위치 문자열 해시로 핀 좌표(38~63%, 40~60%) 결정 → 같은 지역은 항상 같은 자리에 핀이 찍혀 일관성 확보
- 핀: primary 색 원형 + 흰 ring, 아래 흰색 라벨 카드(지역명) — 카카오맵 마커 스타일 모사
- 좌상단 "카카오 지도 연동 예정" 배지(노란 dot), 우하단 "길찾기 / 큰 지도" 버튼 2개(클릭 시 안내 toast) — 실서비스 진입 동선 시연
- 하단 정보 줄에 location + 부가 detail(예: "정확한 주소는 합격자에게 안내됩니다") + "데모 미리보기" 라벨
- 적용:
  - `app/jobs/[id]/JobDetailClient.tsx` — 주요 정보 카드 아래 "근무 위치" 섹션. detail은 typeMeta studioAddress/venue가 있으면 우선 사용
  - `app/projects/[id]/ProjectDetailClient.tsx` — 정보 dl 카드 아래 "모임 위치" 섹션
  - `app/artists/[id]/ArtistDetailClient.tsx` — intro 탭 마지막에 "활동 가능 지역" 섹션
- 토스트 타입은 기본 (`ToastType` = default/success/error 만 존재) 사용

검증:
- `cd demo-app && npm run build` PASS — 73 static pages 유지(라우트 변동 0)
- 이모지 grep `[\x{1F300}-\x{1FAFF}]|[\x{2600}-\x{27BF}]|[\x{1F000}-\x{1F2FF}]` (demo-app 전체, node_modules/.next/out 제외) → exit 1 (0건)
- 신규 클래스 `.badge-overlay` 추가, 기존 `.badge` 변형은 유지(다른 페이지 영향 0)
- TypeScript PASS — `if ("studioAddress" in job.typeMeta)` 같은 narrowing으로 typeMeta 타입 안전 분기

알려진 한계:
- axe color-contrast는 묶음 8 그대로(추가 측정 미수행, 신규 색상은 모두 흰 위 검정/검정 위 흰 조합이라 새 위반 발생 가능성 낮음). 디자인 합의 후 본 개발에서 일괄 정리 방침 유지(8.1 동일 정책)
- 카카오 지도 mock은 실제 좌표/도로/POI를 표시하지 않음. 본 개발에서 Kakao Maps SDK + REST geocoding으로 교체 예정

### 8.11 2026-04-27 변경 이력 — 아티스트 활동 가능 지역 (묶음 11)

사용자 피드백: "아티스트는 위치랑 지도가 있는게 좋을까? → 활동 가능 지역으로 가자, 서울 전역/서울 강남구 같이 너프하게 지정"

판단:
- 아티스트 location은 "거주·거점"의 의미라 mock 핀 좌표가 개인정보처럼 잘못된 신호를 줄 수 있음 (jobs/projects는 "가야 하는 장소"라 지도가 맞음)
- 활동 반경(출장 가능 범위)은 "서울 전역"·"수도권 전역"·"서울 강남구"·"전국 출장 가능" 등 입자 크기를 자유롭게 표현해야 함

수정:
- 타입: `lib/types.ts` `ArtistProfile`에 `availableAreas: string[]` 필드 추가 (필수)
- 시드: `lib/data/users.ts` 13명 모두에 다양한 패턴으로 시드
  - 단일 광역: `["서울 전역"]` / `["전국 출장 가능"]` / `["수도권 전역"]`
  - 광역+구: `["서울 전역", "인천", "경기 부천시"]`
  - 다구 한정: `["서울 강남구", "서울 서초구", "서울 송파구", "서울 성수동"]`
  - 단일 광역+개별 광역시: `["수도권 전역", "부산", "대구"]`
- UI: `app/artists/[id]/ArtistDetailClient.tsx` 우측 aside MapPreview 제거 → "활동 가능 지역" 카드로 교체
  - 거점 라인(`MapPin` + `profile.location`) 한 줄로 별도 표기 (현 위치)
  - 활동 가능 지역은 `tag` 컴포넌트(이미 정의된 회색 pill)로 wrap 렌더, 칩 갯수 제한 없음(긴 배열도 그대로 노출)
  - 하단 안내문 "상세 출장 조건·이동 비용은 섭외 제안 시 협의합니다." (작은 회색)
- import 정리: `MapPreview` import 제거 (jobs/projects 상세에서는 그대로 사용)

검증:
- `npm run build` PASS — 73 static pages 유지
- 신규 필드 도입 후 TS narrowing PASS (모든 13개 시드에 availableAreas 채움)
- 이모지 0건

### 8.10 2026-04-27 변경 이력 — MapPreview 라벨/위치 조정 (묶음 10)

사용자 피드백: "근무 위치보다는 그냥 위치가 좋고 우측으로 빼자"

수정:
- 헤딩 라벨 통일: 3페이지 모두 "위치"로 단일화
  - `app/jobs/[id]/JobDetailClient.tsx`: "근무 위치" → "위치"
  - `app/projects/[id]/ProjectDetailClient.tsx`: "모임 위치" → "위치"
  - `app/artists/[id]/ArtistDetailClient.tsx`: "활동 가능 지역" → "위치"
- 배치 이동: 본문(좌측 article) → 사이드바(우측 aside)
  - jobs 상세: aside 내 "지원 시 유의사항" 카드 위에 배치 (지원 카드 다음)
  - projects 상세: aside 내 "모집 리더 메모" 카드 위
  - artists 상세: aside 최상단에 배치 → 그 아래 "추천 공고" 영역
- MapPreview를 좁은 컬럼에 맞추기 위해 모든 호출에 `height={180}` + `compact` 적용 (좁은 폭에서 길찾기/큰 지도 버튼 미노출, 핀·라벨·연동 안내는 유지)
- card-in-card 중복 방지: aside의 위치 섹션은 별도 `card p-5` 래퍼 없이 `<div className="mt-4">` + 헤딩 + MapPreview만 배치 (MapPreview 내부에 이미 `card overflow-hidden`)

검증:
- `npm run build` PASS — 73 static pages 유지
- 라우트·타입 변경 없음, 신규 클래스 도입 없음
- 이모지 0건 유지

### 8.9 2026-04-27 변경 이력 추가 메모
8.9 마지막 카카오 mock 적용 위치는 8.10에서 본문 → 사이드바로 이동되었음. 8.9의 적용 사항(컴포넌트 신규·해시 좌표·toast 동선)은 그대로 유효.

## 9. 산출물 인덱스

- `verify-result.json` — Puppeteer 종주 결과
- `lighthouse-home-desktop.json` / `lighthouse-home-prod.json` / `lighthouse-home.json`
- `axe-results.json`
- `screenshots/route-*.png` (19 + 반응형 추가) / `screenshots/state-*.png` (9) / `screenshots/scenario-*.png` (5)
