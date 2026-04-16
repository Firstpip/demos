'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { withBasePath } from '@/utils/basePath';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const product = products.find(p => p.id === id);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (!product) return {};
    const initial: Record<string, string> = {};
    product.options.forEach(opt => {
      initial[opt.name] = opt.values[0].label;
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detail' | 'info'>('detail');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">상품을 찾을 수 없습니다</h1>
        <Link href="/" className="btn-primary">홈으로 돌아가기</Link>
      </div>
    );
  }

  const discountRate = currentUser?.discountRate || 0;

  const additionalPrice = product.options.reduce((sum, opt) => {
    const selected = opt.values.find(v => v.label === selectedOptions[opt.name]);
    return sum + (selected?.additionalPrice || 0);
  }, 0);

  const unitPrice = product.basePrice + additionalPrice;
  const discountedUnitPrice = Math.round(unitPrice * (1 - discountRate / 100));
  const totalPrice = discountedUnitPrice * quantity;

  const selectedStock = Math.min(
    ...product.options.map(opt => {
      const selected = opt.values.find(v => v.label === selectedOptions[opt.name]);
      return selected?.stock || 0;
    })
  );

  const optionString = product.options.map(opt => selectedOptions[opt.name]).join(' / ');

  const handleAddToCart = () => {
    if (totalPrice < product.purchaseLimit.minAmount) {
      showToast(`최소 주문금액은 ${formatPrice(product.purchaseLimit.minAmount)}원입니다.`, 'warning');
      return;
    }
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: withBasePath(product.images[0]),
      optionValues: optionString,
      quantity,
      unitPrice: discountedUnitPrice,
    });
    showToast('장바구니에 추가되었습니다.', 'success');
  };

  const handleBuyNow = () => {
    if (totalPrice < product.purchaseLimit.minAmount) {
      showToast(`최소 주문금액은 ${formatPrice(product.purchaseLimit.minAmount)}원입니다.`, 'warning');
      return;
    }
    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: withBasePath(product.images[0]),
      optionValues: optionString,
      quantity,
      unitPrice: discountedUnitPrice,
    });
    router.push('/checkout');
  };

  return (
    <div id="product-detail" className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-neutral-400 mb-6">
        <Link href="/" className="hover:text-primary">홈</Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-neutral-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden mb-4">
            <img src={withBasePath(product.images[selectedImage])} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((imgSrc, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all ${selectedImage === i ? 'ring-2 ring-primary' : ''}`}
              >
                <img src={withBasePath(imgSrc)} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="text-sm text-neutral-400">{product.category}</span>
          <h1 className="text-2xl font-bold text-neutral-900 mt-1 mb-4">{product.name}</h1>
          <p className="text-neutral-600 text-sm mb-6">{product.description}</p>

          <div className="bg-neutral-100 rounded-xl p-4 mb-6">
            {discountRate > 0 ? (
              <div>
                <span className="text-neutral-400 line-through text-sm">{formatPrice(unitPrice)}원</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-error font-bold text-lg">{discountRate}%</span>
                  <span className="text-2xl font-bold text-neutral-900">{formatPrice(discountedUnitPrice)}원</span>
                </div>
                <span className="text-xs text-neutral-400">회원 할인가 적용</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-neutral-900">{formatPrice(unitPrice)}원</span>
            )}
          </div>

          {product.options.map(opt => (
            <div key={opt.name} className="mb-4">
              <label className="label-field">{opt.name}</label>
              <select
                value={selectedOptions[opt.name]}
                onChange={(e) => setSelectedOptions(prev => ({ ...prev, [opt.name]: e.target.value }))}
                className="input-field"
              >
                {opt.values.map(v => (
                  <option key={v.label} value={v.label}>
                    {v.label}
                    {v.additionalPrice !== 0 && ` (${v.additionalPrice > 0 ? '+' : ''}${formatPrice(v.additionalPrice)}원)`}
                    {` - 재고: ${v.stock}개`}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="mb-4">
            <label className="label-field">수량</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              >
                -
              </button>
              <input
                type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                min={1}
                max={Math.min(product.purchaseLimit.maxQuantity, selectedStock)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.purchaseLimit.maxQuantity, parseInt(e.target.value) || 1)))}
                className="w-20 text-center input-field"
              />
              <button
                onClick={() => setQuantity(q => Math.min(product.purchaseLimit.maxQuantity, q + 1))}
                className="w-10 h-10 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              >
                +
              </button>
              <span className="text-xs text-neutral-400 ml-2">재고: {selectedStock}개</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm">
            <p className="font-medium text-yellow-800">구매 제한 안내</p>
            <ul className="text-yellow-700 text-xs mt-1 space-y-0.5">
              <li>- 최소 주문금액: {formatPrice(product.purchaseLimit.minAmount)}원</li>
              <li>- 최대 주문수량: {product.purchaseLimit.maxQuantity}개</li>
              {product.purchaseLimit.periodDays && (
                <li>- 주문 제한 기간: {product.purchaseLimit.periodDays}일</li>
              )}
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200 pt-4 mb-6">
            <span className="font-medium text-neutral-600">총 금액</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}원</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleAddToCart} className="btn-outline !py-3 text-base">
              장바구니
            </button>
            <button onClick={handleBuyNow} className="btn-secondary !py-3 text-base">
              바로 주문
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('detail')}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'detail' ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            상세 설명
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'info' ? 'text-primary border-b-2 border-primary' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            상품 정보
          </button>
        </div>
      </div>

      <div className="max-w-3xl">
        {activeTab === 'detail' ? (
          <div className="product-detail-content" dangerouslySetInnerHTML={{ __html: product.detailDescription.replace(/src="\/images\//g, `src="${withBasePath('/images/')}"`) }} />
        ) : (
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-neutral-100">
                <td className="py-3 text-neutral-400 w-32">상품명</td>
                <td className="py-3">{product.name}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 text-neutral-400">카테고리</td>
                <td className="py-3">{product.category}</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 text-neutral-400">기본가</td>
                <td className="py-3">{formatPrice(product.basePrice)}원</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
