"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  orders,
  influencers,
  vendors,
  deepLinks,
  getInfluencer,
  formatKRW,
} from "@/lib/data";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Building2,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// KPI calculations
const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
const totalOrders = orders.length;
const activeInfluencers = influencers.filter(
  (i) => i.payoneerStatus === "connected" || i.payoneerStatus === "pending"
).length;
const activeVendors = vendors.length;

// Monthly GMV data (mock aggregation)
const monthlyGMV = [
  { month: "2025-10", gmv: 18500000 },
  { month: "2025-11", gmv: 24300000 },
  { month: "2025-12", gmv: 31200000 },
  { month: "2026-01", gmv: 52000000 },
  { month: "2026-02", gmv: 68000000 },
  { month: "2026-03", gmv: 45000000 },
];

// Influencer revenue share
const influencerRevenue = influencers.map((inf) => {
  const rev = deepLinks
    .filter((dl) => dl.influencerId === inf.id)
    .reduce((sum, dl) => sum + dl.revenue, 0);
  return { name: inf.name, value: rev };
});

const PIE_COLORS = [
  "#0D6EFD",
  "#6610F2",
  "#D63384",
  "#FD7E14",
  "#198754",
  "#0DCAF0",
];

// Activity log (mock)
const activityLog = [
  {
    id: 1,
    text: "Sarah Johnson이 새 딥링크를 생성했습니다",
    time: "5분 전",
  },
  {
    id: 2,
    text: "서울스타일 주식회사가 신규 상품 3개를 등록했습니다",
    time: "12분 전",
  },
  {
    id: 3,
    text: "Mike Chen의 1월 정산이 완료되었습니다",
    time: "1시간 전",
  },
  {
    id: 4,
    text: "Emily Park이 프로모션 코드 EMILY20을 활성화했습니다",
    time: "2시간 전",
  },
  {
    id: 5,
    text: "테크코리아가 재고를 업데이트했습니다 (무선 충전 스탠드 +50개)",
    time: "3시간 전",
  },
  {
    id: 6,
    text: "David Kim의 매칭 수수료율이 14%로 조정되었습니다",
    time: "5시간 전",
  },
  {
    id: 7,
    text: "신규 소비자 회원 3명이 가입했습니다",
    time: "6시간 전",
  },
  {
    id: 8,
    text: "Jessica Lee가 Payoneer 연결을 시도했습니다",
    time: "8시간 전",
  },
];

export default function AdminDashboardPage() {
  const kpis = [
    {
      label: "총 GMV",
      value: formatKRW(totalGMV),
      icon: DollarSign,
      color: "#0D6EFD",
    },
    {
      label: "총 주문수",
      value: `${totalOrders}건`,
      icon: ShoppingCart,
      color: "#198754",
    },
    {
      label: "활성 인플루언서",
      value: `${activeInfluencers}명`,
      icon: Users,
      color: "#6610F2",
    },
    {
      label: "활성 공급사",
      value: `${activeVendors}개`,
      icon: Building2,
      color: "#FD7E14",
    },
  ];

  return (
    <div id="page-admin-dashboard" className="space-y-6">
      <div id="admin-dashboard">
        <h2 className="text-2xl font-bold text-gray-900">관리자 대시보드</h2>
        <p className="text-gray-500 mt-1">
          플랫폼 전체 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* KPI Cards */}
      <div id="admin-kpi" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${kpi.color}15` }}
                  >
                    <Icon
                      className="h-6 w-6"
                      style={{ color: kpi.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div id="admin-chart" className="grid gap-6 lg:grid-cols-2">
        {/* GMV Trend */}
        <Card>
          <CardHeader>
            <CardTitle>GMV 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGMV}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(v) =>
                      `${(v / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatKRW(Number(value)),
                      "GMV",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    stroke="#0D6EFD"
                    fill="#0D6EFD"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Influencer Revenue Pie */}
        <Card>
          <CardHeader>
            <CardTitle>인플루언서별 매출 비중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={influencerRevenue}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {influencerRevenue.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={PIE_COLORS[idx % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      formatKRW(Number(value)),
                      "매출",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            최근 활동 로그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm text-gray-700">{log.text}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
