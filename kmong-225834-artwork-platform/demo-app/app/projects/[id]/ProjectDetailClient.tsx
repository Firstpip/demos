"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, MapPin, Users, Calendar, Share2, MessageCircle, Flag, UserPlus } from "lucide-react";
import { getProject, getOpenProjects } from "@/lib/data/projects";
import { getUser } from "@/lib/data/users";
import { getCategory } from "@/lib/data/categories";
import { daysLeft, formatDate, relativeDate, ensureHtml } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { useAuth } from "@/providers/AuthProvider";
import ProjectCard from "@/components/common/ProjectCard";
import MapPreview from "@/components/common/MapPreview";

export default function ProjectDetailClient({ projectId }: { projectId: string }) {
  const project = getProject(projectId);
  const { show } = useToast();
  const { session } = useAuth();
  const [tab, setTab] = useState<"detail" | "comments">("detail");
  const [newComment, setNewComment] = useState("");
  const [joined, setJoined] = useState(false);

  if (!project) {
    return (
      <div className="demo-container py-24 text-center">
        <p className="text-[var(--color-muted)]">존재하지 않는 모집글입니다.</p>
        <Link href="/projects" className="mt-4 btn btn-outline btn-md inline-flex">목록으로</Link>
      </div>
    );
  }

  const leader = getUser(project.authorId);
  const category = getCategory(project.categoryId);
  const dLeft = daysLeft(project.deadline);
  const related = getOpenProjects().filter((p) => p.categoryId === project.categoryId && p.id !== project.id).slice(0, 4);
  const safeDesc = ensureHtml(project.description);

  const onJoin = () => {
    if (!session) {
      show("로그인이 필요해요", "error");
      return;
    }
    setJoined(true);
    show("참여 신청이 전송되었어요. 리더가 확인하면 메시지로 답장합니다.", "success");
  };

  const onComment = () => {
    if (!newComment.trim()) return;
    setNewComment("");
    show("댓글이 등록되었어요", "success");
  };

  return (
    <div>
      <div className="demo-container pt-6 pb-2 text-xs text-[var(--color-muted)]">
        <Link href="/">홈</Link>
        <ChevronRight size={12} className="inline mx-1" />
        <Link href="/projects">프로젝트</Link>
        <ChevronRight size={12} className="inline mx-1" />
        <span className="text-[var(--color-text)] line-clamp-1 inline-block max-w-[240px] align-bottom">{project.title}</span>
      </div>

      <div className="demo-container grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 pb-16">
        <article>
          <div className="card p-5 md:p-6">
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              {category && (() => { const Icon = category.icon; return (
                <span className="badge badge-dark inline-flex items-center gap-1"><Icon size={12} aria-hidden /> {category.name}</span>
              ); })()}
              <span className={`badge ${project.payType === "유보수" ? "badge-primary" : project.payType === "수익 배분" ? "badge-success" : "badge-neutral"}`}>{project.payType}</span>
              <span className="ml-auto">{relativeDate(project.createdAt)}</span>
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">{project.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EDEDE8] grid place-items-center text-sm font-bold">
                {leader?.name?.slice(0, 1)}
              </div>
              <div>
                <div className="font-semibold">{leader?.name}</div>
                <div className="text-xs text-[var(--color-muted)]">모집 리더 · 팔로워 1.2k</div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-5 border-t border-[var(--color-line)]">
              <InfoItem icon={<MapPin size={13} />} label="지역" value={project.location} />
              <InfoItem icon={<Calendar size={13} />} label="기간" value={project.duration} />
              <InfoItem icon={<Users size={13} />} label="모집 인원" value={`${project.headcount}명`} />
              <InfoItem label="보수" value={`${project.payType}${project.payDetail ? ` · ${project.payDetail}` : ""}`} />
            </dl>
          </div>



          <div className="mt-6 border-b border-[var(--color-line)] flex gap-1" role="tablist">
            {([{ id: "detail", label: "상세" }, { id: "comments", label: `댓글 ${project.comments.length}` }] as const).map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`px-4 py-3 text-sm font-semibold border-b-2 ${tab === t.id ? "border-[var(--color-primary)] text-[var(--color-text)]" : "border-transparent text-[var(--color-muted)]"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "detail" && <div className="rich-content" dangerouslySetInnerHTML={{ __html: safeDesc }} />}
            {tab === "comments" && (
              <div className="space-y-4">
                <div className="card p-4">
                  <textarea className="input input-textarea" rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="리더·다른 참여자와 이야기해보세요 (프로젝트 조건, 일정 질문 등)" />
                  <div className="flex justify-end mt-2">
                    <button type="button" className="btn btn-primary btn-sm" onClick={onComment}>댓글 등록</button>
                  </div>
                </div>
                <ul className="space-y-3">
                  {project.comments.map((c) => {
                    const author = getUser(c.userId);
                    const isLeader = c.userId === project.authorId;
                    return (
                      <li key={c.id} className="card p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 rounded-full bg-[#EDEDE8] grid place-items-center text-[11px] font-bold">{author?.name?.slice(0, 1)}</div>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {author?.name}
                              {isLeader && <span className="badge badge-primary">리더</span>}
                            </div>
                            <div className="text-xs text-[var(--color-muted)]">{relativeDate(c.createdAt)}</div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed">{c.body}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-20 self-start">
          <div className="card p-5">
            <div className="text-xs text-[var(--color-muted)]">마감 {formatDate(project.deadline)} · 남은 {Math.max(dLeft, 0)}일</div>
            <div className="mt-2 text-2xl font-black">{project.headcount}명 모집</div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">현재 {project.applicantsCount}명 지원 중</div>

            <div className="mt-5 flex flex-col gap-2">
              <button type="button" className="btn btn-primary btn-lg btn-full" onClick={onJoin} disabled={joined}>
                <UserPlus size={16} /> {joined ? "참여 신청 완료" : "참여 신청"}
              </button>
              <button type="button" className="btn btn-outline btn-md" onClick={() => show("메시지 드로어가 열립니다 (데모)", "success")}>
                <MessageCircle size={14} /> 메시지 보내기
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => show("링크가 복사되었어요", "success")}>
                <Share2 size={12} /> 공유
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2 px-1">위치</div>
            <MapPreview location={project.location} detail="첫 미팅 장소는 참여 확정자에게 별도 공유합니다." height={180} compact />
          </div>

          <div className="card p-5 mt-4 text-sm">
            <div className="font-semibold mb-2">모집 리더 메모</div>
            <p className="text-[var(--color-muted)] leading-relaxed">
              본 프로젝트는 비영리·수익 배분 조건입니다. 리더와의 1차 대화 후 실제 일정·조건이 최종 결정되며, 아티스트 간 합의 사항이 우선합니다.
            </p>
            <button type="button" className="mt-4 text-xs inline-flex items-center gap-1 text-[var(--color-muted)] hover:text-[var(--color-danger)]">
              <Flag size={12} /> 이 모집글 신고
            </button>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="demo-container pb-16">
          <h2 className="text-xl font-bold mb-5">비슷한 모집글</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">{icon}{label}</div>
      <div className="mt-1 font-semibold text-sm line-clamp-2">{value}</div>
    </div>
  );
}
