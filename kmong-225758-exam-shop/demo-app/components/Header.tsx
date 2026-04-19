'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, BookOpen, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/context';
import { useCart } from '@/lib/context';

export default function Header() {
  const pathname = usePathname();
  const { isLoggedIn, role, userName, logout, toggleRole } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (pathname === '/login' || pathname === '/signup') return null;

  const navLinks = [
    { href: '/products', label: '전체 교재' },
    { href: '/products?category=국어', label: '국어' },
    { href: '/products?category=영어', label: '영어' },
    { href: '/products?category=수학', label: '수학' },
    { href: '/resources', label: '자료실' },
    { href: '/notice', label: '공지사항' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* 역할 전환 바 */}
      <div className="bg-gray-900 text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="text-gray-400">[데모] 에듀프레스 모의고사 서점</span>
          <button
            onClick={toggleRole}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <Shield className="w-3 h-3" />
            {role === 'admin' ? '관리자 모드' : '일반회원 모드'} (클릭하여 전환)
          </button>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="w-8 h-8 text-[#1B2A4A]" />
            <span className="text-xl font-bold text-[#1B2A4A] hidden sm:block">에듀프레스</span>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href.split('?')[0]
                    ? 'text-[#E8653A] bg-orange-50'
                    : 'text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {role === 'admin' && (
              <Link
                href="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'text-[#E8653A] bg-orange-50'
                    : 'text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-50'
                }`}
              >
                관리자
              </Link>
            )}
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-2">
            {/* 검색 토글 */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-[#1B2A4A] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 장바구니 */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-[#1B2A4A] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#E8653A] text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* 로그인/사용자 */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/mypage" className="hidden sm:flex items-center gap-1 text-sm text-gray-700 hover:text-[#1B2A4A]">
                  <User className="w-4 h-4" />
                  {userName}님
                </Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 bg-[#1B2A4A] text-white rounded-md hover:bg-[#2D4A7A] transition-colors"
              >
                로그인
              </Link>
            )}

            {/* 모바일 메뉴 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 검색 바 */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                placeholder="교재명, 저자, 과목으로 검색..."
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-sm"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {link.label}
              </Link>
            ))}
            {role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                관리자
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
