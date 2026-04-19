'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart, useToast } from '@/lib/context';
import { formatPrice, generateBookCover } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

function CartInner() {
  const { items, updateQuantity, removeFromCart, toggleSelect, toggleSelectAll, removeSelected, totalSelectedAmount, shippingFee } = useCart();
  const { showToast } = useToast();

  const selected = items.filter(i => i.selected);
  const allSelected = items.length > 0 && items.every(i => i.selected);
  const total = totalSelectedAmount + shippingFee;

  const handleRemove = (id: number, title: string) => {
    removeFromCart(id);
    showToast(`${title}이(가) 장바구니에서 삭제되었습니다.`, 'info');
  };

  const handleRemoveSelected = () => {
    if (selected.length === 0) {
      showToast('선택된 상품이 없습니다.', 'error');
      return;
    }
    removeSelected();
    showToast(`${selected.length}개 상품이 삭제되었습니다.`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h2>
        <p className="text-sm text-gray-500 mb-6">수험생에게 꼭 필요한 교재를 담아보세요.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 bg-[#1B2A4A] text-white rounded-md hover:bg-[#2D4A7A]"
        >
          교재 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">장바구니</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="cart-items" className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-[#1B2A4A]"
                />
                전체 선택 ({selected.length}/{items.length})
              </label>
              <button
                onClick={handleRemoveSelected}
                className="text-xs text-gray-500 hover:text-red-600"
              >
                선택 삭제
              </button>
            </div>

            <ul className="divide-y divide-gray-200">
              {items.map(({ product, quantity, selected: sel }) => {
                const cover = generateBookCover(product.title, product.category);
                return (
                  <li key={product.id} className="p-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={sel}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 accent-[#1B2A4A] mt-2"
                    />
                    <Link href={`/products/${product.id}`} className="shrink-0">
                      <div
                        className="w-16 h-20 rounded flex items-center justify-center text-white text-[10px] font-bold text-center p-1"
                        style={{ backgroundColor: cover.bg }}
                      >
                        {product.category}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#1B2A4A] line-clamp-2"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.author} · {product.publisher}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                            aria-label="수량 감소"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="px-2 py-1 hover:bg-gray-100"
                            aria-label="수량 증가"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(product.salePrice * quantity)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(product.id, product.title)}
                      className="p-1.5 text-gray-400 hover:text-red-500"
                      aria-label="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div id="cart-summary" className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-4">결제 정보</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">선택 상품금액</dt>
                <dd className="font-medium">{formatPrice(totalSelectedAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">배송비</dt>
                <dd className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-green-600">무료</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <dt className="font-semibold text-gray-900">총 결제금액</dt>
                <dd className="text-lg font-bold text-[#E8653A]">{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
              💡 3만원 이상 구매 시 배송비 무료 (
              {totalSelectedAmount >= 30000
                ? '적용됨'
                : `${formatPrice(30000 - totalSelectedAmount)} 더 담으면 무료`}
              )
            </div>

            <Link
              href="/checkout"
              onClick={e => {
                if (selected.length === 0) {
                  e.preventDefault();
                  showToast('주문할 상품을 선택해주세요.', 'error');
                }
              }}
              className="mt-4 block w-full text-center py-3 bg-[#E8653A] text-white font-semibold rounded-md hover:bg-[#d35529]"
            >
              {selected.length}개 주문하기
            </Link>
            <Link
              href="/products"
              className="mt-2 block w-full text-center py-2.5 text-sm text-gray-600 hover:text-[#1B2A4A]"
            >
              계속 쇼핑하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <AuthGuard type="loggedIn">
      <CartInner />
    </AuthGuard>
  );
}
