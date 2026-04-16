"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { vendors } from "@/lib/data";

const vendor = vendors[0]; // ven-1

const banks = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "농협은행",
  "기업은행",
  "SC제일은행",
  "카카오뱅크",
  "토스뱅크",
];

export default function VendorSettingsPage() {
  const [companyName, setCompanyName] = useState(vendor.companyName);
  const [businessNumber, setBusinessNumber] = useState(vendor.businessNumber);
  const [representative, setRepresentative] = useState(vendor.representative);

  // Parse bank from bankAccount string like "국민 123-456-789012"
  const parsedBank = vendor.bankAccount.split(" ")[0] + "은행";
  const parsedAccount = vendor.bankAccount.split(" ").slice(1).join(" ");

  const [bank, setBank] = useState(
    banks.includes(parsedBank) ? parsedBank : banks[0]
  );
  const [accountNumber, setAccountNumber] = useState(parsedAccount);

  const [orderNotif, setOrderNotif] = useState(true);
  const [settlementNotif, setSettlementNotif] = useState(true);
  const [stockNotif, setStockNotif] = useState(false);

  const handleSave = useCallback(() => {
    toast.success("설정이 저장되었습니다");
  }, []);

  return (
    <div id="page-vendor-settings" className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">설정</h2>
        <p className="text-muted-foreground">업체 정보 및 알림을 설정하세요</p>
      </div>

      {/* Company Info */}
      <Card id="vendor-settings">
        <CardHeader>
          <CardTitle>업체 정보</CardTitle>
          <CardDescription>
            사업자 정보를 확인하고 수정할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="setting-company-name">회사명</Label>
            <Input
              id="setting-company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setting-biz-number">사업자번호</Label>
            <Input
              id="setting-biz-number"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="setting-representative">대표자</Label>
            <Input
              id="setting-representative"
              value={representative}
              onChange={(e) => setRepresentative(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Info */}
      <Card>
        <CardHeader>
          <CardTitle>계좌 정보</CardTitle>
          <CardDescription>정산 계좌 정보를 설정하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="setting-bank">은행</Label>
            <Select value={bank} onValueChange={(v) => setBank(v ?? banks[0])}>
              <SelectTrigger id="setting-bank">
                <SelectValue placeholder="은행을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="setting-account">계좌번호</Label>
            <Input
              id="setting-account"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="계좌번호를 입력하세요"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>수신할 알림을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">주문 알림</p>
              <p className="text-xs text-muted-foreground">
                새 주문이 접수되면 알림을 받습니다
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={orderNotif}
              id="setting-order-notif"
              onClick={() => setOrderNotif((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                orderNotif ? "bg-teal-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  orderNotif ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">정산 알림</p>
              <p className="text-xs text-muted-foreground">
                정산 처리 상태가 변경되면 알림을 받습니다
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settlementNotif}
              id="setting-settlement-notif"
              onClick={() => setSettlementNotif((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settlementNotif ? "bg-teal-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settlementNotif ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">재고 알림</p>
              <p className="text-xs text-muted-foreground">
                재고가 부족할 때 알림을 받습니다
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={stockNotif}
              id="setting-stock-notif"
              onClick={() => setStockNotif((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                stockNotif ? "bg-teal-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  stockNotif ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          설정 저장
        </Button>
      </div>
    </div>
  );
}
