'use client'
import Sidebar from '../components/Sidebar'

const menuItems = [
  { label: '대시보드', href: '/partner', icon: '📊' },
  { label: '환자 목록', href: '/partner/patients', icon: '👥' },
  { label: '상담 관리', href: '/partner/consultation', icon: '💬' },
  { label: '추천 제품', href: '/partner/recommend', icon: '💊' },
  { label: '수수료 정산', href: '/partner/settlement', icon: '💰' },
  { label: 'QR/링크 설정', href: '/partner/qr', icon: '🔗' },
]

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar title="파트너센터" menuItems={menuItems} />
      <main className="flex-1 md:ml-60 bg-[#F8FAFC] p-6">{children}</main>
    </div>
  )
}
