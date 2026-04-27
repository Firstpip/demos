# 데모 구현 계획: ARTWORK — 예술인 채용·공연·협업 플랫폼

## 0. 시연 시나리오 (5개)

시연 순서는 S-01 → S-02 → S-03 → S-04 → S-05. "구직자 발견 → 기업 등록·섭외 → 관리자 승인 → 개인 프로젝트 모집 → 댄스학원 레슨 강사 채용" 루프로 RFP 4개 jobType(레슨/공연/행사/프로젝트)을 모두 시연한다.

### S-01: 댄서가 힙합 공고를 필터링해 지원 완료까지
- 페르소나: P-1 (프리랜서 힙합 댄서, 27세)
- 동기: 다음 주 열리는 축제·공연 기회를 카테고리·경력 필터로 빠르게 찾고 싶음
- 관련 요구사항: R-03, R-06, R-08, R-12, R-15, R-17
- 클릭 경로: 1) 홈 → 2) 상단 검색바에 "힙합" 입력 → 3) 자동완성에서 "힙합 · 댄스" 선택 → 4) 공고 리스트에서 좌측 필터 "지역=서울", "경력=1년+" 체크 → 5) 리스트 실시간 재정렬(stagger 애니메이션) → 6) "2026 서울 프린지 페스티벌 힙합 크루 모집" 카드 클릭 → 7) 공고 상세에서 우측 고정 "지원하기" 클릭 → 8) 지원서 모달(자기소개 200자 + 포트폴리오 링크 자동 첨부) → 9) 제출 → 10) "지원 접수됨" 토스트 + 마이페이지 지원 내역에 카드 추가
- 예상 소요: 50초
- 기대 반응(wow moment): 필터 체크 시 리스트가 부드럽게 재배열되는 stagger 애니메이션 + 지원 완료 토스트가 마이페이지 카운터를 증가시키는 동기화 피드백
- 스크린샷 계획: PDF 시나리오 페이지에 4컷 — (1) 홈 검색 자동완성 열린 상태 (2) 필터 적용된 리스트 (3) 공고 상세 우측 CTA (4) 지원 완료 토스트 + 마이페이지

### S-02: 기업이 공고 등록 후 지원자 프로필·영상 확인
- 페르소나: P-2 (공연기획 스타트업 섭외 담당자, 34세)
- 동기: 개막 2주 전 축제에 힙합 크루 4명 급하게 섭외
- 관련 요구사항: R-02, R-04, R-05, R-10, R-15, R-16, R-18
- 클릭 경로: 1) 역할 전환 토글로 기업 계정 로그인 → 2) 기업 대시보드 → 3) "+ 공고 등록" 버튼 → 4) 폼에 제목·카테고리(댄스/힙합)·지역·고용형태·경력·일정·예산·상세설명(WYSIWYG) 입력 → 5) 저장 → 6) 대시보드에 "승인 대기" 상태 카드 등장(펄스 애니메이션) → 7) (시연 목적으로 관리자 승인 직후 가정하여 "게시 중" 전환) → 8) 지원자 탭 클릭 → 9) 지원자 카드 리스트 → 10) 상위 지원자 프로필 상세에서 영상 썸네일 클릭해 모달로 포트폴리오 영상 재생 → 11) "채팅으로 제안" 클릭 → Mock 채팅 드로어 열림
- 예상 소요: 95초
- 기대 반응(wow moment): WYSIWYG 에디터가 실시간 서식(제목·굵게·글머리표) 반영하는 편집 감각 + 지원자 프로필의 영상 썸네일 그리드에서 영상이 인라인 재생되는 순간
- 스크린샷 계획: 4컷 — (1) 공고 등록 폼 WYSIWYG 활성 상태 (2) 기업 대시보드 "승인 대기/게시 중/마감" 탭 (3) 지원자 프로필 영상 그리드 (4) Mock 채팅 드로어

