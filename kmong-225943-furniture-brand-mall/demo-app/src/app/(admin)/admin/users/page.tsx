'use client'

import { useMemo, useState } from 'react'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { users } from '@/data/users'
import { brandById } from '@/data/brands'
import { ordersByUser } from '@/data/orders'
import { useAuth } from '@/lib/contexts/auth'
import { EmptyState } from '@/components/states'
import { formatKRW, formatDate, cn } from '@/lib/utils'
import type { Role } from '@/lib/types'

const tabs: Array<{ key: Role | 'all'; label: string }> = [
  { key: 'all', label: '전체' },
  { key: 'member', label: '일반 회원' },
  { key: 'partner', label: '조합사 운영자' },
  { key: 'admin', label: '관리자' },
]

const roleColor: Record<Role, string> = {
  guest: 'bg-surface-2 text-text-muted',
  member: 'bg-primary text-white',
  partner: 'bg-accent text-white',
  admin: 'bg-success text-white',
}
const roleLabel: Record<Role, string> = { guest: '게스트', member: '일반', partner: '조합사', admin: '관리자' }

const channels = ['이메일', '카카오', '네이버', '구글', '애플']

export default function AdminUsersPage() {
  const { role: currentRole } = useAuth()
  const [tab, setTab] = useState<Role | 'all'>('all')

  const realUsers = useMemo(() => users.filter((u) => u.role !== 'guest'), [])

  const filtered = useMemo(() => {
    if (tab === 'all') return realUsers
    return realUsers.filter((u) => u.role === tab)
  }, [tab, realUsers])

  if (currentRole === 'partner') {
    return (
      <div>
        <AdminPageHeader title="회원 관리" />
        <EmptyState
          title="조합사 권한으로는 접근할 수 없습니다"
          description="회원 정보 관리는 본체 운영자만 가능합니다."
        />
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader title="회원 관리" description={`총 ${realUsers.length.toLocaleString()}명`} />

      <div className="mb-3 flex flex-wrap gap-1" role="tablist">
        {tabs.map((t) => {
          const count = t.key === 'all' ? realUsers.length : realUsers.filter((u) => u.role === t.key).length
          return (
            <button
              key={t.key}
              id={`admin-users-tab-${t.key}`}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
                tab === t.key ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
              )}
            >
              {t.label}
              <span className="rounded-full bg-text-muted/15 px-1.5 py-0.5 text-[10px]">{count}</span>
            </button>
          )
        })}
      </div>

      <div id="admin-users-table" className="overflow-hidden rounded-lg border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs text-text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">이름</th>
              <th className="px-3 py-2 font-medium">이메일</th>
              <th className="px-3 py-2 font-medium">역할</th>
              <th className="px-3 py-2 font-medium">가입 경로</th>
              <th className="px-3 py-2 font-medium">최근 주문</th>
              <th className="px-3 py-2 font-medium text-right">누적 결제</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const userOrders = ordersByUser(u.id)
              const lastOrder = userOrders[0]
              const total = userOrders.reduce((acc, o) => acc + o.totalPrice - o.couponDiscount - o.rewardUsed, 0)
              const channel = channels[i % channels.length]
              const partnerBrand = u.partnerBrandId ? brandById(u.partnerBrandId) : null
              return (
                <tr key={u.id} className="border-t">
                  <td className="px-3 py-2">
                    <p className="font-medium text-text">{u.name}</p>
                    {partnerBrand && <p className="text-[11px] text-text-muted">담당 {partnerBrand.name}</p>}
                  </td>
                  <td className="px-3 py-2 text-text-muted">{u.email || '—'}</td>
                  <td className="px-3 py-2">
                    <span className={cn('rounded px-2 py-0.5 text-[11px]', roleColor[u.role])}>{roleLabel[u.role]}</span>
                  </td>
                  <td className="px-3 py-2 text-text-muted">{u.role === 'guest' ? '—' : channel}</td>
                  <td className="px-3 py-2 text-text-muted">{lastOrder ? formatDate(lastOrder.createdAt) : '—'}</td>
                  <td className="px-3 py-2 text-right">{total > 0 ? formatKRW(total) : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
