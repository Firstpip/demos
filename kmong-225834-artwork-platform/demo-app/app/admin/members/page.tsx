"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { users } from "@/lib/data/users";
import { formatDate } from "@/lib/utils";
import { UserStatus } from "@/lib/types";
import { useToast } from "@/providers/ToastProvider";
import { Search } from "lucide-react";

export default function AdminMembersPage() {
  const [tab, setTab] = useState<"general" | "company">("general");
  const [q, setQ] = useState("");
  const [overrides, setOverrides] = useState<Record<string, UserStatus>>({});
  const { show } = useToast();

  const list = useMemo(() => {
    const source = users.filter((u) => u.type === tab);
    return source.filter((u) => {
      if (!q.trim()) return true;
      const needle = q.trim().toLowerCase();
      return u.name.toLowerCase().includes(needle) || u.email.toLowerCase().includes(needle);
    });
  }, [tab, q]);

  const toggle = (id: string, next: UserStatus) => {
    setOverrides((prev) => ({ ...prev, [id]: next }));
    show(next === "suspended" ? "회원을 정지했어요" : "회원을 재개했어요", "success");
  };

  return (
    <AdminLayout title="회원 관리" subtitle="가입 회원 상태를 조회하고 제재를 관리합니다.">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex gap-1">
          {(["general", "company"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-semibold ${tab === t ? "bg-[var(--color-accent)] text-white" : "bg-[#F3F3EE] text-[var(--color-muted)]"}`}>
              {t === "general" ? "일반 회원" : "기업 회원"}
            </button>
          ))}
        </div>
        <div className="ml-auto relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={14} />
          <input className="input pl-9" placeholder="이름·이메일로 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-[var(--color-muted)] bg-[#FBFBF7]">
            <tr>
              <th className="px-5 py-3 font-semibold">이름</th>
              <th className="px-5 py-3 font-semibold">이메일</th>
              <th className="px-5 py-3 font-semibold">가입일</th>
              <th className="px-5 py-3 font-semibold">마지막 접속</th>
              <th className="px-5 py-3 font-semibold">상태</th>
              <th className="px-5 py-3 font-semibold text-right">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {list.map((u) => {
              const status = overrides[u.id] ?? u.status;
              return (
                <tr key={u.id} className="hover:bg-[rgba(0,0,0,0.02)]">
                  <td className="px-5 py-3 font-semibold">{u.name}</td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{u.email}</td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "-"}</td>
                  <td className="px-5 py-3">
                    {status === "active" ? (
                      <span className="badge badge-success">활성</span>
                    ) : (
                      <span className="badge badge-danger">정지</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {status === "active" ? (
                      <button className="btn btn-outline btn-sm" onClick={() => toggle(u.id, "suspended")}>정지</button>
                    ) : (
                      <button className="btn btn-outline btn-sm" onClick={() => toggle(u.id, "active")}>재개</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-sm text-[var(--color-muted)]">검색 결과가 없어요.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
