import Link from "next/link";
import { Project } from "@/lib/types";
import { getUser } from "@/lib/data/users";
import { getCategory } from "@/lib/data/categories";
import { daysLeft, stripHtml } from "@/lib/utils";
import { MapPin, Users, MessageCircle } from "lucide-react";

export default function ProjectCard({ project, highlight = false }: { project: Project; highlight?: boolean }) {
  const leader = getUser(project.authorId);
  const category = getCategory(project.categoryId);
  const CategoryIcon = category?.icon;
  const dLeft = daysLeft(project.deadline);
  const excerpt = stripHtml(project.description, 120);

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`card card-hover focus-ring h-full flex flex-col p-5 ${highlight ? "ring-2 ring-[var(--color-primary)]" : ""}`}
    >
      <div className="flex items-center gap-2 text-xs flex-wrap">
        {category && CategoryIcon && (
          <span className="badge badge-dark inline-flex items-center gap-1"><CategoryIcon size={12} aria-hidden /> {category.name}</span>
        )}
        <span className={`badge ${project.payType === "유보수" ? "badge-primary" : project.payType === "수익 배분" ? "badge-success" : "badge-neutral"}`}>{project.payType}</span>
        <span className="ml-auto text-[var(--color-muted)] shrink-0">
          {dLeft > 0 ? `D-${dLeft}` : "마감"}
        </span>
      </div>
      <h3 className="mt-3 font-bold text-[16px] leading-snug line-clamp-2 min-h-[2.6em]">{project.title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2 min-h-[2.8em]">{excerpt}</p>
      <div className="mt-auto pt-4 border-t border-[var(--color-line)] flex items-center justify-between text-xs text-[var(--color-muted)] gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#EDEDE8] grid place-items-center text-[11px] font-semibold text-[var(--color-text)] shrink-0">
            {leader?.name?.slice(0, 1) || "A"}
          </div>
          <span className="truncate">{leader?.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> <span className="truncate max-w-[60px]">{project.location}</span></span>
          <span className="inline-flex items-center gap-1"><Users size={12} /> {project.headcount}명</span>
          <span className="inline-flex items-center gap-1"><MessageCircle size={12} /> {project.comments.length}</span>
        </div>
      </div>
    </Link>
  );
}