### S-03: 관리자가 승인 대기 공고 검토·반려
- 페르소나: P-3 (플랫폼 운영 관리자)
- 동기: 저품질·허위 공고 차단, 승인 큐 48시간 내 처리
- 관련 요구사항: R-09, R-10, R-11, R-18, R-21
- 클릭 경로: 1) 관리자 로그인 → 2) 관리자 대시보드 (승인 대기 5, 오늘 처리 12, 신고 3) → 3) "승인 대기 큐" 카드 클릭 → 4) 큐 리스트에서 의심 공고(카테고리/설명 불일치) 클릭 → 5) 공고 상세 우측 "반려" 버튼 → 6) 반려 사유 모달(체크박스 프리셋 + 자유입력) → 7) 제출 → 8) 큐 카운터가 5 → 4로 애니메이션 감소 → 9) 승인 처리 로그에 항목 추가
- 예상 소요: 40초
- 기대 반응(wow moment): 반려 직후 큐 카운터 숫자가 줄어드는 모션 + 처리 로그 최상단에 카드가 슬라이드인
- 스크린샷 계획: 4컷 — (1) 관리자 대시보드 요약 카드 3개 (2) 승인 대기 큐 리스트 (3) 반려 사유 모달 (4) 처리 로그에 기록 추가된 상태

### S-04: 개인 예술인이 프로젝트 모집글 작성
- 페르소나: P-1 (같은 댄서, 이번엔 자신이 팀 리더로서 프로젝트 모집)
- 동기: 유튜브 단편 뮤직비디오 촬영을 위해 여성 댄서 2명 단기 모집
- 관련 요구사항: R-01, R-07, R-17, R-18
- 클릭 경로: 1) 홈 상단 탭에서 "프로젝트 모집"으로 전환 → 2) 페이지 전환 시 카드 리스트가 fade-in → 3) "+ 모집글 작성" 버튼 → 4) 작성 폼(분야·인원·기간·장소·보수 유형·상세 WYSIWYG) → 5) 임시 저장(toast) → 6) 본문 보강 후 게시 → 7) 리스트 최상단에 새 카드가 슬라이드인(highlight ring)
- 예상 소요: 60초
- 기대 반응(wow moment): 게시 직후 새 카드가 리스트 최상단에서 테두리 하이라이트 3초 후 사라지는 확정 피드백
- 스크린샷 계획: 4컷 — (1) 탭 전환 직후 프로젝트 리스트 (2) 작성 폼 WYSIWYG (3) 임시 저장 토스트 (4) 리스트 최상단 새 카드 하이라이트

### S-05: 댄스학원 행정 담당자가 주말 키즈 힙합반 강사를 모집
- 페르소나: P-2 변형 (댄스학원 행정·운영 담당자, 32세) — RFP 명시 페르소나 "댄스학원" 직접 대응
- 동기: 분기 정규반 강사 1명을 4월 마감일 안에 시범 수업까지 마쳐야 함
- 관련 요구사항: R-02, R-04, R-05, R-08
- 클릭 경로: 1) 홈 상단 검색바에 "레슨" 입력 → 2) 자동완성 첫 항목 "레슨 공고 모아보기" 선택 → 3) `/jobs?type=lesson` 도착, 상단 jobType 탭 "레슨" 강조·카드에 레슨/장르 이중 배지 → 4) "주말 키즈 힙합반 외부 강사" 카드 클릭 → 5) 상세에서 강사 자격·운영 시간·분기 보너스 확인 → 6) 헤더 우측 계정 전환으로 기업(c-009 스튜디오라이즈댄스아카데미)으로 전환 → 7) "+ 새 공고 등록" → 8) 첫 select에서 jobType "레슨" 선택, 안내 문구 "검색 탭과 매칭됩니다" 노출 → 9) 장르 카테고리 "댄스" + 지역·일정 입력 후 등록 → 10) 토스트 "관리자 승인 대기" → 11) `/jobs?type=lesson` 복귀 시 새 공고가 카드 리스트 상단에 위치
- 예상 소요: 70초
- 기대 반응(wow moment): 자동완성에서 "레슨" 한 단어 입력만으로 jobType 4탭 라우팅이 즉시 매칭되는 동선 + 등록 폼에서 jobType 선택이 사용자 검색 동선과 같은 어휘로 연결된다는 일관성 인지
- 스크린샷 계획: 4컷 — (1) 자동완성 "레슨" 입력 결과 (2) `/jobs?type=lesson` 탭 강조 + 카드 배지 이중 표시 (3) 강사 모집 상세 페이지 운영 시간·자격 영역 (4) 등록 폼 jobType 셀렉트 활성 상태

---

