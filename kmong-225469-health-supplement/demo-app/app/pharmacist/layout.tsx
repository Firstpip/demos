'use client'
import Sidebar from '../components/Sidebar'

const menuItems = [
  { label: '대시보드', href: '/pharmacist', icon: '📊' },
  { label: '상담 관리', href: '/pharmacist/consultation', icon: '💬' },
  { label: '제품 조합', href: '/pharmacist/products', icon: '💊' },
]

export default function PharmacistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="약사 상담센터" menuItems={menuItems} />
      <main className="flex-1 md:ml-60 bg-[#F8FAFC] p-6">{children}</main>
    </div>
  )
}
