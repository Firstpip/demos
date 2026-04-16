export interface Order {
  id: string
  date: string
  products: { name: string; quantity: number; price: number }[]
  total: number
  status: '결제완료' | '배송준비' | '배송중' | '배송완료' | '정기배송'
  isSubscription: boolean
}

export const orders: Order[] = [
  { id: 'ORD001', date: '2026-03-28', products: [{ name: '프리미엄 밀크씨슬', quantity: 1, price: 25600 }, { name: 'rTG 오메가3 1000', quantity: 1, price: 30400 }], total: 56000, status: '배송완료', isSubscription: true },
  { id: 'ORD002', date: '2026-03-25', products: [{ name: '활성형 비타민D 2000IU', quantity: 2, price: 28800 }], total: 28800, status: '배송중', isSubscription: false },
  { id: 'ORD003', date: '2026-03-20', products: [{ name: '혈당케어 바나바잎', quantity: 1, price: 22400 }], total: 22400, status: '배송완료', isSubscription: true },
  { id: 'ORD004', date: '2026-03-15', products: [{ name: '코엔자임Q10 플러스', quantity: 1, price: 28000 }, { name: '프로바이오틱스 19종', quantity: 1, price: 20000 }], total: 48000, status: '배송완료', isSubscription: false },
  { id: 'ORD005', date: '2026-03-10', products: [{ name: '마그네슘 트리플', quantity: 1, price: 16000 }], total: 16000, status: '배송완료', isSubscription: true },
  { id: 'ORD006', date: '2026-03-05', products: [{ name: '글루타치온 항산화', quantity: 1, price: 33600 }], total: 33600, status: '배송완료', isSubscription: false },
  { id: 'ORD007', date: '2026-03-01', products: [{ name: '활성형 엽산 B콤플렉스', quantity: 1, price: 17600 }], total: 17600, status: '정기배송', isSubscription: true },
  { id: 'ORD008', date: '2026-02-28', products: [{ name: 'BCAA 근력 서포트', quantity: 2, price: 48000 }], total: 48000, status: '배송완료', isSubscription: false },
]
