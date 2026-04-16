// 이카운트 ERP 연동 더미 데이터

export interface ErpSyncLog {
  id: string;
  type: 'order' | 'product';
  referenceId: string;
  referenceName: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  syncedAt: string;
}

export interface ErpProductMapping {
  id: string;
  shopProductId: string;
  shopProductName: string;
  erpProductCode: string;
  erpProductName: string;
  isEventProduct: boolean;
  lastSynced: string;
  status: 'synced' | 'mismatch' | 'unlinked';
}

export const erpConfig = {
  isConnected: true,
  companyCode: 'DEMO_CORP',
  apiEndpoint: 'https://oapi.ecounterp.com/v2',
  lastSyncAt: '2026-03-27 14:30:22',
  syncInterval: 30, // minutes
  autoSync: true,
};

export const erpSyncLogs: ErpSyncLog[] = [
  { id: 'SL001', type: 'order', referenceId: 'ORD-2026-001', referenceName: '(주)한빛유통 주문', status: 'success', message: '주문 데이터 동기화 완료', syncedAt: '2026-03-27 14:30:22' },
  { id: 'SL002', type: 'order', referenceId: 'ORD-2026-002', referenceName: '명성상사 주문', status: 'success', message: '주문 데이터 동기화 완료', syncedAt: '2026-03-27 14:30:20' },
  { id: 'SL003', type: 'product', referenceId: 'P003', referenceName: '[대용량] 종이컵 1000개입', status: 'success', message: '재고 수량 동기화 완료', syncedAt: '2026-03-27 14:15:10' },
  { id: 'SL004', type: 'order', referenceId: 'ORD-2026-005', referenceName: '세진물산 주문', status: 'failed', message: 'ERP 서버 응답 시간 초과', syncedAt: '2026-03-27 13:45:00' },
  { id: 'SL005', type: 'product', referenceId: 'P007', referenceName: 'A4 복사용지 5박스', status: 'success', message: '상품 정보 동기화 완료', syncedAt: '2026-03-27 13:30:15' },
  { id: 'SL006', type: 'order', referenceId: 'ORD-2026-008', referenceName: '(주)대한식자재 주문', status: 'success', message: '주문 데이터 동기화 완료', syncedAt: '2026-03-27 12:00:05' },
  { id: 'SL007', type: 'product', referenceId: 'P010', referenceName: '[프리미엄] 가죽 명함지갑', status: 'pending', message: '동기화 대기 중', syncedAt: '2026-03-27 11:45:30' },
  { id: 'SL008', type: 'order', referenceId: 'ORD-2026-010', referenceName: '글로벌무역 주문', status: 'success', message: '주문 데이터 동기화 완료', syncedAt: '2026-03-27 10:30:00' },
];

export const erpProductMappings: ErpProductMapping[] = [
  { id: 'PM001', shopProductId: 'P001', shopProductName: '[대용량] 아메리카노 원두 1kg', erpProductCode: 'ERP-FD-001', erpProductName: '아메리카노 원두 1kg', isEventProduct: false, lastSynced: '2026-03-27 14:15:10', status: 'synced' },
  { id: 'PM002', shopProductId: 'P002', shopProductName: '[도매] 유기농 녹차 티백 100입', erpProductCode: 'ERP-FD-002', erpProductName: '유기농 녹차 100T', isEventProduct: false, lastSynced: '2026-03-27 14:15:10', status: 'synced' },
  { id: 'PM003', shopProductId: 'P003', shopProductName: '[대용량] 종이컵 1000개입', erpProductCode: 'ERP-FD-003', erpProductName: '종이컵 1000P', isEventProduct: false, lastSynced: '2026-03-27 14:15:10', status: 'synced' },
  { id: 'PM004', shopProductId: 'P005', shopProductName: '[업소용] 세탁세제 대용량 20L', erpProductCode: 'ERP-LV-001', erpProductName: '세탁세제 20L', isEventProduct: false, lastSynced: '2026-03-27 13:30:15', status: 'synced' },
  { id: 'PM005', shopProductId: 'P007', shopProductName: 'A4 복사용지 5박스', erpProductCode: 'ERP-OF-001', erpProductName: 'A4용지 5Box', isEventProduct: false, lastSynced: '2026-03-27 13:30:15', status: 'synced' },
  { id: 'PM006', shopProductId: 'P009', shopProductName: '[이벤트] 프리미엄 볼펜 세트', erpProductCode: 'ERP-OF-EVENT01', erpProductName: '프리미엄 볼펜세트 (이벤트)', isEventProduct: true, lastSynced: '2026-03-27 13:30:15', status: 'synced' },
  { id: 'PM007', shopProductId: 'P010', shopProductName: '[프리미엄] 가죽 명함지갑', erpProductCode: 'ERP-FS-001', erpProductName: '가죽 명함지갑', isEventProduct: false, lastSynced: '2026-03-26 18:00:00', status: 'mismatch' },
  { id: 'PM008', shopProductId: 'P012', shopProductName: '[이벤트] 에코백 대량구매', erpProductCode: '', erpProductName: '', isEventProduct: true, lastSynced: '', status: 'unlinked' },
];
