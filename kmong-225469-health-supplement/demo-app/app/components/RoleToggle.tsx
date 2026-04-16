'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/auth-context'
import type { UserRole } from '../data/users'

const roleMap: { value: UserRole; label: string; path: string }[] = [
  { value: 'user', label: '일반사용자', path: '/' },
  { value: 'doctor', label: '의사파트너', path: '/partner' },
  { value: 'pharmacist', label: '약사', path: '/pharmacist' },
  { value: 'admin', label: '관리자', path: '/admin' },
]

export default function RoleToggle() {
  const { role, switchRole } = useAuth()
  const router = useRouter()
  return (
    <select
      value={role}
      onChange={e => { const r = e.target.value as UserRole; switchRole(r); const m = roleMap.find(x => x.value === r); if (m) router.push(m.path) }}
      className="appearance-none bg-white/10 text-white text-xs border border-white/20 rounded px-2 py-1 pr-6 cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22white%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M2%204l4%204%204-4%22%20stroke%3D%22white%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_4px_center]"
    >
      {roleMap.map(r => <option key={r.value} value={r.value} className="text-black">{r.label}</option>)}
    </select>
  )
}
