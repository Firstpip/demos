"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import { jobs } from "@/lib/data/jobs";
import { getCompanyProfile } from "@/lib/data/users";
import { getCategory } from "@/lib/data/categories";
import { formatDate, daysLeft } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Search } from "lucide-react";
import { JobStatus } from "@/lib/types";

export default function AdminJobsPage() {
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [q, setQ] = useState("");
  const [hidden, setHidden] = useState<string[]>([]);
  const { show } = useToast();

  const list = useMemo(() => {
    return jobs.filter((j) => {
      if (status !== "all" && j.status !== status) return false;
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        if (!j.title.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [status, q]);

  const hide = (id: string) => {
    setHidden((prev) => (prev.includes(id) ? prev : [...prev, id]));
    show("공고를 비공개로 전환했어요", "success");
  };

  return (
    <AdminLayout title="공고 관리" subtitle="전체 공고를 조회·비공개 처리합니다.">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex flex-wrap gap-1">
          {(["all", "approved", "pending", "rejected", "closed"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`badge ${status === s ? "badge-dark" : "badge-neutral"}`}>
              {s === "all" ? "전체" : s === "approved" ? "게시 중" : s === "pending" ? "대기" : s === "rejected" ? "반려" : "마감"}
            </button>
          ))}
        </div>
        <div className="ml-auto relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={14} />
          <input className="input pl-9" placeholder="제목으로 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-[var(--color-muted)] bg-[#FBFBF7]">
            <tr>
              <th className="px-5 py-3 font-semibold">제목</th>
              <th className="px-5 py-3 font-semibold">카테고리</th>
              <th className="px-5 py-3 font-semibold">기업</th>
              <th className="px-5 py-3 font-semibold">상태</th>
              <th className="px-5 py-3 font-semibold">마감</th>
              <th className="px-5 py-3 font-semibold text-right">조회/스크랩</th>
              <th className="px-5 py-3 font-semibold text-right">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {list.map((j) => {
              const isHidden = hidden.includes(j.id);
              return (
                <tr key={j.id} className="hover:bg-[rgba(0,0,0,0.02)]">
                  <td className="px-5 py-3">
                    <Link href={`/jobs/${j.id}`} className={`font-semibold hover:text-[var(--color-primary)] ${isHidden ? "line-through opacity-60" : ""}`}>{j.title}</Link>
                    <div className="text-xs text-[var(--color-muted)]">{j.location} · {j.employmentType}</div>
                  </td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{getCategory(j.categoryId)?.name}</td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{getCompanyProfile(j.companyId)?.companyName}</td>
                  <td className="px-5 py-3">
                    {isHidden ? <span className="badge badge-neutral">비공개</span> : j.status === "approved" ? <span className="badge badge-success">게시 중</span> : j.status === "pending" ? <span className="badge badge-warning">대기</span> : j.status === "rejected" ? <span className="badge badge-danger">반려</span> : <span className="badge badge-neutral">마감</span>}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{formatDate(j.deadline)} (D-{Math.max(daysLeft(j.deadline), 0)})</td>
                  <td className="px-5 py-3 text-right text-[var(--color-muted)] tabular-nums">{j.views} / {j.scraps}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="btn btn-outline btn-sm" disabled={isHidden} onClick={() => hide(j.id)}>
                      {isHidden ? "비공개됨" : "비공개"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-[var(--color-muted)]">결과가 없어요.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
