'use client'
import Sidebar from '../components/Sidebar'

const menuItems = [
  { label: '대시보드', href: '/admin', icon: '📊' },
  { label: '제품 관리', href: '/admin/products', icon: '💊' },
  { label: '설문 관리', href: '/admin/surveys', icon: '📝' },
  { label: '전문가 관리', href: '/admin/experts', icon: '👨‍⚕️' },
  { label: '주문 관리', href: '/admin/orders', icon: '📦' },
  { label: '정산 관리', href: '/admin/settlement', icon: '💰' },
  { label: '매거진', href: '/admin/magazine', icon: '📰' },
  { label: 'CS 관리', href: '/admin/cs', icon: '💬' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="관리자" menuItems={menuItems} />
      <main className="flex-1 md:ml-60 bg-[#F8FAFC] p-6">{children}</main>
    </div>
  )
}
