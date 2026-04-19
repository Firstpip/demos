'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';

type GuardType = 'loggedIn' | 'guestOnly' | 'admin';

export default function AuthGuard({
  children,
  type,
  redirect,
}: {
  children: ReactNode;
  type: GuardType;
  redirect?: string;
}) {
  const router = useRouter();
  const { isLoggedIn, role, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (type === 'loggedIn' && !isLoggedIn) {
      router.replace(redirect || '/login');
    } else if (type === 'guestOnly' && isLoggedIn) {
      router.replace(redirect || '/');
    }
  }, [hydrated, type, isLoggedIn, router, redirect]);

  if (!hydrated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-sm text-gray-400">
        불러오는 중...
      </div>
    );
  }
  if (type === 'loggedIn' && !isLoggedIn) return null;
  if (type === 'guestOnly' && isLoggedIn) return null;
  if (type === 'admin' && role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">관리자 전용 페이지</h2>
        <p className="text-sm text-gray-600 mb-6">
          상단 헤더의 &quot;일반회원 모드 / 관리자 모드&quot; 토글을 클릭하여 관리자 모드로 전환하세요.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
