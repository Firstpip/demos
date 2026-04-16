'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: '홈', href: '/', icon: (c: string) => <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg> },
  { label: '마켓', href: '/market', icon: (c: string) => <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { label: '내결과', href: '/my-results', icon: (c: string) => <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> },
  { label: '상담', href: '/consultation', icon: (c: string) => <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
  { label: 'MY', href: '/mypage', icon: (c: string) => <svg width="24" height="24" fill="none" stroke={c} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-40 flex justify-around py-2">
      {tabs.map(t => {
        const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
        const color = active ? '#22C55E' : '#64748B'
        return (
          <Link key={t.href} href={t.href} className="flex flex-col items-center gap-0.5">
            {t.icon(color)}
            <span className="text-[10px]" style={{ color }}>{t.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
