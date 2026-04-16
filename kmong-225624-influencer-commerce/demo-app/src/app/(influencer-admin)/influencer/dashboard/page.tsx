"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  MousePointerClick,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  deepLinks,
  orders,
  products,
  getProduct,
  formatKRW,
} from "@/lib/data";

const INFLUENCER_ID = "inf-1";

// Mock chart data per period
const chartDataMap: Record<string, { name: string; earnings: number; clicks: number }[]> = {
  "7d": [
    { name: "Mon", earnings: 820000, clicks: 340 },
    { name: "Tue", earnings: 950000, clicks: 410 },
    { name: "Wed", earnings: 780000, clicks: 290 },
    { name: "Thu", earnings: 1100000, clicks: 520 },
    { name: "Fri", earnings: 1250000, clicks: 580 },
    { name: "Sat", earnings: 1400000, clicks: 620 },
    { name: "Sun", earnings: 1050000, clicks: 450 },
  ],
  "30d": [
    { name: "Week 1", earnings: 5200000, clicks: 2100 },
    { name: "Week 2", earnings: 6800000, clicks: 2800 },
    { name: "Week 3", earnings: 7400000, clicks: 3100 },
    { name: "Week 4", earnings: 8100000, clicks: 3500 },
  ],
  "90d": [
    { name: "Oct", earnings: 12500000, clicks: 5200 },
    { name: "Nov", earnings: 15800000, clicks: 6300 },
    { name: "Dec", earnings: 18200000, clicks: 7100 },
    { name: "Jan", earnings: 21573000, clicks: 8300 },
    { name: "Feb", earnings: 19700000, clicks: 7600 },
    { name: "Mar", earnings: 23400000, clicks: 9200 },
  ],
};

const orderStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  shipping: { label: "Shipping", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export default function InfluencerDashboardPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("90d");

  const myLinks = useMemo(
    () => deepLinks.filter((dl) => dl.influencerId === INFLUENCER_ID),
    []
  );

  const totalEarnings = myLinks.reduce((sum, dl) => sum + dl.revenue, 0);
  const totalClicks = myLinks.reduce((sum, dl) => sum + dl.clicks, 0);
  const totalConversions = myLinks.reduce((sum, dl) => sum + dl.conversions, 0);
  const conversionRate =
    totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0.0";

  const myOrders = useMemo(
    () =>
      orders
        .filter((o) => o.influencerId === INFLUENCER_ID)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    []
  );

  const topProducts = useMemo(
    () =>
      [...myLinks]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [myLinks]
  );

  const kpiCards = [
    {
      title: "Total Earnings",
      value: `$${(totalEarnings / 1350).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      change: "+12.5%",
      up: true,
      icon: DollarSign,
      color: "#6366F1",
      bgColor: "#EEF2FF",
    },
    {
      title: "Total Clicks",
      value: totalClicks.toLocaleString("en-US"),
      change: "+8.3%",
      up: true,
      icon: MousePointerClick,
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
    },
    {
      title: "Conversions",
      value: totalConversions.toLocaleString("en-US"),
      change: "+15.2%",
      up: true,
      icon: ShoppingCart,
      color: "#06B6D4",
      bgColor: "#ECFEFF",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "-1.8%",
      up: false,
      icon: TrendingUp,
      color: "#F59E0B",
      bgColor: "#FFFBEB",
    },
  ];

  const chartData = chartDataMap[period];

  return (
    <div id="page-inf-dashboard" className="space-y-6">
      <div id="inf-dashboard">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">
          Welcome back! Here is a summary of your performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        id="inf-kpi"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {kpi.up ? (
                        <ArrowUpRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          kpi.up ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {kpi.change}
                      </span>
                      <span className="text-xs text-gray-400">vs last period</span>
                    </div>
                  </div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: kpi.bgColor }}
                  >
                    <Icon className="h-6 w-6" style={{ color: kpi.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Earnings Chart */}
      <Card id="inf-chart">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">
            Earnings Overview
          </CardTitle>
          <div className="flex gap-1">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(p)}
                className="text-xs"
                style={
                  period === p
                    ? { backgroundColor: "#6366F1", color: "white" }
                    : undefined
                }
              >
                {p}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickFormatter={(v) =>
                    `$${(v / 1350000).toFixed(0)}k`
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    `$${(Number(value) / 1350).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
                    "Earnings",
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366F1", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOrders.map((order) => {
                  const prod = getProduct(order.items[0]?.productId);
                  const statusInfo = orderStatusMap[order.status] ?? {
                    label: order.status,
                    className: "",
                  };
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-sm">
                        {prod?.nameEn ?? "Unknown"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatKRW(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusInfo.className}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Top Products by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((dl, i) => {
                  const prod = getProduct(dl.productId);
                  return (
                    <TableRow key={dl.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell className="text-sm">
                        {prod?.nameEn ?? "Unknown"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {dl.clicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        ${(dl.revenue / 1350).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
