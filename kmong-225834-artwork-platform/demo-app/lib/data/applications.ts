import { Application } from "../types";

export const applications: Application[] = [
  { id: "app-001", jobId: "job-001", userId: "u-001", coverLetter: "서준호입니다. 2025년 서울 프린지에서 솔로 스테이지를 진행했고, 지난 두 축제에서 크루 리더로 참여한 경험이 있어 동선·안무 맞추는 속도가 빠릅니다. 얼번·힙합 양쪽 모두 자신있고, 레퍼런스는 포트폴리오 영상 중 1·3번을 참고 부탁드립니다.", attachedPortfolio: "u-001", status: "pending", createdAt: "2026-04-20" },
  { id: "app-002", jobId: "job-001", userId: "u-007", coverLetter: "강현우입니다. 크럼프 중심이지만 최근 힙합·얼번 크로스오버 작업을 병행하고 있습니다. 야외 공연 체력은 자신있고, 리허설 일정에 유연하게 맞출 수 있습니다.", attachedPortfolio: "u-007", status: "accepted", createdAt: "2026-04-19" },
  { id: "app-003", jobId: "job-001", userId: "u-013", coverLetter: "임동현입니다. 케이팝 백댄서와 배틀을 병행해왔고, 프린지 무대 규모 경험이 있습니다. 팀 안무에 빠르게 녹아들 수 있어요.", attachedPortfolio: "u-013", status: "pending", createdAt: "2026-04-19" },
  { id: "app-004", jobId: "job-001", userId: "u-002", coverLetter: "김하윤입니다. 왁킹·보깅이 메인이지만 쇼케이스 포맷 경험이 많아 크루 안무에도 활용할 수 있을 것 같습니다.", attachedPortfolio: "u-002", status: "pending", createdAt: "2026-04-20" },
  { id: "app-005", jobId: "job-002", userId: "u-002", coverLetter: "여성 댄서 라인 참여 가능합니다. 무드 컨셉 왁킹 포즈·트랜지션 가능해요. 야외 촬영 경험도 있습니다.", attachedPortfolio: "u-002", status: "accepted", createdAt: "2026-04-21" },
  { id: "app-006", jobId: "job-002", userId: "u-006", coverLetter: "정서현입니다. 룩북·에디토리얼 촬영이 주 경력이지만 감성적인 움직임도 연습해왔습니다. 영상 촬영 앵글 이해가 빠릅니다.", attachedPortfolio: "u-006", status: "pending", createdAt: "2026-04-20" },
  { id: "app-007", jobId: "job-002", userId: "u-010", coverLetter: "한서연입니다. 보컬 메인이지만 해당 곡을 커버해본 경험이 있어 MV 분위기에 어울릴 수 있을 것 같습니다.", status: "rejected", createdAt: "2026-04-19" },
  { id: "app-008", jobId: "job-003", userId: "u-002", coverLetter: "왁킹·보깅 쇼 트랜지션 안무 경력 있습니다. 헤어·의상 팀과 협업도 익숙합니다.", attachedPortfolio: "u-002", status: "accepted", createdAt: "2026-04-18" },
  { id: "app-009", jobId: "job-003", userId: "u-003", coverLetter: "이민서입니다. 컨템퍼러리 중심이지만 런웨이 협업 경험이 있습니다.", attachedPortfolio: "u-003", status: "pending", createdAt: "2026-04-18" },
  { id: "app-010", jobId: "job-004", userId: "u-007", coverLetter: "크럼프 전문입니다. TVC 촬영 경험이 있고 감독 디렉션에 즉시 반응하는 훈련을 해왔습니다.", attachedPortfolio: "u-007", status: "accepted", createdAt: "2026-04-19" },
  { id: "app-011", jobId: "job-004", userId: "u-001", coverLetter: "힙합·얼번 경험으로 파워 스타일 가능합니다. TVC 편집 이해도 있습니다.", attachedPortfolio: "u-001", status: "pending", createdAt: "2026-04-20" },
  { id: "app-012", jobId: "job-005", userId: "u-008", coverLetter: "에어리얼 실크 5년차입니다. 야외 공연·리깅 협업 경험이 있습니다.", attachedPortfolio: "u-008", status: "accepted", createdAt: "2026-04-14" },
  { id: "app-013", jobId: "job-006", userId: "u-005", coverLetter: "최유진입니다. 단편 주연 4편 경험이 있고, 섬세한 심리 묘사에 자신 있습니다.", attachedPortfolio: "u-005", status: "pending", createdAt: "2026-04-15" },
  { id: "app-014", jobId: "job-006", userId: "u-012", coverLetter: "문유리입니다. 중·소극장 주연급 경력이 있고, 영상 연기도 2편 경험했습니다.", attachedPortfolio: "u-012", status: "accepted", createdAt: "2026-04-16" },
  { id: "app-015", jobId: "job-008", userId: "u-006", coverLetter: "런웨이 워크 경력 3년, 컬렉션 쇼 12회 출연.", attachedPortfolio: "u-006", status: "accepted", createdAt: "2026-04-10" },
  { id: "app-016", jobId: "job-009", userId: "u-004", coverLetter: "박도현입니다. 어쿠스틱·감성 팝 세션 경험 풍부합니다.", attachedPortfolio: "u-004", status: "pending", createdAt: "2026-04-17" },
  { id: "app-017", jobId: "job-010", userId: "u-010", coverLetter: "재즈 스탠다드 30곡+ 숙지. 정기 공연 안정적으로 운영 가능합니다.", attachedPortfolio: "u-010", status: "accepted", createdAt: "2026-04-08" },
  { id: "app-018", jobId: "job-011", userId: "u-015", coverLetter: "배우석입니다. 중저음 내레이션 5년 경력. 기업 영상 샘플 첨부합니다.", attachedPortfolio: "u-015", status: "accepted", createdAt: "2026-04-20" },
  { id: "app-019", jobId: "job-012", userId: "u-008", coverLetter: "에어리얼 외에 저글링 경험도 있어 듀오 섹션 협업 가능합니다.", status: "pending", createdAt: "2026-04-14" },
  { id: "app-020", jobId: "job-013", userId: "u-003", coverLetter: "공모 작품 '잔향 시즌2' 제출 예정입니다. 10분 구성.", attachedPortfolio: "u-003", status: "pending", createdAt: "2026-04-10" },
  { id: "app-021", jobId: "job-013", userId: "u-002", coverLetter: "왁킹 쇼케이스 작품 '블룸 프리뷰' 출품 희망합니다.", attachedPortfolio: "u-002", status: "pending", createdAt: "2026-04-12" },
  { id: "app-022", jobId: "job-014", userId: "u-002", coverLetter: "왁킹·보깅 룩북 촬영 가능합니다.", attachedPortfolio: "u-002", status: "pending", createdAt: "2026-04-14" },
  { id: "app-023", jobId: "job-015", userId: "u-015", coverLetter: "연기 보조 경험 있습니다.", status: "rejected", createdAt: "2026-04-16" },
  { id: "app-024", jobId: "job-016", userId: "u-014", coverLetter: "마술 공연 6년차, 지역 축제 경험 있음.", attachedPortfolio: "u-014", status: "accepted", createdAt: "2026-04-05" },
  { id: "app-025", jobId: "job-017", userId: "u-015", coverLetter: "밝은 톤으로도 녹음 가능합니다.", attachedPortfolio: "u-015", status: "pending", createdAt: "2026-04-21" },
  { id: "app-026", jobId: "job-017", userId: "u-006", coverLetter: "30초 샘플 녹음 첨부합니다.", status: "pending", createdAt: "2026-04-21" },
  // u-001 (서준호)의 과거 지원 이력
  { id: "app-027", jobId: "job-024", userId: "u-001", coverLetter: "봄 이벤트 참여 희망.", status: "accepted", createdAt: "2026-03-18" },
  { id: "app-028", jobId: "job-002", userId: "u-001", coverLetter: "남성 댄서 추가 필요 시 고려 부탁드립니다.", status: "rejected", createdAt: "2026-04-19" },
  { id: "app-029", jobId: "job-003", userId: "u-007", coverLetter: "크럼프 기반이지만 왁킹 트랜지션 가능.", status: "rejected", createdAt: "2026-04-17" },
  { id: "app-030", jobId: "job-004", userId: "u-013", coverLetter: "케이팝 감성 파워 스타일 가능합니다.", status: "pending", createdAt: "2026-04-18" },
  { id: "app-031", jobId: "job-006", userId: "u-006", coverLetter: "모델 전향 배우 경험.", status: "rejected", createdAt: "2026-04-15" },
  { id: "app-032", jobId: "job-008", userId: "u-002", coverLetter: "런웨이 워크도 가능합니다.", status: "pending", createdAt: "2026-04-11" },
  { id: "app-033", jobId: "job-010", userId: "u-004", coverLetter: "기타 세션 정기 가능 여부 문의.", status: "pending", createdAt: "2026-04-14" },
  { id: "app-034", jobId: "job-013", userId: "u-001", coverLetter: "솔로 쇼케이스 작품 출품 희망.", attachedPortfolio: "u-001", status: "accepted", createdAt: "2026-04-06" },
];

export function getApplicationsByJob(jobId: string): Application[] {
  return applications.filter((a) => a.jobId === jobId);
}
export function getApplicationsByUser(userId: string): Application[] {
  return applications.filter((a) => a.userId === userId);
}
