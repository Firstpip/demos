'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../contexts/auth-context'
import { useCart } from '../contexts/cart-context'
import RoleToggle from './RoleToggle'

export default function Header() {
  const { isLoggedIn, userName, logout } = useAuth()
  const { items } = useCart()
  const cartCount = items.reduce((a, i) => a + i.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    { label: 'DTC소개', href: '/dtc' },
    { label: 'DTC 유전자검사', href: '/dtc/products' },
    { label: '맞춤형건강기능식품', href: '/market' },
  ]
  return (
    <header className="bg-[#1B2A4A] text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wider">ENER RINGER</Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map(n => <Link key={n.href} href={n.href} className="text-sm hover:text-[#22C55E] transition-colors">{n.label}</Link>)}
        </nav>
        <div className="hidden md:flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <>
              <span>{userName}님</span>
              <RoleToggle />
              <button onClick={logout} className="hover:text-[#22C55E]">로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#22C55E]">로그인</Link>
              <Link href="/register" className="hover:text-[#22C55E]">회원가입</Link>
            </>
          )}
          <Link href="/cart" className="hover:text-[#22C55E] relative">
                장바구니{cartCount > 0 && <span className="absolute -top-2 -right-3 bg-[#22C55E] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </Link>
              <Link href="/cs" className="hover:text-[#22C55E]">고객센터</Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#2A3F6A] px-4 pb-4 space-y-3">
          {navItems.map(n => <Link key={n.href} href={n.href} className="block py-2 text-sm hover:text-[#22C55E]" onClick={() => setMenuOpen(false)}>{n.label}</Link>)}
          <div className="border-t border-white/20 pt-3">
            {isLoggedIn ? (
              <div className="space-y-2">
                <p className="text-sm">{userName}님</p>
                <RoleToggle />
                <button onClick={() => { logout(); setMenuOpen(false) }} className="text-sm hover:text-[#22C55E]">로그아웃</button>
              </div>
            ) : (
              <div className="flex gap-4 text-sm">
                <Link href="/login" onClick={() => setMenuOpen(false)}>로그인</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>회원가입</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