## 1. 기술스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 15 (App Router, Static Export) |
| 언어 | TypeScript |
| 스타일링 | TailwindCSS 3.4 + shadcn/ui 컴포넌트 복제 (버튼/다이얼로그/드로어/토스트) |
| 애니메이션 | Framer Motion (stagger, slide-in, ring) |
| 아이콘 | lucide-react |
| 상태관리 | React Context (Auth, UI) + sessionStorage 영속화 |
| WYSIWYG | 경량 자체 RichTextEditor (contentEditable + execCommand) |
| 더미 데이터 | `lib/data/*.ts` 타입 안전 모듈 |
| 배포 | GitHub Pages (`Firstpip/demos/kmong-225834-demo`) |

`next.config.ts` basePath 환경분기: `process.env.GITHUB_PAGES ? '/demos/kmong-225834-demo' : ''`, `trailingSlash: true`, `output: 'export'`.

## 2. 페이지 목록 및 라우팅

### 사용자 영역 (13페이지)
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 홈 | 히어로 + 카테고리 그리드 + 추천 공고 + 추천 예술인 + 최근 프로젝트 모집 |
| `/login` | 로그인 | 일반/기업 탭 없이 이메일만, 데모 안내 문구 |
| `/signup` | 회원가입 | 일반/기업 탭 전환, 폼 분기 |
| `/jobs` | 채용공고 리스트 | 좌측 필터(지역·장르·경력·고용형태) + 카드 그리드 + D-day 배지 |
| `/jobs/[id]` | 채용공고 상세 | Tier 1 체크리스트 전수 + 기업 정보 + 지원 CTA |
| `/jobs/new` | 공고 등록 (기업) | WYSIWYG 본문, 카테고리·지역·경력 필드 |
| `/projects` | 프로젝트 모집 리스트 | 상단 탭 네비(채용공고 ↔ 프로젝트) |
| `/projects/[id]` | 프로젝트 상세 | 모집 조건·일정·리더 프로필·댓글(Mock) |
| `/projects/new` | 프로젝트 모집글 작성 | WYSIWYG + 임시저장 |
| `/artists` | 예술인 리스트 | 카드(프로필사진·장르태그·경력 년수·대표 영상 썸네일) |
| `/artists/[id]` | 예술인 상세 | 영상 그리드·경력·보유 기술 태그·추천 공고 |
| `/mypage` | 마이페이지 | 내 지원 내역 / 스크랩 / 내가 쓴 프로젝트 / 내 공고(기업 회원: 4 통계 카드 + jobType 분포 막대 + 카드별 지원자·조회 메트릭) / 알림 |
| `/profile/edit` | 프로필 편집 | 일반/기업 공통 + 포트폴리오 링크·태그 편집 |

