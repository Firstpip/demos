"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { getDiscountedPrice, formatKRW } from "@/lib/data";

const SHIPPING_FEE = 3000;

interface FormData {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, couponDiscount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const finalTotal = total + SHIPPING_FEE;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "이름을 입력해주세요";
    if (!form.phone.trim()) e.phone = "전화번호를 입력해주세요";
    else if (!/^[\d-]{10,13}$/.test(form.phone.trim())) e.phone = "올바른 전화번호를 입력해주세요";
    if (!form.address.trim()) e.address = "주소를 입력해주세요";
    if (!form.zipCode.trim()) e.zipCode = "우편번호를 입력해주세요";
    else if (!/^\d{5}$/.test(form.zipCode.trim())) e.zipCode = "5자리 우편번호를 입력해주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhoneInput = (value: string) => {
    setForm({ ...form, phone: value.replace(/[^\d-]/g, "") });
  };

  const handleZipInput = (value: string) => {
    setForm({ ...form, zipCode: value.replace(/\D/g, "").slice(0, 5) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error("장바구니가 비어있습니다");
      return;
    }
    toast.success("결제가 완료되었습니다");
    clearCart();
    router.push("/order-complete/");
  };

  if (items.length === 0) {
    return (
      <div id="page-checkout" className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">장바구니가 비어있습니다.</p>
        <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white" onClick={() => router.push("/products/")}>
          쇼핑하기
        </Button>
      </div>
    );
  }

  return (
    <div id="page-checkout" className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">결제하기</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping info */}
            <Card id="checkout-form">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">배송지 정보</h2>

                <div>
                  <Label htmlFor="checkout-name">이름 <span className="text-red-500">*</span></Label>
                  <Input
                    id="checkout-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="수령인 이름"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="checkout-phone">전화번호 <span className="text-red-500">*</span></Label>
                  <Input
                    id="checkout-phone"
                    type="text"
                    inputMode="numeric"
                    value={form.phone}
                    onInput={(e) => handlePhoneInput((e.target as HTMLInputElement).value)}
                    placeholder="010-1234-5678"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="checkout-address">주소 <span className="text-red-500">*</span></Label>
                  <Input
                    id="checkout-address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="도로명 주소"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="checkout-address-detail">상세주소 <span className="text-gray-400 text-xs">(선택)</span></Label>
                  <Input
                    id="checkout-address-detail"
                    value={form.addressDetail}
                    onChange={(e) => setForm({ ...form, addressDetail: e.target.value })}
                    placeholder="동, 호수 등"
                  />
                </div>

                <div>
                  <Label htmlFor="checkout-zip">우편번호 <span className="text-red-500">*</span></Label>
                  <Input
                    id="checkout-zip"
                    type="text"
                    inputMode="numeric"
                    value={form.zipCode}
                    onInput={(e) => handleZipInput((e.target as HTMLInputElement).value)}
                    placeholder="12345"
                    className={`w-40 ${errors.zipCode ? "border-red-500" : ""}`}
                  />
                  {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card id="checkout-payment">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">결제수단</h2>
                <div className="space-y-3">
                  {[
                    { value: "card", label: "신용/체크카드" },
                    { value: "tosspay", label: "토스페이" },
                    { value: "kakaopay", label: "카카오페이" },
                  ].map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === m.value
                          ? "border-[#2563EB] bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.value}
                        checked={paymentMethod === m.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#2563EB]"
                      />
                      <span className="text-sm font-medium">{m.label}</span>
                    </label>
                  ))}
                </div>

                {/* Payment detail mock */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div>
                      <Label className="text-xs text-gray-500">카드번호</Label>
                      <Input disabled placeholder="1234  5678  9012  3456" className="bg-gray-50" />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-500">유효기간</Label>
                        <Input disabled placeholder="MM / YY" className="bg-gray-50" />
                      </div>
                      <div className="w-28">
                        <Label className="text-xs text-gray-500">CVC</Label>
                        <Input disabled placeholder="123" className="bg-gray-50" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">* 데모에서는 실제 결제가 진행되지 않습니다.</p>
                  </div>
                )}
                {paymentMethod === "tosspay" && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-lg bg-[#0064FF] text-white font-semibold text-sm opacity-70 cursor-not-allowed"
                    >
                      토스페이로 결제
                    </button>
                    <p className="text-xs text-gray-400">* 데모에서는 실제 결제가 진행되지 않습니다.</p>
                  </div>
                )}
                {paymentMethod === "kakaopay" && (
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-lg bg-[#FEE500] text-[#191919] font-semibold text-sm opacity-70 cursor-not-allowed"
                    >
                      카카오페이로 결제
                    </button>
                    <p className="text-xs text-gray-400">* 데모에서는 실제 결제가 진행되지 않습니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <Card id="checkout-summary" className="h-fit sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">주문 상품</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const dp = getDiscountedPrice(item.product);
                  return (
                    <div key={item.product.id} className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-12 w-12 rounded bg-gray-100 object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatKRW(dp)} x {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-semibold shrink-0">{formatKRW(dp * item.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">소계</span>
                  <span>{formatKRW(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">배송비</span>
                  <span>{formatKRW(SHIPPING_FEE)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>쿠폰 할인</span>
                    <span>-{formatKRW(couponDiscount)}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>총 결제금액</span>
                <span className="text-[#2563EB]">{formatKRW(finalTotal)}</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                {formatKRW(finalTotal)} 결제하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
