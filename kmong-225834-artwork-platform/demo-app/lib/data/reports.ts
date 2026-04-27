import { Report, Notification, FaqItem } from "../types";

export const reports: Report[] = [
  { id: "r-001", targetType: "job", targetId: "job-023", targetTitle: "반려 테스트 공고 - 허위 콘텐츠", reporterId: "u-003", reason: "허위·과장 콘텐츠", detail: "카테고리와 설명이 전혀 일치하지 않고 연락처가 적혀있지 않습니다. 가입 후 실제 공고인지 확인이 안 됩니다.", status: "open", createdAt: "2026-04-21" },
  { id: "r-002", targetType: "project", targetId: "proj-007", targetTitle: "케이팝 커버 영상 촬영 팀원 5명", reporterId: "u-010", reason: "기타 위반", detail: "참여 조건은 무보수인데 지원 유도 문구가 과장된 것 같습니다. 참여 후 실제 혜택을 구체적으로 공개해주면 좋겠습니다.", status: "open", createdAt: "2026-04-22" },
  { id: "r-003", targetType: "profile", targetId: "u-009", targetTitle: "윤지환 프로필", reporterId: "u-013", reason: "도용 의심", detail: "영상 포트폴리오 일부가 다른 아티스트의 작업물과 동일해 보입니다.", status: "resolved", createdAt: "2026-04-15" },
  { id: "r-004", targetType: "job", targetId: "job-021", targetTitle: "인플루언서 광고 댄서", reporterId: "u-002", reason: "정보 불명확", detail: "촬영 시간·장소·현장 구체 정보가 없어 신뢰가 어렵습니다.", status: "dismissed", createdAt: "2026-04-22" },
];

export const notifications: Notification[] = [
  { id: "n-001", userId: "u-001", type: "application", title: "지원 완료", body: "‘2026 서울 프린지 페스티벌 힙합 크루 모집’ 공고에 지원이 접수되었습니다. 마이페이지에서 진행 상황을 확인하세요.", read: false, createdAt: "2026-04-20 19:12" },
  { id: "n-002", userId: "u-001", type: "application", title: "합격 안내", body: "‘마감된 과거 공고 - 2026 봄 이벤트’ 지원 결과가 합격으로 처리되었습니다.", read: true, createdAt: "2026-03-19 10:04" },
  { id: "n-003", userId: "u-002", type: "application", title: "합격 안내", body: "‘인디 아티스트 뮤직비디오 백댄서’ 공고 캐스팅 대상자로 확정되었습니다.", read: false, createdAt: "2026-04-21 14:32" },
  { id: "n-004", userId: "u-007", type: "application", title: "합격 안내", body: "‘브랜드 TVC 댄서 캐스팅’ 공고 캐스팅이 확정되었습니다.", read: false, createdAt: "2026-04-20 09:22" },
  { id: "n-005", userId: "u-010", type: "application", title: "불합격 안내", body: "‘인디 아티스트 뮤직비디오 백댄서’ 지원 결과 불합격 처리되었습니다.", read: true, createdAt: "2026-04-19 11:08" },
  { id: "n-006", userId: "c-001", type: "approval", title: "공고 승인 완료", body: "‘브랜드 TVC 댄서 캐스팅’ 공고가 승인되어 게시 중입니다.", read: false, createdAt: "2026-04-17 15:30" },
  { id: "n-007", userId: "c-003", type: "approval", title: "공고 등록 알림", body: "‘2026 서울 프린지 페스티벌 힙합 크루 모집’ 공고가 등록되어 승인 대기 상태입니다.", read: true, createdAt: "2026-04-15 10:10" },
  { id: "n-008", userId: "c-006", type: "approval", title: "승인 대기", body: "‘할로윈 야외 이머시브 쇼 퍼포머’ 공고가 접수되어 검토 중입니다. 48시간 이내 안내드립니다.", read: false, createdAt: "2026-04-22 09:01" },
  { id: "n-009", userId: "u-003", type: "message", title: "새 메시지", body: "문유리 님이 ‘현대무용 3인 프로젝트 잔향’ 관련 메시지를 남겼습니다.", read: false, createdAt: "2026-04-20 21:48" },
  { id: "n-010", userId: "u-005", type: "message", title: "새 메시지", body: "송채원 님이 마술 개인쇼 오프닝 관련 문의를 남겼습니다.", read: true, createdAt: "2026-04-10 13:02" },
  { id: "n-011", userId: "u-001", type: "system", title: "프로필 공개 안내", body: "프로필 공개 범위가 ‘섭외자 전체’로 전환되었습니다. 설정에서 변경 가능합니다.", read: true, createdAt: "2026-04-02 08:00" },
  { id: "n-012", userId: "a-001", type: "system", title: "일일 활동 요약", body: "오늘 처리 건수 12건, 승인 대기 5건, 신고 2건. 대기 공고 중 최장 경과는 37시간입니다.", read: false, createdAt: "2026-04-22 09:00" },
  { id: "n-013", userId: "c-002", type: "approval", title: "공고 승인 완료", body: "‘인디 아티스트 뮤직비디오 백댄서’ 공고가 승인되었습니다.", read: true, createdAt: "2026-04-18 14:20" },
  { id: "n-014", userId: "u-002", type: "application", title: "지원 현황", body: "‘왁킹 쇼케이스 팀원 3명’ 프로젝트에 5명이 지원했어요. 리뷰를 시작해보세요.", read: false, createdAt: "2026-04-22 08:14" },
  { id: "n-015", userId: "u-008", type: "system", title: "팔로워 100명 돌파", body: "축하해요! 프로필 팔로워가 500명을 넘어섰어요.", read: true, createdAt: "2026-04-05 20:20" },
  { id: "n-016", userId: "u-013", type: "application", title: "지원 완료", body: "‘브랜드 TVC 댄서 캐스팅’ 공고에 지원이 접수되었습니다.", read: false, createdAt: "2026-04-18 22:10" },
  { id: "n-017", userId: "c-005", type: "approval", title: "공고 승인 완료", body: "‘S/S 컬렉션 런웨이 모델 캐스팅’ 공고가 승인되었습니다.", read: true, createdAt: "2026-04-05 11:34" },
  { id: "n-018", userId: "u-005", type: "application", title: "지원 현황", body: "‘단편 영화 주연 배우 오디션’ 지원이 검토 중입니다.", read: false, createdAt: "2026-04-16 09:50" },
  { id: "n-019", userId: "u-006", type: "message", title: "새 메시지", body: "블루문엔터테인먼트 담당자가 뷰티 런칭쇼 관련 메시지를 남겼습니다.", read: false, createdAt: "2026-04-17 18:00" },
  { id: "n-020", userId: "u-001", type: "system", title: "포트폴리오 업데이트 제안", body: "가장 최근 포트폴리오 등록일이 3개월 전입니다. 새 영상이 있다면 업데이트해보세요.", read: true, createdAt: "2026-04-01 07:30" },
];

