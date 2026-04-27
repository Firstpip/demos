"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Plus, X } from "lucide-react";
import JobCard from "@/components/common/JobCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonCard } from "@/components/common/Skeleton";
import { getActiveJobs } from "@/lib/data/jobs";
import { categories } from "@/lib/data/categories";
import { daysLeft } from "@/lib/utils";
import { JOB_TYPE_OPTIONS } from "@/lib/jobType";
import type { JobType } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

const LOCATIONS = ["서울", "경기", "인천", "부산", "대전", "광주", "충남"];
const EMPLOYMENT_TYPES = ["상주", "프로젝트", "일회성"];
const EXPERIENCES = ["무관", "1년 미만", "1~3년", "3년+"];
const SORTS = [
  { id: "latest", label: "최신순" },
  { id: "deadline", label: "마감임박순" },
  { id: "popular", label: "인기순" },
];

function JobsPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { session } = useAuth();
  const isCompany = session?.type === "company";
  const initialQ = params.get("q") || "";
  const initialCat = params.get("cat") || "";
  const initialType = (params.get("type") || "") as JobType | "";
  const errorMode = params.get("error") === "1";

  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState<string>(initialCat);
  const [jobType, setJobType] = useState<JobType | "">(initialType);
  const [loc, setLoc] = useState<string[]>([]);
  const [emp, setEmp] = useState<string[]>([]);
  const [exp, setExp] = useState<string[]>([]);
  const [urgent, setUrgent] = useState(false);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [q, cat, jobType, loc, emp, exp, urgent, sort]);

  const jobs = useMemo(() => getActiveJobs(), []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = jobs.filter((j) => {
      if (query) {
        const hay = `${j.title} ${j.description} ${j.location}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (cat && j.categoryId !== cat) return false;
      if (jobType && j.jobType !== jobType) return false;
      if (loc.length && !loc.some((l) => j.location.startsWith(l))) return false;
      if (emp.length && !emp.includes(j.employmentType)) return false;
      if (exp.length && !exp.includes(j.experience)) return false;
      if (urgent && daysLeft(j.deadline) > 7) return false;
      return true;
    });
    if (sort === "deadline") list = [...list].sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline));
    else if (sort === "popular") list = [...list].sort((a, b) => b.views - a.views);
    else list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return list;
  }, [jobs, q, cat, jobType, loc, emp, exp, urgent, sort]);

  const toggleItem = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const reset = () => {
    setQ("");
    setCat("");
    setJobType("");
    setLoc([]);
    setEmp([]);
    setExp([]);
    setUrgent(false);
    router.replace("/jobs");
  };

  const appliedChips: { label: string; remove: () => void }[] = [];
  if (jobType) {
    const opt = JOB_TYPE_OPTIONS.find((o) => o.id === jobType);
    appliedChips.push({ label: opt?.label || jobType, remove: () => setJobType("") });
  }
  if (cat) appliedChips.push({ label: categories.find((c) => c.id === cat)?.name || cat, remove: () => setCat("") });
  loc.forEach((l) => appliedChips.push({ label: l, remove: () => toggleItem(l, setLoc) }));
  emp.forEach((e) => appliedChips.push({ label: e, remove: () => toggleItem(e, setEmp) }));
  exp.forEach((e) => appliedChips.push({ label: e, remove: () => toggleItem(e, setExp) }));
  if (urgent) appliedChips.push({ label: "마감임박", remove: () => setUrgent(false) });

  return (
    <div className="demo-container py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">채용공고</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">기업과 기획자가 올린 레슨·공연·행사·프로젝트 공고를 확인하세요.</p>
        </div>
        {isCompany && (
          <Link
            href="/jobs/new"
            id="jobs-list-post-cta"
            className="btn btn-primary btn-md self-start md:self-auto whitespace-nowrap"
          >
            <Plus size={16} />
            공고 등록
          </Link>
        )}
      </div>

      <div role="tablist" aria-label="공고 비즈니스 타입" className="flex flex-wrap gap-2 mb-6 border-b border-[var(--color-line)] pb-3">
        <button
          type="button"
          role="tab"
          aria-selected={jobType === ""}
          onClick={() => setJobType("")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold focus-ring transition-colors ${jobType === "" ? "bg-[var(--color-text)] text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"}`}
        >
          전체
        </button>
        {JOB_TYPE_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={jobType === o.id}
            onClick={() => setJobType(o.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold focus-ring transition-colors ${jobType === o.id ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"}`}
            title={o.description}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside id="job-filters" className={`${showFilter ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : "hidden"} lg:block lg:static lg:p-0 lg:bg-transparent`}>
          <div className="lg:hidden flex items-center justify-between mb-4">
            <span className="font-bold">필터</span>
            <button onClick={() => setShowFilter(false)} className="btn btn-ghost btn-sm"><X size={16} /></button>
          </div>
          <FilterGroup title="카테고리">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <label key={c.id} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    checked={cat === c.id}
                    onChange={() => setCat(cat === c.id ? "" : c.id)}
                  />
                  <span className="inline-flex items-center gap-1"><Icon size={14} aria-hidden /> {c.name}</span>
                </label>
              );
            })}
          </FilterGroup>
          <FilterGroup title="지역">
            {LOCATIONS.map((l) => (
              <label key={l} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                <input type="checkbox" checked={loc.includes(l)} onChange={() => toggleItem(l, setLoc)} />
                <span>{l}</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="고용형태">
            {EMPLOYMENT_TYPES.map((t) => (
              <label key={t} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                <input type="checkbox" checked={emp.includes(t)} onChange={() => toggleItem(t, setEmp)} />
                <span>{t}</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="경력">
            {EXPERIENCES.map((e) => (
              <label key={e} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                <input type="checkbox" checked={exp.includes(e)} onChange={() => toggleItem(e, setExp)} />
                <span>{e}</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="마감">
            <label className="flex items-center gap-2 py-1 text-sm cursor-pointer">
              <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
              <span>7일 이내 마감</span>
            </label>
          </FilterGroup>
          <button onClick={reset} className="btn btn-outline btn-sm mt-2 btn-full">필터 초기화</button>
        </aside>

        <section>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <input
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="키워드로 검색 (제목·지역·내용)"
                aria-label="공고 키워드 검색"
              />
            </div>
            <select className="input demo-select w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <button onClick={() => setShowFilter(true)} className="btn btn-outline btn-md lg:hidden">
              <Filter size={14} /> 필터
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-[var(--color-muted)]">
              총 <strong className="text-[var(--color-text)]">{filtered.length}</strong>건
            </span>
            {appliedChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {appliedChips.map((c, i) => (
                  <button key={i} onClick={c.remove} className="badge badge-neutral" type="button">
                    {c.label} <X size={12} />
                  </button>
                ))}
                <button onClick={reset} className="text-xs text-[var(--color-primary)] font-semibold">모두 해제</button>
              </div>
            )}
          </div>

          {errorMode ? (
            <ErrorState onRetry={() => router.replace("/jobs")} />
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            isCompany ? (
              <EmptyState
                title="조건에 맞는 공고가 없어요"
                description="찾는 공고가 없다면 직접 새 공고를 등록해 인재를 모집해보세요."
                cta={{ label: "새 공고 등록", href: "/jobs/new" }}
                secondaryCta={{ label: "필터 초기화", onClick: reset }}
              />
            ) : (
              <EmptyState
                title="조건에 맞는 공고가 없어요"
                description="필터를 넓히거나 다른 키워드로 다시 검색해보세요."
                cta={{ label: "필터 초기화", onClick: reset }}
              />
            )
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 1 },
                show: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {filtered.map((job) => (
                <motion.div
                  key={job.id}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {isCompany && (
        <Link
          href="/jobs/new"
          id="jobs-list-post-fab"
          aria-label="새 공고 등록"
          className="md:hidden fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-lg shadow-black/15 focus-ring"
        >
          <Plus size={18} />
          공고 등록
        </Link>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-4 mb-4 border-b border-[var(--color-line)]">
      <div className="font-semibold text-sm mb-2">{title}</div>
      <div>{children}</div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
      <JobsPageInner />
    </Suspense>
  );
}
