'use client'
import { useToast } from '../../components/Toast'

const inquiries = [
  { id: 1, title: '정기배송 날짜 변경 문의', date: '2026-03-28', status: '대기', content: '다음 달 배송일을 변경하고 싶습니다.' },
  { id: 2, title: 'DTC 검사 결과 문의', date: '2026-03-25', status: '답변완료', content: '검사 결과를 어디서 확인할 수 있나요?' },
  { id: 3, title: '환불 요청', date: '2026-03-22', status: '대기', content: '주문한 제품 환불 요청드립니다.' },
]

export default function AdminCsPage() {
  const { toast } = useToast()
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">CS 관리</h1>
      <div className="space-y-4">
        {inquiries.map(q => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <div><p className="font-medium text-sm">{q.title}</p><p className="text-xs text-[#64748B]">{q.date}</p></div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${q.status === '대기' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{q.status}</span>
            </div>
            <p className="text-sm text-[#64748B] mb-3">{q.content}</p>
            {q.status === '대기' && (
              <div className="flex gap-2">
                <input type="text" placeholder="답변 입력..." className="flex-1 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
                <button onClick={() => toast('답변이 등록되었습니다')} className="bg-[#22C55E] text-white text-sm px-4 py-2 rounded-lg">답변</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
