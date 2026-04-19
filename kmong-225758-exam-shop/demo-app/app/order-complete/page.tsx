'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/context';

export default function OrderCompletePage() {
  const { userName } = useAuth();
  const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-DEMO`;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
        <CheckCircle2 className="w-9 h-9 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다</h1>
      <p className="text-sm text-gray-500 mb-8">
        {userName ? `${userName}님 ` : ''}주문해 주셔서 감사합니다. 곧 상품이 배송됩니다.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 text-left mb-8">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">주문번호</dt>
            <dd className="font-semibold">{orderNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">결제 상태</dt>
            <dd>
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">결제완료 (Mock)</span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">예상 배송일</dt>
            <dd className="font-semibold">1~2일 이내</dd>
          </div>
        </dl>
      </div>

      <div className="flex gap-2 justify-center">
        <Link
          href="/mypage/orders"
          className="px-5 py-2.5 bg-[#1B2A4A] text-white rounded-md text-sm hover:bg-[#2D4A7A]"
        >
          주문 내역 보기
        </Link>
        <Link
          href="/products"
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
