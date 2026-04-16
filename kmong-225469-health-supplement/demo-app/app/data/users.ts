export type UserRole = 'user' | 'doctor' | 'pharmacist' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  age?: number
  gender?: string
  hospital?: string
  pharmacy?: string
  specialty?: string
  refCode?: string
  consultCount?: number
}

export const users: User[] = [
  { id: 'U001', name: '이환규', email: 'lee@test.com', role: 'user', age: 44, gender: 'male' },
  { id: 'D001', name: '김민수', email: 'kim@hospital.com', role: 'doctor', hospital: '서울대학교병원', specialty: '내과', refCode: 'DR0042' },
  { id: 'P001', name: '강정환', email: 'kang@pharmacy.com', role: 'pharmacist', pharmacy: '올리브영약국', consultCount: 14 },
]
