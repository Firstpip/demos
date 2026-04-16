'use client'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../components/Toast'

export default function BookingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const handleBook = () => { toast('상담 예약이 완료되었습니다'); setTimeout(() => router.push('/mypage'), 1500) }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">상담 예약</h1>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">상담 유형</label><div className="flex gap-3">{['채팅상담','화상상담'].map(t => <button key={t} className="flex-1 border border-[#E2E8F0] py-3 rounded-lg text-sm hover:border-[#22C55E]">{t}</button>)}</div></div>
        <div><label className="block text-sm font-medium mb-1">희망 날짜</label><input type="date" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">희망 시간</label>
          <select className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm bg-white"><option>10:00</option><option>11:00</option><option>14:00</option><option>15:00</option><option>16:00</option></select>
        </div>
        <button onClick={handleBook} className="w-full bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A]">예약 확정</button>
      </div>
    </div>
  )
}
