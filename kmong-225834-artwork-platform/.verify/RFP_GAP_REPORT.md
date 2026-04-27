# RFP 재대조 갭 분석 - 2026-04-27

## 원본 RFP 핵심 (https://kmong.com/enterprise/requests/225834)

- 제목: 예술인 채용·공연·협업 플랫폼 ARTWORK 웹사이트
- 의뢰인: 기업 (초기 스타트업, 예산 협의 가능)
- 예산: 300만원, 기간 2026-04-24 ~ 2026-05-31 (38일)
- 카테고리(원문 명시): **레슨 / 공연 / 행사 / 프로젝트**
- 페르소나(원문 명시):
  - 구직자: 댄서, 스트릿댄서, 퍼포머, 예술전공 학생, 프리랜서 아티스트
  - 구인자: 댄스학원, 공연팀, 행사기획자, 브랜드, 콘텐츠 제작자, 에이전시
- 강조: "초기 MVP", "추후 확장 가능한 구조 (중요)", "플랫폼 구조 이해도"
- 디자인 톤: "깔끔하고 직관적인 UI", 잡코리아·사람인 단순화 구조 참고

## 현 데모와 RFP 갭

### A. RFP 명시 미충족 (P0)

#### A-1. 공고 비즈니스 타입 카테고리 누락
- RFP 원문: "카테고리(레슨/공연/행사/프로젝트)"
- 현재: `Job.categoryId`는 장르(댄스/음악/연기/모델/서커스/마술/성우/기타)만. 비즈니스 타입 축 부재.
- 영향: 페르소나(댄스학원·행사기획자·콘텐츠제작자) 진입 동선이 의도대로 잡히지 않음. R-ID 매핑 표의 R-05 "UI 완전" 표기는 실제 절반 충족.

#### A-2. 댄스학원·레슨 강사 채용 더미 0건
- RFP 명시 페르소나에 "댄스학원" 포함, 카테고리에 "레슨" 포함
- 현재: 더미 회사 8개 모두 엔터/축제/광고 스타트업. 댄스학원 0, 레슨 공고 0.

### B. demo-plan ↔ 실구현 불일치 (P1)

#### B-1. 검색 자동완성 미구현
- demo-plan.md S-01 wow moment: "자동완성에서 '힙합 · 댄스' 선택"
- 실제 `HomeHero.tsx`/`Header.tsx`: 단순 form submit, 자동완성 없음
- 시연 시 "약속과 다름" 위험

#### B-2. 확장 가능한 구조 시각 시연 없음
- RFP "(중요)" 강조
- 현재: 제안서 PDF에서만 처리 예정. 데모에 ERD/확장 포인트 가시화 0.

### C. 시연 깊이 강화 (P2)

- **C-1**: 레슨 시나리오 S-05 추가 (댄스학원이 주말 강사 모집 → 후보 프로필 검토 → 메시지)
- **C-2**: 카테고리 관리 관리 UI (관리자가 카테고리 추가/이름 변경) - "확장 구조" 강조 대응
- **C-3**: 공고 타입별 동적 추가 필드 (레슨: 강사 자격·요일·학원 위치 / 공연: 일시·리허설 / 행사: 드레스 코드 / 프로젝트: 산출물·저작권)
- **C-4**: 마이페이지 기업 "내 공고" 탭 (demo-plan 명시했으나 실구현 확인 필요)

### D. 톤·제안서 (P3)

- **D-1**: 잡코리아/사람인 단순화 톤 - 사용자 메모리(디자인·인터랙션 우선)에 따라 보류 권장
- **D-2**: 호스팅·유지보수 비용 표 - 제안서 PDF Step 9에서 처리

## 권장 실행 묶음

### 묶음 1 (P0, 최우선) — 1.5~2시간 예상
**A-1 + A-2 + C-1 + B-1**
1. `lib/types.ts`에 `JobType = "lesson"|"performance"|"event"|"project"` 추가
2. `Job` 인터페이스에 `jobType: JobType` 필드 추가, 기존 24개 공고에 분배 (행사 8 / 공연 6 / 프로젝트 6 / 레슨 4)
3. `lib/data/users.ts`에 댄스학원 기업회원 2~3개 추가 (예: 스튜디오라이즈·헬리오스댄스아카데미·청담무용원)
4. 위 학원이 등록한 레슨 강사 채용 공고 4~5건 추가 (장르: 댄스 위주, 일부 음악/연기)
5. `app/jobs/page.tsx` 상단에 jobType 4탭(레슨/공연/행사/프로젝트 + 전체) 추가, 기존 카테고리 사이드바는 장르 축으로 유지
6. JobCard·상세에 jobType 배지 (장르 배지와 시각적 구분)
7. `app/jobs/new/page.tsx` 첫 번째 select에 jobType 필드 추가
8. 시나리오 S-05 정의 (`demo-plan.md` 섹션 0): 페르소나 P-2의 변형 = 댄스학원 행정 담당자, R-02·R-04·R-05·R-08 매핑, 클릭 경로·wow moment 작성
9. `tools/scripts/verify.mjs` SCENARIOS 배열에 S-05 추가
10. Header·HomeHero 검색 자동완성 컴포넌트 (장르·지역·jobType·기존 공고 제목 매칭, 키보드 네비, 5~8개 표시)
11. `analysis.md` R-05 업데이트, R-ID 매핑 표 갱신
12. 빌드 + verify.mjs + axe 재실행, REPORT.md 8.3절 추가
13. 사용자 재확인 → OK 시 Step 7 진입

### 묶음 2 (P1, 차순위) — 1~1.5시간 예상
**B-2 + C-2**
1. 관리자 라우트 `/admin/system` 추가 (관리자 권한)
2. ERD 다이어그램 (SVG 또는 Mermaid 정적 렌더): users / artist_profiles / company_profiles / jobs / applications / projects / project_comments / categories / reports / notifications
3. 확장 포인트 가시화: 카테고리 관리, RBAC, i18n, 결제 hook 자리
4. `/admin/categories` 카테고리 관리 관리 UI (jobType + 장르 양쪽 CRUD)

### 묶음 3 (P2, 선택) — 1~2시간
**C-3 + C-4**
1. jobType별 동적 추가 필드 컴포넌트 (`<JobTypeFields type={jobType} />`)
2. 마이페이지 `MyJobs` 탭 추가 (기업 회원만 노출)

## 다음 세션 진입 체크리스트

1. dev 서버 살아있는지 확인: `lsof -iTCP:3001 -sTCP:LISTEN`. 죽었으면 `cd demo-app && npm run dev`
2. 본 문서 + `analysis.md` (R-ID), `demo-plan.md` (S-ID·시나리오) 읽기
3. 묶음 1부터 진행. 각 단계 완료 시 즉시 빌드/verify 통과 확인
4. 검수 도구: `cd tools && node scripts/verify.mjs` / `BASE_URL=http://localhost:3001 node scripts/axe.mjs`
5. 이모지 금지·톤 규칙 유지 (`workflow/scripts/tone-lint.sh`)
6. 묶음 1 완료 → 사용자 재확인 → 묶음 2 여부 협의 → Step 7 진입
