'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = ['기본 정보', '생활습관', '복용 약물', '알레르기', '건강 고민']

export default function SurveyPage() {
  const [step, setStep] = useState(0)
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [habits, setHabits] = useState({ exercise: '', sleep: '', alcohol: '', smoking: '' })
  const [meds, setMeds] = useState('')
  const [allergies, setAllergies] = useState<string[]>([])
  const [concerns, setConcerns] = useState<string[]>([])
  const router = useRouter()

  const toggleArray = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }

  const next = () => { if (step < steps.length - 1) setStep(step + 1); else router.push('/my-results/report') }
  const prev = () => { if (step > 0) setStep(step - 1) }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-4">건강 설문</h1>
      <div className="flex gap-1 mb-6">{steps.map((_, i) => <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`} />)}</div>
      <p className="text-sm text-[#64748B] mb-6">Step {step + 1}/{steps.length} — {steps[step]}</p>
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 min-h-[300px]">
        {step === 0 && <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">성별 <span className="text-red-500">*</span></label>
          <div className="flex gap-3">{['남성','여성'].map(g => (
            <button key={g} onClick={() => setGender(g)}
              className={`flex-1 border py-3 rounded-lg text-sm transition-colors ${gender === g ? 'border-[#22C55E] bg-green-50 text-[#22C55E] font-bold' : 'border-[#E2E8F0] hover:border-[#22C55E]'}`}>{g}</button>
          ))}</div></div>
          <div><label className="block text-sm font-medium mb-1">연령 <span className="text-red-500">*</span></label>
          <input type="text" inputMode="numeric" value={age} onChange={e => setAge(e.target.value.replace(/\D/g, ''))} placeholder="만 나이 (예: 44)" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]" /></div>
        </div>}
        {step === 1 && <div className="space-y-4">
          {([['운동 빈도','exercise'],['수면 시간','sleep'],['음주 빈도','alcohol'],['흡연 여부','smoking']] as const).map(([label, key]) => (
            <div key={key}><label className="block text-sm font-medium mb-1">{label}</label>
            <select value={habits[key]} onChange={e => setHabits(p => ({...p, [key]: e.target.value}))}
              className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22C55E]">
              <option value="">선택하세요</option><option>거의 안함</option><option>주 1~2회</option><option>주 3회 이상</option><option>매일</option>
            </select></div>
          ))}
        </div>}
        {step === 2 && <div><label className="block text-sm font-medium mb-1">현재 복용 중인 약물</label>
          <textarea value={meds} onChange={e => setMeds(e.target.value)} placeholder="복용 중인 약물이 있다면 입력하세요 (없으면 비워두세요)" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#22C55E]" /></div>}
        {step === 3 && <div><label className="block text-sm font-medium mb-1">알레르기</label>
          <div className="flex flex-wrap gap-2 mt-2">{['유제품','갑각류','견과류','대두','밀','없음'].map(a => (
            <button key={a} onClick={() => toggleArray(allergies, setAllergies, a)}
              className={`border px-4 py-2 rounded-full text-sm transition-colors ${allergies.includes(a) ? 'border-[#22C55E] bg-green-50 text-[#22C55E] font-bold' : 'border-[#E2E8F0] hover:border-[#22C55E]'}`}>{a}</button>
          ))}</div></div>}
        {step === 4 && <div><label className="block text-sm font-medium mb-1">건강 고민 (복수 선택)</label>
          <div className="flex flex-wrap gap-2 mt-2">{['피로감','수면 문제','소화 불량','체중 관리','면역력','혈당 관리','혈압 관리','관절 건강','피부 건강','눈 건강'].map(c => (
            <button key={c} onClick={() => toggleArray(concerns, setConcerns, c)}
              className={`border px-4 py-2 rounded-full text-sm transition-colors ${concerns.includes(c) ? 'border-[#22C55E] bg-green-50 text-[#22C55E] font-bold' : 'border-[#E2E8F0] hover:border-[#22C55E]'}`}>{c}</button>
          ))}</div></div>}
      </div>
      <div className="flex gap-3 mt-6">
        {step === 0
          ? <button onClick={() => router.push('/my-results')} className="flex-1 border border-[#E2E8F0] py-3 rounded-lg font-bold hover:bg-[#F8FAFC]">취소</button>
          : <button onClick={prev} className="flex-1 border border-[#E2E8F0] py-3 rounded-lg font-bold hover:bg-[#F8FAFC]">이전</button>
        }
        <button onClick={next} className="flex-1 bg-[#22C55E] text-white py-3 rounded-lg font-bold hover:bg-[#16A34A]">{step < steps.length - 1 ? '다음' : '결과 확인'}</button>
      </div>
    </div>
  )
}
