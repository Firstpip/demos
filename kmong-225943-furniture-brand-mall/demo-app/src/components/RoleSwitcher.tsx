'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, UserCircle, ShieldCheck, Building2, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth'
import type { Role } from '@/lib/types'
import { cn } from '@/lib/utils'

const options: Array<{ role: Role; label: string; sub: string; icon: React.ElementType }> = [
  { role: 'guest', label: '비로그인', sub: '공개 페이지·마이크로사이트', icon: EyeOff },
  { role: 'member', label: '사용자 김지윤', sub: '장바구니·결제·자동 보상', icon: UserCircle },
  { role: 'partner', label: '조합사 라온우드', sub: '본인 브랜드 CMS만', icon: Building2 },
  { role: 'admin', label: '전체 관리자', sub: '모든 관리자 페이지', icon: ShieldCheck },
]

export function RoleSwitcher() {
  const { role, signInAs, hydrated } = useAuth()
  const [open, setOpen] = useState(false)
  const firstItemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    firstItemRef.current?.focus()
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!hydrated) return null
  const current = options.find((o) => o.role === role) ?? options[0]
  const Icon = current.icon

  return (
    <div id="role-switcher" className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border bg-surface px-2.5 py-1.5 text-xs font-medium text-text shadow-sm hover:bg-surface-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">시점</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div role="menu" className="absolute right-0 z-20 mt-2 w-72 rounded-md border bg-surface shadow-md animate-fade-in">
            <div className="border-b px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">데모 시점 전환</p>
              <p className="text-[11px] text-text-muted">본 개발에서는 제거되는 데모 전용 컨트롤입니다.</p>
            </div>
            <ul className="py-1">
              {options.map((opt, idx) => {
                const OptIcon = opt.icon
                const active = opt.role === role
                return (
                  <li key={opt.role}>
                    <button
                      type="button"
                      ref={idx === 0 ? firstItemRef : undefined}
                      onClick={() => { signInAs(opt.role); setOpen(false) }}
                      className={cn(
                        'flex w-full items-start gap-2.5 px-3 py-2 text-left hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none',
                        active && 'bg-surface-2',
                      )}
                    >
                      <OptIcon className="mt-0.5 h-4 w-4 text-text-muted" />
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-text">{opt.label}</span>
                        <span className="block text-xs text-text-muted">{opt.sub}</span>
                      </span>
                      {active && <span className="text-[11px] font-medium text-accent">현재</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
