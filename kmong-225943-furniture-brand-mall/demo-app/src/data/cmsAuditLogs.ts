import type { CmsAuditLog } from '@/lib/types'

export const cmsAuditLogs: CmsAuditLog[] = [
  { id: 'ca-1', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'product:raonwood-oak-bed:price', before: 1200000, after: 1140000, at: '2026-05-10T15:42:11+09:00' },
  { id: 'ca-2', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'product:raonwood-oak-bed:subtitle', before: '국내산 오크 원목', after: '국내산 오크 원목, 무광 도장 마감', at: '2026-05-10T15:43:00+09:00' },
  { id: 'ca-3', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'product:raonwood-walnut-dresser:image', before: 'old.jpg', after: 'new-2026-spring.jpg', at: '2026-05-09T10:18:33+09:00' },
  { id: 'ca-4', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'banner:spring-sale:html', before: '봄 세일 진행중', after: '봄 세일 — 5월 31일까지', at: '2026-05-08T19:02:41+09:00' },
  { id: 'ca-5', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: '__denied__', before: null, after: null, attemptedDeniedAction: 'product.create', at: '2026-05-07T11:12:09+09:00' },
  { id: 'ca-6', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: '__denied__', before: null, after: null, attemptedDeniedAction: 'order.refund', at: '2026-05-06T16:33:21+09:00' },
  { id: 'ca-7', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'product:maholn-oak-sofa-3s:price', before: 1990000, after: 1890000, at: '2026-05-05T09:21:00+09:00' },
  { id: 'ca-8', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'product:maholn-linen-armchair:image', before: 'old-armchair.jpg', after: 'new-armchair.jpg', at: '2026-05-04T17:48:00+09:00' },
  { id: 'ca-9', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'product:maholn-walnut-tv-stand:subtitle', before: 'TV 스탠드 1800', after: '낮은 무게중심으로 거실의 시선을 정돈', at: '2026-05-04T17:49:30+09:00' },
  { id: 'ca-10', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'banner:lookbook-2026-spring:cta', before: '룩북 보기', after: '봄 컬렉션 보기', at: '2026-05-03T11:10:00+09:00' },
  { id: 'ca-11', partnerId: 'brand-maholn', userId: 'user-partner-1', field: '__denied__', before: null, after: null, attemptedDeniedAction: 'product.create', at: '2026-05-02T14:30:11+09:00' },
  { id: 'ca-12', partnerId: 'brand-forestlab', userId: 'user-partner-3', field: 'product:forestlab-low-sofa-2s:price', before: 820000, after: 760000, at: '2026-05-02T10:05:09+09:00' },
  { id: 'ca-13', partnerId: 'brand-forestlab', userId: 'user-partner-3', field: 'product:forestlab-low-sofa-2s:subtitle', before: '북유럽풍 좌식 소파', after: '북유럽풍 좌식 라이프', at: '2026-05-02T10:06:00+09:00' },
  { id: 'ca-14', partnerId: 'brand-monodot', userId: 'user-partner-4', field: 'product:monodot-modular-shelf:price', before: 580000, after: 540000, at: '2026-05-01T18:12:33+09:00' },
  { id: 'ca-15', partnerId: 'brand-monodot', userId: 'user-partner-4', field: 'product:monodot-modular-shelf:image', before: 'shelf-2025.jpg', after: 'shelf-2026.jpg', at: '2026-05-01T18:13:42+09:00' },
  { id: 'ca-16', partnerId: 'brand-monodot', userId: 'user-partner-4', field: '__denied__', before: null, after: null, attemptedDeniedAction: 'user.create', at: '2026-04-30T09:40:00+09:00' },
  { id: 'ca-17', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'product:raonwood-item-1:price', before: 350000, after: 320000, at: '2026-04-29T13:15:00+09:00' },
  { id: 'ca-18', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'product:raonwood-item-2:image', before: 'a.jpg', after: 'b.jpg', at: '2026-04-29T13:16:00+09:00' },
  { id: 'ca-19', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'product:maholn-oak-sofa-3s:image', before: 'sofa-old.jpg', after: 'sofa-new.jpg', at: '2026-04-28T20:00:00+09:00' },
  { id: 'ca-20', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'banner:bedroom-collection:body', before: '침실 컬렉션', after: '침실 컬렉션 — 잠의 결을 위한 디자인', at: '2026-04-28T20:01:00+09:00' },
  { id: 'ca-21', partnerId: 'brand-forestlab', userId: 'user-partner-3', field: 'product:forestlab-item-1:price', before: 240000, after: 220000, at: '2026-04-27T14:45:00+09:00' },
  { id: 'ca-22', partnerId: 'brand-forestlab', userId: 'user-partner-3', field: 'product:forestlab-item-2:subtitle', before: '북유럽 라운지', after: '북유럽 라운지 의자, 캐주얼 톤', at: '2026-04-27T14:46:00+09:00' },
  { id: 'ca-23', partnerId: 'brand-monodot', userId: 'user-partner-4', field: 'product:monodot-item-1:image', before: 'item-1-old.jpg', after: 'item-1-new.jpg', at: '2026-04-26T11:30:00+09:00' },
  { id: 'ca-24', partnerId: 'brand-monodot', userId: 'user-partner-4', field: 'product:monodot-item-2:price', before: 280000, after: 260000, at: '2026-04-26T11:31:00+09:00' },
  { id: 'ca-25', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: 'banner:heritage-oak:cta', before: '컬렉션 보기', after: '오크 컬렉션 보기', at: '2026-04-25T16:20:00+09:00' },
  { id: 'ca-26', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'product:maholn-linen-armchair:price', before: 720000, after: 690000, at: '2026-04-25T10:00:00+09:00' },
  { id: 'ca-27', partnerId: 'brand-forestlab', userId: 'user-partner-3', field: 'product:forestlab-low-sofa-2s:image', before: 'sofa-2s-2025.jpg', after: 'sofa-2s-2026.jpg', at: '2026-04-24T17:55:00+09:00' },
  { id: 'ca-28', partnerId: 'brand-monodot', userId: 'user-partner-4', field: 'product:monodot-modular-shelf:subtitle', before: '모듈 셸프', after: '무광 도장의 단정한 수납', at: '2026-04-24T15:00:00+09:00' },
  { id: 'ca-29', partnerId: 'brand-raonwood', userId: 'user-partner-2', field: '__denied__', before: null, after: null, attemptedDeniedAction: 'product.delete', at: '2026-04-23T18:42:00+09:00' },
  { id: 'ca-30', partnerId: 'brand-maholn', userId: 'user-partner-1', field: 'banner:lookbook-2026-spring:image', before: 'spring-old.jpg', after: 'spring-2026-final.jpg', at: '2026-04-23T11:05:00+09:00' },
]

export function logsByPartner(partnerId: string): CmsAuditLog[] {
  return cmsAuditLogs.filter((l) => l.partnerId === partnerId)
}
