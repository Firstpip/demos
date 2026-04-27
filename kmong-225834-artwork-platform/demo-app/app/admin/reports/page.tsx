"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { reports } from "@/lib/data/reports";
import { getUser } from "@/lib/data/users";
import { relativeDate } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { ReportStatus } from "@/lib/types";

export default function AdminReportsPage() {
  const [tab, setTab] = useState<"open" | "resolved" | "dismissed">("open");
  const [overrides, setOverrides] = useState<Record<string, ReportStatus>>({});
  const { show } = useToast();

  const merged = useMemo(() => reports.map((r) => ({ ...r, status: overrides[r.id] ?? r.status })), [overrides]);
  const list = merged.filter((r) => r.status === tab);

  const handle = (id: string, next: ReportStatus) => {
    setOverrides((prev) => ({ ...prev, [id]: next }));
    show(next === "resolved" ? "신고를 조치했어요" : "신고를 기각 처리했어요", "success");
  };

  return (
    <AdminLayout title="신고 관리" subtitle="공고·모집글·프로필에 대한 신고를 처리합니다.">
      <div className="flex items-center gap-1 mb-5" role="tablist">
        {([
          { id: "open" as const, label: "대기", count: merged.filter((r) => r.status === "open").length },
          { id: "resolved" as const, label: "조치 완료", count: merged.filter((r) => r.status === "resolved").length },
          { id: "dismissed" as const, label: "기각", count: merged.filter((r) => r.status === "dismissed").length },
        ]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === t.id ? "bg-[var(--color-accent)] text-white" : "bg-[#F3F3EE] text-[var(--color-muted)]"}`}>
            {t.label} <span className="opacity-70 ml-1">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((r) => {
          const reporter = getUser(r.reporterId);
          return (
            <div key={r.id} className="card p-5">
              <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <span className="badge badge-dark">
                  {r.targetType === "job" ? "공고" : r.targetType === "project" ? "모집글" : "프로필"}
                </span>
                <span>{r.reason}</span>
                <span className="ml-auto">{relativeDate(r.createdAt)}</span>
              </div>
              <div className="mt-1 font-semibold">{r.targetTitle}</div>
              <p className="mt-2 text-sm text-[var(--color-muted)] leading-relaxed">{r.detail}</p>
              <div className="mt-3 text-xs text-[var(--color-muted)]">신고자: {reporter?.name || "익명"}</div>
              {r.status === "open" && (
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-primary btn-sm" onClick={() => handle(r.id, "resolved")}>조치 완료</button>
                  <button className="btn btn-outline btn-sm" onClick={() => handle(r.id, "dismissed")}>기각</button>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="card p-10 text-center text-sm text-[var(--color-muted)]">처리할 신고가 없어요.</div>
        )}
      </div>
    </AdminLayout>
  );
}