### 관리자 영역 (8페이지)
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/admin` | 관리자 대시보드 | 요약 카드 3개(승인 대기·오늘 처리·신고) + 최근 활동 로그 |
| `/admin/approvals` | 공고 승인 큐 | 대기/승인/반려 탭, 상세 검토 우측 패널 |
| `/admin/members` | 회원 관리 | 일반/기업 탭, 상태 변경(활성·정지), 검색 |
| `/admin/jobs` | 공고 관리 | 전체 공고 리스트, 삭제·비공개 처리 |
| `/admin/projects` | 게시글 관리 | 프로젝트 모집글 전체 관리 |
| `/admin/reports` | 신고 관리 | 공고·게시글·프로필 신고 큐, 처리 상태 |
| `/admin/categories` | 카테고리 관리 | jobType + 장르 양 축 CRUD, 사용 중 항목 삭제 잠금, 표시 순서 변경 |

**총 20페이지** (사용자 13 + 관리자 7)

## 3. 권한 체계

| 경로 패턴 | 비로그인 | 일반회원 | 기업회원 | 관리자 |
|-----------|----------|----------|----------|--------|
| `/`, `/jobs`, `/jobs/[id]`, `/projects`, `/projects/[id]`, `/artists`, `/artists/[id]` | 허용 | 허용 | 허용 | 허용 |
| `/login`, `/signup` | 허용(guest-only) | 차단→/ | 차단→/ | 차단→/ |
| `/mypage`, `/profile/edit`, `/projects/new` | 차단→/login | 허용 | 허용 | 허용 |
| `/jobs/new` (jobType 동적 추가 필드) | 차단→/login | 차단→/jobs | 허용 | 허용 |
| `/jobs/[id]/apply` (지원 모달) | 차단→/login | 허용 | 본인 회사 공고만 차단 | 허용 |
| `/admin/**` | 차단→/login | 차단→/ | 차단→/ | 허용 |

- AuthGuard 컴포넌트 하나로 처리. `hydrated === true` 이전엔 판단 보류 + "불러오는 중..." 스피너.
- `guestOnly` 경로는 로그인 상태에서 홈으로, `protected`는 비로그인에서 `/login?next=intended`, `admin`은 비관리자 전체 차단.
- 역할 전환 토글: 헤더 우측 드롭다운에 "일반회원 데모 계정 / 기업회원 데모 계정 / 관리자 데모 계정" 프리셋. 데모라서 비밀번호 없이 전환.

## 4. 디자인 시스템

예술인 특화 브랜드 — 무대 조명 이미지에서 힌트. 과한 화려함 없이 강한 포인트 하나.

### 컬러 팔레트
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-bg` | `#FAFAF7` | 본문 배경 (따뜻한 오프화이트) |
| `--color-surface` | `#FFFFFF` | 카드 배경 |
| `--color-text` | `#121212` | 본문 |
| `--color-muted` | `#6B6B6B` | 보조 텍스트 |
| `--color-line` | `#E6E6E1` | 구분선 |
| `--color-primary` | `#FF5A36` | 브랜드 포인트 (무대 조명 오렌지-코랄) |
| `--color-primary-hover` | `#E6492A` | 호버 |
| `--color-accent` | `#1A1A1A` | 강조 텍스트 블록 배경 |
| `--color-success` | `#0E9F6E` | 승인·성공 |
| `--color-warning` | `#F59E0B` | 대기·주의 |
| `--color-danger` | `#DC2626` | 반려·삭제 |

### 타이포그래피
- 본문: Pretendard Variable (next/font 자가 호스팅)
- 헤드라인(H1·히어로): Pretendard + tracking -0.02em, font-weight 800
- 스케일: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48 / 60
- 줄 높이: 본문 1.65, 제목 1.2

### 레이아웃
- 최대 너비: `max-w-[1200px]`, 좌우 패딩 24px (모바일 16px)
- 섹션 세로 간격: 80px (모바일 48px)
- 그리드: 3열(데스크톱) / 2열(태블릿) / 1열(모바일)

### 컴포넌트 스타일
- Button: default(solid primary), secondary(검정 라인), ghost, destructive. 모서리 `rounded-xl`, 높이 44/40/36 3단계
- Card: 흰색 배경 + `border border-[line]` + `shadow-sm hover:shadow-md`, `rounded-2xl`
- Input/Select/Textarea: 높이 44, 포커스 링 2px primary
- Badge: New(primary), D-day(warning), 마감임박(danger), 승인대기(warning), 게시중(success)
- Modal/Drawer: radix dialog 기반 custom, overlay 40% 블러

### 반응형 브레이크포인트
`sm 640` / `md 768` / `lg 1024` / `xl 1280`

## 5. 공통 컴포넌트

- `Header` — 로고(ARTWORK), 메인 탭(채용공고 / 프로젝트 모집 / 예술인), 검색바(데스크톱), 로그인/가입 또는 프로필 드롭다운(역할 전환 토글 포함)
- `Footer` — 운영 정보, 약관·개인정보·문의, 법인정보(더미)
- `AuthGuard` — hydrated 가드 + 권한 체크 + 리다이렉트
- `AppShell` — Header + main + Footer 래핑 (admin에서는 제외)
- `AdminLayout` — 사이드바(대시보드/승인큐/회원/공고/게시글/신고) + AuthGuard(role=admin)
- `RichTextEditor` — 제목·굵게·기울임·밑줄·리스트·인용·링크 툴바
- `Toast` · `Modal` · `Drawer` — shadcn 스타일 복제
- `JobCard`, `ArtistCard`, `ProjectCard`, `Filter`, `EmptyState`, `LoadingSkeleton`, `ErrorState`
- `CategoryPill`, `DdayBadge`, `StatusBadge`

## 6. 페이지별 기능 명세

### 홈 `/`
- 히어로: 브랜드 헤드라인 "무대에 설 기회, 여기서 시작" + 검색바(공고·예술인 통합) + 카테고리 8개 퀵 진입
- 섹션 1: 추천 공고 8개 카드 (D-day 배지, 장르 태그, 지역·경력)
- 섹션 2: 주목 예술인 6명 (프로필 사진 + 대표 영상 썸네일 + 장르 태그)
- 섹션 3: 최근 프로젝트 모집 6개
- 섹션 4: 플랫폼 사용 가이드 (구직자용 3스텝 + 기업용 3스텝)
- 빈 상태: 데모에서는 발생하지 않지만, 필터 이후 페이지에서 일관

### 채용공고 리스트 `/jobs`
- 좌측 필터(데스크톱) / 상단 시트(모바일): 지역 다중선택, 장르(카테고리), 고용형태(상주·프로젝트·일회성), 경력(무관·1년 미만·1~3년·3년+), 마감 임박
- 상단: 검색바, 정렬(최신·마감임박·인기), 결과 카운트, 선택 필터 chip
- 카드 그리드: 썸네일(기업 로고·포스터) / 제목 / 회사명 / 지역·경력 / D-day 배지 / 스크랩 아이콘
- 로딩: 스켈레톤 카드 9개
- 빈 상태: "조건에 맞는 공고가 없어요. 필터를 넓혀보세요." + 필터 초기화 CTA
- 무한스크롤 대신 페이지네이션(12/page, stagger fade-in)

### 채용공고 상세 `/jobs/[id]` — Tier 1 전수
1. 미디어: 공연 포스터 메인 + 참고 이미지 썸네일 4개 (클릭 시 메인 교체)
2. 브레드크럼: 홈 > 채용공고 > {카테고리} > {제목}
3. 기본 정보: 제목, 회사명, 카테고리 태그, "D-3" 배지, "신규"/"인기" 배지
4. 주요 정보 카드: 고용형태·지역·경력·일정·보수·모집인원
5. 조건 태그 섹션: 제공(의상·교통·식사·숙소), 선호 조건
6. CTA 2종: "지원하기"(solid primary) + "스크랩"(outline), 우측 고정 sidebar (스크롤 중 유지)
7. 탭 3개: **상세 설명**(WYSIWYG 렌더, `.rich-content`) / **회사 정보**(회사 소개·과거 공고 3개) / **문의**(Q&A 아코디언 + 문의하기 버튼)
8. 관련 공고 4개 (같은 카테고리)

### 채용공고 등록 `/jobs/new` (기업 전용)
- 폼 섹션: 기본 정보(제목·카테고리·지역·고용형태·경력) / 일정·보수 / 상세 설명(WYSIWYG 필수) / 제공 조건(체크박스) / 공개 범위
- 실시간 유효성 검증(필수 미입력 시 submit 차단, 에러 메시지 인라인)
- 하단 고정 바: 임시 저장 / 미리보기 / 제출
- 제출 후 → 대시보드 "승인 대기" 탭으로 이동 + 토스트

### 프로젝트 모집 리스트 `/projects`
- 상단 탭: 채용공고 ↔ 프로젝트 모집 (공통 리스트 뷰에서 탭 전환)
- 카드: 분야·인원·기간·지역·보수 유형(유·무보수·공연 수익 배분)·리더 프로필 썸네일
- 필터: 분야, 기간(1주/한달/프로젝트별), 보수 유형

### 프로젝트 상세 `/projects/[id]` — Tier 1 + 커뮤니티형 일부
1. 리더 프로필 카드 (이름·장르·경력·팔로우 수) + 브레드크럼
2. 기본 정보: 제목·분야·지역·기간·인원·보수 유형
3. 상세 설명 (WYSIWYG 렌더)
4. CTA: "참여 신청"(primary), "메시지"(outline), "공유"(ghost)
5. 탭 2개: 상세 / 댓글(Mock, 4~6개)
6. 관련 모집글 4개

### 프로젝트 모집글 작성 `/projects/new`
- 필드: 제목·분야·인원·기간·장소·보수 유형(셀렉트)·상세(WYSIWYG)
- 임시 저장 / 게시

### 예술인 리스트 `/artists`
- 필터: 장르·지역·경력 년수
- 카드: 프로필사진 · 대표 영상 썸네일(호버 시 재생 아이콘) · 이름 · 장르 태그 · 경력 · 팔로우
- 빈 상태: "조건에 맞는 예술인을 찾지 못했어요"

### 예술인 상세 `/artists/[id]` — Tier 1 + 포트폴리오형
1. 히어로: 프로필사진 + 이름 + 한 줄 소개 + CTA(제안하기·메시지·공유)
2. 포트폴리오 영상 그리드 4~6개 (모달 재생)
3. 경력 타임라인 (연도별, 5개 이상)
4. 보유 기술·장르 태그
5. 추천 공고 4개 (이 예술인과 매칭되는 카테고리)
6. 탭 2개: 소개 / 후기(섭외자 후기 Mock)

### 마이페이지 `/mypage`
- 상단 요약: 지원 수 · 스크랩 수 · 내가 쓴 프로젝트 수
- 탭: 지원 내역(상태별 필터: 대기·합격·불합격) / 스크랩 / 내 프로젝트 / 내 공고(기업 시)
- 카드 클릭 시 상세로 이동
- 빈 상태별: "아직 지원한 공고가 없어요" 등

### 프로필 편집 `/profile/edit`
- 공통: 프로필사진(업로드 Mock), 이름, 연락처, 소개
- 일반: 장르·경력 년수·대표 경력 3줄·포트폴리오 링크(YouTube·Vimeo·인스타), 기술 태그
- 기업: 회사명·사업자번호(Mock)·대표자·회사 소개
- 저장 → 토스트 + 헤더 프로필 아이콘 즉시 반영

### 관리자 `/admin` 대시보드
- 요약 카드 3개: 승인 대기(숫자 + 임시 막대 그래프), 오늘 처리, 신고
- 최근 활동 로그 10개 (승인/반려/회원 제재/신고 처리)
- 사이드바 내비(AdminLayout)

### 관리자 `/admin/approvals`
- 좌측: 승인 대기 큐 리스트
- 우측: 선택된 공고 상세 검토 패널 (공고 내용·회사 정보)
- 하단 고정 액션: "승인" / "반려" (사유 모달)
- 탭: 대기 / 승인 / 반려

### 관리자 `/admin/members`
- 탭: 일반 / 기업
- 컬럼: 이름 · 이메일 · 가입일 · 상태 · 마지막 접속 · 액션(정지·재개)
- 검색·정렬

### 관리자 `/admin/jobs`, `/admin/projects`
- 전체 게시물 리스트, 상태 필터, 삭제·비공개

### 관리자 `/admin/reports`
- 신고 큐: 대상 유형(공고·게시글·프로필) · 신고자 · 사유 · 처리 상태
- 처리 액션: 경고·삭제·반려

## 7. 시맨틱 ID 설계

| 영역 | id |
|------|-----|
| 전역 헤더 | `app-header` |
| 헤더 검색바 | `header-search` |
| 역할 전환 토글 | `role-switch` |
| 홈 히어로 검색 | `hero-search` |
| 홈 카테고리 그리드 | `home-categories` |
| 공고 리스트 필터 | `job-filters` |
| 공고 카드 | `job-card-{id}` |
| 공고 상세 지원 버튼 | `job-apply-cta` |
| 공고 상세 스크랩 | `job-scrap-btn` |
| 공고 탭 | `job-tabs` |
| 공고 등록 폼 | `job-create-form` |
| WYSIWYG 에디터 | `rte-editor` |
| 지원 모달 | `apply-modal` |
| 프로젝트 탭 전환 | `main-tab-jobs` / `main-tab-projects` |
| 예술인 영상 그리드 | `artist-portfolio-grid` |
| 마이페이지 지원 탭 | `mypage-tab-applications` |
| 관리자 승인 큐 | `admin-approval-queue` |
| 반려 사유 모달 | `reject-reason-modal` |
| 토스트 영역 | `toast-root` |

## 8. 데이터 구조

```ts
type UserType = 'general' | 'company' | 'admin'
type JobStatus = 'pending' | 'approved' | 'closed' | 'rejected'
type ApplicationStatus = 'pending' | 'accepted' | 'rejected'
type ProjectStatus = 'open' | 'closed'
type ReportStatus = 'open' | 'resolved' | 'dismissed'

interface User {
  id: string
  email: string
  type: UserType
  name: string
  phone?: string
  createdAt: string
  status: 'active' | 'suspended'
  avatar?: string
}

interface ArtistProfile {
  userId: string
  genres: string[]       // ['힙합', '왁킹']
  experienceYears: number
  bio: string            // 5~8줄 HTML
  portfolio: {
    videos: { url: string; title: string; thumb: string }[]
    images: { url: string; caption: string }[]
  }
  skills: string[]
  careerTimeline: { year: number; title: string; description: string }[]
}

interface CompanyProfile {
  userId: string
  companyName: string
  businessNumber: string // Mock
  representative: string
  description: string    // HTML
  website?: string
}

interface Category { id: string; name: string; slug: string; emoji: string }

interface Job {
  id: string
  companyId: string
  title: string
  categoryId: string
  location: string       // 시·구
  employmentType: '상주' | '프로젝트' | '일회성'
  experience: '무관' | '1년 미만' | '1~3년' | '3년+'
  deadline: string       // YYYY-MM-DD
  budget: string         // "협의" or "300만원" 등 표시 문자열
  headcount: number
  description: string    // HTML (WYSIWYG)
  perks: string[]        // ['의상', '교통', '식사']
  status: JobStatus
  createdAt: string
  views: number
  scraps: number
}

interface Application {
  id: string
  jobId: string
  userId: string
  coverLetter: string
  attachedPortfolio?: string
  status: ApplicationStatus
  createdAt: string
}

interface Project {
  id: string
  authorId: string
  title: string
  categoryId: string
  location: string
  duration: string
  headcount: number
  payType: '유보수' | '무보수' | '수익 배분'
  description: string    // HTML
  status: ProjectStatus
  createdAt: string
  comments: { id: string; userId: string; body: string; createdAt: string }[]
}

interface Report {
  id: string
  targetType: 'job' | 'project' | 'profile'
  targetId: string
  reporterId: string
  reason: string
  status: ReportStatus
  createdAt: string
}

interface Notification { id: string; userId: string; title: string; body: string; read: boolean; createdAt: string }
```

## 9. 더미 데이터 구성

- **장르 카테고리 8개**: 댄스 / 음악 / 연기 / 모델 / 서커스 / 마술 / 성우 / 기타 (Lucide 아이콘 컴포넌트로 배지 시각화, `Category.icon` 필드)
- **공고 비즈니스 타입 4종**: 레슨 / 공연 / 행사 / 프로젝트 (`JobType` enum, RFP 명시 카테고리 직접 매핑)
- **유저**: 일반 회원 15명(댄서 중심, 실명 더미), 기업 회원 8명(엔터·축제·광고 스타트업), 관리자 1명
- **예술인 프로필** 15명: 장르 분포 댄스 7 / 음악 3 / 연기 2 / 모델 2 / 서커스 1. 각 프로필 영상 3~5개 (YouTube 공개 URL), 경력 타임라인 5~8개, 자기소개 5~8줄 HTML
- **채용공고 24개**: 상태 분포 승인됨 18 / 대기 4 / 반려 1 / 마감 1. 카테고리·지역·경력 다양화. 상세 설명 8줄 이상 HTML, 제공 조건 평균 3개
- **프로젝트 모집 12개**: 보수 유형 유/무/수익배분 다양화. 각 글에 댓글 4~6개
- **지원 내역 34개**: 상태 분포 대기 18 / 합격 10 / 불합격 6. 자기소개 200자 내외
- **신고 4개**: 대상 유형 섞이게 (공고 2·프로젝트 1·프로필 1). 처리 상태 대기 2 / 해결 1 / 기각 1
- **알림 20개**: 가입·승인·지원 결과 등 종류 다양화
- **후기(섭외자 후기, 예술인 프로필용)**: 예술인당 평균 3개, 구체 경험 3~5줄
- **FAQ 8개**: 가입·공고·지원·보수 질문, 답변 3~5줄

---

## 검수 전 확인

- 10개 섹션(0번 시나리오 포함) 모두 작성됨 (확인)
- 시나리오 5개(S-01~S-05), 각 7항목 전수 작성 (S-05: RFP 명시 페르소나 "댄스학원" + jobType "레슨" 직접 대응)
- 상세 페이지 Tier 1 체크리스트 항목 단위로 명세 — 채용공고 상세·프로젝트 상세·예술인 상세에 풀어서 기재됨
- 시맨틱 id가 Step 8 스크린샷 자동화와 시나리오 클릭 경로 요소 전수 매칭
- 더미 데이터 양 충분 (1~2개 샘플 금지)
- WYSIWYG 적용 필드 명시: 공고 상세 설명 / 프로젝트 상세 / 예술인 자기소개 / 기업 소개

---

## 부록 A: R-ID ↔ 페이지·컴포넌트 매핑 (Step 6 자체 검증용)

| R-ID | 요구사항 요약 | 충족 페이지·컴포넌트 | 데모 충족도 |
|------|--------------|----------------------|-------------|
| R-01 | 회원가입/로그인 | `/login`, `/signup` (이메일·비번 폼, OAuth 버튼 Mock) | UI 완전 |
| R-02 | 일반/기업 구분 | `/signup` 회원유형 선택 → `/mypage` 권한별 메뉴 분기 | UI 완전 |
| R-03 | 프로필 입력 | `/profile/edit` (이름·연락처·장르·경력·포트폴리오 링크·프로필 이미지) | UI 완전 |
| R-04 | 채용공고 CRUD | `/jobs/new` 등록(jobType + 장르 분리 셀렉트 + jobType별 동적 추가 필드 카드), `/admin/jobs` 수정/삭제 액션 | UI 완전 |
| R-05 | 공고 카테고리 | `/jobs` 상단 jobType 4탭(레슨/공연/행사/프로젝트) + 사이드바 장르·지역·고용형태·경력 필터, `/jobs/[id]` jobType+장르 이중 배지, `/jobs/new` jobType+장르 분리 셀렉트 | UI 완전 |
| R-06 | 채용공고 리스트/상세 | `/jobs` 리스트(필터·정렬), `/jobs/[id]` 상세(지원 CTA) | UI 완전 |
| R-07 | 프로젝트/공연 모집 | `/projects`, `/projects/[id]`, `/projects/new` | UI 완전 |
| R-08 | 검색·필터 | 모든 리스트(jobs/projects/artists)에 키워드+다중 필터 | UI 완전 |
| R-09 | 관리자 회원관리 | `/admin/members` (조회·상태 변경·제재 액션) | UI 완전 |
| R-10 | 관리자 공고 승인/삭제 | `/admin/approvals`, `/admin/jobs` (승인 큐·반려) | UI 완전 |
| R-11 | 관리자 게시글 관리 | `/admin/projects`, `/admin/jobs` (조회·삭제) | UI 완전 |
| R-12 | 반응형 웹 | 전 페이지 Tailwind breakpoint(sm/md/lg) 적용. Step 6 768/375 검증 | 검증 대상 |
| R-13 | DB 확장성 | `/admin/categories`에서 jobType 4종(잠금된 RFP 명시) + 장르 8종 마스터 CRUD 직접 시연, 사용 중 항목 삭제 차단으로 데이터 정합성 정책 노출. 본 운영 ERD·확장 포인트(RBAC/i18n/결제/감사 로그/알림 채널/검색 인덱스/jobType 추가 필드)는 제안서 텍스트로 보강 | UI 일부 + 텍스트 |
| R-14 | 유지보수·호스팅 안내 | 데모 외부, 제안서 본문에서 운영 비용·인계 방식 명시 (Step 9) | 비-UI |
| R-15 | 지원하기 | `/jobs/[id]` 지원 폼 + 기업 측 `/admin/jobs` 지원자 보기 동선(S-02) | UI 완전 |
| R-16 | 포트폴리오 업로드/링크 | `/profile/edit` 포트폴리오 URL 필드, `/artists/[id]` 임베드 표시 | UI 완전 |
| R-17 | 빈/로딩/에러 상태 | Skeleton(`components/common/Skeleton.tsx`), EmptyState(`EmptyState.tsx`), ErrorState(Step 6 신규 추가) | 검증 대상 |
| R-18 | 권한 분기 | 비로그인/일반/기업/관리자 4단 분기 — `/admin/*` 진입, `/jobs/new` 기업만, `/profile/edit` 본인만 | UI 완전 |
| R-19 | SEO 기본값 | `app/layout.tsx` metadata, 동적 라우트 `generateMetadata`. sitemap은 빌드 후 정적 OK | UI 완전 |
| R-20 | 이메일 알림 | `/mypage` 알림 탭, `/admin/reports` 알림 발송 이력 (실 발송은 Mock UI) | Mock 시연 |
| R-21 | 신고·차단 | 공고/프로젝트/프로필 상세 신고 버튼 + `/admin/reports` 처리 큐 | UI 완전 |

**S-ID ↔ R-ID 매핑은 본 문서 섹션 0(시연 시나리오)에 이미 명시됨** — Puppeteer 종주에서 시나리오 단위로 어설트.

미충족·부분 충족 항목: R-13(카테고리 관리 CRUD UI는 시연, ERD·확장 포인트는 제안서 텍스트로 보강), R-14(비-UI 운영 영역, 제안서로 처리), R-20(이메일 발송은 Mock UI 시연만). 제안서·발표 시 명확히 구분.
