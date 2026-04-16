export interface DailySales {
  date: string;
  amount: number;
  orderCount: number;
}

export interface DashboardSummary {
  todayOrders: number;
  pendingPayments: number;
  pendingMembers: number;
  monthlySales: number;
  monthlyOrderCount: number;
  todaySales: number;
}

// 30일간 일별 매출 데이터
export const dailySales: DailySales[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 2, i + 1); // March 2025
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const baseAmount = isWeekend ? 200000 : 500000;
  const randomFactor = 0.5 + Math.random();
  const amount = Math.round(baseAmount * randomFactor);
  const orderCount = Math.round(amount / 150000) + 1;

  return {
    date: `2025-03-${String(i + 1).padStart(2, '0')}`,
    amount,
    orderCount,
  };
});

export const dashboardSummary: DashboardSummary = {
  todayOrders: 5,
  pendingPayments: 3,
  pendingMembers: 2,
  monthlySales: dailySales.reduce((sum, d) => sum + d.amount, 0),
  monthlyOrderCount: dailySales.reduce((sum, d) => sum + d.orderCount, 0),
  todaySales: 685000,
};

export interface LowStockProduct {
  id: string;
  name: string;
  option: string;
  currentStock: number;
}

export const lowStockProducts: LowStockProduct[] = [
  { id: 'P003', name: '[대량] 유기농 녹차 티백 100입', option: '보이차', currentStock: 40 },
  { id: 'P009', name: '스테이플러 + 침 세트 (10개입)', option: '화이트', currentStock: 60 },
  { id: 'P010', name: '[단체용] 면 티셔츠 30장', option: 'XXL 이상', currentStock: 30 },
];
