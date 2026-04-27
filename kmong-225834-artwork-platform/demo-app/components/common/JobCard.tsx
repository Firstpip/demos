"use client";

import Link from "next/link";
import { Bookmark, MapPin, Users } from "lucide-react";
import { Job } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { getCompanyProfile } from "@/lib/data/users";
import { daysLeft } from "@/lib/utils";
import { getJobTypeLabel } from "@/lib/jobType";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";

export default function JobCard({ job, highlight = false }: { job: Job; highlight?: boolean }) {
  const { scraps, toggleScrap } = useAuth();
  const { show } = useToast();
  const company = getCompanyProfile(job.companyId);
  const category = getCategory(job.categoryId);
  const CategoryIcon = category?.icon;
  const dLeft = daysLeft(job.deadline);
  const isScrapped = scraps.includes(job.id);

  const onScrap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleScrap(job.id);
    show(isScrapped ? "스크랩을 해제했어요" : "스크랩에 담았어요", "success");
  };

  const dDayClass =
    dLeft <= 0 ? "bg-[#4A4A4A] text-white"
      : dLeft <= 3 ? "bg-[var(--color-danger)] text-white"
      : dLeft <= 7 ? "bg-[#B45309] text-white"
      : "bg-[var(--color-primary)] text-white";
  const dDayLabel = dLeft <= 0 ? "마감" : `D-${dLeft}`;

  return (
    <Link
      href={`/jobs/${job.id}`}
      id={`job-card-${job.id}`}
      className={`card card-hover focus-ring h-full flex flex-col overflow-hidden ${highlight ? "ring-2 ring-[var(--color-primary)]" : ""}`}
    >
      <div className="aspect-[16/9] relative bg-[#EDEDE8] shrink-0">
        {job.posterImage && (
          <img src={job.posterImage} alt={`${job.title} 포스터`} className="w-full h-full object-cover" loading="lazy" />
        )}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/55 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute left-3 top-3 right-14 flex flex-wrap gap-1.5">
          <span className="badge-overlay bg-white text-[var(--color-text)] uppercase tracking-wide">{getJobTypeLabel(job.jobType)}</span>
          {category && CategoryIcon && (
            <span className="badge-overlay bg-black/70 text-white inline-flex items-center gap-1 backdrop-blur-sm">
              <CategoryIcon size={12} aria-hidden /> {category.name}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onScrap}
          aria-label={isScrapped ? "스크랩 해제" : "스크랩"}
          className={`absolute right-3 top-3 w-9 h-9 grid place-items-center rounded-full shadow-md focus-ring transition-colors ${isScrapped ? "bg-[var(--color-primary)] text-white" : "bg-white/95 text-[var(--color-text)] hover:bg-white"}`}
        >
          <Bookmark size={16} fill={isScrapped ? "currentColor" : "none"} />
        </button>
        <span className={`absolute left-3 bottom-3 badge-overlay ${dDayClass}`}>{dDayLabel}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-[var(--color-muted)] truncate">{company?.companyName || "기업 회원"}</div>
        <h3 className="mt-1 font-bold text-[15px] leading-snug line-clamp-2 min-h-[2.6em]">{job.title}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--color-muted)] overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center gap-1 shrink-0"><MapPin size={13} /> <span className="truncate max-w-[80px]">{job.location}</span></span>
          <span className="inline-flex items-center gap-1 shrink-0"><Users size={13} /> {job.headcount}명</span>
          <span className="truncate">{job.experience}</span>
        </div>
        <div className="mt-auto pt-4">
          <span className="text-sm font-semibold text-[var(--color-primary)] truncate block">{job.budget}</span>
        </div>
      </div>
    </Link>
  );
}
