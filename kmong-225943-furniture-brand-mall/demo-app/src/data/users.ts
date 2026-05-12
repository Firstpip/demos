import type { User } from '@/lib/types'

export const users: User[] = [
  { id: 'user-guest', role: 'guest', name: '비로그인', email: '' },
  { id: 'user-member-1', role: 'member', name: '김지윤', email: 'jiyun@example.com' },
  { id: 'user-member-2', role: 'member', name: '박서연', email: 'seoyeon@example.com' },
  { id: 'user-member-3', role: 'member', name: '이도원', email: 'dowon@example.com' },
  { id: 'user-member-4', role: 'member', name: '정시우', email: 'siwoo@example.com' },
  { id: 'user-member-5', role: 'member', name: '한수아', email: 'sua@example.com' },
  { id: 'user-member-6', role: 'member', name: '오재민', email: 'jaemin@example.com' },
  { id: 'user-member-7', role: 'member', name: '강유나', email: 'yuna@example.com' },
  { id: 'user-member-8', role: 'member', name: '서지호', email: 'jiho@example.com' },
  { id: 'user-member-9', role: 'member', name: '윤하늘', email: 'haneul@example.com' },
  { id: 'user-member-10', role: 'member', name: '문가람', email: 'garam@example.com' },
  { id: 'user-member-11', role: 'member', name: '신해솔', email: 'haesol@example.com' },
  { id: 'user-member-12', role: 'member', name: '백다인', email: 'dain@example.com' },
  { id: 'user-member-13', role: 'member', name: '조시현', email: 'sihyun@example.com' },
  { id: 'user-member-14', role: 'member', name: '임지안', email: 'jian@example.com' },
  { id: 'user-member-15', role: 'member', name: '권은채', email: 'eunchae@example.com' },
  { id: 'user-partner-1', role: 'partner', name: '마홀앤 매니저', email: 'manager@maholn.co.kr', partnerBrandId: 'brand-maholn' },
  { id: 'user-partner-2', role: 'partner', name: '라온우드 매니저', email: 'cs@raonwood.co.kr', partnerBrandId: 'brand-raonwood' },
  { id: 'user-partner-3', role: 'partner', name: '포레스트랩 매니저', email: 'shop@forestlab.co.kr', partnerBrandId: 'brand-forestlab' },
  { id: 'user-partner-4', role: 'partner', name: '모노닷 매니저', email: 'hi@monodot.kr', partnerBrandId: 'brand-monodot' },
  { id: 'user-admin-1', role: 'admin', name: '본체 운영자', email: 'ops@gagumall.kr' },
]

export function userById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

export const presetByRole: Record<'guest' | 'member' | 'partner' | 'admin', string> = {
  guest: 'user-guest',
  member: 'user-member-1',
  partner: 'user-partner-2',
  admin: 'user-admin-1',
}
