'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { members } from '@/data/members';
import { products } from '@/data/products';
import { useToast } from '@/contexts/ToastContext';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

interface OrderLineItem {
  productId: string;
  productName: string;
  optionValues: string;
  quantity: number;
  unitPrice: number;
}

export default function AdminOrderCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'무통장입금' | '계좌이체'>('무통장입금');
  const [shippingMemo, setShippingMemo] = useState('');
  const [manualDiscount, setManualDiscount] = useState(0);

  const approvedMembers = members.filter(m => m.status === 'approved');
  const selectedMember = approvedMembers.find(m => m.id === selectedMemberId);

  const filteredMembers = memberSearch
    ? approvedMembers.filter(m =>
        m.businessName.includes(memberSearch) || m.loginId.includes(memberSearch) || m.managerName.includes(memberSearch)
      )
    : approvedMembers;

  const filteredProducts = productSearch
    ? products.filter(p => p.isActive && (p.name.includes(productSearch) || p.category.includes(productSearch)))
    : products.filter(p => p.isActive);

  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const optionValues = product.options.map(o => o.values[0].label).join(' / ');
    const existing = orderItems.find(i => i.productId === productId && i.optionValues === optionValues);
    if (existing) {
      setOrderItems(prev => prev.map(i =>
        i.productId === productId && i.optionValues === optionValues
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setOrderItems(prev => [...prev, {
        productId: product.id,
        productName: product.name,
        optionValues,
        quantity: 1,
        unitPrice: product.basePrice,
      }]);
    }
    setProductSearch('');
  };

  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItemQty = (index: number, qty: number) => {
    if (qty < 1) return;
    setOrderItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: qty } : item));
  };

  const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const autoDiscount = selectedMember ? Math.round(subtotal * (selectedMember.discountRate / 100)) : 0;
  const totalDiscount = autoDiscount + manualDiscount;
  const finalAmount = subtotal - totalDiscount;

  const handleCreate = () => {
    if (!selectedMemberId) {
      showToast('회원을 선택해주세요.', 'warning');
      return;
    }
    if (orderItems.length === 0) {
      showToast('상품을 추가해주세요.', 'warning');
      return;
    }
    showToast('주문이 생성되었습니다.', 'success');
    router.push('/admin/orders');
  };

  return (
    <div id="admin-order-create">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">주문 생성</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Member selection */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">1. 회원 선택</h2>
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="회사명, 아이디, 담당자 검색..."
              className="input-field mb-3"
            />
            {selectedMember ? (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedMember.businessName}</p>
                  <p className="text-xs text-neutral-400">{selectedMember.managerName} | 할인율: {selectedMember.discountRate}%</p>
                </div>
                <button onClick={() => setSelectedMemberId('')} className="text-xs text-neutral-400 hover:text-error cursor-pointer">변경</button>
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-neutral-200 rounded-lg">
                {filteredMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMemberId(m.id); setMemberSearch(''); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 border-b border-neutral-100 last:border-0 transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{m.businessName}</span>
                    <span className="text-neutral-400 ml-2">{m.managerName} | 할인율: {m.discountRate}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product selection */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">2. 상품 추가</h2>
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="상품명 또는 카테고리 검색..."
              className="input-field mb-3"
            />
            {productSearch && (
              <div className="max-h-40 overflow-y-auto border border-neutral-200 rounded-lg mb-4">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p.id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 border-b border-neutral-100 last:border-0 transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-neutral-400 ml-2">{formatPrice(p.basePrice)}원</span>
                  </button>
                ))}
              </div>
            )}

            {/* Order items */}
            {orderItems.length > 0 && (
              <div className="space-y-2">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-100">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-neutral-400">{item.optionValues}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateItemQty(i, item.quantity - 1)} className="w-6 h-6 border rounded text-xs hover:bg-neutral-100 cursor-pointer">-</button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateItemQty(i, item.quantity + 1)} className="w-6 h-6 border rounded text-xs hover:bg-neutral-100 cursor-pointer">+</button>
                    </div>
                    <span className="text-sm font-medium w-24 text-right">{formatPrice(item.unitPrice * item.quantity)}원</span>
                    <button onClick={() => removeItem(i)} className="text-neutral-400 hover:text-error text-xs cursor-pointer">삭제</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & shipping */}
          <div className="card p-6">
            <h2 className="font-bold text-neutral-900 mb-4">3. 결제/배송</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">결제 방식</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)} className="input-field">
                  <option value="무통장입금">무통장입금</option>
                  <option value="계좌이체">계좌이체</option>
                </select>
              </div>
              <div>
                <label className="label-field">수동 할인 (원)</label>
                <input
                  type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                  value={manualDiscount}
                  onChange={(e) => setManualDiscount(Math.max(0, Number(e.target.value)))}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="label-field">배송 메모</label>
                <input
                  type="text"
                  value={shippingMemo}
                  onChange={(e) => setShippingMemo(e.target.value)}
                  className="input-field"
                  placeholder="배송 관련 메모"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="font-bold text-neutral-900 mb-4">주문 요약</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">상품 합계</span>
                <span>{formatPrice(subtotal)}원</span>
              </div>
              {autoDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span>회원 할인 ({selectedMember?.discountRate}%)</span>
                  <span>-{formatPrice(autoDiscount)}원</span>
                </div>
              )}
              {manualDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span>수동 할인</span>
                  <span>-{formatPrice(manualDiscount)}원</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-2 mt-2 flex justify-between">
                <span className="font-bold">결제 금액</span>
                <span className="font-bold text-primary text-lg">{formatPrice(Math.max(0, finalAmount))}원</span>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="btn-secondary w-full !py-3 mt-6"
            >
              주문 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
