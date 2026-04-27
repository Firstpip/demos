"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Pencil,
  Check,
  X,
  Tags,
  Layers,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { categories as seedGenres } from "@/lib/data/categories";
import { JOB_TYPE_OPTIONS } from "@/lib/jobType";
import { jobs } from "@/lib/data/jobs";
import { useToast } from "@/providers/ToastProvider";

type GenreRow = { id: string; name: string; slug: string; locked?: boolean };
type JobTypeRow = { id: string; label: string; description: string; locked?: boolean };

const TABS = [
  { id: "jobtype" as const, label: "공고 타입 (jobType)", icon: Tags },
  { id: "genre" as const, label: "장르 카테고리", icon: Layers },
];

export default function AdminCategoriesPage() {
  const { show } = useToast();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("jobtype");

  const [jobTypes, setJobTypes] = useState<JobTypeRow[]>(
    JOB_TYPE_OPTIONS.map((o) => ({ id: o.id, label: o.label, description: o.description, locked: true })),
  );
  const [genres, setGenres] = useState<GenreRow[]>(
    seedGenres.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  );

  const jobsCountByJobType = useMemo(() => {
    const m: Record<string, number> = {};
    for (const j of jobs) m[j.jobType] = (m[j.jobType] || 0) + 1;
    return m;
  }, []);
  const jobsCountByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    for (const j of jobs) m[j.categoryId] = (m[j.categoryId] || 0) + 1;
    return m;
  }, []);

  return (
    <AdminLayout
      title="카테고리 관리"
      subtitle="공고 타입(jobType)·장르 카테고리를 동적으로 관리"
    >
      <div className="mb-4 text-xs text-[var(--color-muted)]">
        본 데모에서는 변경이 메모리상에 머물며 새로고침 시 초기화됩니다. 본 운영에서는 categories / job_types 테이블의 CRUD로 대응.
      </div>

      <div role="tablist" className="flex gap-2 mb-6 border-b border-[var(--color-line)]">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 focus-ring ${tab === t.id ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"}`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "jobtype" ? (
        <JobTypeMaster
          rows={jobTypes}
          setRows={setJobTypes}
          jobsCount={jobsCountByJobType}
          notify={(m) => show(m, "success")}
        />
      ) : (
        <GenreMaster
          rows={genres}
          setRows={setGenres}
          jobsCount={jobsCountByCategory}
          notify={(m) => show(m, "success")}
        />
      )}
    </AdminLayout>
  );
}

