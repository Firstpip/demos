"use client";

import type { JobType, JobTypeMeta, LessonMeta, PerformanceMeta, EventMeta, ProjectMeta } from "@/lib/types";

export const EMPTY_TYPE_META: Record<JobType, JobTypeMeta> = {
  lesson: { kind: "lesson", qualification: "", schedule: "", studioAddress: "", trialClass: false },
  performance: { kind: "performance", showDates: "", rehearsals: "", venue: "", costumeProvided: false },
  event: { kind: "event", eventDate: "", dressCode: "", briefingDate: "", cateringProvided: false },
  project: { kind: "project", deliverables: "", copyright: "", ndaRequired: false, finalUseScope: "" },
};

export function ensureTypeMeta(jobType: JobType, current?: JobTypeMeta): JobTypeMeta {
  if (current && current.kind === jobType) return current;
  return EMPTY_TYPE_META[jobType];
}

export default function JobTypeFields({
  jobType,
  value,
  onChange,
}: {
  jobType: JobType;
  value: JobTypeMeta;
  onChange: (next: JobTypeMeta) => void;
}) {
  if (value.kind !== jobType) return null;
  if (value.kind === "lesson") return <LessonFields value={value} onChange={onChange} />;
  if (value.kind === "performance") return <PerformanceFields value={value} onChange={onChange} />;
  if (value.kind === "event") return <EventFields value={value} onChange={onChange} />;
  return <ProjectFields value={value} onChange={onChange} />;
}

function LessonFields({
  value,
  onChange,
}: {
  value: { kind: "lesson" } & LessonMeta;
  onChange: (n: JobTypeMeta) => void;
}) {
  const set = (patch: Partial<LessonMeta>) => onChange({ ...value, ...patch });
  return (
    <FieldGrid title="레슨 추가 정보" hint="강사 자격·운영 일정·학원 위치·시범 수업 여부">
      <Labeled label="강사 자격" hint="예: 댄스학과 졸업, 키즈 지도 1년 이상">
        <input className="input" value={value.qualification} onChange={(e) => set({ qualification: e.target.value })} placeholder="자격 요건" />
      </Labeled>
      <Labeled label="요일·시간">
        <input className="input" value={value.schedule} onChange={(e) => set({ schedule: e.target.value })} placeholder="예: 토 10:00·11:00 / 일 10:00 (50분)" />
      </Labeled>
      <Labeled label="학원 위치">
        <input className="input" value={value.studioAddress} onChange={(e) => set({ studioAddress: e.target.value })} placeholder="예: 서울 마포구 ABC빌딩 3F" />
      </Labeled>
      <Labeled label="시범 수업 운영" hint="첫 주 시범 수업 후 정식 계약 여부">
        <ToggleRow label="첫 주 시범 수업 진행" checked={value.trialClass} onChange={(v) => set({ trialClass: v })} />
      </Labeled>
    </FieldGrid>
  );
}

function PerformanceFields({
  value,
  onChange,
}: {
  value: { kind: "performance" } & PerformanceMeta;
  onChange: (n: JobTypeMeta) => void;
}) {
  const set = (patch: Partial<PerformanceMeta>) => onChange({ ...value, ...patch });
  return (
    <FieldGrid title="공연 추가 정보" hint="공연 일시·리허설 일정·공연장·의상 지급 여부">
      <Labeled label="본 공연 일시·횟수">
        <input className="input" value={value.showDates} onChange={(e) => set({ showDates: e.target.value })} placeholder="예: 5/24, 5/25 19:30 (2회)" />
      </Labeled>
      <Labeled label="리허설 일정" hint="복수 회차 시 줄바꿈으로 구분">
        <input className="input" value={value.rehearsals} onChange={(e) => set({ rehearsals: e.target.value })} placeholder="예: 5/20 18:00 리딩 / 5/22 16:00 드레스" />
      </Labeled>
      <Labeled label="공연장">
        <input className="input" value={value.venue} onChange={(e) => set({ venue: e.target.value })} placeholder="예: 서울 LG아트센터 메인홀" />
      </Labeled>
      <Labeled label="의상 지급">
        <ToggleRow label="공연 의상 지급" checked={value.costumeProvided} onChange={(v) => set({ costumeProvided: v })} />
      </Labeled>
    </FieldGrid>
  );
}

function EventFields({
  value,
  onChange,
}: {
  value: { kind: "event" } & EventMeta;
  onChange: (n: JobTypeMeta) => void;
}) {
  const set = (patch: Partial<EventMeta>) => onChange({ ...value, ...patch });
  return (
    <FieldGrid title="행사 추가 정보" hint="행사 일자·드레스 코드·브리핑 일정·식사 제공">
      <Labeled label="행사 일자">
        <input className="input" value={value.eventDate} onChange={(e) => set({ eventDate: e.target.value })} placeholder="예: 2026-06-15 (토)" />
      </Labeled>
      <Labeled label="드레스 코드" hint="복장·헤어·메이크업 톤">
        <input className="input" value={value.dressCode} onChange={(e) => set({ dressCode: e.target.value })} placeholder="예: 모노톤 정장, 검정 구두" />
      </Labeled>
      <Labeled label="사전 브리핑 일정">
        <input className="input" value={value.briefingDate} onChange={(e) => set({ briefingDate: e.target.value })} placeholder="예: 2026-06-13 14:00 ZOOM 1시간" />
      </Labeled>
      <Labeled label="식사 제공">
        <ToggleRow label="현장 식사 제공" checked={value.cateringProvided} onChange={(v) => set({ cateringProvided: v })} />
      </Labeled>
    </FieldGrid>
  );
}

function ProjectFields({
  value,
  onChange,
}: {
  value: { kind: "project" } & ProjectMeta;
  onChange: (n: JobTypeMeta) => void;
}) {
  const set = (patch: Partial<ProjectMeta>) => onChange({ ...value, ...patch });
  return (
    <FieldGrid title="프로젝트 추가 정보" hint="산출물·저작권·NDA·최종 활용 범위">
      <Labeled label="산출물">
        <input className="input" value={value.deliverables} onChange={(e) => set({ deliverables: e.target.value })} placeholder="예: 본편 60s + 메이킹 30s" />
      </Labeled>
      <Labeled label="저작권 귀속">
        <input className="input" value={value.copyright} onChange={(e) => set({ copyright: e.target.value })} placeholder="예: 본편 권리 발주사 전유, 출연자 본인 SNS 공유 허용" />
      </Labeled>
      <Labeled label="NDA 필요 여부">
        <ToggleRow label="비공개 협약(NDA) 체결" checked={value.ndaRequired} onChange={(v) => set({ ndaRequired: v })} />
      </Labeled>
      <Labeled label="최종 활용 범위" hint="2차 송출·매체·기간">
        <input className="input" value={value.finalUseScope} onChange={(e) => set({ finalUseScope: e.target.value })} placeholder="예: 자사 SNS·유튜브 1년" />
      </Labeled>
    </FieldGrid>
  );
}

function FieldGrid({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5 md:p-6 border-dashed">
      <h2 className="font-bold text-base">{title}</h2>
      {hint && <p className="text-xs text-[var(--color-muted)] mt-1">{hint}</p>}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Labeled({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {hint && <span className="block text-[11px] text-[var(--color-muted)] mt-0.5">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-line)] cursor-pointer text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
