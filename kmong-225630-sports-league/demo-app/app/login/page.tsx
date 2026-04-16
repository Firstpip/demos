'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Trophy, Info } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email.split('@')[0] || '데모 사용자', email || 'demo@example.com');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold text-2xl">
            <Trophy className="w-8 h-8" />
            배드민턴리그
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-gray-900 text-center mb-6">로그인</h1>

          <div id="login-demo-notice" className="bg-blue-50 rounded-lg p-3 mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">데모 페이지입니다. 아무 값이나 입력하여 로그인할 수 있습니다.</p>
          </div>

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 <span className="text-red-500">*</span></label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <button type="submit"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              로그인
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-500">또는</span></div>
            </div>
            <div id="login-social" className="mt-4 space-y-2">
              <button onClick={() => { login('카카오 사용자', 'kakao@example.com'); router.push('/'); }}
                className="w-full py-2.5 bg-[#FEE500] text-[#3C1E1E] rounded-lg font-medium text-sm hover:bg-[#FDD800] transition-colors">
                카카오 로그인
              </button>
              <button onClick={() => { login('네이버 사용자', 'naver@example.com'); router.push('/'); }}
                className="w-full py-2.5 bg-[#03C75A] text-white rounded-lg font-medium text-sm hover:bg-[#02b351] transition-colors">
                네이버 로그인
              </button>
              <button onClick={() => { login('구글 사용자', 'google@example.com'); router.push('/'); }}
                className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                Google 로그인
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            아직 회원이 아니신가요?{' '}
            <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
