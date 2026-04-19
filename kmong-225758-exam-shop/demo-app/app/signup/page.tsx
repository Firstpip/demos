'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
import { useAuth, useToast } from '@/lib/context';
import AuthGuard from '@/components/AuthGuard';

function SignupInner() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [String(key)]: '' }));
  };

  const toggleAll = (checked: boolean) => {
    setForm(f => ({
      ...f,
      agreeAll: checked,
      agreeTerms: checked,
      agreePrivacy: checked,
      agreeMarketing: checked,
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = '이름을 입력해주세요.';
    if (!form.email.trim()) next.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = '이메일 형식이 올바르지 않습니다.';
    if (!form.phone.trim()) next.phone = '연락처를 입력해주세요.';
    if (!form.password.trim()) next.password = '비밀번호를 입력해주세요.';
    else if (form.password.length < 6) next.password = '비밀번호는 6자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) next.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (!form.agreeTerms) next.agreeTerms = '이용약관에 동의해주세요.';
    if (!form.agreePrivacy) next.agreePrivacy = '개인정보처리방침에 동의해주세요.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      showToast('입력값을 확인해주세요.', 'error');
      return;
    }
    login(form.name);
    showToast(`${form.name}님 회원가입 완료! 2,000원 적립금을 지급했습니다.`);
    setTimeout(() => router.push('/'), 300);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-6 text-[#1B2A4A]">
          <BookOpen className="w-7 h-7" />
          <span className="text-xl font-bold">에듀프레스</span>
        </Link>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-5 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            <span className="font-semibold">데모 안내</span>: 입력값은 저장되지 않으며, 가입 시 즉시 2,000원 적립금이 지급되는 Mock 플로우입니다.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h1 className="text-lg font-bold text-gray-900 text-center">회원가입</h1>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">
              이름 <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">
              이메일 <span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">
              연락처 <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="tel"
              placeholder="010-1234-5678"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">
                비밀번호 <span className="text-red-500">*</span>
              </span>
              <input
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-gray-600">
                비밀번호 확인 <span className="text-red-500">*</span>
              </span>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={e => update('passwordConfirm', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
              {errors.passwordConfirm && (
                <p className="text-xs text-red-500 mt-1">{errors.passwordConfirm}</p>
              )}
            </label>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreeAll}
                onChange={e => toggleAll(e.target.checked)}
                className="w-4 h-4 accent-[#1B2A4A]"
              />
              전체 동의
            </label>
            <div className="space-y-1.5 pl-6 text-xs text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={e => update('agreeTerms', e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1B2A4A]"
                />
                이용약관 동의 (필수)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreePrivacy}
                  onChange={e => update('agreePrivacy', e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1B2A4A]"
                />
                개인정보 수집 및 이용 동의 (필수)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agreeMarketing}
                  onChange={e => update('agreeMarketing', e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1B2A4A]"
                />
                마케팅 정보 수신 동의 (선택)
              </label>
              {(errors.agreeTerms || errors.agreePrivacy) && (
                <p className="text-xs text-red-500 pt-1">{errors.agreeTerms || errors.agreePrivacy}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#E8653A] text-white font-semibold rounded-md hover:bg-[#d35529]"
          >
            회원가입
          </button>

          <p className="text-xs text-center text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-[#1B2A4A] font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthGuard type="guestOnly">
      <SignupInner />
    </AuthGuard>
  );
}
