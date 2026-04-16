"use client";

import { useMemo } from "react";
import {
  DollarSign,
  Clock,
  CalendarDays,
  CheckCircle2,
  Loader2,
  AlertCircle,
  CircleDot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  settlements,
  deepLinks,
  getProduct,
  formatKRW,
  formatUSD,
} from "@/lib/data";

const INFLUENCER_ID = "inf-1";
const EXCHANGE_RATE = 1350;

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: AlertCircle,
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: Loader2,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    icon: CircleDot,
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: CheckCircle2,
  },
};

const timelineSteps = ["Pending", "Processing", "Confirmed", "Completed"];
const timelineStatusOrder = ["pending", "processing", "confirmed", "completed"];

export default function InfluencerEarningsPage() {
  const mySettlements = useMemo(
    () =>
      settlements
        .filter((s) => s.type === "influencer" && s.targetId === INFLUENCER_ID)
        .sort((a, b) => b.period.localeCompare(a.period)),
    []
  );

  const myLinks = useMemo(
    () => deepLinks.filter((dl) => dl.influencerId === INFLUENCER_ID),
    []
  );

  const totalEarned = mySettlements.reduce((sum, s) => sum + s.commission, 0);
  const pendingAmount = mySettlements
    .filter((s) => s.status !== "completed")
    .reduce((sum, s) => sum + s.commission, 0);
  const thisMonth = mySettlements
    .filter((s) => s.period === "2026-03")
    .reduce((sum, s) => sum + s.commission, 0);

  // Latest settlement status for timeline
  const latestSettlement = mySettlements[0];
  const currentStepIndex = latestSettlement
    ? timelineStatusOrder.indexOf(latestSettlement.status)
    : 0;

  // Commission detail by product
  const commissionDetails = myLinks.map((dl) => {
    const prod = getProduct(dl.productId);
    const commRate = [15, 12, 13, 14, 11, 12][
      parseInt(dl.influencerId.replace("inf-", "")) - 1
    ] ?? 12;
    const commissionKRW = Math.round(dl.revenue * (commRate / 100));
    return {
      id: dl.id,
      productName: prod?.nameEn ?? "Unknown",
      commissionRate: commRate,
      conversions: dl.conversions,
      revenue: dl.revenue,
      commissionKRW,
      commissionUSD: commissionKRW / EXCHANGE_RATE,
    };
  });

  return (
    <div id="page-inf-earnings" className="space-y-6">
      <div id="inf-earnings">
        <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
        <p className="text-gray-500 mt-1">
          Track your earnings and settlement history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earned</p>
                <p className="text-xl font-bold">
                  ${(totalEarned / EXCHANGE_RATE).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-400">{formatKRW(totalEarned)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold">
                  ${(pendingAmount / EXCHANGE_RATE).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-400">{formatKRW(pendingAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <CalendarDays className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-xl font-bold">
                  {thisMonth > 0
                    ? `$${(thisMonth / EXCHANGE_RATE).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                    : "$0"}
                </p>
                <p className="text-xs text-gray-400">
                  {thisMonth > 0 ? formatKRW(thisMonth) : "No settlements yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settlement Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Latest Settlement Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between px-4">
            {timelineSteps.map((step, i) => {
              const isCompleted = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center relative flex-1">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          i <= currentStepIndex ? "bg-indigo-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isCurrent
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : isCompleted
                          ? "border-indigo-500 bg-indigo-50 text-indigo-500"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{i + 1}</span>
                      )}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 ${
                          i < currentStepIndex ? "bg-indigo-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isCurrent ? "text-indigo-600" : isCompleted ? "text-indigo-500" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          {latestSettlement && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Period: {latestSettlement.period} -- Current status:{" "}
              <span className="font-medium text-indigo-600">
                {statusConfig[latestSettlement.status]?.label ?? latestSettlement.status}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Settlement History Table */}
      <Card id="inf-settlement-history">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Settlement History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Gross Sales</TableHead>
                  <TableHead className="text-right">Returns</TableHead>
                  <TableHead className="text-right">Net Sales</TableHead>
                  <TableHead className="text-right">Comm. Rate</TableHead>
                  <TableHead className="text-right">Commission (KRW)</TableHead>
                  <TableHead className="text-right">Commission (USD)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySettlements.map((s) => {
                  const info = statusConfig[s.status];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.period}</TableCell>
                      <TableCell className="text-right text-sm">
                        {formatKRW(s.grossSales)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatKRW(s.returns)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatKRW(s.netSales)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {s.commissionRate}%
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatKRW(s.commission)}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {formatUSD(s.commission, s.exchangeRate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={info?.className}>
                          {info?.label ?? s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Detail by Product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Commission Detail by Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Comm. Rate</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead className="text-right">Revenue (KRW)</TableHead>
                  <TableHead className="text-right">Commission (KRW)</TableHead>
                  <TableHead className="text-right">Commission (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionDetails.map((cd) => (
                  <TableRow key={cd.id}>
                    <TableCell className="text-sm">{cd.productName}</TableCell>
                    <TableCell className="text-right text-sm">
                      {cd.commissionRate}%
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {cd.conversions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatKRW(cd.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      {formatKRW(cd.commissionKRW)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">
                      ${cd.commissionUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
