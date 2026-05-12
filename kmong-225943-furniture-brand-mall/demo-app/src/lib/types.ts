export type Role = 'guest' | 'member' | 'partner' | 'admin'

export interface Brand {
  id: string
  slug: string
  name: string
  isMicrosite: boolean
  description: string
  primaryColor: string
  logoEmoji?: never
  logoLetter: string
  partnerUserIds: string[]
}

export interface Lookbook {
  id: string
  brandId: string
  slug: string
  title: string
  subtitle: string
  heroLetter: string
  description: string
  publishedAt: string
  hotspots: Array<{ x: number; y: number; productId: string; label: string }>
}

export interface Collection {
  id: string
  slug: string
  title: string
  subtitle: string
  season: '26SS' | '26FW' | 'EVERGREEN'
  heroLetter: string
  description: string
  productIds: string[]
  hotspots: Array<{ x: number; y: number; productId: string; label: string }>
}

export type FilterAxis =
  | 'use'
  | 'brand'
  | 'material'
  | 'delivery'
  | 'price'
  | 'color'
  | 'size'

export interface Product {
  id: string
  slug: string
  brandId: string
  name: string
  subtitle: string
  badges: Array<'NEW' | 'BEST' | 'LIMITED'>
  priceRegular: number
  priceSale: number
  rewardPoint: number
  options: { color: string[]; size: string[] }
  stock: Record<string, number>
  axes: {
    category: string
    subCategory: string
    use: string[]
    material: string[]
    deliveryDays: number
  }
  thumbLetter: string
  galleryLetters: string[]
  descriptionHtml: string
  rating: number
  reviewCount: number
  collectionIds: string[]
}

export interface Review {
  id: string
  productId: string
  userId: string
  rating: 1 | 2 | 3 | 4 | 5
  body: string
  hasPhoto: boolean
  createdAt: string
  helpfulCount: number
}

export interface QnA {
  id: string
  productId: string
  question: string
  answer?: string
  askedAt: string
  answeredAt?: string
}

export interface CartItem {
  productId: string
  option: string
  qty: number
  unitPrice: number
}

export type OrderStatus =
  | 'paid'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'delayed'
  | 'refunded'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  couponDiscount: number
  rewardUsed: number
  status: OrderStatus
  scheduledDeliveryAt: string
  virtualNowAt: string
  compensationIssued: boolean
  createdAt: string
}

export interface RewardLedger {
  id: string
  userId: string
  delta: number
  reason: 'purchase' | 'auto-delay-compensation' | 'coupon' | 'manual'
  refOrderId?: string
  createdAt: string
}

export interface Coupon {
  id: string
  code: string
  name: string
  type: 'fixed' | 'percent' | 'shipping' | 'set'
  value: number
  minOrder: number
  expiresAt: string
}

export interface ContentModule {
  id: string
  type: 'lookbook-card' | 'story' | 'banner' | 'review-quote'
  title: string
  body: string
  ctaLabel?: string
  ctaHref?: string
  letter: string
  usedIn: Array<'home' | 'maholn-home' | 'product-detail' | 'collection-detail' | 'category'>
}

export interface CmsAuditLog {
  id: string
  partnerId: string
  userId: string
  field: string
  before: unknown
  after: unknown
  attemptedDeniedAction?: string
  at: string
}

export type IntegrationKey = 'erp' | 'sabangnet' | 'tax' | 'logistics'
export interface IntegrationStatus {
  key: IntegrationKey
  label: string
  state: 'connected' | 'syncing' | 'error' | 'disconnected'
  lastSyncedAt: string
  logs: Array<{ at: string; level: 'info' | 'error'; msg: string }>
}

export interface User {
  id: string
  role: Role
  name: string
  email: string
  partnerBrandId?: string
}

export interface Notice {
  id: string
  title: string
  body: string
  category: '공지' | '이벤트' | '점검'
  publishedAt: string
}

export interface Faq {
  id: string
  category: '주문' | '배송' | '환불' | '계정'
  question: string
  answer: string
}
