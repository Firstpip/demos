"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthGuard from "@/components/common/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { getApplicationsByUser } from "@/lib/data/applications";
import { getJob, jobs } from "@/lib/data/jobs";
import { getUser } from "@/lib/data/users";
import { projects } from "@/lib/data/projects";
import JobCard from "@/components/common/JobCard";
import ProjectCard from "@/components/common/ProjectCard";
import EmptyState from "@/components/common/EmptyState";
import { notifications } from "@/lib/data/reports";
import { relativeDate } from "@/lib/utils";
import { Bell, Briefcase, Bookmark, UserPlus } from "lucide-react";
import { JOB_TYPE_OPTIONS, getJobTypeLabel } from "@/lib/jobType";
import { getApplicationsByJob } from "@/lib/data/applications";

type TabId = "applications" | "scraps" | "my-projects" | "my-jobs" | "notifications";

export default function MyPage() {
  return (
    <AuthGuard requireLogin>
      <Suspense fallback={<div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
        <MyPageInner />
      </Suspense>
    </AuthGuard>
  );
}

function MyPageInner() {
  const params = useSearchParams();
  const { session, scraps, myApplications, notificationCountOffset } = useAuth();

  const initialTab = (params.get("tab") as TabId) || "applications";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  if (!session) return null;
  const user = getUser(session.userId);
  const isCompany = session.type === "company";

  const baseApplications = getApplicationsByUser(session.userId);
  const mergedApplications = [
    ...baseApplications,
    ...myApplications
      .filter((jid) => !baseApplications.find((a) => a.jobId === jid))
      .map((jid, i) => ({ id: `local-${i}`, jobId: jid, userId: session.userId, coverLetter: "(방금 제출한 지원서)", status: "pending" as const, createdAt: new Date().toISOString().slice(0, 10) })),
  ];
  const visibleApplications = mergedApplications.filter((a) => statusFilter === "all" || a.status === statusFilter);
  const myProjects = projects.filter((p) => p.authorId === session.userId);
  const myJobs = jobs.filter((j) => j.companyId === session.userId);
  const scrappedJobs = jobs.filter((j) => scraps.includes(j.id));
  const myNotifications = notifications.filter((n) => n.userId === session.userId);
  const notificationCount = myNotifications.filter((n) => !n.read).length + notificationCountOffset;

  const TABS: { id: TabId; label: string; count?: number; show: boolean }[] = [
    { id: "applications", label: "지원 내역", count: mergedApplications.length, show: !isCompany },
    { id: "my-jobs", label: "내 공고", count: myJobs.length, show: isCompany },
    { id: "scraps", label: "스크랩", count: scrappedJobs.length, show: true },
    { id: "my-projects", label: "내 프로젝트", count: myProjects.length, show: true },
    { id: "notifications", label: "알림", count: notificationCount, show: true },
  ];

  return (
    <div className="demo-container py-8">
      <section className="card p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] text-white grid place-items-center text-2xl font-black">
          {user?.name?.slice(0, 1)}
        </div>
        <div>
          <div className="text-xs text-[var(--color-muted)]">{isCompany ? "기업 회원" : session.type === "admin" ? "관리자" : "일반 회원"}</div>
          <h1 className="text-xl md:text-2xl font-bold mt-0.5">{user?.name}</h1>
          <div className="mt-1 text-xs text-[var(--color-muted)]">{user?.email}</div>
        </div>
        <div className="flex gap-2">
          <Link href="/profile/edit" className="btn btn-outline btn-md">프로필 편집</Link>
          {isCompany && <Link href="/jobs/new" className="btn btn-primary btn-md">공고 등록</Link>}
          {!isCompany && <Link href="/projects/new" className="btn btn-primary btn-md">모집글 작성</Link>}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon={<Briefcase size={16} />} label={isCompany ? "등록 공고" : "지원 내역"} value={isCompany ? myJobs.length : mergedApplications.length} />
        <Stat icon={<Bookmark size={16} />} label="스크랩" value={scrappedJobs.length} />
        <Stat icon={<UserPlus size={16} />} label="내 프로젝트" value={myProjects.length} />
        <Stat icon={<Bell size={16} />} label="미확인 알림" value={notificationCount} />
      </section>

      <div className="mt-8 border-b border-[var(--color-line)] overflow-x-auto">
        <div className="flex gap-1 min-w-fit" role="tablist">
          {TABS.filter((t) => t.show).map((t) => (
            <button
              id={`mypage-tab-${t.id}`}
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${tab === t.id ? "border-[var(--color-primary)] text-[var(--color-text)]" : "border-transparent text-[var(--color-muted)]"}`}
            >
              {t.label} {typeof t.count === "number" && <span className="ml-1 text-[var(--color-muted)]">{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {tab === "applications" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(["all", "pending", "accepted", "rejected"] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`badge ${statusFilter === s ? "badge-dark" : "badge-neutral"}`}>
                  {s === "all" ? "전체" : s === "pending" ? "검토중" : s === "accepted" ? "합격" : "불합격"}
                </button>
              ))}
            </div>
            {visibleApplications.length === 0 ? (
              <EmptyState title="아직 지원한 공고가 없어요" description="카테고리별 공고를 둘러보고 마음에 드는 곳에 지원해보세요." cta={{ label: "공고 둘러보기", onClick: () => (window.location.href = "/jobs") }} />
            ) : (
              <ul className="space-y-3">
                {visibleApplications.map((a) => {
                  const job = getJob(a.jobId);
                  if (!job) return null;
                  return (
                    <li key={a.id} className="card p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <div className="text-xs text-[var(--color-muted)]">{job.location} · {job.experience}</div>
                        <Link href={`/jobs/${job.id}`} className="mt-0.5 font-bold block hover:text-[var(--color-primary)]">{job.title}</Link>
                        <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2">{a.coverLetter}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`badge ${a.status === "accepted" ? "badge-success" : a.status === "rejected" ? "badge-neutral" : "badge-warning"}`}>
                          {a.status === "accepted" ? "합격" : a.status === "rejected" ? "불합격" : "검토중"}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">{relativeDate(a.createdAt)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {tab === "my-jobs" && (
          myJobs.length === 0 ? (
            <EmptyState title="등록한 공고가 없어요" description="새 공고를 등록하면 관리자 검토를 거쳐 게시됩니다." cta={{ label: "공고 등록", onClick: () => (window.location.href = "/jobs/new") }} />
          ) : (
            <MyJobsPanel jobs={myJobs} />
          )
        )}

        {tab === "scraps" && (
          scrappedJobs.length === 0 ? (
            <EmptyState title="스크랩한 공고가 없어요" description="관심 공고를 스크랩해두면 나중에 다시 찾기 쉬워요." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{scrappedJobs.map((j) => <JobCard key={j.id} job={j} />)}</div>
          )
        )}

        {tab === "my-projects" && (
          myProjects.length === 0 ? (
            <EmptyState title="내가 쓴 모집글이 없어요" description="프로젝트를 주도하고 싶다면 모집글을 작성해보세요." cta={{ label: "모집글 작성", onClick: () => (window.location.href = "/projects/new") }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{myProjects.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
          )
        )}

        {tab === "notifications" && (
          myNotifications.length === 0 ? (
            <EmptyState title="알림이 없어요" description="새로운 활동이 생기면 이곳에 모입니다." />
          ) : (
            <ul className="space-y-2">
              {myNotifications.map((n) => (
                <li key={n.id} className={`card p-4 ${n.read ? "opacity-80" : "border-[var(--color-primary)]/40"}`}>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    <span className={`badge ${n.type === "application" ? "badge-primary" : n.type === "approval" ? "badge-warning" : n.type === "message" ? "badge-dark" : "badge-neutral"}`}>
                      {n.type === "application" ? "지원" : n.type === "approval" ? "승인" : n.type === "message" ? "메시지" : "안내"}
                    </span>
                    {!n.read && <span className="text-[var(--color-primary)] font-semibold">NEW</span>}
                    <span className="ml-auto">{relativeDate(n.createdAt)}</span>
                  </div>
                  <div className="mt-1 font-semibold">{n.title}</div>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{n.body}</p>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-[var(--color-muted)] flex items-center gap-1.5">{icon}{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

function MyJobsPanel({ jobs: ownedJobs }: { jobs: typeof jobs }) {
  const total = ownedJobs.length;
  const approved = ownedJobs.filter((j) => j.status === "approved").length;
  const pending = ownedJobs.filter((j) => j.status === "pending").length;
  const closed = ownedJobs.filter((j) => j.status === "closed").length;
  const totalViews = ownedJobs.reduce((s, j) => s + j.views, 0);

  const byType = JOB_TYPE_OPTIONS.map((o) => ({
    id: o.id,
    label: o.label,
    count: ownedJobs.filter((j) => j.jobType === o.id).length,
  }));
  const maxByType = Math.max(1, ...byType.map((x) => x.count));

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SmallStat label="전체" value={total} />
        <SmallStat label="게시 중" value={approved} accent="success" />
        <SmallStat label="승인 대기" value={pending} accent="warning" />
        <SmallStat label="마감/종료" value={closed} accent="muted" />
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">공고 타입별 분포</h3>
          <span className="text-xs text-[var(--color-muted)]">총 조회 {totalViews.toLocaleString()}</span>
        </div>
        <ul className="space-y-2">
          {byType.map((b) => (
            <li key={b.id} className="grid grid-cols-[80px_1fr_40px] items-center gap-3 text-sm">
              <span className="text-[var(--color-text)] font-semibold">{b.label}</span>
              <div className="h-2 rounded-full bg-[#F3F3EE] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)]"
                  style={{ width: `${(b.count / maxByType) * 100}%` }}
                  aria-label={`${b.label} ${b.count}건`}
                />
              </div>
              <span className="text-right text-xs text-[var(--color-muted)]">{b.count}건</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-bold text-sm mb-3">등록한 공고 ({total})</h3>
        <ul className="space-y-3">
          {ownedJobs.map((j) => {
            const apps = getApplicationsByJob(j.id).length;
            const statusLabel =
              j.status === "approved"
                ? "게시 중"
                : j.status === "pending"
                  ? "승인 대기"
                  : j.status === "rejected"
                    ? "반려"
                    : "마감";
            const statusBadge =
              j.status === "approved"
                ? "badge-primary"
                : j.status === "pending"
                  ? "badge-warning"
                  : j.status === "rejected"
                    ? "badge-danger"
                    : "badge-neutral";
            return (
              <li key={j.id} className="card p-4 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-neutral text-[10px]">{getJobTypeLabel(j.jobType)}</span>
                    <span className={`badge ${statusBadge} text-[10px]`}>{statusLabel}</span>
                  </div>
                  <Link href={`/jobs/${j.id}`} className="font-semibold text-sm hover:underline line-clamp-1">
                    {j.title}
                  </Link>
                  <div className="text-xs text-[var(--color-muted)] mt-1">
                    {j.location} · 마감 {j.deadline}
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6 text-xs text-[var(--color-muted)]">
                  <Metric label="지원자" value={apps} />
                  <Metric label="조회" value={j.views} />
                  <Metric label="스크랩" value={j.scraps} />
                  <Link href={`/jobs/${j.id}`} className="btn btn-outline btn-sm">
                    상세
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function SmallStat({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: number;
  accent?: "success" | "warning" | "muted" | "neutral";
}) {
  const color =
    accent === "success"
      ? "text-[var(--color-success)]"
      : accent === "warning"
        ? "text-[var(--color-warning)]"
        : accent === "muted"
          ? "text-[var(--color-muted)]"
          : "text-[var(--color-text)]";
  return (
    <div className="card p-4">
      <div className="text-xs text-[var(--color-muted)]">{label}</div>
      <div className={`mt-1 text-2xl font-black tabular-nums ${color}`}>{value.toLocaleString()}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-[var(--color-muted)]">{label}</div>
      <div className="font-semibold text-[var(--color-text)] tabular-nums">{value.toLocaleString()}</div>
    </div>
  );
}
