import type { JobType } from "./types";

export const JOB_TYPE_OPTIONS: { id: JobType; label: string; description: string }[] = [
  { id: "lesson", label: "레슨", description: "정규·단기 레슨 강사 모집" },
  { id: "performance", label: "공연", description: "무대·페스티벌 공연자 섭외" },
  { id: "event", label: "행사", description: "런웨이·축제·기업 이벤트" },
  { id: "project", label: "프로젝트", description: "촬영·녹음·콘텐츠 제작" },
];

export const JOB_TYPE_LABEL: Record<JobType, string> = JOB_TYPE_OPTIONS.reduce(
  (acc, o) => ({ ...acc, [o.id]: o.label }),
  {} as Record<JobType, string>,
);

export function getJobTypeLabel(t: JobType): string {
  return JOB_TYPE_LABEL[t] ?? t;
}
