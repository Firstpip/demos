import Link from 'next/link'
import { consultations } from '../../../data/consultations'

const statusStyle: Record<string, string> = { '예약완료': 'bg-blue-100 text-blue-700', '상담완료': 'bg-green-100 text-green-700', '취소': 'bg-gray-100 text-gray-600' }

export default function ConsultationHistoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">상담 내역</h1>
      {consultations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#64748B] mb-4">상담 내역이 없습니다.</p>
          <Link href="/consultation" className="inline-block bg-[#22C55E] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#16A34A]">상담 예약하기</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map(c => (
            <div key={c.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm text-[#1E293B]">{c.expertName}</p>
                  <p className="text-xs text-[#64748B]">{c.date} {c.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B]">{c.type === 'video' ? '화상' : '채팅'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[c.status] || ''}`}>{c.status}</span>
                </div>
              </div>
              <p className="text-sm text-[#64748B]">{c.notes}</p>
              {c.status === '예약완료' && (
                <div className="flex gap-2 mt-3">
                  <Link href={`/consultation/room?type=${c.type}`} className="text-xs bg-[#22C55E] text-white px-3 py-1 rounded hover:bg-[#16A34A]">상담 입장</Link>
                  <button className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded hover:bg-red-50">예약 취소</button>
                </div>
              )}
              {c.status === '상담완료' && (
                <Link href="/my-results/report" className="text-xs text-blue-600 mt-2 inline-block hover:underline">추천 제품 확인 →</Link>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Link href="/consultation" className="inline-block border border-[#E2E8F0] px-6 py-2 rounded-lg text-sm hover:bg-[#F8FAFC]">새 상담 예약</Link>
      </div>
    </div>
  )
}
