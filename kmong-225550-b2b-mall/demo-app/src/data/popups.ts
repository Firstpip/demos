export interface Popup {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  linkUrl: string;
  position: 'center' | 'bottom';
  width: number;
  height: number;
  status: 'active' | 'scheduled' | 'ended';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export const popups: Popup[] = [
  {
    id: 'POP001',
    title: '3월 대량구매 할인 이벤트',
    content: '3월 한 달간 50만원 이상 주문 시 추가 5% 할인! 대량 구매 고객을 위한 특별 혜택을 놓치지 마세요.',
    imageUrl: '/images/popups/popup-event.jpg',
    linkUrl: '/products',
    position: 'center',
    width: 500,
    height: 400,
    status: 'active',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    createdAt: '2025-02-28',
  },
  {
    id: 'POP002',
    title: '4월 신상품 입고 안내',
    content: '4월 새로운 사무용품 라인업이 입고됩니다. 사전 예약 시 10% 할인 혜택을 드립니다.',
    imageUrl: '/images/popups/popup-new.jpg',
    linkUrl: '/products',
    position: 'center',
    width: 500,
    height: 400,
    status: 'scheduled',
    startDate: '2025-04-01',
    endDate: '2025-04-15',
    createdAt: '2025-03-20',
  },
  {
    id: 'POP003',
    title: '설 연휴 배송 안내',
    content: '설 연휴(1/28~1/30) 기간 중 주문 건은 1/31부터 순차 발송됩니다.',
    imageUrl: '/images/popups/popup-notice.jpg',
    linkUrl: '',
    position: 'center',
    width: 450,
    height: 350,
    status: 'ended',
    startDate: '2025-01-20',
    endDate: '2025-01-31',
    createdAt: '2025-01-18',
  },
];