function JobTypeMaster({
  rows,
  setRows,
  jobsCount,
  notify,
}: {
  rows: JobTypeRow[];
  setRows: (r: JobTypeRow[]) => void;
  jobsCount: Record<string, number>;
  notify: (m: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const startEdit = (r: JobTypeRow) => {
    setEditing(r.id);
    setDraftLabel(r.label);
    setDraftDesc(r.description);
  };
  const saveEdit = (id: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, label: draftLabel, description: draftDesc } : r)));
    setEditing(null);
    notify("공고 타입 라벨이 변경되었습니다");
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    notify("표시 순서가 변경되었습니다");
  };
  const remove = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
    notify("공고 타입이 삭제되었습니다");
  };
  const add = () => {
    if (!newId.trim() || !newLabel.trim()) return;
    if (rows.some((r) => r.id === newId.trim())) {
      notify("동일한 ID가 이미 존재합니다");
      return;
    }
    setRows([...rows, { id: newId.trim(), label: newLabel.trim(), description: newDesc.trim() || "—" }]);
    setNewId("");
    setNewLabel("");
    setNewDesc("");
    notify("새 공고 타입이 추가되었습니다");
  };

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h3 className="font-bold text-sm mb-3">현재 공고 타입 ({rows.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--color-muted)] border-b border-[var(--color-line)]">
                <th className="text-left py-2 w-16">순서</th>
                <th className="text-left py-2 w-24">ID</th>
                <th className="text-left py-2 w-28">라벨</th>
                <th className="text-left py-2">설명</th>
                <th className="text-left py-2 w-24">사용 공고</th>
                <th className="text-right py-2 w-44">액션</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-[var(--color-line)] last:border-b-0">
                  <td className="py-2">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        aria-label="위로"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="w-7 h-7 grid place-items-center rounded border border-[var(--color-line)] disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        aria-label="아래로"
                        onClick={() => move(i, 1)}
                        disabled={i === rows.length - 1}
                        className="w-7 h-7 grid place-items-center rounded border border-[var(--color-line)] disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 font-mono text-xs text-[var(--color-muted)]">{r.id}</td>
                  <td className="py-2 font-semibold">
                    {editing === r.id ? (
                      <input
                        className="input h-8 text-sm"
                        value={draftLabel}
                        onChange={(e) => setDraftLabel(e.target.value)}
                        aria-label={`${r.id} 라벨`}
                      />
                    ) : (
                      r.label
                    )}
                  </td>
                  <td className="py-2 text-xs text-[var(--color-muted)]">
                    {editing === r.id ? (
                      <input
                        className="input h-8 text-sm"
                        value={draftDesc}
                        onChange={(e) => setDraftDesc(e.target.value)}
                        aria-label={`${r.id} 설명`}
                      />
                    ) : (
                      r.description
                    )}
                  </td>
                  <td className="py-2 text-xs">
                    <span className="badge badge-neutral">{jobsCount[r.id] || 0}건</span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="inline-flex gap-1">
                      {editing === r.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveEdit(r.id)}
                            className="btn btn-primary btn-sm"
                            aria-label="저장"
                          >
                            <Check size={12} /> 저장
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="btn btn-ghost btn-sm"
                            aria-label="취소"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            className="btn btn-outline btn-sm"
                            aria-label={`${r.label} 편집`}
                          >
                            <Pencil size={12} /> 편집
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(r.id)}
                            disabled={r.locked}
                            className="btn btn-ghost btn-sm text-[var(--color-danger)] disabled:opacity-40"
                            aria-label={`${r.label} 삭제`}
                            title={r.locked ? "RFP 명시 카테고리는 잠겨있음" : "삭제"}
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-[var(--color-muted)] mt-3">
          RFP 원문 명시 4종(레슨/공연/행사/프로젝트)은 잠겨 있어 삭제할 수 없습니다. 라벨·설명·표시 순서는 변경 가능.
        </p>
      </section>

      <section className="card p-5">
        <h3 className="font-bold text-sm mb-3">새 공고 타입 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="new-jt-id">
              ID (영문 소문자)
            </label>
            <input
              id="new-jt-id"
              className="input"
              value={newId}
              onChange={(e) => setNewId(e.target.value.toLowerCase())}
              placeholder="예: workshop"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="new-jt-label">
              표시 라벨
            </label>
            <input id="new-jt-label" className="input" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="예: 워크숍" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="new-jt-desc">
              설명
            </label>
            <input id="new-jt-desc" className="input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="예: 1회성 단기 워크숍" />
          </div>
        </div>
        <button type="button" onClick={add} className="btn btn-primary btn-md mt-4 inline-flex items-center gap-1">
          <Plus size={14} /> 추가
        </button>
      </section>
    </div>
  );
}

