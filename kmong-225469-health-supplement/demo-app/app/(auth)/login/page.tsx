'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/auth-context'

export default function LoginPage() {
  const [name, setName] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const handleLogin = () => { if (name.trim()) { login(name.trim()); router.push('/') } }
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1E293B] mb-2">로그인</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs text-blue-700">
        데모 버전입니다. 아무 값이나 입력하여 로그인할 수 있습니다.
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">이름</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="이름을 입력하세요" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
        </div>
        <button onClick={handleLogin} className="w-full bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A] transition-colors">로그인</button>
        <button className="w-full bg-[#FEE500] text-[#3C1E1E] font-bold py-3 rounded-lg hover:bg-[#FDD835] transition-colors" onClick={handleLogin}>카카오로 시작하기</button>
      </div>
    </div>
  )
}
