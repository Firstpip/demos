import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const maholnNav = [
  { href: '/maholn', label: 'Home' },
  { href: '/maholn/lookbook/2026-spring', label: 'Lookbook' },
  { href: '/maholn/about', label: 'About' },
  { href: '/brands/maholn', label: 'Shop' },
]

export function MaholnHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--maholn-text)]/10 bg-[var(--maholn-bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <Link href="/maholn" className="text-base font-semibold tracking-[0.16em] text-[var(--maholn-text)]">
          MAHOLN
        </Link>
        <nav aria-label="마홀앤 메뉴" className="hidden md:flex items-center gap-7 text-[13px] tracking-wide text-[var(--maholn-text)]/80">
          {maholnNav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[var(--maholn-text)]">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs tracking-wide text-[var(--maholn-text)]/70 hover:text-[var(--maholn-text)]"
        >
          본체 쇼핑몰로 <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  )
}

export function MaholnFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--maholn-text)]/10">
      <div className="mx-auto max-w-[1280px] px-6 py-10 text-xs tracking-wide text-[var(--maholn-text)]/60">
        <p>MAHOLN — 가구의 결을 기록하는 마이크로사이트</p>
        <p className="mt-2">결제·배송·계정은 본체 쇼핑몰과 통합되어 있습니다.</p>
      </div>
    </footer>
  )
}
