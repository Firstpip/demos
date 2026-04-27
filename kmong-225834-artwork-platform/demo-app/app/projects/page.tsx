"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import ProjectCard from "@/components/common/ProjectCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonCard } from "@/components/common/Skeleton";
import { getOpenProjects } from "@/lib/data/projects";
import { categories } from "@/lib/data/categories";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";

const PAY_TYPES = ["유보수", "수익 배분", "무보수"] as const;

function ProjectsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialCat = params.get("cat") || "";
  const errorMode = params.get("error") === "1";
  const { session } = useAuth();
  const [cat, setCat] = useState<string>(initialCat);
  const [pay, setPay] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, [cat, pay]);

  const list = useMemo(() => {
    const base = getOpenProjects();
    return base.filter((p) => {
      if (cat && p.categoryId !== cat) return false;
      if (pay.length && !pay.includes(p.payType)) return false;
      return true;
    });
  }, [cat, pay]);

  const togglePay = (v: string) => setPay((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

  return (
    <div className="demo-container py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">프로젝트 · 공연 모집</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">개인·팀이 직접 올린 협업 모집. 단기 프로젝트부터 장기 팀원까지.</p>
        </div>
        <Link
          href={session ? "/projects/new" : "/login?next=/projects/new"}
          className="btn btn-primary btn-md"
        >
          <Plus size={16} /> 모집글 작성
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button onClick={() => setCat("")} className={`badge ${cat === "" ? "badge-dark" : "badge-neutral"}`}>전체</button>
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`badge inline-flex items-center gap-1 ${cat === c.id ? "badge-dark" : "badge-neutral"}`}
            >
              <Icon size={12} aria-hidden /> {c.name}
            </button>
          );
        })}
        <span className="mx-2 h-4 w-px bg-[var(--color-line)]" />
        {PAY_TYPES.map((p) => (
          <button key={p} onClick={() => togglePay(p)} className={`badge ${pay.includes(p) ? "badge-primary" : "badge-neutral"}`}>
            {p}
          </button>
        ))}
      </div>

      {errorMode ? (
        <ErrorState onRetry={() => router.replace("/projects")} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState title="조건에 맞는 모집글이 없어요" description="필터를 넓히거나 직접 모집글을 올려보세요." />
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>
          {list.map((p) => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="h-full">
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
      <ProjectsInner />
    </Suspense>
  );
}
