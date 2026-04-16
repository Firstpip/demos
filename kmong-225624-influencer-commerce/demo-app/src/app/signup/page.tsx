"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  terms?: string;
}

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 4) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { level: 1, label: "약함", color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "보통", color: "bg-yellow-500" };
  return { level: 3, label: "강함", color: "bg-green-500" };
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Terms agreement state
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "이름을 입력해주세요";
    if (!form.email.trim()) e.email = "이메일을 입력해주세요";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "올바른 이메일 형식이 아닙니다";
    if (!form.password) e.password = "비밀번호를 입력해주세요";
    else if (form.password.length < 4) e.password = "비밀번호는 4자 이상이어야 합니다";
    if (!form.passwordConfirm) e.passwordConfirm = "비밀번호 확인을 입력해주세요";
    else if (form.password !== form.passwordConfirm)
      e.passwordConfirm = "비밀번호가 일치하지 않습니다";
    if (!agreeTerms || !agreePrivacy) e.terms = "필수 약관에 동의해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    toast.success("가입 완료! 로그인해주세요.");
    router.push("/login/");
  };

  const update = (key: keyof FormData, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#2563EB]">KWAVE</h1>
        </Link>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">회원가입</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="홍길동"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-email">
                  이메일 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="example@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-password">
                  비밀번호 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="4자 이상"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
                {/* Password Strength Bar */}
                {form.password.length > 0 && (
                  <div className="mt-2" id="signup-password-strength">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.level
                              ? passwordStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        passwordStrength.level === 1
                          ? "text-red-500"
                          : passwordStrength.level === 2
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      비밀번호 강도: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="signup-password-confirm">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signup-password-confirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(e) => update("passwordConfirm", e.target.value)}
                  placeholder="비밀번호 재입력"
                  className={errors.passwordConfirm ? "border-red-500" : ""}
                />
                {errors.passwordConfirm && (
                  <p className="text-xs text-red-500 mt-1">{errors.passwordConfirm}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2 pt-2" id="signup-terms">
                <p className="text-sm font-medium text-gray-700">약관 동의</p>
                <label
                  htmlFor="signup-agree-terms"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="signup-agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-sm text-gray-700">
                    이용약관 동의 <span className="text-red-500">(필수)</span>
                  </span>
                </label>
                <label
                  htmlFor="signup-agree-privacy"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="signup-agree-privacy"
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-sm text-gray-700">
                    개인정보처리방침 동의 <span className="text-red-500">(필수)</span>
                  </span>
                </label>
                <label
                  htmlFor="signup-agree-marketing"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="signup-agree-marketing"
                    type="checkbox"
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] accent-[#2563EB]"
                  />
                  <span className="text-sm text-gray-700">
                    마케팅 수신 동의 <span className="text-gray-400">(선택)</span>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                가입하기
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login/"
                className="text-[#2563EB] hover:underline font-medium"
              >
                로그인
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
