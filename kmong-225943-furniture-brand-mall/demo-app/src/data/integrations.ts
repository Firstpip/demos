import type { IntegrationStatus } from '@/lib/types'

export const integrations: IntegrationStatus[] = [
  {
    key: 'erp',
    label: 'ERP (자체 ERP)',
    state: 'connected',
    lastSyncedAt: '2026-05-11T09:32:14+09:00',
    logs: [
      { at: '2026-05-11T09:32:14+09:00', level: 'info', msg: '재고 변동 412건 동기화 완료' },
      { at: '2026-05-11T03:00:00+09:00', level: 'info', msg: '야간 재고 정합 검사: 차이 0건' },
      { at: '2026-05-10T18:21:09+09:00', level: 'info', msg: '입고 38건, 출고 271건 반영' },
      { at: '2026-05-10T11:05:42+09:00', level: 'info', msg: '신규 SKU 7건 등록 완료' },
      { at: '2026-05-09T22:14:00+09:00', level: 'info', msg: '재고 차이 알림 0건' },
    ],
  },
  {
    key: 'sabangnet',
    label: '사방넷 (오픈마켓 통합)',
    state: 'syncing',
    lastSyncedAt: '2026-05-11T09:30:00+09:00',
    logs: [
      { at: '2026-05-11T09:30:00+09:00', level: 'info', msg: '주문 동기화 진행 중 (87/120)' },
      { at: '2026-05-11T08:00:00+09:00', level: 'info', msg: '시간당 주문 동기화 완료 (152건)' },
      { at: '2026-05-10T16:42:00+09:00', level: 'error', msg: '네이버 스마트스토어 토큰 일시 만료, 자동 재발급 후 재시도 성공' },
      { at: '2026-05-10T08:00:00+09:00', level: 'info', msg: '시간당 주문 동기화 완료 (98건)' },
    ],
  },
  {
    key: 'tax',
    label: '세금계산서 (홈택스)',
    state: 'connected',
    lastSyncedAt: '2026-05-11T00:05:00+09:00',
    logs: [
      { at: '2026-05-11T00:05:00+09:00', level: 'info', msg: '5월 1차 세금계산서 23건 자동 발행' },
      { at: '2026-05-08T00:05:00+09:00', level: 'info', msg: '4월 마감 세금계산서 187건 발행 완료' },
      { at: '2026-05-01T00:10:00+09:00', level: 'info', msg: '월 정기 신고 데이터 추출 완료' },
    ],
  },
  {
    key: 'logistics',
    label: '물류 (CJ대한통운·로젠)',
    state: 'error',
    lastSyncedAt: '2026-05-11T07:11:23+09:00',
    logs: [
      { at: '2026-05-11T07:11:23+09:00', level: 'error', msg: '로젠택배 API 응답 5회 연속 타임아웃, 자동 재시도 대기' },
      { at: '2026-05-11T05:42:00+09:00', level: 'info', msg: 'CJ 송장 12건 발급' },
      { at: '2026-05-10T22:30:00+09:00', level: 'info', msg: '도착 완료 처리 81건' },
      { at: '2026-05-10T15:18:00+09:00', level: 'info', msg: '송장 일괄 발급 142건 완료' },
    ],
  },
]
