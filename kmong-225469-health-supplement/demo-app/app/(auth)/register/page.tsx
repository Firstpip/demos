'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/Toast'

export default function RegisterPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = '이름을 입력해주세요'
    if (!form.email.trim()) e.email = '이메일을 입력해주세요'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = '올바른 이메일 형식이 아닙니다'
    if (!form.password.trim()) e.password = '비밀번호를 입력해주세요'
    else if (form.password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleRegister = () => {
    if (!validate()) return
    toast('회원가입이 완료되었습니다')
    setTimeout(() => router.push('/login'), 1000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-6">회원가입</h1>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">이름 <span className="text-red-500">*</span></label>
        <input type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="이름" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.name ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
        <div><label className="block text-sm font-medium mb-1">이메일 <span className="text-red-500">*</span></label>
        <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="이메일" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.email ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
        <div><label className="block text-sm font-medium mb-1">비밀번호 <span className="text-red-500">*</span></label>
        <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="6자 이상" className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.password ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}</div>
        <button onClick={handleRegister} className="w-full bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A]">가입하기</button>
        <button onClick={handleRegister} className="w-full bg-[#FEE500] text-[#3C1E1E] font-bold py-3 rounded-lg">카카오로 간편가입</button>
      </div>
    </div>
  )
}
