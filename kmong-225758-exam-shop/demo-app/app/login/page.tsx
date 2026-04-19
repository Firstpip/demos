'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
import { useAuth, useToast } from '@/lib/context';
import AuthGuard from '@/components/AuthGuard';

function LoginInner() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = '이메일을 입력해주세요.';
    if (!password.trim()) next.password = '비밀번호를 입력해주세요.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      showToast('입력값을 확인해주세요.', 'error');
      return;
    }
    const name = email.split('@')[0];
    login(name);
    showToast(`${name}님 환영합니다!`);
    setTimeout(() => router.push('/'), 200);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6 text-[#1B2A4A]">
          <BookOpen className="w-7 h-7" />
          <span className="text-xl font-bold">에듀프레스</span>
        </Link>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-5 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            <span className="font-semibold">데모 안내</span>: 아무 이메일/비밀번호나 입력해도 로그인됩니다.
            상단 바의 "관리자 모드" 토글로 관리자 기능도 확인할 수 있습니다.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h1 className="text-lg font-bold text-gray-900 text-center">로그인</h1>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">이메일</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@edupress.co.kr"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </label>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1B2A4A] text-white font-semibold rounded-md hover:bg-[#2D4A7A]"
          >
            로그인
          </button>

          <div className="text-xs text-center text-gray-500 space-x-3">
            <Link href="/signup" className="hover:text-[#1B2A4A]">회원가입</Link>
            <span>·</span>
            <span className="cursor-pointer hover:text-[#1B2A4A]">아이디 찾기</span>
            <span>·</span>
            <span className="cursor-pointer hover:text-[#1B2A4A]">비밀번호 재설정</span>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          실서비스에서는 이메일 인증 + 소셜 로그인(카카오/네이버)이 지원됩니다.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthGuard type="guestOnly">
      <LoginInner />
    </AuthGuard>
  );
}
