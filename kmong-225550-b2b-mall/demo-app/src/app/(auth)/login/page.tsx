'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, role } = useAuth();
  const { showToast } = useToast();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ loginId?: string; password?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (role !== 'guest') {
      router.replace('/');
    }
  }, [role, router]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!loginId.trim()) errs.loginId = '아이디를 입력해주세요.';
    if (!password.trim()) errs.password = '비밀번호를 입력해주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = login(loginId, password);
    if (success) {
      showToast('로그인되었습니다.', 'success');
      router.push('/');
    } else {
      showToast('로그인에 실패했습니다.', 'error');
    }
  };

  return (
    <div id="login-page" className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">B2B</span>
          </div>
          <span className="text-2xl font-bold text-primary">B2B MALL</span>
        </div>
        <p className="text-neutral-600 text-sm">B2B 전용 쇼핑몰입니다</p>
        <p className="text-neutral-400 text-xs mt-1">사업자 회원만 이용 가능합니다</p>
      </div>

      {/* Login form */}
      <div className="card p-8">
        {/* Demo notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-blue-700 text-sm font-medium">데모 안내</p>
          <p className="text-blue-600 text-xs mt-1">
            데모 버전입니다. 아무 값이나 입력하여 로그인할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">아이디 <span className="text-error">*</span></label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="아이디를 입력하세요"
              className={`input-field ${errors.loginId ? 'border-error ring-1 ring-error' : ''}`}
            />
            {errors.loginId && <p className="text-error text-xs mt-1">{errors.loginId}</p>}
          </div>
          <div>
            <label className="label-field">비밀번호 <span className="text-error">*</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className={`input-field ${errors.password ? 'border-error ring-1 ring-error' : ''}`}
            />
            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="btn-primary w-full !py-3 text-base">
            로그인
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/signup" className="text-sm text-primary hover:underline">
            아직 회원이 아니신가요? 회원가입
          </Link>
        </div>
      </div>

      {/* Official site banner */}
      <div id="official-site-banner" className="mt-6 card p-4 text-center">
        <p className="text-sm text-neutral-600">공식 홈페이지에서 더 많은 정보를 확인하세요</p>
        <a
          href="#"
          className="inline-block mt-2 text-sm text-secondary font-medium hover:underline"
        >
          공식 홈페이지 바로가기 &rarr;
        </a>
      </div>
    </div>
  );
}
