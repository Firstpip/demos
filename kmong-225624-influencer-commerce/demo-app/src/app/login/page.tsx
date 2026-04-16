"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "이메일을 입력해주세요";
    if (!password.trim()) e.password = "비밀번호를 입력해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const name = email.split("@")[0] || "데모 사용자";
    login(name);
    router.push("/");
  };

  const handleSocialLogin = (provider: string) => {
    toast.info("소셜 로그인은 데모에서 지원하지 않습니다");
    login(`${provider} 사용자`);
    router.push("/");
  };

  return (
    <div id="page-login" className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#2563EB]">KWAVE</h1>
        </Link>

        <Card>
          <CardContent className="p-6">
            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="login-email">이메일</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="login-password">비밀번호</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-[#2563EB] hover:underline"
                  onClick={() => toast.info("데모에서는 지원하지 않습니다")}
                >
                  비밀번호 찾기
                </button>
              </div>

              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                로그인
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">또는</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2" id="login-social">
              <Button
                type="button"
                className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-medium"
                onClick={() => handleSocialLogin("카카오")}
              >
                카카오로 시작하기
              </Button>
              <Button
                type="button"
                className="w-full bg-[#03C75A] hover:bg-[#02b351] text-white font-medium"
                onClick={() => handleSocialLogin("네이버")}
              >
                네이버로 시작하기
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full font-medium"
                onClick={() => handleSocialLogin("Google")}
              >
                Google로 시작하기
              </Button>
            </div>

            {/* Demo notice */}
            <div
              id="login-demo-notice"
              className="mt-4 flex items-start gap-2 rounded-md bg-blue-50 p-3 text-xs text-blue-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>이것은 데모 사이트입니다. 아무 값이나 입력하여 로그인할 수 있습니다.</p>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              계정이 없으신가요?{" "}
              <Link href="/signup/" className="text-[#2563EB] hover:underline font-medium">
                회원가입
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
