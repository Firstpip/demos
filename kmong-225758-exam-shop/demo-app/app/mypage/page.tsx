'use client';

import Link from 'next/link';
import { User, Gift, Package, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/context';
import { orders, users, products } from '@/lib/data';
import { formatPrice, formatDate, getStatusColor, generateBookCover } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

function MypageInner() {
  const { userName } = useAuth();
  const me = users.find(u => u.name === userName) ?? users[0];
  const myOrders = orders
    .filter(o => o.userName === userName || o.userId === me.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 5);
  const recentViewed = products.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">마이페이지</h1>

      <section className="bg-gradient-to-r from-[#1B2A4A] to-[#2D4A7A] rounded-lg p-5 text-white flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          <User className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold">{userName || '회원'}님 반갑습니다</p>
          <p className="text-xs text-white/70">{me.email}</p>
        </div>
        <div className="hidden md:flex gap-3 text-sm">
          <div className="text-center">
            <Gift className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/70">적립금</p>
            <p className="font-bold">{me.points.toLocaleString('ko-KR')}P</p>
          </div>
          <div className="text-center">
            <Package className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs text-white/70">주문 건수</p>
            <p className="font-bold">{me.orderCount}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { href: '/mypage/orders', label: '주문 내역', icon: Package, color: '#1B2A4A' },
          { href: '/mypage/reviews', label: '내 후기', icon: MessageSquare, color: '#E8653A' },
          { href: '/resources', label: '자료실', icon: Gift, color: '#22C55E' },
          { href: '/notice', label: '공지사항', icon: MessageSquare, color: '#8B5CF6' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: item.color + '20', color: item.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">최근 주문</h2>
          <Link href="/mypage/orders" className="text-xs text-[#1B2A4A] hover:text-[#E8653A]">
            전체보기
          </Link>
        </div>
        {myOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-sm text-gray-500">
            주문 내역이 없습니다.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {myOrders.map(o => (
              <div key={o.id} className="p-4 flex items-center gap-3">
                <span className="text-xs text-gray-500 shrink-0 w-24">{formatDate(o.createdAt)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {o.items[0].title}
                    {o.items.length > 1 && ` 외 ${o.items.length - 1}건`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.orderNumber}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(o.status)}`}>
                  {o.status}
                </span>
                <span className="text-sm font-bold text-gray-900 w-24 text-right">
                  {formatPrice(o.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">최근 본 교재</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentViewed.map(p => {
            const cover = generateBookCover(p.title, p.category);
            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
              >
                <div
                  className="aspect-[3/4] rounded flex items-center justify-center text-white text-xs font-bold text-center p-2 mb-2"
                  style={{ backgroundColor: cover.bg }}
                >
                  {p.title}
                </div>
                <p className="text-xs text-gray-500">{p.category} · {p.grade}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(p.salePrice)}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function MypagePage() {
  return (
    <AuthGuard type="loggedIn">
      <MypageInner />
    </AuthGuard>
  );
}
