'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuItem { label: string; href: string; icon: string }
interface Props { title: string; menuItems: MenuItem[] }

export default function Sidebar({ title, menuItems }: Props) {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-60 bg-[#1B2A4A] min-h-screen fixed left-0 top-0 z-30 text-white">
      <div className="p-4 border-b border-white/10">
        <Link href="/" className="text-lg font-bold tracking-wider">ENER RINGER</Link>
        <p className="text-xs text-white/60 mt-1">{title}</p>
      </div>
      <nav className="flex-1 py-4">
        {menuItems.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${active ? 'bg-white/10 text-[#22C55E] border-r-2 border-[#22C55E]' : 'hover:bg-white/5'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
