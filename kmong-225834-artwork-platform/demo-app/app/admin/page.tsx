"use client";

import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import { jobs, getPendingJobs } from "@/lib/data/jobs";
import { users } from "@/lib/data/users";
import { reports } from "@/lib/data/reports";
import { relativeDate } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { ChevronRight, Clock, CheckSquare, Flag, UserPlus, Tags } from "lucide-react";

const ACTIVITY_LOG = [
  { id: "a1", type: "approval", who: "운영팀", action: "‘인디 아티스트 뮤직비디오 백댄서’ 공고 승인", at: "2026-04-22 10:10" },
  { id: "a2", type: "reject", who: "운영팀", action: "‘반려 테스트 공고’ 반려 처리 (허위 콘텐츠)", at: "2026-04-22 09:44" },
  { id: "a3", type: "signup", who: "신규 회원", action: "박지훈 님 가입", at: "2026-04-22 09:12" },
  { id: "a4", type: "report", who: "이민서", action: "‘윤지환 프로필’ 도용 신고 접수", at: "2026-04-21 22:05" },
  { id: "a5", type: "approval", who: "운영팀", action: "‘2026 서울 프린지 페스티벌 힙합 크루 모집’ 승인", at: "2026-04-21 18:40" },
  { id: "a6", type: "report", who: "한서연", action: "‘케이팝 커버 영상 팀원’ 모집글 신고 접수", at: "2026-04-21 15:30" },
  { id: "a7", type: "approval", who: "운영팀", action: "‘재즈 라이브 공연 세션 보컬’ 공고 승인", at: "2026-04-21 14:02" },
  { id: "a8", type: "signup", who: "신규 회원", action: "시르크 서울 기업 가입", at: "2026-04-21 11:27" },
  { id: "a9", type: "reject", who: "운영팀", action: "‘미공개 테스트 공고’ 반려 (정보 불명확)", at: "2026-04-20 18:20" },
  { id: "a10", type: "approval", who: "운영팀", action: "‘단편 영화 주연 배우 오디션’ 공고 승인", at: "2026-04-20 13:15" },
];

export default function AdminDashboardPage() {
  const { pendingJobAdjust } = useAuth();
  const pending = getPendingJobs().length + pendingJobAdjust;
  const approvedToday = jobs.filter((j) => j.status === "approved" && j.createdAt.startsWith("2026-04-22")).length + 12;
  const openReports = reports.filter((r) => r.status === "open").length;
  const newMembers = users.filter((u) => u.createdAt.startsWith("2026-04")).length;

  return (
    <AdminLayout title="운영 대시보드" subtitle="오늘의 대기 큐와 활동 로그를 한눈에 확인하세요.">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <DashCard label="승인 대기" value={pending} icon={<Clock size={18} />} accent="warning" cta={{ href: "/admin/approvals", label: "승인 큐로" }} />
        <DashCard label="오늘 처리" value={approvedToday} icon={<CheckSquare size={18} />} accent="success" />
        <DashCard label="열린 신고" value={openReports} icon={<Flag size={18} />} accent="danger" cta={{ href: "/admin/reports", label: "신고 처리" }} />
        <DashCard label="이 달 신규 회원" value={newMembers} icon={<UserPlus size={18} />} accent="neutral" cta={{ href: "/admin/members", label: "회원 관리" }} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold text-base">48시간 내 승인 필요</h2>
          <p className="text-xs text-[var(--color-muted)] mt-1">SLA: 접수 후 48시간 내 처리 95% 유지</p>
          <ul className="mt-5 space-y-3">
            {getPendingJobs().slice(0, 5).map((j) => (
              <li key={j.id} className="flex items-center gap-3">
                <span className="w-1.5 h-10 rounded-full bg-[var(--color-warning)]" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm line-clamp-1">{j.title}</div>
                  <div className="text-xs text-[var(--color-muted)]">접수 {relativeDate(j.createdAt)}</div>
                </div>
                <Link href={`/admin/approvals?job=${j.id}`} className="btn btn-outline btn-sm">검토</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-base">최근 활동 로그</h2>
          <ul className="mt-5 space-y-3">
            {ACTIVITY_LOG.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className={`inline-block mt-1.5 w-2 h-2 rounded-full ${a.type === "approval" ? "bg-[var(--color-success)]" : a.type === "reject" ? "bg-[var(--color-danger)]" : a.type === "report" ? "bg-[var(--color-warning)]" : "bg-[var(--color-muted)]"}`} />
                <div className="flex-1">
                  <div className="leading-snug">{a.action}</div>
                  <div className="text-xs text-[var(--color-muted)] mt-0.5">{a.who} · {relativeDate(a.at)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-6">
        <Link href="/admin/categories" className="card card-hover p-6 focus-ring block">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-[#FFEDE8] grid place-items-center text-[var(--color-primary)]">
              <Tags size={18} />
            </span>
            <div>
              <h2 className="font-bold text-sm">카테고리 관리</h2>
              <p className="text-[11px] text-[var(--color-muted)]">jobType + 장르 양 축 동적 관리</p>
            </div>
            <ChevronRight size={16} className="ml-auto text-[var(--color-muted)]" />
          </div>
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">
            공고 타입·장르 라벨 변경, 표시 순서 조정, 신규 항목 추가. 사용 중인 항목은 삭제 잠금으로 데이터 정합성 보호.
          </p>
        </Link>
      </section>

      <section className="mt-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">주간 처리 현황</h2>
            <div className="text-xs text-[var(--color-muted)]">최근 7일</div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[6, 9, 12, 8, 11, 14, 12].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[#FFEDE8] rounded-t-md relative" style={{ height: `${v * 6}px` }}>
                  <div className="absolute inset-0 bg-[var(--color-primary)] rounded-t-md origin-bottom" style={{ height: `${v * 6}px`, transform: "scaleY(1)" }} />
                </div>
                <div className="text-[10px] text-[var(--color-muted)]">{["월", "화", "수", "목", "금", "토", "일"][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

function DashCard({ label, value, icon, accent, cta }: { label: string; value: number; icon: React.ReactNode; accent: "warning" | "success" | "danger" | "neutral"; cta?: { href: string; label: string } }) {
  const color = accent === "warning" ? "#F59E0B" : accent === "success" ? "#0E9F6E" : accent === "danger" ? "#DC2626" : "#6B6B6B";
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: `${color}20`, color }}>{icon}</span>
        {label}
      </div>
      <div className="mt-3 text-3xl font-black tabular-nums">{value.toLocaleString()}</div>
      {cta && (
        <Link href={cta.href} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)]">
          {cta.label} <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}
