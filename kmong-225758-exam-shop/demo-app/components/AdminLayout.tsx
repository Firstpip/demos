'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  FolderOpen,
  Bell,
  Settings,
} from 'lucide-react';
import AuthGuard from './AuthGuard';

const menu = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: '상품 관리', icon: Package },
  { href: '/admin/orders', label: '주문 관리', icon: ShoppingBag },
  { href: '/admin/members', label: '회원 관리', icon: Users },
  { href: '/admin/reviews', label: '후기 관리', icon: MessageSquare },
  { href: '/admin/resources', label: '자료실 관리', icon: FolderOpen },
  { href: '/admin/notices', label: '공지 관리', icon: Bell },
  { href: '/admin/settings', label: '쇼핑몰 설정', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard type="admin">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            id="admin-sidebar"
            className="lg:w-60 shrink-0"
          >
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-[#1B2A4A] text-white">
                <p className="text-xs text-gray-300">에듀프레스</p>
                <p className="text-sm font-bold">관리자 콘솔</p>
              </div>
              <nav className="p-2">
                {menu.map(item => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                        active
                          ? 'bg-[#E8653A]/10 text-[#E8653A] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
