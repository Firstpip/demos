// 회계솔루션 연동 더미 데이터

export interface TaxInvoice {
  id: string;
  orderId: string;
  businessName: string;
  businessNumber: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'issued' | 'failed' | 'pending' | 'cancelled';
  issuedAt: string;
  type: 'taxInvoice';
}

export interface CashReceipt {
  id: string;
  orderId: string;
  businessName: string;
  receiptNumber: string;
  amount: number;
  status: 'issued' | 'failed' | 'pending' | 'cancelled';
  issuedAt: string;
  type: 'cashReceipt';
}

export const accountingConfig = {
  isConnected: true,
  provider: '스마트빌',
  apiEndpoint: 'https://api.smartbill.co.kr/v2',
  businessNumber: '123-45-67890',
  businessName: 'B2B MALL (데모)',
  autoIssueOnConfirm: true,   // 주문 확정 시 자동 발행
  autoIssueCashReceipt: true,  // 현금영수증 자동 발행
  lastSyncAt: '2026-03-27 15:00:00',
};

export const taxInvoices: TaxInvoice[] = [
  { id: 'TI001', orderId: 'ORD-2026-001', businessName: '(주)한빛유통', businessNumber: '123-45-67890', amount: 450000, taxAmount: 45000, totalAmount: 495000, status: 'issued', issuedAt: '2026-03-27 10:30:00', type: 'taxInvoice' },
  { id: 'TI002', orderId: 'ORD-2026-002', businessName: '명성상사', businessNumber: '234-56-78901', amount: 280000, taxAmount: 28000, totalAmount: 308000, status: 'issued', issuedAt: '2026-03-26 14:20:00', type: 'taxInvoice' },
  { id: 'TI003', orderId: 'ORD-2026-005', businessName: '세진물산', businessNumber: '345-67-89012', amount: 1200000, taxAmount: 120000, totalAmount: 1320000, status: 'failed', issuedAt: '2026-03-25 09:15:00', type: 'taxInvoice' },
  { id: 'TI004', orderId: 'ORD-2026-006', businessName: '(주)대한식자재', businessNumber: '456-78-90123', amount: 850000, taxAmount: 85000, totalAmount: 935000, status: 'issued', issuedAt: '2026-03-24 16:45:00', type: 'taxInvoice' },
  { id: 'TI005', orderId: 'ORD-2026-008', businessName: '(주)한빛유통', businessNumber: '123-45-67890', amount: 320000, taxAmount: 32000, totalAmount: 352000, status: 'pending', issuedAt: '2026-03-27 15:00:00', type: 'taxInvoice' },
  { id: 'TI006', orderId: 'ORD-2026-010', businessName: '글로벌무역', businessNumber: '567-89-01234', amount: 1500000, taxAmount: 150000, totalAmount: 1650000, status: 'issued', issuedAt: '2026-03-23 11:30:00', type: 'taxInvoice' },
];

export const cashReceipts: CashReceipt[] = [
  { id: 'CR001', orderId: 'ORD-2026-001', businessName: '(주)한빛유통', receiptNumber: '010-1234-5678', amount: 495000, status: 'issued', issuedAt: '2026-03-27 10:30:05', type: 'cashReceipt' },
  { id: 'CR002', orderId: 'ORD-2026-002', businessName: '명성상사', receiptNumber: '010-2345-6789', amount: 308000, status: 'issued', issuedAt: '2026-03-26 14:20:05', type: 'cashReceipt' },
  { id: 'CR003', orderId: 'ORD-2026-004', businessName: '진영트레이딩', receiptNumber: '010-3456-7890', amount: 156000, status: 'issued', issuedAt: '2026-03-25 11:00:00', type: 'cashReceipt' },
  { id: 'CR004', orderId: 'ORD-2026-006', businessName: '(주)대한식자재', receiptNumber: '010-4567-8901', amount: 935000, status: 'issued', issuedAt: '2026-03-24 16:45:05', type: 'cashReceipt' },
  { id: 'CR005', orderId: 'ORD-2026-008', businessName: '(주)한빛유통', receiptNumber: '010-1234-5678', amount: 352000, status: 'pending', issuedAt: '2026-03-27 15:00:05', type: 'cashReceipt' },
];
