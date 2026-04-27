"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthGuard from "@/components/common/AuthGuard";
import RichTextEditor from "@/components/common/RichTextEditor";
import { categories } from "@/lib/data/categories";
import { JOB_TYPE_OPTIONS } from "@/lib/jobType";
import type { JobType, JobTypeMeta } from "@/lib/types";
import JobTypeFields, { EMPTY_TYPE_META, ensureTypeMeta } from "@/components/common/JobTypeFields";
import { useToast } from "@/providers/ToastProvider";
import { useAuth } from "@/providers/AuthProvider";

const LOCATIONS = ["서울 강남구", "서울 마포구", "서울 종로구", "서울 성수동", "서울 홍대", "서울 여의도", "경기 파주시", "경기 고양시", "인천 중구", "부산 해운대구"];
const PERKS = ["의상 제공", "교통비", "식사 제공", "숙박 제공", "헤어·메이크업 제공", "영상 2차 사용"];

export default function JobNewPage() {
  return (
    <AuthGuard allow={["company", "admin"]}>
      <JobNewInner />
    </AuthGuard>
  );
}

function JobNewInner() {
  const router = useRouter();
  const { show } = useToast();
  const { session } = useAuth();

  const [title, setTitle] = useState("2026 서울 프린지 페스티벌 힙합 크루 모집");
  const [jobType, setJobType] = useState<JobType>("performance");
  const [typeMeta, setTypeMeta] = useState<JobTypeMeta>(EMPTY_TYPE_META.performance);
  const [cat, setCat] = useState("dance");
  const [loc, setLoc] = useState("서울 종로구");
  const [emp, setEmp] = useState<"상주" | "프로젝트" | "일회성">("프로젝트");
  const [exp, setExp] = useState<"무관" | "1년 미만" | "1~3년" | "3년+">("1~3년");
  const [deadline, setDeadline] = useState("2026-05-05");
  const [budget, setBudget] = useState("회당 25만원 (리허설 1 + 본 공연 2)");
  const [headcount, setHeadcount] = useState(4);
  const [description, setDescription] = useState("<h2>공연 개요</h2><p>2026 서울 프린지 페스티벌 메인 스테이지 중 주말 저녁 슬롯에 올릴 힙합 크루 공연을 함께할 댄서를 찾습니다. 15분 구성·2곡 메들리 예정이며 안무 구성은 공동으로 진행합니다.</p>");
  const [perks, setPerks] = useState<string[]>(["의상 제공", "교통비", "식사 제공"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const togglePerk = (p: string) => {
    setPerks((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (title.trim().length < 8) e.title = "제목을 8자 이상 입력해주세요.";
    if (!deadline) e.deadline = "마감일을 선택해주세요.";
    if (headcount < 1) e.headcount = "모집 인원은 1명 이상이어야 해요.";
    if (description.replace(/<[^>]+>/g, "").trim().length < 30) e.description = "상세 설명은 30자 이상 작성해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = (draft: boolean) => {
    if (!draft && !validate()) {
      show("필수 항목을 확인해주세요.", "error");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      if (draft) {
        show("임시 저장되었어요", "success");
      } else {
        show("공고가 등록되어 관리자 승인 대기 상태입니다.", "success");
        router.push("/mypage?tab=my-jobs");
      }
    }, 450);
  };

  return (
    <div className="demo-container py-8">
      <div className="mb-6">
        <div className="text-xs text-[var(--color-muted)]">기업 회원 전용</div>
        <h1 className="mt-1 text-2xl md:text-3xl font-bold">새 공고 등록</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">모든 공고는 관리자 검토를 거쳐 게시됩니다. 평균 영업일 기준 하루 이내 결과를 알려드려요.</p>
      </div>

      <form id="job-create-form" className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6">
          <FormSection title="기본 정보">
            <Field label="공고 타입" required>
              <select
                className="input demo-select"
                value={jobType}
                onChange={(e) => {
                  const next = e.target.value as JobType;
                  setJobType(next);
                  setTypeMeta(ensureTypeMeta(next, typeMeta));
                }}
                aria-describedby="jobtype-help"
              >
                {JOB_TYPE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label} - {o.description}</option>)}
              </select>
              <div id="jobtype-help" className="text-xs text-[var(--color-muted)] mt-1">레슨/공연/행사/프로젝트 중 가장 가까운 형태를 선택하세요. 아래 추가 필드가 자동으로 갱신됩니다.</div>
            </Field>
            <Field label="공고 제목" error={errors.title} required>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="장르 카테고리" required>
                <select className="input demo-select" value={cat} onChange={(e) => setCat(e.target.value)}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="지역" required>
                <select className="input demo-select" value={loc} onChange={(e) => setLoc(e.target.value)}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="고용형태" required>
                <select className="input demo-select" value={emp} onChange={(e) => setEmp(e.target.value as typeof emp)}>
                  {["상주", "프로젝트", "일회성"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="경력" required>
                <select className="input demo-select" value={exp} onChange={(e) => setExp(e.target.value as typeof exp)}>
                  {["무관", "1년 미만", "1~3년", "3년+"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
          </FormSection>

          <JobTypeFields jobType={jobType} value={typeMeta} onChange={setTypeMeta} />

          <FormSection title="일정 · 보수">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="마감일" required error={errors.deadline}>
                <input type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </Field>
              <Field label="모집 인원" required error={errors.headcount}>
                <input type="text" inputMode="numeric" className="input" value={String(headcount)} onChange={(e) => setHeadcount(Number(e.target.value.replace(/\D/g, "")) || 0)} />
              </Field>
              <Field label="보수 (표시 문자열)">
                <input className="input" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="상세 설명" description="WYSIWYG 에디터로 공연 개요·준비 일정·선호 조건을 단계별로 작성하면 지원 품질이 올라갑니다.">
            <Field label="상세 설명" required error={errors.description}>
              <RichTextEditor id="rte-editor" value={description} onChange={setDescription} minHeight={260} />
            </Field>
          </FormSection>

          <FormSection title="제공 조건">
            <div className="flex flex-wrap gap-2">
              {PERKS.map((p) => (
                <label key={p} className={`px-3 py-2 rounded-lg border cursor-pointer text-sm ${perks.includes(p) ? "border-[var(--color-primary)] bg-[#FFEDE8] text-[var(--color-primary)]" : "border-[var(--color-line)] text-[var(--color-muted)]"}`}>
                  <input type="checkbox" className="sr-only" checked={perks.includes(p)} onChange={() => togglePerk(p)} />
                  {p}
                </label>
              ))}
            </div>
          </FormSection>
        </div>

        <aside className="lg:sticky lg:top-20 self-start space-y-4">
          <div className="card p-5 text-sm">
            <div className="font-bold mb-2">등록자 정보</div>
            <div className="text-[var(--color-muted)]">{session?.name}</div>
            <div className="text-xs text-[var(--color-muted)] mt-1">담당자 정보·연락처는 내부 관리자에게만 공유됩니다.</div>
          </div>
          <div className="card p-5 text-sm">
            <div className="font-bold mb-2">검토 기준</div>
            <ul className="space-y-1.5 text-[var(--color-muted)]">
              <li>· 카테고리와 설명이 일치하는지</li>
              <li>· 연락처·개인정보가 본문에 노출되지 않는지</li>
              <li>· 허위·과장 표현이 없는지</li>
              <li>· 보수 조건이 구체적인지</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => onSave(false)} disabled={saving}>
              {saving ? "저장 중…" : "등록하고 승인 요청"}
            </button>
            <button type="button" className="btn btn-outline btn-md" onClick={() => onSave(true)} disabled={saving}>
              임시 저장
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-6">
      <h2 className="font-bold text-base">{title}</h2>
      {description && <p className="text-xs text-[var(--color-muted)] mt-1">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label} {required && <span className="text-[var(--color-primary)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <div className="text-xs text-[var(--color-danger)] mt-1">{error}</div>}
    </label>
  );
}
