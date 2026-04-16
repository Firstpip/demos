import StatCard from '../components/StatCard'
import { consultations } from '../data/consultations'

export default function PharmacistDashboard() {
  const today = consultations.filter(c => c.status === '예약완료')
  const completed = consultations.filter(c => c.status === '상담완료')
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">약사 대시보드</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="오늘 상담" value={`${today.length}건`} color="#3B82F6" />
        <StatCard label="대기 환자" value={`${today.length}명`} color="#F59E0B" />
        <StatCard label="이번 달 완료" value={`${completed.length}건`} color="#22C55E" />
        <StatCard label="전체 상담" value={`${consultations.length}건`} color="#8B5CF6" />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-[#1E293B] mb-4">상담 일정</h2>
        {consultations.length === 0 ? (
          <p className="text-sm text-[#64748B] text-center py-8">예정된 상담이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {consultations.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                <div>
                  <p className="font-medium text-sm">{c.notes}</p>
                  <p className="text-xs text-[#64748B]">{c.date} {c.time} · {c.type === 'video' ? '화상' : '채팅'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === '예약완료' ? 'bg-blue-100 text-blue-700' : c.status === '상담완료' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
