'use client'
import Link from 'next/link'
import { useAuth } from '../../contexts/auth-context'

const menus = [
  { label: '검사 결과', href: '/my-results', icon: '📋' },
  { label: '상담 내역', href: '/mypage/consultations', icon: '💬' },
  { label: '주문/배송 내역', href: '/mypage/orders', icon: '📦' },
  { label: '정기배송 관리', href: '/mypage/subscription', icon: '🔄' },
  { label: '복약 관리', href: '/mypage/medication', icon: '💊' },
  { label: '고객센터', href: '/cs', icon: '❓' },
]

export default function MyPage() {
  const { userName } = useAuth()
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6 flex items-center gap-4">
        <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center text-2xl font-bold text-[#1B2A4A]">{(userName || '?')[0]}</div>
        <div>
          <p className="font-bold text-lg text-[#1E293B]">{userName || '게스트'}님</p>
          <p className="text-sm text-[#64748B]">에너링거와 함께 건강을 관리하세요</p>
        </div>
      </div>
      <div className="space-y-2">
        {menus.map(m => (
          <Link key={m.href} href={m.href} className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md transition-shadow">
            <span className="text-xl">{m.icon}</span>
            <span className="font-medium text-[#1E293B]">{m.label}</span>
            <span className="ml-auto text-[#64748B]">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
