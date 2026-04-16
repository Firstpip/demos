'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import PopupOverlay from '@/components/PopupOverlay';
import { withBasePath } from '@/utils/basePath';

const banners = [
  { title: '3월 대량구매 특별 할인', subtitle: '50만원 이상 주문 시 추가 5% 할인', bg: 'from-primary to-primary-light' },
  { title: '신상품 입고 안내', subtitle: '사무용품 신규 라인업을 확인하세요', bg: 'from-secondary to-secondary-light' },
  { title: '회원 전용 특별 혜택', subtitle: '최대 12% 할인 + 무료배송', bg: 'from-primary-dark to-primary' },
];

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

export default function HomePage() {
  const { role, currentUser } = useAuth();
  const { searchQuery } = useSearch();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const discountRate = currentUser?.discountRate || 0;

  const visibleProducts = products.filter(p => {
    if (!p.isActive) return false;
    if (role === 'admin') return true;
    return true;
  }).filter(p => !selectedCategory || p.category === selectedCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.includes(searchQuery));

  return (
    <div id="home-page">
      <PopupOverlay />

      {/* Main banner */}
      <section id="main-banner" className="relative bg-neutral-900 overflow-hidden">
        <div className={`bg-gradient-to-r ${banners[currentBanner].bg} transition-all duration-500`}>
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{banners[currentBanner].title}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">{banners[currentBanner].subtitle}</p>
            <Link href="#products" className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
              상품 보러가기
            </Link>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                i === currentBanner ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category shortcuts */}
      <section id="category-shortcuts" className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`card p-6 text-center hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === cat.name ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  {cat.slug === 'food-beverage' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.379a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                  ) : cat.slug === 'living' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  ) : cat.slug === 'office' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  )}
                </svg>
              </div>
              <h3 className="font-medium text-neutral-900">{cat.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">{cat.productCount}개 상품</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section id="products" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">{selectedCategory || '전체 상품'}</h2>
          {selectedCategory && (
            <button onClick={() => setSelectedCategory(null)} className="text-sm text-neutral-400 hover:text-neutral-600 cursor-pointer">전체 보기</button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map(product => {
            const discountedPrice = Math.round(product.basePrice * (1 - discountRate / 100));
            return (
              <Link key={product.id} href={`/products/${product.id}`} className="card overflow-hidden group hover:shadow-md transition-shadow">
                <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                  <img src={withBasePath(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="p-4">
                  <span className="text-xs text-neutral-400">{product.category}</span>
                  <h3 className="font-medium text-neutral-900 mt-1 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-2">
                    {discountRate > 0 ? (
                      <>
                        <span className="text-xs text-neutral-400 line-through">{formatPrice(product.basePrice)}원</span>
                        <div className="flex items-center gap-1">
                          <span className="text-error text-sm font-bold">{discountRate}%</span>
                          <span className="text-lg font-bold text-neutral-900">{formatPrice(discountedPrice)}원</span>
                        </div>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-neutral-900">{formatPrice(product.basePrice)}원</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-2">
                    최소주문: {formatPrice(product.purchaseLimit.minAmount)}원
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
