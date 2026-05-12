'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ClipboardList,
  Tag,
  Users,
  Truck,
  Plug,
  FileEdit,
  Building2,
  Lock,
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth'
import { brandById } from '@/data/brands'
import { usePermissionDenied } from './PermissionDeniedModal'
import { cn } from '@/lib/utils'

interface MenuItem {
  key: string
  href: string
  label: string
  icon: React.ElementType
  partnerAllowed: boolean
  group: 'overview' | 'catalog' | 'operations' | 'cms'
}

const items: MenuItem[] = [
  { key: 'dashboard', href: '/admin', label: '대시보드', icon: LayoutDashboard, partnerAllowed: true, group: 'overview' },
  { key: 'products', href: '/admin/products', label: '제품 관리', icon: Package, partnerAllowed: false, group: 'catalog' },
  { key: 'product-new', href: '/admin/products/new', label: '제품 등록', icon: PackagePlus, partnerAllowed: false, group: 'catalog' },
  { key: 'orders', href: '/admin/orders', label: '주문 관리', icon: ClipboardList, partnerAllowed: false, group: 'operations' },
  { key: 'coupons', href: '/admin/coupons', label: '쿠폰 관리', icon: Tag, partnerAllowed: false, group: 'operations' },
  { key: 'delivery-monitor', href: '/admin/delivery-monitor', label: '배송 모니터', icon: Truck, partnerAllowed: false, group: 'operations' },
  { key: 'integrations', href: '/admin/integrations', label: '외부 연동', icon: Plug, partnerAllowed: false, group: 'operations' },
  { key: 'users', href: '/admin/users', label: '회원 관리', icon: Users, partnerAllowed: false, group: 'operations' },
  { key: 'cms', href: '/admin/cms', label: '콘텐츠 모듈', icon: FileEdit, partnerAllowed: false, group: 'cms' },
  { key: 'brands', href: '/admin/brands', label: '브랜드 관리', icon: Building2, partnerAllowed: false, group: 'cms' },
  { key: 'partner', href: '#', label: '내 브랜드 페이지', icon: Building2, partnerAllowed: true, group: 'cms' },
]

const groupLabel: Record<MenuItem['group'], string> = {
  overview: '개요',
  catalog: '카탈로그',
  operations: '운영',
  cms: '브랜드·콘텐츠',
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { role, user } = useAuth()
  const { trigger } = usePermissionDenied()
  const isPartner = role === 'partner'
  const partnerHref = isPartner && user.partnerBrandId
    ? `/admin/cms/partner/${brandById(user.partnerBrandId)?.slug ?? 'raonwood'}`
    : '/admin/cms/partner/raonwood'

  const grouped = items.reduce<Record<MenuItem['group'], MenuItem[]>>((acc, it) => {
    acc[it.group] = acc[it.group] ?? []
    acc[it.group].push(it)
    return acc
  }, { overview: [], catalog: [], operations: [], cms: [] })

  return (
    <aside id="admin-sidebar" className="w-60 shrink-0 border-r bg-surface">
      <nav className="sticky top-[88px] space-y-5 px-3 py-4 text-sm">
        {(Object.keys(grouped) as MenuItem['group'][]).map((g) => (
          <div key={g}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              {groupLabel[g]}
            </p>
            <ul className="space-y-0.5">
              {grouped[g].map((it) => {
                if (it.key === 'partner' && !isPartner) return null
                if (it.key === 'brands' && isPartner) return null
                const Icon = it.icon
                const href = it.key === 'partner' ? partnerHref : it.href
                const active = pathname === href || (it.key !== 'dashboard' && pathname?.startsWith(href))
                const locked = isPartner && !it.partnerAllowed
                const className = cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                  active && !locked ? 'bg-primary/10 text-primary' : 'text-text-muted hover:bg-surface-2 hover:text-text',
                  locked && 'cursor-not-allowed italic text-text-muted/90 hover:bg-transparent hover:text-text-muted/90',
                )
                if (locked) {
                  return (
                    <li key={it.key}>
                      <button
                        type="button"
                        id={`admin-sidebar-item-${it.key}`}
                        aria-disabled="true"
                        onClick={() => trigger(`${it.label} 메뉴 진입`, user.partnerBrandId)}
                        className={cn(className, 'w-full text-left')}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1">{it.label}</span>
                        <Lock className="h-3 w-3" />
                      </button>
                    </li>
                  )
                }
                return (
                  <li key={it.key}>
                    <Link id={`admin-sidebar-item-${it.key}`} href={href} className={className}>
                      <Icon className="h-4 w-4" />
                      <span>{it.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        <div className="rounded-md border border-dashed bg-surface-2 p-3 text-[11px] text-text-muted">
          좌상단 시점 전환으로 사용자·조합사·관리자 시점을 즉시 바꿀 수 있습니다.
        </div>
      </nav>
    </aside>
  )
}
