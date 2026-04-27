"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/common/AuthGuard";
import { LayoutDashboard, CheckSquare, Users, Briefcase, Megaphone, AlertTriangle, ArrowLeft, Tags } from "lucide-react";

const NAV = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/members", label: "회원 관리", icon: Users },
  { href: "/admin/jobs", label: "공고 관리", icon: Briefcase },
  { href: "/admin/projects", label: "게시글 관리", icon: Megaphone },
  { href: "/admin/categories", label: "카테고리 관리", icon: Tags },
  { href: "/admin/approvals", label: "공고 승인", icon: CheckSquare },
  { href: "/admin/reports", label: "신고", icon: AlertTriangle },
];

export default function AdminLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const pathname = usePathname() || "";
  return (
    <AuthGuard allow={["admin"]}>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[240px_1fr] bg-[var(--color-bg)]">
        <aside className="hidden lg:flex flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)] sticky top-0 h-screen">
          <div className="p-5 border-b border-[var(--color-line)] flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-[var(--color-accent)] text-white grid place-items-center font-black">A</span>
            <div>
              <div className="font-bold text-sm leading-tight">ARTWORK 콘솔</div>
              <div className="text-[11px] text-[var(--color-muted)]">운영 관리자 전용</div>
            </div>
          </div>
          <nav className="p-3 text-sm">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 transition-colors ${active ? "bg-[var(--color-accent)] !text-white font-semibold shadow-sm" : "text-[var(--color-text)] font-medium hover:bg-[rgba(0,0,0,0.05)]"}`}
                >
                  <Icon size={16} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto p-3">
            <Link href="/" className="flex items-center gap-2 text-xs text-[var(--color-muted)] px-3 py-2 hover:text-[var(--color-text)]">
              <ArrowLeft size={14} /> 서비스로 나가기
            </Link>
          </div>
        </aside>

        <main className="min-h-screen">
          <header className="sticky top-0 z-30 bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-line)]">
            <div className="px-5 md:px-8 py-4 flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold">{title}</h1>
                {subtitle && <p className="text-xs text-[var(--color-muted)] mt-0.5">{subtitle}</p>}
              </div>
              <Link href="/" className="ml-auto btn btn-outline btn-sm">
                사용자 뷰
              </Link>
            </div>
            <nav className="lg:hidden flex gap-1 px-2 pb-2 overflow-x-auto">
              {NAV.map((n) => {
                const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
                return (
                  <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={`whitespace-nowrap px-3 py-2 text-xs rounded-lg transition-colors ${active ? "bg-[var(--color-accent)] !text-white font-semibold shadow-sm" : "text-[var(--color-text)] font-medium hover:bg-[rgba(0,0,0,0.05)]"}`}>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
