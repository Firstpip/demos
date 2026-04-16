"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/status-badge";
import { DollarSign, ShoppingCart, Users, Percent } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  orders,
  products,
  influencers,
  settlements,
} from "@/lib/data";

const VENDOR_ID = "ven-1";

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VendorDashboardPage() {
  const vendorOrders = useMemo(
    () =>
      orders.filter((o) =>
        o.items.some((item) => item.vendorId === VENDOR_ID)
      ),
    []
  );

  const totalRevenue = useMemo(
    () =>
      vendorOrders.reduce((sum, o) => {
        const vendorItems = o.items.filter((i) => i.vendorId === VENDOR_ID);
        return (
          sum + vendorItems.reduce((s, i) => s + i.price * i.quantity, 0)
        );
      }, 0),
    [vendorOrders]
  );

  const connectedInfluencers = useMemo(() => {
    const ids = new Set<string>();
    vendorOrders.forEach((o) =>
      o.items.forEach((item) => {
        if (item.vendorId === VENDOR_ID && item.influencerId) {
          ids.add(item.influencerId);
        }
      })
    );
    return ids.size;
  }, [vendorOrders]);

  const avgCommission = useMemo(() => {
    const vendorSettlements = settlements.filter(
      (s) => s.type === "vendor" && s.targetId === VENDOR_ID
    );
    if (vendorSettlements.length === 0) return 0;
    return (
      vendorSettlements.reduce((sum, s) => sum + s.commissionRate, 0) /
      vendorSettlements.length
    );
  }, []);

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    vendorOrders.forEach((o) => {
      const month = o.createdAt.slice(0, 7);
      const vendorItems = o.items.filter((i) => i.vendorId === VENDOR_ID);
      const amount = vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
      map[month] = (map[month] || 0) + amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));
  }, [vendorOrders]);

  const recentOrders = useMemo(
    () =>
      [...vendorOrders]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [vendorOrders]
  );

  const influencerRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    vendorOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (item.vendorId === VENDOR_ID && item.influencerId) {
          map[item.influencerId] =
            (map[item.influencerId] || 0) + item.price * item.quantity;
        }
      });
    });
    return Object.entries(map)
      .map(([id, revenue]) => {
        const inf = influencers.find((i) => i.id === id);
        return { id, name: inf?.name ?? id, revenue };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [vendorOrders]);

  const kpis = [
    {
      label: "총 매출",
      value: formatKRW(totalRevenue),
      icon: DollarSign,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "주문 수",
      value: `${vendorOrders.length}건`,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "연결 인플루언서",
      value: `${connectedInfluencers}명`,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "평균 수수료율",
      value: `${avgCommission.toFixed(1)}%`,
      icon: Percent,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div id="page-vendor-dashboard" className="space-y-6">
      {/* KPI Cards */}
      <div id="vendor-dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  </div>
                  <div className={`${kpi.bg} ${kpi.color} rounded-full p-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart */}
      <Card id="vendor-chart">
        <CardHeader>
          <CardTitle>월별 매출</CardTitle>
          <CardDescription>월별 매출 추이를 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(v: number) =>
                    `${(v / 10000).toLocaleString()}만`
                  }
                />
                <Tooltip
                  formatter={(value) => [formatKRW(Number(value)), "매출"]}
                />
                <Bar dataKey="amount" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
            <CardDescription>최근 5건의 주문입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>상품</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const vendorItem = order.items.find(
                    (i) => i.vendorId === VENDOR_ID
                  );
                  const product = products.find(
                    (p) => p.id === vendorItem?.productId
                  );
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id}
                      </TableCell>
                      <TableCell className="truncate max-w-[120px]">
                        {product?.name ?? "-"}
                      </TableCell>
                      <TableCell>
                        {formatKRW(
                          (vendorItem?.price ?? 0) *
                            (vendorItem?.quantity ?? 0)
                        )}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Influencer Revenue TOP 5 */}
        <Card>
          <CardHeader>
            <CardTitle>인플루언서별 매출 TOP 5</CardTitle>
            <CardDescription>가장 높은 매출을 기록한 인플루언서</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>순위</TableHead>
                  <TableHead>인플루언서</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencerRevenue.map((inf, idx) => (
                  <TableRow key={inf.id}>
                    <TableCell className="font-bold">{idx + 1}</TableCell>
                    <TableCell>{inf.name}</TableCell>
                    <TableCell className="text-right">
                      {formatKRW(inf.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
