"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SettlementStatusBadge } from "@/components/status-badge";
import {
  settlements,
  getInfluencer,
  getVendor,
  formatKRW,
} from "@/lib/data";
import { toast } from "sonner";
import { CheckCircle, DollarSign, AlertTriangle } from "lucide-react";

const STEPS = [
  "매출집계",
  "수수료산정",
  "공급사컨펌",
  "관리자승인",
  "지급실행",
];

export default function AdminSettlementsPage() {
  const [currentStep, setCurrentStep] = useState(2);
  const [exchangeRate, setExchangeRate] = useState("1355");
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  const influencerSettlements = settlements.filter(
    (s) => s.type === "influencer"
  );
  const vendorSettlements = settlements.filter((s) => s.type === "vendor");

  function applyExchangeRate() {
    toast(`환율이 ${exchangeRate} KRW/USD로 적용되었습니다`);
  }

  function advanceStep(idx: number) {
    setCurrentStep(idx);
    toast(`정산 단계가 "${STEPS[idx]}"로 진행되었습니다`);
  }

  function executePayout() {
    setPayoutDialogOpen(false);
    toast("정산이 처리되었습니다");
  }

  function getTargetName(s: (typeof settlements)[0]) {
    if (s.type === "influencer") {
      return getInfluencer(s.targetId)?.name ?? s.targetId;
    }
    return getVendor(s.targetId)?.companyName ?? s.targetId;
  }

  return (
    <div id="page-admin-settlements" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">정산 관리</h2>
        <p className="text-gray-500 mt-1">
          인플루언서 및 공급사 정산을 관리합니다
        </p>
      </div>

      {/* Step Indicator */}
      <Card id="admin-settlements">
        <CardHeader>
          <CardTitle>정산 프로세스</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <button
                key={step}
                onClick={() => advanceStep(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  idx === currentStep
                    ? "bg-blue-600 text-white"
                    : idx < currentStep
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
                }`}
                id={`btn-step-${idx}`}
              >
                {idx < currentStep && (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>
                  {idx + 1}. {step}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate + Reconciliation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card id="admin-exchange-rate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              환율 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                현재 환율: <span className="font-semibold">1 USD = {exchangeRate} KRW</span>
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="input-exchange-rate">USD/KRW 환율</Label>
                  <Input
                    id="input-exchange-rate"
                    value={exchangeRate}
                    onChange={(e) =>
                      setExchangeRate(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    placeholder="예: 1355"
                  />
                </div>
                <Button
                  className="self-end"
                  onClick={applyExchangeRate}
                  id="btn-apply-exchange-rate"
                >
                  적용
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">자동 매칭율</span>
                <span className="font-semibold text-green-600">95.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">불일치 건수</span>
                <span className="font-semibold text-red-600">3건</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">총 처리 건수</span>
                <span className="font-semibold">62건</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">마지막 확인</span>
                <span className="text-gray-600">2026-03-30 14:22</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payoneer Payout */}
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Payoneer 정산 처리</h3>
            <p className="text-sm text-gray-500">
              확정된 인플루언서 정산을 일괄 지급합니다
            </p>
          </div>
          <Button
            onClick={() => setPayoutDialogOpen(true)}
            id="btn-bulk-payout"
          >
            일괄 지급 실행
          </Button>
        </CardContent>
      </Card>

      {/* Settlement Tables */}
      <Tabs defaultValue="influencer">
        <TabsList>
          <TabsTrigger value="influencer">인플루언서 정산</TabsTrigger>
          <TabsTrigger value="vendor">공급사 정산</TabsTrigger>
        </TabsList>

        <TabsContent value="influencer">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>기간</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>대상</TableHead>
                    <TableHead>총매출</TableHead>
                    <TableHead>반품</TableHead>
                    <TableHead>순매출</TableHead>
                    <TableHead>수수료율</TableHead>
                    <TableHead>수수료</TableHead>
                    <TableHead>환율</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencerSettlements.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.period}</TableCell>
                      <TableCell>인플루언서</TableCell>
                      <TableCell className="font-medium">
                        {getTargetName(s)}
                      </TableCell>
                      <TableCell>{formatKRW(s.grossSales)}</TableCell>
                      <TableCell>{formatKRW(s.returns)}</TableCell>
                      <TableCell>{formatKRW(s.netSales)}</TableCell>
                      <TableCell>{s.commissionRate}%</TableCell>
                      <TableCell className="font-semibold">
                        {formatKRW(s.commission)}
                      </TableCell>
                      <TableCell>{s.exchangeRate}</TableCell>
                      <TableCell>
                        <SettlementStatusBadge status={s.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendor">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>기간</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>대상</TableHead>
                    <TableHead>총매출</TableHead>
                    <TableHead>반품</TableHead>
                    <TableHead>순매출</TableHead>
                    <TableHead>수수료율</TableHead>
                    <TableHead>수수료</TableHead>
                    <TableHead>환율</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorSettlements.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.period}</TableCell>
                      <TableCell>공급사</TableCell>
                      <TableCell className="font-medium">
                        {getTargetName(s)}
                      </TableCell>
                      <TableCell>{formatKRW(s.grossSales)}</TableCell>
                      <TableCell>{formatKRW(s.returns)}</TableCell>
                      <TableCell>{formatKRW(s.netSales)}</TableCell>
                      <TableCell>{s.commissionRate}%</TableCell>
                      <TableCell className="font-semibold">
                        {formatKRW(s.commission)}
                      </TableCell>
                      <TableCell>{s.exchangeRate}</TableCell>
                      <TableCell>
                        <SettlementStatusBadge status={s.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payout Confirmation Dialog */}
      <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일괄 지급 실행 확인</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              확정된 인플루언서 정산 건을 Payoneer를 통해 일괄 지급합니다.
              진행하시겠습니까?
            </p>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">대상 건수</span>
                <span className="font-semibold">
                  {
                    influencerSettlements.filter(
                      (s) => s.status === "confirmed"
                    ).length
                  }
                  건
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">총 지급액</span>
                <span className="font-semibold">
                  {formatKRW(
                    influencerSettlements
                      .filter((s) => s.status === "confirmed")
                      .reduce((sum, s) => sum + s.commission, 0)
                  )}
                </span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setPayoutDialogOpen(false)}
              >
                취소
              </Button>
              <Button onClick={executePayout} id="btn-confirm-payout">
                지급 실행
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
