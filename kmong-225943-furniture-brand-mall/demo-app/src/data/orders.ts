import type { Order, OrderStatus, RewardLedger } from '@/lib/types'
import { products } from './products'
import { users } from './users'
import { addDays } from '@/lib/utils'

const memberUsers = users.filter((u) => u.role === 'member')
const statuses: OrderStatus[] = ['paid', 'preparing', 'shipping', 'delivered', 'delivered', 'delivered', 'delayed', 'refunded']

function pickProducts(seed: number): { items: Order['items']; total: number } {
  const count = 1 + (seed % 3)
  const items: Order['items'] = []
  let total = 0
  for (let i = 0; i < count; i++) {
    const p = products[(seed * 7 + i * 3) % products.length]
    const color = p.options.color[0]
    const size = p.options.size[0]
    const qty = 1 + ((seed + i) % 2)
    const unitPrice = p.priceSale
    items.push({ productId: p.id, option: `${color}|${size}`, qty, unitPrice })
    total += unitPrice * qty
  }
  return { items, total }
}

const featuredOrder: Order = {
  id: 'order-DEMO-S02',
  userId: 'user-member-1',
  items: [
    { productId: 'prd-maholn-oak-sofa-3s', option: '오크|Q', qty: 1, unitPrice: 1690000 },
    { productId: 'prd-lenore-rug-200x290', option: '아이보리|M', qty: 1, unitPrice: 320000 },
  ],
  totalPrice: 2010000,
  couponDiscount: 50000,
  rewardUsed: 10000,
  status: 'shipping',
  scheduledDeliveryAt: '2026-05-25T15:00:00+09:00',
  virtualNowAt: '2026-05-23T10:00:00+09:00',
  compensationIssued: false,
  createdAt: '2026-05-15T11:34:00+09:00',
}

export const orders: Order[] = (() => {
  const out: Order[] = [featuredOrder]
  for (let i = 1; i < 40; i++) {
    const seed = i * 17 + 3
    const u = memberUsers[seed % memberUsers.length]
    const status = statuses[seed % statuses.length]
    const { items, total } = pickProducts(seed)
    const createdDaysAgo = (seed * 3) % 60 + 1
    const createdAt = addDays('2026-05-11T00:00:00+09:00', -createdDaysAgo)
    const scheduled = addDays(createdAt, 5 + (seed % 8))
    const virtualNow = status === 'delayed'
      ? addDays(scheduled, 2 + (seed % 3))
      : status === 'delivered'
        ? addDays(scheduled, (seed % 2))
        : addDays(createdAt, 1 + (seed % 4))
    const couponDiscount = seed % 4 === 0 ? 20000 + (seed % 4) * 10000 : 0
    const rewardUsed = seed % 5 === 0 ? 5000 : 0
    out.push({
      id: `order-${1000 + i}`,
      userId: u.id,
      items,
      totalPrice: total,
      couponDiscount,
      rewardUsed,
      status,
      scheduledDeliveryAt: scheduled,
      virtualNowAt: virtualNow,
      compensationIssued: status === 'delayed' && seed % 2 === 0,
      createdAt,
    })
  }
  return out
})()

export function orderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}
export function ordersByUser(userId: string): Order[] {
  return orders.filter((o) => o.userId === userId)
}

const memberSeeds = memberUsers.map((u, idx) => ({ u, baseBalance: 12000 + idx * 1300 }))

export const rewardLedger: RewardLedger[] = (() => {
  const out: RewardLedger[] = []
  let counter = 0
  memberSeeds.forEach(({ u, baseBalance }) => {
    counter += 1
    out.push({
      id: `rwd-${counter}`,
      userId: u.id,
      delta: baseBalance,
      reason: 'manual',
      createdAt: '2026-01-02T10:00:00+09:00',
    })
  })
  orders.forEach((o, idx) => {
    if (o.status === 'delivered' || o.status === 'shipping') {
      counter += 1
      out.push({
        id: `rwd-${counter}`,
        userId: o.userId,
        delta: Math.round(o.totalPrice * 0.01 / 100) * 100,
        reason: 'purchase',
        refOrderId: o.id,
        createdAt: o.createdAt,
      })
    }
    if (o.status === 'delayed' && o.compensationIssued) {
      counter += 1
      out.push({
        id: `rwd-${counter}`,
        userId: o.userId,
        delta: 5000,
        reason: 'auto-delay-compensation',
        refOrderId: o.id,
        createdAt: o.virtualNowAt,
      })
    }
    if (idx % 6 === 0) {
      counter += 1
      out.push({
        id: `rwd-${counter}`,
        userId: o.userId,
        delta: -3000,
        reason: 'coupon',
        refOrderId: o.id,
        createdAt: o.createdAt,
      })
    }
  })
  return out
})()

export function rewardsByUser(userId: string): RewardLedger[] {
  return rewardLedger.filter((r) => r.userId === userId)
}
export function rewardBalance(userId: string): number {
  return rewardsByUser(userId).reduce((acc, r) => acc + r.delta, 0)
}