export const faqItems: FaqItem[] = [
  { id: "f-001", category: "가입", question: "일반회원과 기업회원은 무엇이 다른가요?", answer: "일반회원은 본인의 예술인 프로필을 등록하고 공고·프로젝트에 지원·참여할 수 있습니다. 기업회원은 채용공고 등록과 지원자 프로필 검토 기능을 사용할 수 있고, 상세 대시보드에서 섭외 현황을 관리합니다. 가입 시 유형을 선택하고 이후에도 설정에서 전환 요청이 가능합니다." },
  { id: "f-002", category: "공고", question: "공고는 등록 즉시 노출되나요?", answer: "모든 공고는 관리자 검토 후 게시됩니다. 평균 소요는 영업일 기준 하루 이내이고, 필수 정보(카테고리·지역·조건)가 명확할수록 빠르게 승인됩니다. 승인·반려 결과는 알림으로 전달되며, 반려 시 사유와 수정 가이드가 함께 제공됩니다." },
  { id: "f-003", category: "지원", question: "지원한 공고 결과는 어떻게 확인하나요?", answer: "마이페이지 ‘지원 내역’ 탭에서 대기·합격·불합격 상태별로 확인할 수 있고, 상태가 변경되면 이메일·앱 알림으로도 전달됩니다. 기업이 추가 자료를 요청하면 메시지로 알림이 옵니다." },
  { id: "f-004", category: "보수", question: "보수는 어떻게 정산되나요?", answer: "1차 MVP에서는 보수 정산을 플랫폼에서 대행하지 않고, 공고·프로젝트 상세에 명시된 조건에 따라 기업 또는 팀 리더가 직접 지급합니다. 계약서·보수 관련 기본 가이드를 자료실에서 제공합니다." },
  { id: "f-005", category: "프로필", question: "포트폴리오 영상은 어떻게 올리나요?", answer: "프로필 편집에서 YouTube·Vimeo·인스타그램 URL을 입력하면 자동으로 임베드됩니다. 외부 플랫폼 사용은 저작권 관리와 재생 호환성을 고려한 결정이며, 파일 업로드형 MVP 이후 단계에서 검토 예정입니다." },
  { id: "f-006", category: "신고", question: "허위 공고·게시글은 어떻게 신고하나요?", answer: "공고·프로젝트·프로필 페이지 우측의 ‘신고’ 버튼으로 접수하실 수 있습니다. 사유를 선택하고 내용을 작성하면 관리자가 확인해 24시간 이내 조치 결과를 알려드립니다." },
  { id: "f-007", category: "승인", question: "공고가 반려되었을 때 재등록할 수 있나요?", answer: "반려 사유를 확인한 뒤 수정해서 다시 제출하면 검토가 재개됩니다. 3회 이상 동일 사유로 반려되면 고객센터 문의가 필요합니다." },
  { id: "f-008", category: "운영", question: "데모 계정은 실제 서비스에서도 동일하게 동작하나요?", answer: "현재는 시연용 데모로, 실제 운영에서는 이메일 인증·기업 인증 프로세스가 추가됩니다. 실서비스 런칭 시 별도 안내드립니다." },
];
