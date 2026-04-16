'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const { showToast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast('장바구니가 비어있습니다.', 'warning');
      return;
    }
    if (totalAmount < 30000) {
      showToast('최소 주문금액은 30,000원입니다.', 'warning');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div id="cart-page" className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">장바구니</h1>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <p className="text-neutral-600 mb-4">장바구니가 비어있습니다.</p>
          <Link href="/" className="btn-primary">쇼핑하러 가기</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={`${item.productId}-${item.optionValues}`} className="card p-4 flex gap-4">
                <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-neutral-900 text-sm truncate">{item.productName}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{item.optionValues}</p>
                  <p className="text-sm font-bold text-neutral-900 mt-1">{formatPrice(item.unitPrice)}원</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.optionValues, item.quantity - 1)}
                      className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center text-sm hover:bg-neutral-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.optionValues, item.quantity + 1)}
                      className="w-7 h-7 border border-neutral-200 rounded flex items-center justify-center text-sm hover:bg-neutral-100 cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-sm text-neutral-600 ml-auto">
                      {formatPrice(item.unitPrice * item.quantity)}원
                    </span>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId, item.optionValues);
                        showToast('상품이 삭제되었습니다.', 'info');
                      }}
                      className="text-neutral-400 hover:text-error ml-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="font-bold text-neutral-900 mb-4">주문 요약</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">상품 금액</span>
                  <span>{formatPrice(totalAmount)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">배송비</span>
                  <span className="text-success">무료</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-neutral-900">결제 예정금액</span>
                  <span className="font-bold text-primary text-lg">{formatPrice(totalAmount)}원</span>
                </div>
              </div>
              {totalAmount < 30000 && (
                <p className="text-error text-xs mt-3">최소 주문금액: 30,000원 ({formatPrice(30000 - totalAmount)}원 부족)</p>
              )}
              <button
                onClick={handleCheckout}
                className="btn-secondary w-full !py-3 mt-4 text-base"
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
