'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const { showToast } = useToast();

  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [shippingMemo, setShippingMemo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'무통장입금' | '계좌이체'>('무통장입금');
  const [taxInvoice, setTaxInvoice] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  const handleOrder = () => {
    const errs: Record<string, string> = {};
    if (!shippingAddress.trim()) errs.address = '배송지를 입력해주세요.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    clearCart();
    showToast('주문이 완료되었습니다! 입금 확인 후 배송됩니다.', 'success');
    router.push('/mypage/orders');
  };

  return (
    <div id="checkout-page" className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">주문/결제</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping info */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">배송 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">배송지 주소 <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => { setShippingAddress(e.target.value); setErrors({}); }}
                  className={`input-field ${errors.address ? 'border-error' : ''}`}
                  placeholder="배송받을 주소를 입력하세요"
                />
                {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="label-field">배송 메모</label>
                <input
                  type="text"
                  value={shippingMemo}
                  onChange={(e) => setShippingMemo(e.target.value)}
                  className="input-field"
                  placeholder="경비실에 맡겨주세요"
                />
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">주문 상품 ({items.length}건)</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={`${item.productId}-${item.optionValues}`} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="w-12 h-12 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{item.productName}</p>
                    <p className="text-xs text-neutral-400">{item.optionValues} / {item.quantity}개</p>
                  </div>
                  <span className="text-sm font-bold">{formatPrice(item.unitPrice * item.quantity)}원</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">결제 방식</h2>
            <div className="flex gap-3">
              {(['무통장입금', '계좌이체'] as const).map(method => (
                <label key={method} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="peer sr-only"
                  />
                  <div className="border-2 border-neutral-200 rounded-lg p-4 text-center peer-checked:border-primary peer-checked:bg-primary/5 transition-colors">
                    <span className="text-sm font-medium">{method}</span>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === '무통장입금' && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800">입금 계좌 안내</p>
                <p className="text-sm text-blue-700 mt-1">국민은행 000-000-00-000000 (주)비투비커머스</p>
                <p className="text-xs text-blue-600 mt-1">주문 후 3영업일 이내 입금해주세요.</p>
              </div>
            )}

          </div>

          {/* Cash receipt & Tax invoice */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">증빙 서류</h2>
            <div>
              <label className="label-field">현금영수증</label>
              <div className="flex gap-3 mb-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="receiptType" defaultChecked />
                  <span className="text-sm">개인 (휴대폰)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="receiptType" />
                  <span className="text-sm">사업자 (사업자번호)</span>
                </label>
              </div>
              <input
                type="text"
                defaultValue={currentUser?.cashReceiptNumber || ''}
                className="input-field"
                placeholder="010-0000-0000"
              />
            </div>

            {/* Tax invoice */}
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={taxInvoice}
                onChange={(e) => setTaxInvoice(e.target.checked)}
              />
              <span className="text-sm text-neutral-600">세금계산서 발행 요청</span>
            </label>
            {taxInvoice && (
              <p className="text-xs text-neutral-400 mt-1 ml-6">사업자등록번호: {currentUser?.businessNumber || '-'} 으로 발행됩니다.</p>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-bold text-neutral-900 mb-4">결제 금액</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">상품 금액</span>
                <span>{formatPrice(totalAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">배송비</span>
                <span className="text-success">무료</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-neutral-900">총 결제금액</span>
                  <span className="font-bold text-primary text-xl">{formatPrice(totalAmount)}원</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleOrder}
              className="btn-secondary w-full !py-3 mt-6 text-base"
            >
              주문하기
            </button>
            <p className="text-xs text-neutral-400 text-center mt-3">
              주문 시 이용약관에 동의한 것으로 간주합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
