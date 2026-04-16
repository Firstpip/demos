'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'member' | 'admin' | 'any';
}

export default function AuthGuard({ children, requiredRole = 'any' }: AuthGuardProps) {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    // Logged-in user trying to access auth pages
    if (isAuthPage && role !== 'guest') {
      router.replace('/');
      return;
    }

    // Guest trying to access protected pages
    if (!isAuthPage && role === 'guest') {
      router.replace('/login');
      return;
    }

    // Admin-only check
    if (requiredRole === 'admin' && role !== 'admin') {
      router.replace('/');
      return;
    }
  }, [role, isLoading, pathname, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
