"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  orders,
  influencers,
  vendors,
  getInfluencer,
  getVendor,
  formatKRW,
} from "@/lib/data";
import { toast } from "sonner";
import { Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminReportsPage() {
  const [dateFrom, setDateFrom] = useState("2026-02-01");
  const [dateTo, setDateTo] = useState("2026-03-31");
  const [infFilter, setInfFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (dateFrom && o.createdAt < dateFrom) return false;
      if (dateTo && o.createdAt > dateTo) return false;
      if (infFilter !== "all" && o.influencerId !== infFilter) return false;
      if (
        vendorFilter !== "all" &&
        !o.items.some((it) => it.vendorId === vendorFilter)
      )
        return false;
      return true;
    });
  }, [dateFrom, dateTo, infFilter, vendorFilter]);

  // Daily aggregation
  const dailyData = useMemo(() => {
    const map = new Map<string, { date: string; sales: number; orders: number; commission: number }>();
    filteredOrders.forEach((o) => {
      const existing = map.get(o.createdAt) || {
        date: o.createdAt,
        sales: 0,
        orders: 0,
        commission: 0,
      };
      existing.sales += o.totalAmount;
      existing.orders += 1;
      existing.commission += Math.round(o.totalAmount * 0.13);
      map.set(o.createdAt, existing);
    });
    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [filteredOrders]);

  // Influencer aggregation
  const influencerData = useMemo(() => {
    const map = new Map<string, { name: string; sales: number; orders: number; commission: number }>();
    filteredOrders.forEach((o) => {
      if (!o.influencerId) return;
      const inf = getInfluencer(o.influencerId);
      const name = inf?.name ?? o.influencerId;
      const existing = map.get(o.influencerId) || {
        name,
        sales: 0,
        orders: 0,
        commission: 0,
      };
      existing.sales += o.totalAmount;
      existing.orders += 1;
      existing.commission += Math.round(o.totalAmount * 0.13);
      map.set(o.influencerId, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.sales - a.sales);
  }, [filteredOrders]);

  // Vendor aggregation
  const vendorData = useMemo(() => {
    const map = new Map<string, { name: string; sales: number; orders: number; commission: number }>();
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const v = getVendor(item.vendorId);
        const name = v?.companyName ?? item.vendorId;
        const existing = map.get(item.vendorId) || {
          name,
          sales: 0,
          orders: 0,
          commission: 0,
        };
        existing.sales += item.price * item.quantity;
        existing.orders += 1;
        existing.commission += Math.round(item.price * item.quantity * 0.1);
        map.set(item.vendorId, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.sales - a.sales);
  }, [filteredOrders]);

  return (
    <div id="page-admin-reports" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">리포트</h2>
          <p className="text-gray-500 mt-1">매출 및 성과 리포트</p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast("리포트가 다운로드되었습니다")}
          id="btn-download-report"
        >
          <Download className="h-4 w-4 mr-2" />
          리포트 다운로드
        </Button>
      </div>

      {/* Filters */}
      <Card id="admin-report-filter">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>시작일</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                id="input-report-date-from"
              />
            </div>
            <div className="space-y-2">
              <Label>종료일</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                id="input-report-date-to"
              />
            </div>
            <div className="space-y-2">
              <Label>인플루언서</Label>
              <Select value={infFilter} onValueChange={(v) => setInfFilter(v ?? "all")}>
                <SelectTrigger className="w-[180px]" id="select-report-influencer">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {influencers.map((inf) => (
                    <SelectItem key={inf.id} value={inf.id}>
                      {inf.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>공급사</Label>
              <Select value={vendorFilter} onValueChange={(v) => setVendorFilter(v ?? "all")}>
                <SelectTrigger className="w-[180px]" id="select-report-vendor">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">총 매출</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatKRW(filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">총 수수료</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatKRW(filteredOrders.reduce((sum, o) => sum + Math.round(o.totalAmount * 0.13), 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 mb-1">총 주문수</p>
            <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}건</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" id="admin-reports">
        <TabsList>
          <TabsTrigger value="daily">일자별</TabsTrigger>
          <TabsTrigger value="influencer">인플루언서별</TabsTrigger>
          <TabsTrigger value="vendor">공급사별</TabsTrigger>
        </TabsList>

        {/* Daily Tab */}
        <TabsContent value="daily" className="space-y-4">
          {dailyData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                해당 조건의 데이터가 없습니다.
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardHeader>
              <CardTitle>일자별 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={14} />
                    <YAxis
                      fontSize={14}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value) => [formatKRW(Number(value)), "매출"]}
                    />
                    <Bar dataKey="sales" fill="#0D6EFD" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>매출</TableHead>
                    <TableHead>주문수</TableHead>
                    <TableHead>수수료</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map((d) => (
                    <TableRow key={d.date}>
                      <TableCell>{d.date}</TableCell>
                      <TableCell>{formatKRW(d.sales)}</TableCell>
                      <TableCell>{d.orders}건</TableCell>
                      <TableCell>{formatKRW(d.commission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencer Tab */}
        <TabsContent value="influencer" className="space-y-4">
          {influencerData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                해당 조건의 데이터가 없습니다.
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardHeader>
              <CardTitle>인플루언서별 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={influencerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={14} />
                    <YAxis
                      fontSize={14}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value) => [formatKRW(Number(value)), "매출"]}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#6610F2"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>인플루언서</TableHead>
                    <TableHead>매출</TableHead>
                    <TableHead>주문수</TableHead>
                    <TableHead>수수료</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencerData.map((d) => (
                    <TableRow key={d.name}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{formatKRW(d.sales)}</TableCell>
                      <TableCell>{d.orders}건</TableCell>
                      <TableCell>{formatKRW(d.commission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Tab */}
        <TabsContent value="vendor" className="space-y-4">
          {vendorData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-400">
                해당 조건의 데이터가 없습니다.
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardHeader>
              <CardTitle>공급사별 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={14} />
                    <YAxis
                      fontSize={14}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value) => [formatKRW(Number(value)), "매출"]}
                    />
                    <Bar
                      dataKey="sales"
                      fill="#198754"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          )}
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>공급사</TableHead>
                    <TableHead>매출</TableHead>
                    <TableHead>주문수</TableHead>
                    <TableHead>수수료</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorData.map((d) => (
                    <TableRow key={d.name}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{formatKRW(d.sales)}</TableCell>
                      <TableCell>{d.orders}건</TableCell>
                      <TableCell>{formatKRW(d.commission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
