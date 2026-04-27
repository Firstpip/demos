"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Modal from "@/components/common/Modal";
import { jobs } from "@/lib/data/jobs";
import { getCompanyProfile } from "@/lib/data/users";
import { getCategory } from "@/lib/data/categories";
import { daysLeft, ensureHtml, formatDate, relativeDate, stripHtml } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

type QueueTab = "pending" | "approved" | "rejected";

const REJECT_REASONS = [
  "카테고리와 내용이 일치하지 않음",
  "연락처·개인정보 노출",
  "허위·과장 표현",
  "보수·조건 정보 불명확",
];

export default function AdminApprovalsPage() {
  return (
    <AdminLayout title="공고 승인" subtitle="신규 공고를 검토하고 승인·반려를 처리합니다.">
      <Suspense fallback={<div className="py-10 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
        <ApprovalsInner />
      </Suspense>
    </AdminLayout>
  );
}

function ApprovalsInner() {
  const params = useSearchParams();
  const [tab, setTab] = useState<QueueTab>("pending");
  const [selectedId, setSelectedId] = useState<string | null>(params.get("job"));
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reasonList, setReasonList] = useState<string[]>([REJECT_REASONS[0]]);
  const [reasonNote, setReasonNote] = useState("");
  const { markJobApproved, markJobRejected, pendingJobAdjust } = useAuth();
  const { show } = useToast();

  const [localStatus, setLocalStatus] = useState<Record<string, "approved" | "rejected">>({});

  const byTab = useMemo(() => {
    return jobs.map((j) => {
      const override = localStatus[j.id];
      const status = (override ?? j.status) as typeof j.status;
      return { ...j, status };
    });
  }, [localStatus]);

  const list = byTab.filter((j) => j.status === tab);

  const selected = useMemo(() => list.find((j) => j.id === selectedId) || list[0], [list, selectedId]);

  const approve = () => {
    if (!selected) return;
    setLocalStatus((s) => ({ ...s, [selected.id]: "approved" }));
    markJobApproved();
    show("공고가 승인되었어요", "success");
    setSelectedId(null);
  };

  const reject = () => {
    if (!selected) return;
    if (reasonList.length === 0) {
      show("반려 사유를 하나 이상 선택해주세요", "error");
      return;
    }
    setLocalStatus((s) => ({ ...s, [selected.id]: "rejected" }));
    markJobRejected();
    setRejectOpen(false);
    show("공고를 반려했어요. 기업에 사유가 전달됩니다.", "success");
    setSelectedId(null);
  };

  const toggleReason = (r: string) => setReasonList((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const pendingCount = byTab.filter((j) => j.status === "pending").length + pendingJobAdjust;

  return (
    <div>
      <div className="flex items-center gap-1 mb-5" role="tablist">
        {([
          { id: "pending" as const, label: "대기", count: pendingCount },
          { id: "approved" as const, label: "승인됨", count: byTab.filter((j) => j.status === "approved").length },
          { id: "rejected" as const, label: "반려", count: byTab.filter((j) => j.status === "rejected").length },
        ]).map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => { setTab(t.id); setSelectedId(null); }} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === t.id ? "bg-[var(--color-accent)] text-white" : "bg-[#F3F3EE] text-[var(--color-muted)]"}`}>
            {t.label} <span className="opacity-70 ml-1">{t.count}</span>
          </button>
        ))}
      </div>

      <div id="admin-approval-queue" className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        <aside className="card p-3 max-h-[640px] overflow-auto">
          {list.length === 0 ? (
            <div className="text-center text-sm text-[var(--color-muted)] py-10">처리할 공고가 없어요.</div>
          ) : (
            <ul className="space-y-1">
              {list.map((j) => {
                const active = selected?.id === j.id;
                const category = getCategory(j.categoryId);
                return (
                  <li key={j.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(j.id)}
                      className={`w-full text-left p-3 rounded-xl ${active ? "bg-[#FFF4F0] ring-1 ring-[var(--color-primary)]" : "hover:bg-[rgba(0,0,0,0.03)]"}`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
                        {category && <span className="badge badge-neutral">{category.name}</span>}
                        <span>{relativeDate(j.createdAt)}</span>
                      </div>
                      <div className="mt-1 font-semibold text-sm line-clamp-2">{j.title}</div>
                      <div className="text-xs text-[var(--color-muted)] mt-1 line-clamp-1">{getCompanyProfile(j.companyId)?.companyName}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="card p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-[var(--color-muted)]">{getCompanyProfile(selected.companyId)?.companyName} · {getCategory(selected.categoryId)?.name}</div>
                  <h2 className="mt-1 text-xl font-bold leading-snug">{selected.title}</h2>
                  <div className="mt-2 text-xs text-[var(--color-muted)]">
                    접수 {formatDate(selected.createdAt)} · 마감 {formatDate(selected.deadline)} (D-{Math.max(daysLeft(selected.deadline), 0)})
                  </div>
                </div>
                {selected.status === "pending" ? (
                  <span className="badge badge-warning">대기</span>
                ) : selected.status === "approved" ? (
                  <span className="badge badge-success">승인됨</span>
                ) : (
                  <span className="badge badge-danger">반려</span>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <InfoChip label="지역" value={selected.location} />
                <InfoChip label="고용" value={selected.employmentType} />
                <InfoChip label="경력" value={selected.experience} />
                <InfoChip label="인원" value={`${selected.headcount}명`} />
                <InfoChip label="보수" value={selected.budget} />
              </div>

              <div className="mt-5 rich-content border-t border-[var(--color-line)] pt-5 prose-sm" dangerouslySetInnerHTML={{ __html: ensureHtml(selected.description) }} />

              {selected.status === "pending" && (
                <div className="mt-6 pt-5 border-t border-[var(--color-line)] flex flex-wrap gap-2">
                  <button type="button" className="btn btn-primary btn-md" onClick={approve}>
                    <CheckCircle2 size={16} /> 승인
                  </button>
                  <button type="button" className="btn btn-outline btn-md" onClick={() => setRejectOpen(true)}>
                    <XCircle size={16} /> 반려
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm ml-auto">
                    <AlertCircle size={14} /> 기업에 보충 요청
                  </button>
                </div>
              )}

              <div className="mt-5 p-4 rounded-xl bg-[#F7F7F3] text-xs text-[var(--color-muted)]">
                <strong className="text-[var(--color-text)]">자동 점검 결과:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>연락처·이메일 패턴 감지: 없음</li>
                  <li>금지어 포함: 없음</li>
                  <li>상세 설명 길이: {stripHtml(selected.description, 2000).length}자</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-sm text-[var(--color-muted)]">
              좌측 큐에서 공고를 선택해 검토하세요.
            </div>
          )}
        </section>
      </div>

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="반려 사유 선택" id="reject-reason-modal">
        <div className="space-y-3 text-sm">
          {REJECT_REASONS.map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input type="checkbox" checked={reasonList.includes(r)} onChange={() => toggleReason(r)} /> {r}
            </label>
          ))}
          <textarea className="input input-textarea" value={reasonNote} onChange={(e) => setReasonNote(e.target.value)} placeholder="기업에 전달할 상세 메모 (선택)" />
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn btn-outline btn-md" onClick={() => setRejectOpen(false)}>취소</button>
            <button type="button" className="btn btn-danger btn-md" onClick={reject}>반려 처리</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-[#FBFBF7] border border-[var(--color-line)]">
      <div className="text-xs text-[var(--color-muted)]">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