function GenreMaster({
  rows,
  setRows,
  jobsCount,
  notify,
}: {
  rows: GenreRow[];
  setRows: (r: GenreRow[]) => void;
  jobsCount: Record<string, number>;
  notify: (m: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");

  const startEdit = (r: GenreRow) => {
    setEditing(r.id);
    setDraftName(r.name);
  };
  const saveEdit = (id: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, name: draftName } : r)));
    setEditing(null);
    notify("장르 라벨이 변경되었습니다");
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    notify("표시 순서가 변경되었습니다");
  };
  const remove = (id: string) => {
    if ((jobsCount[id] || 0) > 0) {
      notify(`사용 중인 장르는 삭제할 수 없습니다 (${jobsCount[id]}건 연결)`);
      return;
    }
    setRows(rows.filter((r) => r.id !== id));
    notify("장르가 삭제되었습니다");
  };
  const add = () => {
    if (!newId.trim() || !newName.trim()) return;
    if (rows.some((r) => r.id === newId.trim())) {
      notify("동일한 ID가 이미 존재합니다");
      return;
    }
    setRows([...rows, { id: newId.trim(), name: newName.trim(), slug: newId.trim() }]);
    setNewId("");
    setNewName("");
    notify("새 장르가 추가되었습니다");
  };

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h3 className="font-bold text-sm mb-3">현재 장르 카테고리 ({rows.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--color-muted)] border-b border-[var(--color-line)]">
                <th className="text-left py-2 w-16">순서</th>
                <th className="text-left py-2 w-24">ID</th>
                <th className="text-left py-2 w-32">라벨</th>
                <th className="text-left py-2 w-28">slug</th>
                <th className="text-left py-2 w-28">사용 공고</th>
                <th className="text-right py-2 w-44">액션</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-[var(--color-line)] last:border-b-0">
                  <td className="py-2">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        aria-label="위로"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="w-7 h-7 grid place-items-center rounded border border-[var(--color-line)] disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        aria-label="아래로"
                        onClick={() => move(i, 1)}
                        disabled={i === rows.length - 1}
                        className="w-7 h-7 grid place-items-center rounded border border-[var(--color-line)] disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 font-mono text-xs text-[var(--color-muted)]">{r.id}</td>
                  <td className="py-2 font-semibold">
                    {editing === r.id ? (
                      <input className="input h-8 text-sm" value={draftName} onChange={(e) => setDraftName(e.target.value)} aria-label={`${r.id} 라벨`} />
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className="py-2 font-mono text-xs text-[var(--color-muted)]">{r.slug}</td>
                  <td className="py-2 text-xs">
                    <span className="badge badge-neutral">{jobsCount[r.id] || 0}건</span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="inline-flex gap-1">
                      {editing === r.id ? (
                        <>
                          <button type="button" onClick={() => saveEdit(r.id)} className="btn btn-primary btn-sm">
                            <Check size={12} /> 저장
                          </button>
                          <button type="button" onClick={() => setEditing(null)} className="btn btn-ghost btn-sm" aria-label="취소">
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(r)}
                            className="btn btn-outline btn-sm"
                            aria-label={`${r.name} 편집`}
                          >
                            <Pencil size={12} /> 편집
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(r.id)}
                            disabled={(jobsCount[r.id] || 0) > 0}
                            className="btn btn-ghost btn-sm text-[var(--color-danger)] disabled:opacity-40"
                            aria-label={`${r.name} 삭제`}
                            title={(jobsCount[r.id] || 0) > 0 ? "사용 중인 장르는 삭제 불가" : "삭제"}
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-[var(--color-muted)] mt-3">
          연결된 공고가 1건 이상이면 삭제 불가. 본 운영에서는 카테고리 폐지 시 마이그레이션 마법사로 일괄 이동 처리.
        </p>
      </section>

      <section className="card p-5">
        <h3 className="font-bold text-sm mb-3">새 장르 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="new-genre-id">
              ID / slug
            </label>
            <input
              id="new-genre-id"
              className="input"
              value={newId}
              onChange={(e) => setNewId(e.target.value.toLowerCase())}
              placeholder="예: kpop"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" htmlFor="new-genre-name">
              표시 라벨
            </label>
            <input id="new-genre-name" className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="예: K-pop" />
          </div>
        </div>
        <button type="button" onClick={add} className="btn btn-primary btn-md mt-4 inline-flex items-center gap-1">
          <Plus size={14} /> 추가
        </button>
      </section>
    </div>
  );
}
