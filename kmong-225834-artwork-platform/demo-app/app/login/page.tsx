"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/common/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { users } from "@/lib/data/users";
import { UserCircle, Shield, Briefcase } from "lucide-react";

export default function LoginPage() {
  return (
    <AuthGuard guestOnly>
      <Suspense fallback={<div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
        <LoginInner />
      </Suspense>
    </AuthGuard>
  );
}

const DEMO_ACCOUNTS = [
  { userId: "u-001", type: "general" as const, name: "서준호", icon: UserCircle, subtitle: "일반 회원 (댄서)", bg: "bg-[var(--color-primary)] text-white" },
  { userId: "c-001", type: "company" as const, name: "스테이지라이즈", icon: Briefcase, subtitle: "기업 회원", bg: "bg-[var(--color-accent)] text-white" },
  { userId: "a-001", type: "admin" as const, name: "ARTWORK 운영팀", icon: Shield, subtitle: "관리자", bg: "bg-[#0E9F6E] text-white" },
];

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState("jun.seo@artwork.demo");
  const [password, setPassword] = useState("demo-password");
  const next = params.get("next") || "/";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = users.find((u) => u.email === email);
    if (!u) {
      show("데모 계정만 로그인 가능합니다. 아래 계정을 선택해주세요.", "error");
      return;
    }
    login({ userId: u.id, type: u.type, name: u.name });
    show(`${u.name}으로 로그인했어요`, "success");
    router.replace(u.type === "admin" ? "/admin" : next);
  };

  const loginAs = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    if (!u) return;
    login({ userId: u.id, type: u.type, name: u.name });
    show(`${u.name}으로 로그인했어요`, "success");
    router.replace(u.type === "admin" ? "/admin" : next);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2A1A12] to-[#FF5A36]" />
        <div className="relative h-full p-12 text-white flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span className="w-10 h-10 rounded-xl bg-white text-[var(--color-primary)] grid place-items-center font-black">A</span>
            <span className="font-bold text-xl tracking-tight">ARTWORK</span>
          </Link>
          <div>
            <div className="text-5xl font-black leading-tight tracking-tight">
              무대에 설 기회를<br />
              <span className="text-[var(--color-primary)]">한 곳에서</span>
            </div>
            <p className="mt-5 text-white/70 leading-relaxed max-w-md">
              댄서·뮤지션·배우·모델·서커스 아티스트를 위한 구인구직 허브.<br />
              공연·광고·단기 프로젝트까지 한 번에 탐색하고 지원하세요.
            </p>
          </div>
          <div className="text-xs text-white/50">© 2026 ARTWORK · 데모 페이지</div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 md:p-12 bg-[var(--color-bg)]">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white grid place-items-center font-black">A</span>
            <span className="font-bold text-lg">ARTWORK</span>
          </Link>
          <h1 className="text-2xl font-bold">다시 만나서 반가워요</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">이메일과 비밀번호로 로그인하거나, 데모 계정을 바로 선택하세요.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold">이메일</span>
              <input type="email" className="input mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">비밀번호</span>
              <input type="password" className="input mt-1.5" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-primary btn-lg btn-full">로그인</button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs text-[var(--color-muted)]">
            <div className="flex-1 h-px bg-[var(--color-line)]" />
            <span>또는 데모 계정으로 바로 전환</span>
            <div className="flex-1 h-px bg-[var(--color-line)]" />
          </div>

          <div className="grid gap-3">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.userId}
                  type="button"
                  onClick={() => loginAs(acc.userId)}
                  className="card card-hover p-4 flex items-center gap-3 text-left"
                >
                  <div className={`w-10 h-10 rounded-xl grid place-items-center ${acc.bg}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{acc.name}</div>
                    <div className="text-xs text-[var(--color-muted)]">{acc.subtitle}</div>
                  </div>
                  <span className="ml-auto text-xs text-[var(--color-primary)] font-semibold">전환 →</span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 text-sm text-[var(--color-muted)] text-center">
            계정이 없나요? <Link href="/signup" className="text-[var(--color-primary)] font-semibold">회원가입</Link>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#F3F3EE] text-xs text-[var(--color-muted)] leading-relaxed">
            <strong className="text-[var(--color-text)]">데모 안내:</strong> 본 페이지는 제안용 시연으로, 비밀번호는 어떤 값이든 로그인 가능합니다. 이메일을 바꾸려면 데모 계정 목록에서 선택하세요.
          </div>
        </div>
      </section>
    </div>
  );
}
