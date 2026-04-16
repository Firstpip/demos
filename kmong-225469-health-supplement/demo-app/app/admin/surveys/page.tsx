'use client'
import { useToast } from '../../components/Toast'

const surveySteps = [
  { step: 1, title: '기본 정보', items: ['성별', '연령'] },
  { step: 2, title: '생활습관', items: ['운동 빈도', '수면 시간', '음주 빈도', '흡연 여부'] },
  { step: 3, title: '복용 약물', items: ['현재 복용 중인 약물'] },
  { step: 4, title: '알레르기', items: ['유제품', '갑각류', '견과류', '대두', '밀'] },
  { step: 5, title: '건강 고민', items: ['피로감', '수면 문제', '소화 불량', '체중 관리', '면역력', '혈당', '혈압', '관절', '피부', '눈'] },
]

export default function AdminSurveysPage() {
  const { toast } = useToast()
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">설문 관리</h1>
        <button onClick={() => toast('항목 추가 기능 (데모)')} className="bg-[#22C55E] text-white text-sm px-4 py-2 rounded-lg">+ 항목 추가</button>
      </div>
      <div className="space-y-4">
        {surveySteps.map(s => (
          <div key={s.step} className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-bold text-[#1E293B] mb-3">Step {s.step}: {s.title}</h2>
            <div className="flex flex-wrap gap-2">{s.items.map(i => (
              <span key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] text-sm px-3 py-1 rounded-full">{i}</span>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
