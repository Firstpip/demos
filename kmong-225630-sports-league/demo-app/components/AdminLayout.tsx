'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard, Users, Trophy, AlertTriangle, CreditCard, ChevronLeft } from 'lucide-react';
import { type ReactNode } from 'react';

const sidebarLinks = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/members', label: '회원 관리', icon: Users },
  { href: '/admin/tournaments', label: '대회 관리', icon: Trophy },
  { href: '/admin/appeals', label: '이의제기 관리', icon: AlertTriangle },
  { href: '/admin/payments', label: '결제 관리', icon: CreditCard },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { toggleRole } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside id="admin-sidebar" className="hidden lg:flex w-60 flex-col bg-gray-900 text-white flex-shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" onClick={toggleRole} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ChevronLeft className="w-4 h-4" /> 사이트로 돌아가기
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(l => {
            const isActive = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex">
        {sidebarLinks.map(l => {
          const isActive = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
              <l.icon className="w-5 h-5 mb-0.5" />
              {l.label.replace(' 관리', '')}
            </Link>
          );
        })}
      </div>

      <main className="flex-1 bg-gray-50 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
