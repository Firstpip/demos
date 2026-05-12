'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ChevronRight, Coins } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth'
import { useRewards } from '@/lib/contexts/rewards'
import { formatDate, cn } from '@/lib/utils'

const reasonLabel: Record<string, string> = {
  purchase: '구매 적립',
  'auto-delay-compensation': '배송 지연 자동 보상',
  coupon: '쿠폰 사용',
  manual: '수동 조정',
}

const filters = [
  { key: 'all', label: '전체' },
  { key: 'purchase', label: '구매 적립' },
  { key: 'auto-delay-compensation', label: '자동 보상' },
  { key: 'coupon', label: '쿠폰 사용' },
] as const

type FilterKey = typeof filters[number]['key']

export default function RewardsPage() {
  const { userId, user } = useAuth()
  const { entries, balanceForUser } = useRewards()
  const [filter, setFilter] = useState<FilterKey>('all')

  const ledger = useMemo(() => {
    const own = entries.filter((e) => e.userId === userId || e.userId === 'user-member-1')
    if (filter === 'all') return own
    return own.filter((e) => e.reason === filter)
  }, [entries, userId, filter])

  const balance = balanceForUser(userId) || balanceForUser('user-member-1')
  const totalEarned = entries
    .filter((e) => (e.userId === userId || e.userId === 'user-member-1') && e.delta > 0)
    .reduce((acc, e) => acc + e.delta, 0)

  return (
    <div className="mx-auto max-w-[960px] px-4 py-8">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-3 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/account" className="hover:text-text">마이페이지</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">적립금</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-text">적립금 내역</h1>
        <p className="mt-1 text-sm text-text-muted">{user.name}님의 적립금 사용·발급 내역입니다.</p>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-2">
        <div id="rewards-card-balance" className="rounded-lg border bg-surface p-5">
          <p className="inline-flex items-center gap-1 text-xs text-text-muted"><Coins className="h-3.5 w-3.5" /> 사용 가능 적립금</p>
          <p className="mt-1 text-3xl font-semibold text-text">{balance.toLocaleString()}<span className="ml-1 text-base text-text-muted">P</span></p>
        </div>
        <div className="rounded-lg border bg-surface p-5">
          <p className="text-xs text-text-muted">누적 적립</p>
          <p className="mt-1 text-3xl font-semibold text-text">{totalEarned.toLocaleString()}<span className="ml-1 text-base text-text-muted">P</span></p>
        </div>
      </section>

      <div className="mb-3 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs',
              filter === f.key ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-1.5">
        {ledger.map((r) => (
          <li
            key={r.id}
            id={`rewards-history-row-${r.id}`}
            className="flex items-center justify-between rounded-md border bg-surface px-4 py-3 text-sm"
          >
            <span>
              <span className="block text-text">{reasonLabel[r.reason] ?? r.reason}</span>
              <span className="block text-[11px] text-text-muted">
                {formatDate(r.createdAt)}
                {r.refOrderId && ` · 주문 ${r.refOrderId}`}
              </span>
            </span>
            <span className={cn('text-base font-semibold', r.delta >= 0 ? 'text-success' : 'text-danger')}>
              {r.delta >= 0 ? '+' : ''}{r.delta.toLocaleString()}P
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
