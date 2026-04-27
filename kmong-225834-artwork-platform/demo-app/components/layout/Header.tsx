"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Plus, UserCircle, Shield } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { users } from "@/lib/data/users";
import SearchAutocomplete from "@/components/common/SearchAutocomplete";

const DEMO_ACCOUNTS = [
  { userId: "u-001", type: "general" as const, name: "서준호", label: "일반 회원 (댄서)" },
  { userId: "c-001", type: "company" as const, name: "스테이지라이즈", label: "기업 회원" },
  { userId: "a-001", type: "admin" as const, name: "ARTWORK 운영팀", label: "관리자" },
];

export default function Header() {
  const { session, hydrated, login, logout } = useAuth();
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || "/";

  const currentUser = session ? users.find((u) => u.id === session.userId) : null;

  const isActive = (prefix: string) =>
    pathname === prefix || pathname.startsWith(prefix + "/");

  const switchTo = (acc: (typeof DEMO_ACCOUNTS)[number]) => {
    login({ userId: acc.userId, type: acc.type, name: acc.name });
    setOpen(false);
    show(`${acc.name} 계정으로 전환되었어요`, "success");
    if (acc.type === "admin") router.push("/admin");
  };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 bg-[var(--color-surface)]/85 backdrop-blur border-b border-[var(--color-line)]"
    >
      <div className="demo-container flex items-center gap-6 h-16">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] grid place-items-center text-white font-bold">
            A
          </span>
          <span className="font-bold text-lg tracking-tight">ARTWORK</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link
            href="/jobs"
            id="main-tab-jobs"
            className={`py-1 ${isActive("/jobs") ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}
          >
            채용공고
          </Link>
          <Link
            href="/projects"
            id="main-tab-projects"
            className={`py-1 ${isActive("/projects") ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}
          >
            프로젝트 모집
          </Link>
          <Link
            href="/artists"
            className={`py-1 ${isActive("/artists") ? "font-semibold text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}
          >
            예술인
          </Link>
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-2 flex-1 max-w-md">
          <SearchAutocomplete
            size="md"
            containerId="header-search"
            placeholder="공고·장르·지역·타입 검색"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          {hydrated && session?.type === "company" && (
            <Link
              href="/jobs/new"
              id="header-post-job"
              className="btn btn-primary btn-sm hidden md:inline-flex whitespace-nowrap"
              title="기업 회원 전용 — 새 공고 등록"
            >
              <Plus size={14} />
              공고 등록
            </Link>
          )}
          {!hydrated ? (
            <div className="w-24 h-8 skel" aria-hidden />
          ) : session ? (
            <div className="relative">
              <button
                id="role-switch"
                className="btn btn-outline btn-sm"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <UserCircle size={16} />
                <span className="hidden sm:inline">{currentUser?.name || session.name}</span>
                <ChevronDown size={14} />
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[var(--color-line)] rounded-xl shadow-lg p-2 z-50" role="menu">
                  <div className="px-3 py-2 text-xs text-[var(--color-muted)]">현재 로그인</div>
                  <div className="px-3 pb-3 border-b border-[var(--color-line)]">
                    <div className="font-semibold text-sm">{currentUser?.name || session.name}</div>
                    <div className="text-xs text-[var(--color-muted)]">{session.type === "general" ? "일반 회원" : session.type === "company" ? "기업 회원" : "관리자"}</div>
                  </div>
                  <div className="px-3 py-2 text-xs text-[var(--color-muted)]">데모 계정 전환</div>
                  {DEMO_ACCOUNTS.filter((a) => a.userId !== session.userId).map((acc) => (
                    <button
                      key={acc.userId}
                      role="menuitem"
                      onClick={() => switchTo(acc)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[rgba(0,0,0,0.04)] flex items-center gap-2"
                    >
                      {acc.type === "admin" ? <Shield size={14} /> : <UserCircle size={14} />}
                      <span>{acc.label}</span>
                    </button>
                  ))}
                  <div className="border-t border-[var(--color-line)] mt-2 pt-2">
                    <Link href="/mypage" onClick={() => setOpen(false)} role="menuitem" className="block px-3 py-2 text-sm rounded-lg hover:bg-[rgba(0,0,0,0.04)]">
                      마이페이지
                    </Link>
                    <Link href="/profile/edit" onClick={() => setOpen(false)} role="menuitem" className="block px-3 py-2 text-sm rounded-lg hover:bg-[rgba(0,0,0,0.04)]">
                      프로필 편집
                    </Link>
                    {session.type === "admin" && (
                      <Link href="/admin" onClick={() => setOpen(false)} role="menuitem" className="block px-3 py-2 text-sm rounded-lg hover:bg-[rgba(0,0,0,0.04)]">
                        관리자 콘솔
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        show("로그아웃되었어요");
                      }}
                      role="menuitem"
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[rgba(0,0,0,0.04)] text-[var(--color-danger)] flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                로그인
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                회원가입
              </Link>
            </>
          )}
          <button aria-label="알림" className="btn btn-ghost btn-sm" type="button">
            <Bell size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
