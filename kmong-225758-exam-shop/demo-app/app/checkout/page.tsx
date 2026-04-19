'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { CreditCard, Landmark, FileText } from 'lucide-react';
import { useCart, useToast, useAuth } from '@/lib/context';
import { formatPrice } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

type Method = 'card' | 'bank' | 'virtual';

function CheckoutInner() {
  const router = useRouter();
  const { items, totalSelectedAmount, shippingFee, clearCart } = useCart();
  const { userName } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: userName || '',
    phone: '',
    zipcode: '',
    address: '',
    addressDetail: '',
    memo: '',
  });
  const [method, setMethod] = useState<Method>('card');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selected = items.filter(i => i.selected);
  const total = totalSelectedAmount + shippingFee;

  const update = (key: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = '이름을 입력해주세요.';
    if (!form.phone.trim()) next.phone = '연락처를 입력해주세요.';
    else if (!/^\d{2,3}-?\d{3,4}-?\d{4}$/.test(form.phone)) next.phone = '올바른 연락처 형식이 아닙니다.';
    if (!form.zipcode.trim()) next.zipcode = '우편번호를 입력해주세요.';
    if (!form.address.trim()) next.address = '주소를 입력해주세요.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (selected.length === 0) {
      showToast('주문할 상품이 없습니다.', 'error');
      return;
    }
    if (!validate()) {
      showToast('필수 입력값을 확인해주세요.', 'error');
      return;
    }
    showToast(`${method === 'card' ? '카드' : method === 'bank' ? '계좌이체' : '가상계좌'} 결제 (데모 Mock) 진행 중...`, 'info');
    setTimeout(() => {
      clearCart();
      router.push('/order-complete');
    }, 700);
  };

  if (selected.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">주문할 상품이 없습니다</h2>
        <Link href="/products" className="inline-block mt-4 px-6 py-2.5 bg-[#1B2A4A] text-white rounded-md">
          교재 둘러보기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">주문/결제</h1>
      <p className="text-xs text-gray-500 mb-6">
        데모에서는 실제 결제가 진행되지 않으며, 클릭 시 Mock 결제 플로우로 이동합니다.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section id="shipping-form" className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">배송 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-semibold text-gray-600">
                  받는 사람 <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-gray-600">
                  연락처 <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  inputMode="tel"
                  placeholder="010-1234-5678"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </label>

              <label className="block md:col-span-2">
                <span className="text-xs font-semibold text-gray-600">
                  우편번호 <span className="text-red-500">*</span>
                </span>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.zipcode}
                    onChange={e => update('zipcode', e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      update('zipcode', '04524');
                      update('address', '서울특별시 중구 세종대로 지하 2 (태평로1가)');
                      showToast('데모: 우편번호가 자동 입력되었습니다.', 'info');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    주소 검색
                  </button>
                </div>
                {errors.zipcode && <p className="text-xs text-red-500 mt-1">{errors.zipcode}</p>}
              </label>

              <label className="block md:col-span-2">
                <span className="text-xs font-semibold text-gray-600">
                  주소 <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </label>

              <label className="block md:col-span-2">
                <span className="text-xs font-semibold text-gray-600">상세 주소</span>
                <input
                  type="text"
                  value={form.addressDetail}
                  onChange={e => update('addressDetail', e.target.value)}
                  placeholder="동/호수 등"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-xs font-semibold text-gray-600">배송 메모</span>
                <textarea
                  value={form.memo}
                  onChange={e => update('memo', e.target.value)}
                  rows={2}
                  placeholder="부재 시 경비실에 맡겨주세요"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
                />
              </label>
            </div>
          </section>

          <section id="payment-method" className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">결제 수단 선택 (Mock)</h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card' as const, label: '신용/체크카드', icon: CreditCard },
                { id: 'bank' as const, label: '계좌이체', icon: Landmark },
                { id: 'virtual' as const, label: '가상계좌', icon: FileText },
              ].map(m => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`p-4 rounded-md border-2 flex flex-col items-center gap-1 transition-colors ${
                      active
                        ? 'border-[#1B2A4A] bg-[#1B2A4A]/5'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-[#1B2A4A]' : 'text-gray-500'}`} />
                    <span className={`text-xs font-semibold ${active ? 'text-[#1B2A4A]' : 'text-gray-700'}`}>
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              실서비스에서는 토스페이먼츠 또는 포트원을 통한 국내 PG 결제가 연동됩니다.
            </p>
          </section>
        </div>

        <aside id="order-summary" className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-3">주문 상품</h2>
            <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {selected.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center justify-between text-xs">
                  <span className="line-clamp-1 text-gray-700">
                    {product.title} × {quantity}
                  </span>
                  <span className="font-semibold shrink-0 ml-2">
                    {formatPrice(product.salePrice * quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 text-sm pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <dt className="text-gray-600">상품금액</dt>
                <dd>{formatPrice(totalSelectedAmount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">배송비</dt>
                <dd>{shippingFee === 0 ? <span className="text-green-600">무료</span> : formatPrice(shippingFee)}</dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <dt className="font-bold text-gray-900">총 결제금액</dt>
                <dd className="text-lg font-bold text-[#E8653A]">{formatPrice(total)}</dd>
              </div>
            </dl>
            <button
              onClick={submit}
              className="mt-4 w-full py-3 bg-[#E8653A] text-white font-semibold rounded-md hover:bg-[#d35529]"
            >
              {formatPrice(total)} 결제하기
            </button>
            <p className="mt-2 text-[11px] text-gray-500 text-center">
              주문 내용을 확인했으며 결제에 동의합니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard type="loggedIn">
      <CheckoutInner />
    </AuthGuard>
  );
}
