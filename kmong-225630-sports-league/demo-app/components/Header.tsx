'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, Trophy, User, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: '홈' },
  { href: '/schedule', label: '경기일정' },
  { href: '/bracket', label: '대진표' },
  { href: '/ranking', label: '랭킹' },
];

export default function Header() {
  const { isLoggedIn, userName, role, logout, toggleRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleRole = () => {
    const nextRole = role === 'user' ? 'admin' : 'user';
    toggleRole();
    if (nextRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const handleNavClick = () => {
    if (role === 'admin') toggleRole();
  };

  return (
    <header id="header" className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" onClick={handleNavClick} className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <Trophy className="w-6 h-6" />
          <span className="hidden sm:inline">배드민턴리그</span>
        </Link>

        <nav id="nav-menu" className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={handleNavClick}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}>{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button id="role-toggle" onClick={handleToggleRole}
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                title={role === 'admin' ? '일반 사용자로 전환' : '관리자로 전환'}>
                <Shield className="w-3.5 h-3.5" />
                {role === 'admin' ? '관리자' : '사용자'}
              </button>
              <Link href="/mypage" onClick={handleNavClick} className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <User className="w-4 h-4" />
                {userName}
              </Link>
              <button onClick={logout} className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="hidden md:inline-flex px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              로그인
            </Link>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => { handleNavClick(); setMenuOpen(false); }}
              className={`block px-3 py-2 rounded-lg text-sm ${pathname === l.href ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'}`}>{l.label}</Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link href="/mypage" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-gray-600">마이페이지</Link>
              <button onClick={() => { handleToggleRole(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600">
                {role === 'admin' ? '사용자로 전환' : '관리자로 전환'}
              </button>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-red-500">로그아웃</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-blue-600 font-medium">로그인</Link>
          )}
        </div>
      )}
    </header>
  );
}
