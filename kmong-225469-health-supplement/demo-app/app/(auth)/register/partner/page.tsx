'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../components/Toast'

export default function PartnerRegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [type, setType] = useState<'doctor' | 'pharmacist' | ''>('')
  const [form, setForm] = useState({ name: '', org: '', specialty: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!type) e.type = '파트너 유형을 선택해주세요'
    if (!form.name.trim()) e.name = '이름을 입력해주세요'
    if (!form.org.trim()) e.org = '소속을 입력해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) { toast('필수 항목을 입력해주세요', 'error'); return }
    toast('가입 신청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.')
    setTimeout(() => router.push('/login'), 1500)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-6">파트너 회원가입</h1>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">파트너 유형 <span className="text-red-500">*</span></label>
        <div className="flex gap-3">{[{v:'doctor' as const,l:'의사'},{v:'pharmacist' as const,l:'약사'}].map(t => (
          <button key={t.v} onClick={() => setType(t.v)}
            className={`flex-1 border py-3 rounded-lg text-sm transition-colors ${type === t.v ? 'border-[#22C55E] bg-green-50 text-[#22C55E] font-bold' : 'border-[#E2E8F0] hover:border-[#22C55E]'}`}>{t.l}</button>
        ))}</div>
        {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}</div>
        <div><label className="block text-sm font-medium mb-1">이름 <span className="text-red-500">*</span></label>
        <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="이름" className={`w-full border rounded-lg px-4 py-3 text-sm ${errors.name ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
        <div><label className="block text-sm font-medium mb-1">소속 <span className="text-red-500">*</span></label>
        <input type="text" value={form.org} onChange={e => setForm(p => ({...p, org: e.target.value}))} placeholder="병원/약국명" className={`w-full border rounded-lg px-4 py-3 text-sm ${errors.org ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
        {errors.org && <p className="text-xs text-red-500 mt-1">{errors.org}</p>}</div>
        <div><label className="block text-sm font-medium mb-1">전문 분야</label>
        <input type="text" value={form.specialty} onChange={e => setForm(p => ({...p, specialty: e.target.value}))} placeholder="전문 분야" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">자격증 업로드 <span className="text-red-500">*</span></label>
        <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 text-center text-[#64748B] text-sm cursor-pointer hover:border-[#22C55E]">클릭하여 자격증 파일을 업로드하세요</div></div>
        <button onClick={handleSubmit} className="w-full bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A]">가입 신청</button>
      </div>
    </div>
  )
}
