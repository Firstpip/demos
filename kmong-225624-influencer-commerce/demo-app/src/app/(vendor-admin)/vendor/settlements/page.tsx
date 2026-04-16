"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettlementStatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import {
  settlements as initialSettlements,
  orders,
  influencers,
  products,
  type Settlement,
} from "@/lib/data";

const VENDOR_ID = "ven-1";

function formatKRW(value: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VendorSettlementsPage() {
  const [settlementList, setSettlementList] = useState<Settlement[]>(
    () => initialSettlements.filter(
      (s) => s.type === "vendor" && s.targetId === VENDOR_ID
    )
  );

  // Build influencer commission data from vendor orders
  const influencerCommissions = useMemo(() => {
    const vendorOrders = orders.filter((o) =>
      o.items.some((item) => item.vendorId === VENDOR_ID)
    );

    const map: Record<string, { revenue: number; orders: number }> = {};
    vendorOrders.forEach((o) => {
      o.items.forEach((item) => {
        if (item.vendorId === VENDOR_ID && item.influencerId) {
          if (!map[item.influencerId]) {
            map[item.influencerId] = { revenue: 0, orders: 0 };
          }
          map[item.influencerId].revenue += item.price * item.quantity;
          map[item.influencerId].orders += 1;
        }
      });
    });

    return Object.entries(map).map(([infId, data]) => {
      const inf = influencers.find((i) => i.id === infId);
      // Find matching influencer settlement for commission rate
      const infSettlement = initialSettlements.find(
        (s) => s.type === "influencer" && s.targetId === infId
      );
      const commissionRate = infSettlement?.commissionRate ?? 12;
      const commissionAmount = Math.round(data.revenue * (commissionRate / 100));

      return {
        id: `inf-comm-${infId}`,
        influencerId: infId,
        name: inf?.name ?? infId,
        revenue: data.revenue,
        commissionRate,
        commissionAmount,
        status: infSettlement?.status ?? "pending",
      };
    });
  }, []);

  const [infCommissions, setInfCommissions] = useState(influencerCommissions);

  const handleApprove = useCallback((id: string) => {
    setInfCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "confirmed" as const } : c))
    );
    toast.success("수수료가 승인되었습니다");
  }, []);

  const handleReject = useCallback((id: string) => {
    setInfCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "pending" as const } : c))
    );
    toast.error("수수료가 거부되었습니다");
  }, []);

  // Settlement preview data
  const previewData = useMemo(() => {
    const latest = settlementList[settlementList.length - 1];
    if (!latest) {
      return {
        period: "-",
        grossSales: 0,
        returns: 0,
        netSales: 0,
        commissionRate: 0,
        commission: 0,
      };
    }
    return latest;
  }, [settlementList]);

  return (
    <div id="page-vendor-settlements" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">정산 관리</h2>
        <p className="text-muted-foreground">
          인플루언서별 수수료와 정산 현황을 관리하세요
        </p>
      </div>

      {/* Influencer Commission Table */}
      <Card id="vendor-settlements">
        <CardHeader>
          <CardTitle>인플루언서별 수수료</CardTitle>
          <CardDescription>
            인플루언서별 매출 및 수수료 현황
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>인플루언서</TableHead>
                <TableHead>매출액</TableHead>
                <TableHead>수수료율</TableHead>
                <TableHead>수수료액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead id="vendor-confirm" className="text-right">
                  액션
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {infCommissions.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell className="font-medium">{comm.name}</TableCell>
                  <TableCell>{formatKRW(comm.revenue)}</TableCell>
                  <TableCell>{comm.commissionRate}%</TableCell>
                  <TableCell>{formatKRW(comm.commissionAmount)}</TableCell>
                  <TableCell>
                    <SettlementStatusBadge status={comm.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(comm.id)}
                        disabled={comm.status === "confirmed" || comm.status === "completed"}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        승인
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(comm.id)}
                        disabled={comm.status === "confirmed" || comm.status === "completed"}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        거부
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Settlement History */}
      <Card>
        <CardHeader>
          <CardTitle>정산 내역</CardTitle>
          <CardDescription>기간별 정산 내역</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>기간</TableHead>
                <TableHead>총 매출</TableHead>
                <TableHead>반품</TableHead>
                <TableHead>순매출</TableHead>
                <TableHead>수수료율</TableHead>
                <TableHead>수수료</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settlementList.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.period}</TableCell>
                  <TableCell>{formatKRW(s.grossSales)}</TableCell>
                  <TableCell>{formatKRW(s.returns)}</TableCell>
                  <TableCell>{formatKRW(s.netSales)}</TableCell>
                  <TableCell>{s.commissionRate}%</TableCell>
                  <TableCell className="font-semibold">
                    {formatKRW(s.commission)}
                  </TableCell>
                  <TableCell>
                    <SettlementStatusBadge status={s.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Settlement Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>정산 명세서 미리보기</CardTitle>
          <CardDescription>
            최근 정산 기간: {previewData.period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">총 매출 (Gross Sales)</span>
              <span className="font-medium">
                {formatKRW(previewData.grossSales)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">반품 (Returns)</span>
              <span className="font-medium text-red-600">
                - {formatKRW(previewData.returns)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">순매출 (Net Sales)</span>
              <span className="font-semibold">
                {formatKRW(previewData.netSales)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                수수료율 (Commission Rate)
              </span>
              <span className="font-medium">
                x {previewData.commissionRate}%
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-semibold">수수료 (Commission)</span>
              <span className="font-bold text-teal-600">
                {formatKRW(previewData.commission)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
