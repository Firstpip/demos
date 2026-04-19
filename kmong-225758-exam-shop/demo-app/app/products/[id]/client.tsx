'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Star,
  Truck,
  RefreshCw,
  CreditCard,
  Minus,
  Plus,
  Share2,
  Bell,
  MessageCircle,
  ThumbsUp,
  ChevronDown,
} from 'lucide-react';
import { products, reviews as allReviews, qnas as allQnas } from '@/lib/data';
import { formatDate, formatPrice, generateBookCover } from '@/lib/utils';
import { useCart, useToast } from '@/lib/context';
import ProductCard from '@/components/ProductCard';

type Tab = 'desc' | 'reviews' | 'qna' | 'shipping';
type Sort = 'recent' | 'rating' | 'helpful';

function estimatedDeliveryRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + 2);
  const end = new Date(now);
  end.setDate(now.getDate() + 4);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(start)} ~ ${fmt(end)}`;
}

export default function ProductDetailClient({ id }: { id: string }) {
  const product = products.find(p => String(p.id) === id);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>('desc');
  const [mainIdx, setMainIdx] = useState(0);
  const [sort, setSort] = useState<Sort>('recent');
  const [openQnaId, setOpenQnaId] = useState<number | null>(null);
  const [helpful, setHelpful] = useState<Record<number, number>>({});

  if (!product) return notFound();

  const reviews = allReviews.filter(r => r.productId === product.id);
  const qnas = allQnas.filter(q => q.productId === product.id);
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const cover = generateBookCover(product.title, product.category);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : product.rating;

  // 별점 분포
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  const maxDist = Math.max(...ratingDist.map(d => d.count), 1);

  const sortedReviews = useMemo(() => {
    const arr = [...reviews];
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (sort === 'helpful') arr.sort((a, b) => (helpful[b.id] ?? 0) - (helpful[a.id] ?? 0));
    else arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return arr;
  }, [reviews, sort, helpful]);

  // 재고 상태
  const stockState: { label: string; cls: string } =
    product.stock <= 0
      ? { label: '일시 품절', cls: 'bg-gray-100 text-gray-600' }
      : product.stock < 30
      ? { label: `마지막 ${product.stock}권 (서둘러 주세요)`, cls: 'bg-red-100 text-red-700' }
      : product.stock < 100
      ? { label: `재고 ${product.stock}권 (여유 있음)`, cls: 'bg-yellow-100 text-yellow-700' }
      : { label: '재고 충분', cls: 'bg-green-100 text-green-700' };

  // 무료 배송 진행률
  const itemTotal = product.salePrice * quantity;
  const freeShipProgress = Math.min(100, Math.round((itemTotal / 30000) * 100));
  const freeShipRemaining = Math.max(0, 30000 - itemTotal);

  const handleAdd = () => {
    addToCart(product.id, quantity);
    showToast(`${product.title}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleBuy = () => {
    addToCart(product.id, quantity);
    showToast('주문 페이지로 이동합니다.');
    setTimeout(() => (window.location.href = '/checkout'), 200);
  };

  const handleShare = async (channel: string) => {
    if (channel === 'url') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('링크가 복사되었습니다.', 'success');
      } catch {
        showToast('링크 복사에 실패했습니다.', 'error');
      }
    } else {
      showToast(`${channel}으로 공유 (Mock)`, 'info');
    }
  };

  const handleRestockAlert = () => {
    showToast('입고 알림을 신청했습니다. 재입고 시 알림톡으로 안내드립니다.', 'success');
  };

  const handleHelpful = (reviewId: number) => {
    setHelpful(prev => ({ ...prev, [reviewId]: (prev[reviewId] ?? 0) + 1 }));
    showToast('도움이 된 후기로 표시했습니다.', 'info');
  };

  // 갤러리 (커버 + 3개 파생 톤)
  const galleryTints = ['', '30', '55', '80'] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4">
        <Link href="/" className="hover:text-[#1B2A4A]">홈</Link> &nbsp;›&nbsp;
        <Link href="/products" className="hover:text-[#1B2A4A]">교재</Link> &nbsp;›&nbsp;
        <Link href={`/products?category=${product.category}`} className="hover:text-[#1B2A4A]">
          {product.category}
        </Link> &nbsp;›&nbsp;
        <span className="text-gray-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div id="product-image" className="flex flex-col gap-3">
          <div
            className="aspect-[3/4] rounded-lg overflow-hidden"
            style={{ backgroundColor: cover.bg + galleryTints[mainIdx] }}
          >
            <div
              className="w-full h-full flex flex-col items-center justify-center p-8 text-center transition-colors"
              style={{ backgroundColor: cover.bg }}
            >
              <span className="text-white/60 text-sm mb-2">{product.category}</span>
              <h2 className="text-white font-bold text-2xl leading-tight">{product.title}</h2>
              <span className="text-white/70 text-sm mt-4">{product.author}</span>
              <span className="text-white/50 text-xs mt-2">{product.publisher}</span>
              <span className="text-white/50 text-xs mt-4">미리보기 {mainIdx + 1}/4</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {galleryTints.map((_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMainIdx(n)}
                aria-label={`미리보기 ${n + 1}번으로 이동`}
                className={`aspect-square rounded-md border-2 transition-all ${
                  mainIdx === n ? 'border-[#1B2A4A]' : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: cover.bg + galleryTints[n] }}
              />
            ))}
          </div>
        </div>

        <div id="product-info">
          <div className="flex items-center gap-2 mb-3">
            {product.isBest && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">BEST</span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded">NEW</span>
            )}
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{product.grade}</span>
            <span className={`ml-auto px-2 py-0.5 text-[11px] rounded ${stockState.cls}`}>
              {stockState.label}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {product.author} · {product.publisher}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-6">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-gray-400">({reviews.length}개 후기)</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{product.soldCount.toLocaleString('ko-KR')}권 판매</span>
            <button
              type="button"
              onClick={() => setTab('reviews')}
              className="ml-auto text-xs text-[#1B2A4A] hover:underline"
            >
              후기 보러가기 →
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              {product.discountRate > 0 && (
                <>
                  <span className="text-[#E8653A] text-2xl font-bold">{product.discountRate}%</span>
                  <span className="text-gray-400 text-sm line-through">{formatPrice(product.price)}</span>
                </>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(product.salePrice)}</p>
            <p className="text-xs text-gray-500 mt-1">
              적립금 {Math.round(product.salePrice * 0.01).toLocaleString('ko-KR')}원 (1%)
            </p>
          </div>

          {/* 무료 배송 진행률 + 예상 배송일 */}
          <div className="mb-4 p-3 border border-blue-100 bg-blue-50 rounded-md text-xs text-blue-800">
            {freeShipRemaining > 0 ? (
              <p>
                <span className="font-semibold">{formatPrice(freeShipRemaining)}</span> 더 담으면 무료 배송!
              </p>
            ) : (
              <p className="font-semibold">3만원 이상 구매, 무료 배송이 적용됩니다.</p>
            )}
            <div className="mt-2 h-1.5 bg-white/70 rounded overflow-hidden">
              <div
                className="h-full bg-[#1B2A4A] transition-all"
                style={{ width: `${freeShipProgress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-blue-700">
              지금 주문 시 예상 수령일: <span className="font-semibold">{estimatedDeliveryRange()}</span>
            </p>
          </div>

          <div id="product-actions" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">수량</span>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  aria-label="수량 감소"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={quantity}
                  onChange={e => {
                    const v = e.target.value.replace(/\D/g, '');
                    setQuantity(v === '' ? 1 : Math.max(1, Math.min(99, Number(v))));
                  }}
                  className="w-12 text-center text-sm"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(99, q + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  aria-label="수량 증가"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700">총 상품 금액</span>
              <span className="text-xl font-bold text-[#1B2A4A]">
                {formatPrice(product.salePrice * quantity)}
              </span>
            </div>

            {product.stock <= 0 ? (
              <button
                type="button"
                onClick={handleRestockAlert}
                className="w-full py-3 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                재입고 알림 신청
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 border-2 border-[#1B2A4A] text-[#1B2A4A] font-semibold rounded-md hover:bg-[#1B2A4A] hover:text-white transition-colors"
                >
                  장바구니 담기
                </button>
                <button
                  onClick={handleBuy}
                  className="flex-1 py-3 bg-[#E8653A] text-white font-semibold rounded-md hover:bg-[#d35529] transition-colors"
                >
                  바로 구매
                </button>
              </div>
            )}
          </div>

          {/* 공유 */}
          <div className="mt-4 flex items-center gap-2 text-xs">
            <Share2 className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500 mr-1">공유</span>
            <button
              type="button"
              onClick={() => handleShare('카카오톡')}
              className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              카카오톡
            </button>
            <button
              type="button"
              onClick={() => handleShare('페이스북')}
              className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              페이스북
            </button>
            <button
              type="button"
              onClick={() => handleShare('url')}
              className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              링크 복사
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-md">
              <Truck className="w-5 h-5 text-[#1B2A4A]" />
              <span className="text-gray-600">3만원 이상 무배송</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-md">
              <RefreshCw className="w-5 h-5 text-[#1B2A4A]" />
              <span className="text-gray-600">7일 교환/반품</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-md">
              <CreditCard className="w-5 h-5 text-[#1B2A4A]" />
              <span className="text-gray-600">카드/계좌/가상</span>
            </div>
          </div>
        </div>
      </div>

      <section id="product-tabs" className="mb-10">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'desc' as Tab, label: '상세 설명' },
            { id: 'reviews' as Tab, label: `후기 (${reviews.length})` },
            { id: 'qna' as Tab, label: `Q&A (${qnas.length})` },
            { id: 'shipping' as Tab, label: '배송/환불' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#1B2A4A] text-[#1B2A4A]'
                  : 'border-transparent text-gray-500 hover:text-[#1B2A4A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {tab === 'desc' && (
            <div
              className="rich-content text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: /<[a-z][\s\S]*>/i.test(product.description)
                  ? product.description
                  : product.description
                      .split(/\n{2,}/)
                      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                      .join(''),
              }}
            />
          )}

          {tab === 'reviews' && (
            <div id="product-reviews">
              {/* 별점 분포 + 요약 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 p-5 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-4xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{reviews.length}개 후기</p>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  {ratingDist.map(d => (
                    <div key={d.star} className="flex items-center gap-2 text-xs">
                      <span className="w-10 text-gray-600">{d.star}점</span>
                      <div className="flex-1 h-2 bg-white rounded overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${(d.count / maxDist) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-500">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 정렬 */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500">총 {reviews.length}개의 후기</p>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as Sort)}
                  className="demo-select text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                  aria-label="후기 정렬"
                >
                  <option value="recent">최신순</option>
                  <option value="rating">평점 높은순</option>
                  <option value="helpful">도움순</option>
                </select>
              </div>

              <div className="space-y-3">
                {sortedReviews.length === 0 ? (
                  <p className="text-sm text-gray-500 py-10 text-center">등록된 후기가 없습니다.</p>
                ) : (
                  sortedReviews.map(r => (
                    <article key={r.id} className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{r.userName}</span>
                        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                        <button
                          type="button"
                          onClick={() => handleHelpful(r.id)}
                          className="ml-auto inline-flex items-center gap-1 text-xs text-gray-600 hover:text-[#1B2A4A]"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          도움 돼요 ({helpful[r.id] ?? 0})
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{r.content}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === 'qna' && (
            <div id="product-qna">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500">총 {qnas.length}개의 문의</p>
                <button
                  type="button"
                  onClick={() => showToast('문의 등록 (Mock). 실서비스에서는 로그인 후 등록됩니다.', 'info')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1B2A4A] text-white text-xs rounded-md hover:bg-[#2D4A7A]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  문의하기
                </button>
              </div>

              {qnas.length === 0 ? (
                <p className="text-sm text-gray-500 py-10 text-center">등록된 문의가 없습니다.</p>
              ) : (
                <div className="space-y-2">
                  {qnas.map(q => {
                    const open = openQnaId === q.id;
                    return (
                      <div key={q.id} className="border border-gray-200 rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenQnaId(open ? null : q.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <span className="text-[#E8653A] font-bold text-sm">Q.</span>
                          <span className="flex-1 text-sm text-gray-800 line-clamp-1">{q.question}</span>
                          <span className="text-xs text-gray-400">{q.userName}</span>
                          <span className="text-xs text-gray-400 hidden sm:inline">{formatDate(q.createdAt)}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {open && (
                          <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                            <div className="pt-3 pl-5">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[#1B2A4A] font-bold text-sm">A.</span>
                                <span className="text-xs text-gray-500">{q.answeredBy}</span>
                                <span className="text-xs text-gray-400">{formatDate(q.answeredAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed pl-5">{q.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'shipping' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 leading-relaxed">
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-bold text-gray-900 mb-2">배송 안내</h4>
                <p>평일 오후 2시 이전 주문 시 당일 출고, 출고 후 1~2일 내 수령</p>
                <p>현재 주문 시 예상 수령일: <span className="font-semibold">{estimatedDeliveryRange()}</span></p>
                <p>3만원 이상 구매 시 무료 배송 (미만 시 3,000원)</p>
                <p>도서/산간 지역은 추가 1~2일 및 추가 배송비가 발생할 수 있습니다.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-bold text-gray-900 mb-2">교환·반품</h4>
                <p>수령 후 7일 이내 마이페이지 &gt; 주문 내역에서 접수</p>
                <p>필기·사용 흔적이 있는 경우 반품 불가</p>
                <p>저희 측 귀책(오배송, 파손)은 무료 교환 처리됩니다.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-bold text-gray-900 mb-2">A/S·하자 안내</h4>
                <p>인쇄 불량·제본 불량은 수령 후 30일 이내 무상 교환</p>
                <p>정오표는 자료실에서 수시 업데이트됩니다.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h4 className="font-bold text-gray-900 mb-2">단체·대량 주문</h4>
                <p>학교, 학원, 독서실 30권 이상 주문 시 별도 할인</p>
                <p>견적·세금계산서 문의: cs@edupress.co.kr / 02-1234-5678</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section id="related-products">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{product.category} 관련 교재</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
