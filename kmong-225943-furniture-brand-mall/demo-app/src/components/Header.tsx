'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth'
import { useCart } from '@/lib/contexts/cart'
import { RoleSwitcher } from './RoleSwitcher'
import { categoryTree } from '@/data/categoryTree'

const utilityNav = [
  { href: '/collections', label: '컬렉션' },
  { href: '/brands', label: '브랜드' },
  { href: '/maholn', label: '마홀앤' },
]

export function Header() {
  const { hydrated, isLoggedIn, user, role } = useAuth()
  const { count, hydrated: cartHydrated } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const cartLabel = hydrated && cartHydrated ? count : 0
  const showAdmin = hydrated && (role === 'admin' || role === 'partner')

  return (
    <header id="site-header" className="sticky top-0 z-30 border-b bg-surface/95 backdrop-blur">
      <div className="bg-primary text-primary-fg">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <span className="truncate">봄맞이 SPRING10 코드 — 20만원 이상 주문 시 10% 할인</span>
          <RoleSwitcher />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-3">
        <button
          type="button"
          aria-label="메뉴 열기"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/" className="text-lg font-semibold tracking-tight">
          가구몰
        </Link>
        <nav id="header-nav" aria-label="주요 메뉴" className="hidden md:flex items-center gap-4 text-sm text-text-muted lg:gap-5">
          {categoryTree.map((node) => (
            <Link
              key={node.category}
              href={`/products?category=${encodeURIComponent(node.category)}`}
              className="hover:text-text"
            >
              {node.category}
            </Link>
          ))}
          <span aria-hidden className="h-3.5 w-px bg-border" />
          {utilityNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-text-muted hover:text-text"
            >
              {n.label}
            </Link>
          ))}
          {showAdmin && (
            <Link href="/admin" className="text-text-muted hover:text-text">
              관리자
            </Link>
          )}
        </nav>
        <form
          id="header-search"
          action="/search"
          method="GET"
          className="ml-auto hidden lg:flex items-center gap-2 rounded-md border bg-bg px-3 py-1.5 w-[180px] xl:w-[220px]"
        >
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="search"
            name="q"
            placeholder="가구·브랜드 검색"
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
          />
        </form>
        <Link href="/cart" id="cart-button" className="relative ml-auto inline-flex items-center gap-1 text-sm lg:ml-0" aria-label="장바구니">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 inline-flex min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-primary-fg">
            {cartLabel}
          </span>
        </Link>
        <Link href={isLoggedIn ? '/account' : '/sign-in'} className="inline-flex items-center gap-1 text-sm" aria-label={isLoggedIn ? '마이페이지' : '로그인'}>
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">{hydrated && isLoggedIn ? user.name : '로그인'}</span>
        </Link>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <aside className="absolute left-0 top-0 h-full w-[min(288px,85vw)] overflow-y-auto bg-surface p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base font-semibold">메뉴</p>
              <button type="button" aria-label="메뉴 닫기" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 text-sm">
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">카테고리</p>
              {categoryTree.map((node) => (
                <details key={node.category} className="rounded-md">
                  <summary className="cursor-pointer rounded-md px-2 py-2 font-medium hover:bg-surface-2">
                    {node.category}
                  </summary>
                  <ul className="ml-2 space-y-0.5 border-l pl-2">
                    <li>
                      <Link
                        href={`/products?category=${encodeURIComponent(node.category)}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded px-2 py-1 text-[11px] text-text-muted hover:bg-surface-2 hover:text-text"
                      >
                        전체 보기
                      </Link>
                    </li>
                    {node.subCategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`/products?category=${encodeURIComponent(node.category)}&subCategory=${encodeURIComponent(sub)}`}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded px-2 py-1 text-[11px] text-text-muted hover:bg-surface-2 hover:text-text"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <p className="mt-3 px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">바로가기</p>
              {utilityNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2 hover:bg-surface-2"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href={isLoggedIn ? '/account' : '/sign-in'}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 hover:bg-surface-2"
              >
                마이페이지
              </Link>
              {showAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-2 hover:bg-surface-2"
                >
                  관리자
                </Link>
              )}
            </nav>
          </aside>
        </div>
      )}
    </header>
  )
}
