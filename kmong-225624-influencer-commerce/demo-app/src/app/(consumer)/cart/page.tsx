"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { getDiscountedPrice, formatKRW } from "@/lib/data";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    total,
    totalItems,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const SHIPPING_FEE = 3000;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("쿠폰 코드를 입력해주세요");
      return;
    }
    const ok = applyCoupon(couponCode.trim());
    if (ok) {
      toast.success("쿠폰이 적용되었습니다");
      setCouponCode("");
    } else {
      toast.error("유효하지 않은 쿠폰 코드입니다");
    }
  };

  if (items.length === 0) {
    return (
      <div id="page-cart" className="mx-auto max-w-7xl px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h1>
        <p className="text-gray-500 mb-6">마음에 드는 상품을 담아보세요!</p>
        <Button
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          onClick={() => router.push("/products/")}
        >
          쇼핑하기
        </Button>
      </div>
    );
  }

  const finalTotal = total + SHIPPING_FEE;

  return (
    <div id="page-cart" className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        장바구니 <span className="text-[#2563EB]">({totalItems})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div id="cart-items" className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const discounted = getDiscountedPrice(item.product);
            return (
              <Card key={item.product.id}>
                <CardContent className="p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-md bg-gray-100 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.id}/`}
                      className="text-sm font-medium text-gray-900 hover:text-[#2563EB] line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm font-bold text-gray-900 mt-1">{formatKRW(discounted)}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="px-2 py-1 hover:bg-gray-50"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          className="px-2 py-1 hover:bg-gray-50"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          {formatKRW(discounted * item.quantity)}
                        </span>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => {
                            removeItem(item.product.id);
                            toast.info("상품이 삭제되었습니다");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          {/* Coupon */}
          <Card id="cart-coupon">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
                <Tag className="h-4 w-4" /> 할인코드
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-blue-50 rounded px-3 py-2">
                  <span className="text-sm font-medium text-[#2563EB]">{appliedCoupon}</span>
                  <button
                    className="text-xs text-gray-500 hover:text-red-500"
                    onClick={() => {
                      removeCoupon();
                      toast.info("쿠폰이 제거되었습니다");
                    }}
                  >
                    제거
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="할인코드 입력"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                    적용
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order summary */}
          <Card id="cart-summary">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">주문 요약</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">소계</span>
                <span>{formatKRW(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">배송비</span>
                <span>{formatKRW(SHIPPING_FEE)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>쿠폰 할인</span>
                  <span>-{formatKRW(couponDiscount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제금액</span>
                <span className="text-[#2563EB]">{formatKRW(finalTotal)}</span>
              </div>
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                size="lg"
                onClick={() => router.push("/checkout/")}
              >
                결제하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
