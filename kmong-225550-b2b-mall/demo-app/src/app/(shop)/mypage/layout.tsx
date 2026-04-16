'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/mypage/orders', label: '주문내역' },
  { href: '/mypage/profile', label: '회원정보' },
];

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">마이페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <nav className="card overflow-hidden">
            {menuItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 text-sm border-b border-neutral-100 last:border-0 transition-colors ${
                  pathname === item.href
                    ? 'bg-primary/5 text-primary font-medium border-l-3 border-l-primary'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
