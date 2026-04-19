'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { products, banners, notices, reviews, categoryInfo } from '@/lib/data';
import { formatDate, formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const bestSellers = products.filter(p => p.isBest).slice(0, 8);
  const newReleases = products.filter(p => p.isNew).slice(0, 8);
  const recentReviews = [...reviews].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 4);
  const latestNotices = [...notices].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 3);

  const nextBanner = () => setBannerIdx(i => (i + 1) % banners.length);
  const prevBanner = () => setBannerIdx(i => (i - 1 + banners.length) % banners.length);

  const banner = banners[bannerIdx];

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 히어로 배너 */}
      <section id="hero-banner" className="relative">
        <div
          className="relative h-[260px] md:h-[380px] overflow-hidden"
          style={{ backgroundColor: banner.color }}
        >
          <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-16 flex flex-col justify-center">
            <p className="text-white/70 text-sm md:text-base mb-2">{banner.subtitle}</p>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {banner.title}
            </h1>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 self-start px-6 py-3 bg-white text-gray-900 rounded-md font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              {banner.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <button
            onClick={prevBanner}
            aria-label="이전 배너"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextBanner}
            aria-label="다음 배너"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setBannerIdx(i)}
                aria-label={`${i + 1}번째 배너로 이동`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === bannerIdx ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-12">
        {/* 카테고리 */}
        <section id="categories">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(categoryInfo).map(([name, info]) => (
              <Link
                key={name}
                href={`/products?category=${encodeURIComponent(name)}`}
                className="group bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl mb-2 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: info.color + '20' }}
                >
                  {info.icon}
                </div>
                <p className="text-sm font-medium text-gray-800">{name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 베스트셀러 */}
        <section id="best-sellers">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">베스트셀러</h2>
              <p className="text-sm text-gray-500 mt-1">수험생이 가장 많이 선택한 교재</p>
            </div>
            <Link
              href="/products?sort=popular"
              className="text-sm text-[#1B2A4A] hover:text-[#E8653A] flex items-center gap-1"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* 신간 */}
        <section id="new-releases">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">신간 교재</h2>
              <p className="text-sm text-gray-500 mt-1">새로 출간된 최신 교재</p>
            </div>
            <Link
              href="/products?sort=new"
              className="text-sm text-[#1B2A4A] hover:text-[#E8653A] flex items-center gap-1"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newReleases.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* 최신 후기 + 공지 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div id="recent-reviews" className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">최신 후기</h2>
              <span className="text-xs text-gray-500">실제 구매 고객의 리뷰</span>
            </div>
            <div className="space-y-3">
              {recentReviews.map(r => {
                const product = products.find(p => p.id === r.productId);
                return (
                  <Link
                    key={r.id}
                    href={`/products/${r.productId}`}
                    className="block p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{r.userName}</span>
                      <span className="text-xs text-gray-400 shrink-0">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-800 line-clamp-2">{r.content}</p>
                    {product && (
                      <p className="mt-1 text-xs text-[#1B2A4A]">📘 {product.title}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div id="notices" className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">공지사항</h2>
              <Link
                href="/notice"
                className="text-xs text-[#1B2A4A] hover:text-[#E8653A]"
              >
                더보기
              </Link>
            </div>
            <ul className="space-y-2">
              {latestNotices.map(n => (
                <li key={n.id}>
                  <Link
                    href={`/notice/${n.id}`}
                    className="block p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                          n.category === '이벤트'
                            ? 'bg-[#E8653A]/10 text-[#E8653A]'
                            : 'bg-[#1B2A4A]/10 text-[#1B2A4A]'
                        }`}
                      >
                        {n.category}
                      </span>
                      <p className="text-sm text-gray-800 line-clamp-1">{n.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-1 mt-1">{formatDate(n.createdAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 가격/혜택 안내 */}
        <section className="bg-gradient-to-r from-[#1B2A4A] to-[#2D4A7A] rounded-lg p-6 md:p-8 text-white grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div>
            <p className="text-xs text-white/60 mb-1">최대 20% 할인</p>
            <p className="text-lg font-bold">베스트셀러 특별 할인</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">3만원 이상 무료 배송</p>
            <p className="text-lg font-bold">합리적인 가격</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">회원가입 시 2,000원 적립금</p>
            <p className="text-lg font-bold">신규 회원 혜택</p>
          </div>
        </section>
      </div>
    </div>
  );
}
