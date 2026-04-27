"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/common/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";

type Role = "general" | "company";

export default function SignupPage() {
  return (
    <AuthGuard guestOnly>
      <Suspense fallback={<div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
        <SignupInner />
      </Suspense>
    </AuthGuard>
  );
}

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const { show } = useToast();
  const [role, setRole] = useState<Role>((params.get("as") as Role) || "general");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [rep, setRep] = useState("");
  const [agree, setAgree] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return show("약관에 동의해주세요.", "error");
    if (email.length < 4 || password.length < 4) return show("이메일·비밀번호를 확인해주세요.", "error");
    const finalName = role === "company" ? (company || "신규 기업") : (name || "신규 회원");
    login({ userId: role === "company" ? "c-999" : "u-999", type: role, name: finalName });
    show("회원가입이 완료되었어요 (데모)", "success");
    router.replace(role === "company" ? "/jobs/new" : "/profile/edit");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Link href="/" className="flex items-center gap-2 mb-6 w-fit">
          <span className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white grid place-items-center font-black">A</span>
          <span className="font-bold text-lg">ARTWORK</span>
        </Link>

        <div className="card p-6 md:p-8">
          <div>
            <h1 className="text-2xl font-bold">회원가입</h1>
            <p className="text-sm text-[var(--color-muted)] mt-1">가입 유형을 먼저 선택하면 필요한 정보만 입력하게 안내해드려요.</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("general")}
              className={`p-4 rounded-xl border-2 text-left transition ${role === "general" ? "border-[var(--color-primary)] bg-[#FFF4F0]" : "border-[var(--color-line)]"}`}
              aria-pressed={role === "general"}
            >
              <div className="font-bold">일반 회원</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">댄서·뮤지션·배우·모델·아티스트. 프로필을 만들고 공고에 지원해요.</div>
            </button>
            <button
              type="button"
              onClick={() => setRole("company")}
              className={`p-4 rounded-xl border-2 text-left transition ${role === "company" ? "border-[var(--color-primary)] bg-[#FFF4F0]" : "border-[var(--color-line)]"}`}
              aria-pressed={role === "company"}
            >
              <div className="font-bold">기업 회원</div>
              <div className="text-xs text-[var(--color-muted)] mt-1">공연 기획·엔터테인먼트·프로덕션. 공고를 등록하고 섭외를 진행해요.</div>
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="이메일" required>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
              </Field>
              <Field label="비밀번호" required>
                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="영문·숫자 조합 8자 이상" />
              </Field>
              {role === "general" ? (
                <>
                  <Field label="이름" required>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                  </Field>
                  <Field label="연락처">
                    <input type="text" inputMode="numeric" className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ""))} placeholder="010-0000-0000" />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="회사명" required>
                    <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
                  </Field>
                  <Field label="사업자등록번호" required>
                    <input type="text" inputMode="numeric" className="input" value={bizNo} onChange={(e) => setBizNo(e.target.value.replace(/[^\d-]/g, ""))} placeholder="000-00-00000" />
                  </Field>
                  <Field label="대표자명" required>
                    <input className="input" value={rep} onChange={(e) => setRep(e.target.value)} />
                  </Field>
                  <Field label="담당자 연락처">
                    <input type="text" inputMode="numeric" className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ""))} />
                  </Field>
                </>
              )}
            </div>

            <label className="flex items-start gap-2 text-sm pt-2">
              <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="text-[var(--color-muted)]">이용약관과 개인정보 처리방침에 동의합니다. (데모)</span>
            </label>

            <button type="submit" className="btn btn-primary btn-lg btn-full">가입 완료</button>
          </form>

          <div className="mt-5 text-sm text-[var(--color-muted)] text-center">
            이미 계정이 있나요? <Link href="/login" className="text-[var(--color-primary)] font-semibold">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label} {required && <span className="text-[var(--color-primary)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
