"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import { projects } from "@/lib/data/projects";
import { getUser } from "@/lib/data/users";
import { getCategory } from "@/lib/data/categories";
import { relativeDate, stripHtml } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Search, Trash2 } from "lucide-react";

export default function AdminProjectsPage() {
  const [q, setQ] = useState("");
  const [deleted, setDeleted] = useState<string[]>([]);
  const { show } = useToast();

  const list = useMemo(() => {
    return projects.filter((p) => {
      if (!q.trim()) return true;
      return p.title.toLowerCase().includes(q.trim().toLowerCase()) || stripHtml(p.description, 200).toLowerCase().includes(q.trim().toLowerCase());
    });
  }, [q]);

  const onDelete = (id: string) => {
    setDeleted((prev) => [...prev, id]);
    show("모집글을 삭제했어요", "success");
  };

  return (
    <AdminLayout title="게시글 관리" subtitle="개인·팀이 올린 프로젝트 모집글을 관리합니다.">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={14} />
          <input className="input pl-9" placeholder="제목·내용 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <span className="ml-auto text-sm text-[var(--color-muted)]">총 {list.length}건</span>
      </div>

      <div className="space-y-3">
        {list.map((p) => {
          const isDeleted = deleted.includes(p.id);
          const author = getUser(p.authorId);
          const category = getCategory(p.categoryId);
          return (
            <div key={p.id} className={`card p-5 flex flex-col md:flex-row gap-4 ${isDeleted ? "opacity-50" : ""}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  {category && <span className="badge badge-neutral">{category.name}</span>}
                  <span>{author?.name}</span>
                  <span>· {relativeDate(p.createdAt)}</span>
                </div>
                <Link href={`/projects/${p.id}`} className={`mt-1 font-bold hover:text-[var(--color-primary)] block ${isDeleted ? "line-through" : ""}`}>{p.title}</Link>
                <p className="mt-2 text-sm text-[var(--color-muted)] line-clamp-2">{stripHtml(p.description, 180)}</p>
              </div>
              <div className="flex items-center gap-2 self-start">
                <button className="btn btn-outline btn-sm" disabled={isDeleted} onClick={() => onDelete(p.id)}>
                  <Trash2 size={14} /> {isDeleted ? "삭제됨" : "삭제"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
