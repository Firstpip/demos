'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from '@/contexts/SearchContext';

export default function Header() {
  const { role, currentUser, switchRole, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles = [
    { value: 'guest' as const, label: '비로그인' },
    { value: 'member' as const, label: '일반회원' },
    { value: 'admin' as const, label: '관리자' },
  ];

  return (
    <header id="header" className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs md:text-sm">B2B</span>
            </div>
            <span className="text-sm md:text-xl font-bold text-primary">B2B MALL</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="상품을 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-4">
            {/* Role toggle */}
            <div id="role-toggle" className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1 px-2 md:px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs md:text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {roles.find(r => r.value === role)?.label}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showRoleDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      onClick={() => {
                        switchRole(r.value);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 transition-colors cursor-pointer ${
                        role === r.value ? 'text-primary font-medium bg-primary/5' : 'text-neutral-600'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            {role !== 'guest' && role !== 'admin' && (
              <Link href="/cart" className="relative p-2 text-neutral-600 hover:text-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}

            {/* My page / Admin */}
            {role === 'admin' ? (
              <Link href="/admin" className="btn-primary text-xs md:text-sm !py-1.5 whitespace-nowrap">
                관리자
              </Link>
            ) : role !== 'guest' ? (
              <Link href="/mypage/orders" className="text-xs md:text-sm text-neutral-600 hover:text-primary transition-colors whitespace-nowrap">
                마이페이지
              </Link>
            ) : null}

            {/* Login/Logout */}
            {role === 'guest' ? (
              <Link href="/login" className="btn-primary text-xs md:text-sm !py-1.5 whitespace-nowrap">
                로그인
              </Link>
            ) : (
              <button
                onClick={logout}
                className="text-xs md:text-sm text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>

        {/* Logged-in user info bar */}
        {currentUser && (
          <div className="flex items-center justify-between py-1.5 text-[10px] md:text-xs text-neutral-400 border-t border-neutral-100 overflow-hidden">
            <span className="truncate">{currentUser.businessName} | {currentUser.managerName}님</span>
            <span className="whitespace-nowrap ml-2">할인율: <span className="font-medium text-primary">{currentUser.discountRate}%</span></span>
          </div>
        )}
      </div>
    </header>
  );
}
