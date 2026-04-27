"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, Share2, MapPin, Calendar, Users, Briefcase, CheckCircle2, ChevronRight, Flag } from "lucide-react";
import { getJob, getActiveJobs } from "@/lib/data/jobs";
import { getCategory } from "@/lib/data/categories";
import { getCompanyProfile, getUser } from "@/lib/data/users";
import { getApplicationsByJob } from "@/lib/data/applications";
import { daysLeft, formatDate, ensureHtml } from "@/lib/utils";
import { getJobTypeLabel } from "@/lib/jobType";
import type { JobTypeMeta } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import JobCard from "@/components/common/JobCard";
import Modal from "@/components/common/Modal";
import MapPreview from "@/components/common/MapPreview";

export default function JobDetailClient({ jobId }: { jobId: string }) {
  const job = getJob(jobId);
  const { session, scraps, toggleScrap, myApplications, addApplication } = useAuth();
  const { show } = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<"detail" | "company" | "qna">("detail");
  const [applyOpen, setApplyOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [cover, setCover] = useState("");

  if (!job) {
    return (
      <div className="demo-container py-24 text-center">
        <p className="text-[var(--color-muted)]">존재하지 않거나 삭제된 공고입니다.</p>
        <Link href="/jobs" className="mt-4 btn btn-outline btn-md inline-flex">공고 목록으로</Link>
      </div>
    );
  }

  const category = getCategory(job.categoryId);
  const company = getCompanyProfile(job.companyId);
  const applications = getApplicationsByJob(job.id);
  const related = getActiveJobs().filter((j) => j.categoryId === job.categoryId && j.id !== job.id).slice(0, 4);
  const isScrapped = scraps.includes(job.id);
  const isApplied = myApplications.includes(job.id);
  const dLeft = daysLeft(job.deadline);
  const safeDescription = ensureHtml(job.description);

  const onApply = () => {
    if (!session) {
      show("로그인이 필요해요. 데모 계정으로 전환해보세요.", "error");
      router.push(`/login?next=/jobs/${job.id}`);
      return;
    }
    if (session.type !== "general") {
      show("일반 회원 계정으로 전환 후 지원해주세요.", "error");
      return;
    }
    setApplyOpen(true);
  };

  const submitApply = () => {
    if (!cover.trim() || cover.trim().length < 30) {
      show("자기소개는 30자 이상 작성해주세요.", "error");
      return;
    }
    addApplication(job.id);
    setApplyOpen(false);
    show("지원이 접수되었어요. 마이페이지에서 확인하세요.", "success");
  };

  return (
    <div className="bg-[var(--color-bg)]">
      <div className="demo-container pt-6 pb-2 text-xs text-[var(--color-muted)]">
        <Link href="/" className="hover:text-[var(--color-text)]">홈</Link>
        <ChevronRight size={12} className="inline mx-1" />
        <Link href="/jobs" className="hover:text-[var(--color-text)]">채용공고</Link>
        <ChevronRight size={12} className="inline mx-1" />
        {category && <Link href={`/jobs?cat=${category.slug}`} className="hover:text-[var(--color-text)]">{category.name}</Link>}
        <ChevronRight size={12} className="inline mx-1" />
        <span className="text-[var(--color-text)] line-clamp-1 inline-block max-w-[240px] align-bottom">{job.title}</span>
      </div>

      <div className="demo-container grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 pb-16">
        <article>
          <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-[#EDEDE8]">
            {job.posterImage && (
              <img src={job.posterImage} alt={`${job.title} 포스터`} className="w-full h-full object-cover" />
            )}
            <div className="absolute left-4 top-4 flex gap-2 flex-wrap">
              <span className="badge badge-primary uppercase tracking-wide">{getJobTypeLabel(job.jobType)}</span>
              {category && (() => { const Icon = category.icon; return (
                <span className="badge badge-dark inline-flex items-center gap-1"><Icon size={12} aria-hidden /> {category.name}</span>
              ); })()}
              {dLeft <= 3 && dLeft > 0 && <span className="badge badge-danger">D-{dLeft}</span>}
              {dLeft > 3 && dLeft <= 7 && <span className="badge badge-warning">D-{dLeft}</span>}
              {applications.length > 20 && <span className="badge badge-primary">인기</span>}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-[var(--color-muted)]">{company?.companyName}</div>
            <h1 className="mt-1 text-2xl md:text-3xl font-black leading-tight tracking-tight">{job.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-muted)]">
              <span>등록 {formatDate(job.createdAt)}</span>
              <span>· 조회 {job.views.toLocaleString()}</span>
              <span>· 스크랩 {job.scraps + (isScrapped ? 1 : 0)}</span>
              <span>· 지원자 {applications.length + (isApplied ? 1 : 0)}명</span>
            </div>
          </div>

          <div className="mt-6 card p-5 md:p-6">
            <h2 className="font-bold mb-4 text-sm text-[var(--color-muted)]">주요 정보</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <InfoCell icon={<Briefcase size={14} />} label="고용형태" value={job.employmentType} />
              <InfoCell icon={<MapPin size={14} />} label="지역" value={job.location} />
              <InfoCell icon={<CheckCircle2 size={14} />} label="경력" value={job.experience} />
              <InfoCell icon={<Calendar size={14} />} label="마감" value={`${formatDate(job.deadline)} (D-${Math.max(dLeft, 0)})`} />
              <InfoCell icon={<Users size={14} />} label="모집 인원" value={`${job.headcount}명`} />
              <InfoCell label="보수" value={job.budget} />
            </div>

            {job.typeMeta && (
              <TypeMetaCard meta={job.typeMeta} />
            )}

            {(job.perks.length > 0 || job.preferred.length > 0) && (
              <div className="mt-5 pt-5 border-t border-[var(--color-line)] grid grid-cols-1 md:grid-cols-2 gap-6">
                {job.perks.length > 0 && (
                  <div>
                    <div className="text-xs text-[var(--color-muted)] mb-2">제공 조건</div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.perks.map((p) => <span key={p} className="tag">{p}</span>)}
                    </div>
                  </div>
                )}
                {job.preferred.length > 0 && (
                  <div>
                    <div className="text-xs text-[var(--color-muted)] mb-2">우대 조건</div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.preferred.map((p) => <span key={p} className="tag">{p}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>



          <div className="mt-8 border-b border-[var(--color-line)]">
            <div id="job-tabs" className="flex gap-1" role="tablist">
              {([
                { id: "detail", label: "상세 설명" },
                { id: "company", label: "회사 정보" },
                { id: "qna", label: "문의" },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 ${tab === t.id ? "border-[var(--color-primary)] text-[var(--color-text)]" : "border-transparent text-[var(--color-muted)]"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {tab === "detail" && (
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
            )}
            {tab === "company" && company && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg">{company.companyName}</h3>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">{company.industry} · 대표 {company.representative}</div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text)]">{company.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-line)] text-sm">
                  <div>
                    <div className="text-xs text-[var(--color-muted)]">사업자번호</div>
                    <div>{company.businessNumber}</div>
                  </div>
                  {company.website && (
                    <div>
                      <div className="text-xs text-[var(--color-muted)]">웹사이트</div>
                      <div>{company.website}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {tab === "qna" && (
              <div className="space-y-3">
                {[
                  { q: "촬영 일정은 변경될 수 있나요?", a: "1주일 이상의 사전 고지 없이는 확정 일정이 변경되지 않습니다. 긴급 조정이 필요할 경우 당사자 합의 후 결정합니다." },
                  { q: "2차 사용권은 어떤 범위인가요?", a: "기업 홈페이지·공식 SNS·행사 아카이브 영상에 한해 2년간 사용 가능하며, 대외 광고 송출 시 별도 협의합니다." },
                  { q: "보수는 언제 지급되나요?", a: "공연·촬영 종료 후 10영업일 이내 지급하며, 세금계산서·간이영수증 중 원하는 방식으로 발행합니다." },
                ].map((item, idx) => (
                  <details key={idx} className="card p-4">
                    <summary className="cursor-pointer font-semibold text-sm">{item.q}</summary>
                    <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">{item.a}</p>
                  </details>
                ))}
                <div className="pt-4">
                  <button type="button" className="btn btn-outline btn-md" onClick={() => show("문의가 접수되었어요", "success")}>
                    문의하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-20 self-start">
          <div className="card p-5 md:p-6">
            <div className="text-xs text-[var(--color-muted)]">{company?.companyName}</div>
            <div className="mt-1 font-bold text-[15px] line-clamp-2">{job.title}</div>
            <div className="mt-4 text-2xl font-black text-[var(--color-primary)]">{job.budget}</div>
            <div className="mt-1 text-xs text-[var(--color-muted)]">{formatDate(job.deadline)}까지 · 남은 {Math.max(dLeft, 0)}일</div>

            <div className="mt-5 flex flex-col gap-2">
              <button
                id="job-apply-cta"
                type="button"
                className="btn btn-primary btn-lg btn-full"
                onClick={onApply}
                disabled={isApplied || dLeft <= 0}
              >
                {dLeft <= 0 ? "마감된 공고" : isApplied ? "지원 완료" : "지원하기"}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="job-scrap-btn"
                  type="button"
                  className="btn btn-outline btn-md"
                  onClick={() => {
                    toggleScrap(job.id);
                    show(isScrapped ? "스크랩을 해제했어요" : "스크랩에 담았어요", "success");
                  }}
                  aria-pressed={isScrapped}
                >
                  <Bookmark size={14} fill={isScrapped ? "currentColor" : "none"} />
                  {isScrapped ? "스크랩 해제" : "스크랩"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-md"
                  onClick={() => show("공고 주소가 복사되었어요", "success")}
                >
                  <Share2 size={14} /> 공유
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="mt-5 inline-flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)]"
            >
              <Flag size={12} /> 이 공고 신고하기
            </button>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2 px-1">위치</div>
            <MapPreview
              location={job.location}
              detail={job.typeMeta && "studioAddress" in job.typeMeta ? job.typeMeta.studioAddress : job.typeMeta && "venue" in job.typeMeta ? job.typeMeta.venue : "정확한 주소는 합격자에게 안내됩니다."}
              height={180}
              compact
            />
          </div>

          <div className="card p-5 mt-4">
            <div className="text-sm font-semibold mb-3">지원 시 유의사항</div>
            <ul className="space-y-2 text-xs text-[var(--color-muted)] leading-relaxed">
              <li>· 자기소개는 최소 30자 이상 작성하면 기업 열람률이 높아집니다.</li>
              <li>· 포트폴리오 영상이 있으면 섭외 전환이 빠릅니다.</li>
              <li>· 허위 지원·반복 지원은 계정 이용에 제한이 생길 수 있습니다.</li>
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="demo-container pb-16">
          <div className="flex items-end justify-between mb-5">
            <h2 className="text-xl font-bold">비슷한 공고</h2>
            <Link href={`/jobs?cat=${category?.slug || ""}`} className="text-sm font-semibold text-[var(--color-primary)] inline-flex items-center gap-1">
              전체 보기 <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </div>
      )}

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="지원서 작성" id="apply-modal">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">자기소개 (최소 30자)</label>
            <textarea
              className="input input-textarea mt-2"
              rows={6}
              placeholder="본인의 장르·경력·가능 일정을 중심으로 작성해주세요."
              value={cover}
              onChange={(e) => setCover(e.target.value)}
            />
            <div className="mt-1 text-xs text-[var(--color-muted)]">{cover.length}자 · 최대 500자</div>
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            첨부: 내 포트폴리오 URL (프로필에 등록된 영상·이미지가 자동으로 첨부됩니다)
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" className="btn btn-outline btn-md" onClick={() => setApplyOpen(false)}>취소</button>
            <button type="button" className="btn btn-primary btn-md" onClick={submitApply}>제출</button>
          </div>
        </div>
      </Modal>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="신고 사유 선택" id="report-modal">
        <div className="space-y-3 text-sm">
          {["허위·과장 콘텐츠", "부적절한 채용 조건", "카테고리 오분류", "연락처·개인정보 유출 우려", "기타"].map((r) => (
            <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
              <input type="radio" name="report" defaultChecked={r === "허위·과장 콘텐츠"} /> {r}
            </label>
          ))}
          <textarea className="input input-textarea" placeholder="상세 사유를 적어주세요 (선택)" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-outline btn-md" onClick={() => setReportOpen(false)}>취소</button>
            <button type="button" className="btn btn-primary btn-md" onClick={() => {
              setReportOpen(false);
              show("신고가 접수되었어요. 48시간 내 처리됩니다.", "success");
            }}>신고 접수</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoCell({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">{icon}{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function TypeMetaCard({ meta }: { meta: JobTypeMeta }) {
  const rows = describeMeta(meta);
  return (
    <div className="mt-5 pt-5 border-t border-[var(--color-line)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-primary uppercase tracking-wide">{getJobTypeLabel(meta.kind)}</span>
        <span className="text-xs text-[var(--color-muted)]">타입별 추가 정보</span>
      </div>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {rows.map((r) => (
          <div key={r.label} className="text-sm">
            <dt className="text-xs text-[var(--color-muted)]">{r.label}</dt>
            <dd className="mt-0.5 font-semibold leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function describeMeta(meta: JobTypeMeta): { label: string; value: string }[] {
  if (meta.kind === "lesson") {
    return [
      { label: "강사 자격", value: meta.qualification || "—" },
      { label: "운영 일정", value: meta.schedule || "—" },
      { label: "학원 위치", value: meta.studioAddress || "—" },
      { label: "시범 수업", value: meta.trialClass ? "첫 주 시범 수업 운영" : "시범 수업 없음" },
    ];
  }
  if (meta.kind === "performance") {
    return [
      { label: "본 공연", value: meta.showDates || "—" },
      { label: "리허설", value: meta.rehearsals || "—" },
      { label: "공연장", value: meta.venue || "—" },
      { label: "공연 의상", value: meta.costumeProvided ? "공연 의상 지급" : "본인 의상 준비" },
    ];
  }
  if (meta.kind === "event") {
    return [
      { label: "행사 일자", value: meta.eventDate || "—" },
      { label: "드레스 코드", value: meta.dressCode || "—" },
      { label: "사전 브리핑", value: meta.briefingDate || "—" },
      { label: "현장 식사", value: meta.cateringProvided ? "식사 제공" : "별도 준비" },
    ];
  }
  return [
    { label: "산출물", value: meta.deliverables || "—" },
    { label: "저작권", value: meta.copyright || "—" },
    { label: "NDA", value: meta.ndaRequired ? "비공개 협약 체결 필요" : "NDA 불요" },
    { label: "활용 범위", value: meta.finalUseScope || "—" },
  ];
}
