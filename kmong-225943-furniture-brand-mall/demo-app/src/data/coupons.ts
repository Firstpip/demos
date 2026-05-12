import type { Coupon } from '@/lib/types'

export const coupons: Coupon[] = [
  { id: 'cp-1', code: 'WELCOME20', name: '신규 가입 2만원 할인', type: 'fixed', value: 20000, minOrder: 100000, expiresAt: '2026-12-31' },
  { id: 'cp-2', code: 'SPRING10', name: '봄맞이 10% 할인', type: 'percent', value: 10, minOrder: 200000, expiresAt: '2026-06-30' },
  { id: 'cp-3', code: 'OAKDEAL', name: '원목 가구 5만원 할인', type: 'fixed', value: 50000, minOrder: 500000, expiresAt: '2026-08-31' },
  { id: 'cp-4', code: 'FREESHIP', name: '배송비 면제', type: 'shipping', value: 0, minOrder: 50000, expiresAt: '2026-12-31' },
  { id: 'cp-5', code: 'LIVING15', name: '거실 세트 15% 할인', type: 'percent', value: 15, minOrder: 800000, expiresAt: '2026-07-31' },
  { id: 'cp-6', code: 'SLEEP30', name: '침실 세트 30,000원 할인', type: 'fixed', value: 30000, minOrder: 300000, expiresAt: '2026-09-30' },
  { id: 'cp-7', code: 'BUNDLE5', name: '가구 + 조명 묶음 5%', type: 'set', value: 5, minOrder: 600000, expiresAt: '2026-12-31' },
  { id: 'cp-8', code: 'MAHOLNVIP', name: '마홀앤 단골 7%', type: 'percent', value: 7, minOrder: 250000, expiresAt: '2026-12-31' },
]
