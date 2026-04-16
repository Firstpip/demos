"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function OrderCompletePage() {
  const router = useRouter();
  const orderNumber = useMemo(() => {
    const now = Date.now();
    return `ORD-${now.toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }, []);

  return (
    <div id="page-order-complete" className="mx-auto max-w-lg px-4 py-16">
      <Card id="order-complete">
        <CardContent className="p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-500 mb-6">
            주문이 성공적으로 접수되었습니다.<br />
            결제 확인 후 상품이 준비됩니다.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">주문번호</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{orderNumber}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/mypage/")}
            >
              마이페이지
            </Button>
            <Button
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              onClick={() => router.push("/products/")}
            >
              계속 쇼핑하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
