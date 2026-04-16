"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Minus,
  Plus,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/product-card";
import {
  type Product,
  getDiscountedPrice,
  formatKRW,
  getCategory,
  getVendor,
  reviews,
  deepLinks,
  influencers,
  getInfluencer,
  consumers,
  products,
} from "@/lib/data";

interface ProductDetailClientProps {
  product: Product;
}

const GALLERY_BG = ["#f9fafb", "#f3f4f6", "#f0f0f0", "#eef2ff", "#fdf2f8"];

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const discounted = getDiscountedPrice(product);
  const category = getCategory(product.categoryId);
  const vendor = getVendor(product.vendorId);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const productDeepLinks = deepLinks.filter((dl) => dl.productId === product.id);
  const recommendingInfluencers = productDeepLinks
    .map((dl) => getInfluencer(dl.influencerId))
    .filter(Boolean);

  // 관련 상품 (같은 카테고리, 자기 자신 제외)
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.status === "active")
    .slice(0, 4);

  // 갤러리 이미지 (메인 이미지 + 보기 각도)
  const galleryImages = GALLERY_BG.map((bg, i) => ({
    src: product.images[0],
    bg,
  }));

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num >= 1 && num <= 99) {
      setQuantity(num);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success("장바구니에 추가되었습니다", {
      description: `${product.name} x ${quantity}`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout/");
  };

  const handleShare = () => {
    toast.success("링크가 복사되었습니다");
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "찜 목록에서 제거되었습니다" : "찜 목록에 추가되었습니다");
  };

  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((s, r) => s + r.rating, 0) / productReviews.length).toFixed(1)
    : product.rating.toFixed(1);

  return (
    <div id="page-product-detail" className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-5">
        <Link href="/" className="hover:text-gray-600">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products/" className="hover:text-gray-600">전체 상품</Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products/?category=${category.id}`} className="hover:text-gray-600">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div id="product-detail" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* ─── Image Gallery ─── */}
        <div>
          {/* Main image */}
          <div
            className="aspect-square rounded-xl overflow-hidden mb-3 border border-gray-200"
            style={{ backgroundColor: galleryImages[selectedImage].bg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImages[selectedImage].src}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                  selectedImage === i ? "border-[#2563EB] ring-1 ring-[#2563EB]" : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: img.bg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Product Info ─── */}
        <div>
          {/* Vendor + Category */}
          <div className="flex items-center gap-2 mb-2">
            {vendor && (
              <span className="text-xs text-gray-400">{vendor.companyName}</span>
            )}
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category.icon} {category.name}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
          <p className="text-sm text-gray-400 mb-3">{product.nameEn}</p>

          {/* Rating summary */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold text-gray-900">{avgRating}</span>
            </div>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{product.reviewCount}개 리뷰</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">구매 {Math.floor(product.reviewCount * 2.3)}건</span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-5 mb-5">
            {product.discountRate > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400 line-through text-sm">{formatKRW(product.price)}</span>
                  <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs font-bold">
                    {product.discountRate}% OFF
                  </Badge>
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{formatKRW(discounted)}</p>
              </>
            ) : (
              <p className="text-3xl font-extrabold text-gray-900">{formatKRW(product.price)}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">적립 예정 포인트 {Math.floor(discounted * 0.01).toLocaleString()}P</p>
          </div>

          {/* Delivery info */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-start gap-3 text-sm">
              <Truck className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-gray-700">배송비 {formatKRW(product.shippingFee ?? 3000)}</span>
                <span className="text-gray-400 mx-1">|</span>
                <span className="text-gray-500">{formatKRW(product.freeShippingThreshold ?? 50000)} 이상 무료배송</span>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-gray-500">내일(수) 도착 예정</span>
            </div>
          </div>

          <Separator className="mb-5" />

          {/* Recommending Influencers (inline) */}
          {recommendingInfluencers.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommended by</p>
              <div className="flex items-center gap-2 flex-wrap">
                {recommendingInfluencers.map(
                  (inf) =>
                    inf && (
                      <Link
                        key={inf.id}
                        href={`/influencer/${inf.id}/`}
                        className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1.5 transition-colors"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={inf.avatar} alt={inf.name} className="h-5 w-5 rounded-full" />
                        <span className="text-xs font-medium text-indigo-700">{inf.name}</span>
                      </Link>
                    )
                )}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-700">수량</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                className="px-3 py-2.5 hover:bg-gray-50 rounded-l-lg transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onInput={(e) => handleQuantityChange((e.target as HTMLInputElement).value)}
                className="w-14 text-center text-sm border-x border-gray-300 py-2.5 outline-none font-medium"
              />
              <button
                className="px-3 py-2.5 hover:bg-gray-50 rounded-r-lg transition-colors"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">
              합계 <span className="font-bold text-gray-900 text-base">{formatKRW(discounted * quantity)}</span>
            </span>
          </div>

          {/* Stock status */}
          {product.status === "soldout" ? (
            <div className="bg-red-50 text-red-600 text-sm font-medium rounded-lg p-3 text-center mb-4">
              현재 품절된 상품입니다
            </div>
          ) : product.stock <= 10 ? (
            <p className="text-xs text-orange-500 font-medium mb-4">남은 수량 {product.stock}개 - 서두르세요!</p>
          ) : null}

          {/* Action buttons */}
          <div className="flex gap-2 mb-3">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-[#2563EB] text-[#2563EB] hover:bg-blue-50 h-12 text-base font-semibold"
              onClick={handleAddToCart}
              disabled={product.status === "soldout"}
            >
              <ShoppingCart className="h-5 w-5 mr-2" /> 장바구니
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 text-base font-semibold"
              onClick={handleBuyNow}
              disabled={product.status === "soldout"}
            >
              바로구매
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs ${wishlisted ? "text-red-500" : "text-gray-400"}`}
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 mr-1 ${wishlisted ? "fill-red-500" : ""}`} />
              {wishlisted ? "찜 해제" : "찜하기"}
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs text-gray-400" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" /> 공유하기
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Tabs: 상품설명 / 리뷰 / 배송교환 ─── */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-[#2563EB] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none"
          >
            상품설명
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-[#2563EB] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none"
          >
            리뷰 ({productReviews.length})
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium data-[state=active]:border-[#2563EB] data-[state=active]:text-[#2563EB] data-[state=active]:shadow-none"
          >
            배송/교환
          </TabsTrigger>
        </TabsList>

        {/* 상품설명 탭 */}
        <TabsContent value="description" className="mt-0">
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">상품 소개</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-gray-900">상품 정보</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">상품명</span>
                <span className="text-gray-900">{product.name}</span>
                <span className="text-gray-500">영문명</span>
                <span className="text-gray-900">{product.nameEn}</span>
                <span className="text-gray-500">카테고리</span>
                <span className="text-gray-900">{category?.name ?? "-"}</span>
                <span className="text-gray-500">판매사</span>
                <span className="text-gray-900">{vendor?.companyName ?? "-"}</span>
                <span className="text-gray-500">원산지</span>
                <span className="text-gray-900">{product.origin ?? "대한민국"}</span>
                {product.weight && (
                  <>
                    <span className="text-gray-500">중량/규격</span>
                    <span className="text-gray-900">{product.weight}</span>
                  </>
                )}
                <span className="text-gray-500">정가</span>
                <span className="text-gray-900">{formatKRW(product.price)}</span>
                {product.discountRate > 0 && (
                  <>
                    <span className="text-gray-500">할인율</span>
                    <span className="text-red-500 font-medium">{product.discountRate}%</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">주요 특징</h4>
              <ul className="space-y-2">
                {(product.features && product.features.length > 0 ? product.features : [
                  "한국에서 직접 생산한 정품 보장",
                  "해외 배송 가능 (인플루언서 추천 상품 우선 배송)",
                  "안전한 포장으로 파손 걱정 없이 배송",
                  "교환/환불 14일 이내 무료",
                ]).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* 리뷰 탭 */}
        <TabsContent value="reviews" id="product-reviews" className="mt-0">
          {/* Rating overview */}
          <div className="flex items-center gap-8 mb-6 p-5 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-gray-900">{avgRating}</p>
              <div className="flex items-center gap-0.5 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{productReviews.length}개 리뷰</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = productReviews.filter((r) => r.rating === star).length;
                const pct = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-6 text-right text-gray-500">{star}점</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-6 text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {productReviews.length === 0 ? (
            <p className="text-gray-400 text-sm py-12 text-center">아직 리뷰가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {productReviews.map((rev) => {
                const reviewer = consumers.find((u) => u.id === rev.userId);
                return (
                  <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-3.5 w-3.5 ${s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{reviewer?.name ?? "익명"}</span>
                      </div>
                      <span className="text-xs text-gray-400">{rev.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{rev.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* 배송/교환 탭 */}
        <TabsContent value="shipping" className="mt-0">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
              <Truck className="h-6 w-6 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">배송 안내</h4>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li>배송비: {formatKRW(product.shippingFee ?? 3000)} ({formatKRW(product.freeShippingThreshold ?? 50000)} 이상 무료배송)</li>
                  <li>배송 기간: 결제 완료 후 1~3일 (영업일 기준)</li>
                  <li>배송 방법: CJ대한통운 택배</li>
                  <li>도서산간 지역: 추가 배송비 발생 가능</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
              <RotateCcw className="h-6 w-6 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">교환/반품 안내</h4>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li>교환/반품 기간: 수령 후 14일 이내</li>
                  <li>교환/반품 배송비: 편도 3,000원 (고객 변심 시)</li>
                  <li>불량/오배송: 배송비 무료 (판매사 부담)</li>
                  <li>교환/반품 불가: 사용 흔적이 있는 경우, 포장 훼손 시</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
              <Shield className="h-6 w-6 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">안전 거래 안내</h4>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li>KWAVE는 통신판매중개자로서 거래의 안전을 보장합니다.</li>
                  <li>구매 확정 전까지 결제 금액이 안전하게 보호됩니다.</li>
                  <li>분쟁 발생 시 KWAVE 고객센터에서 중재를 도와드립니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Related Products ─── */}
      {relatedProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">함께 보면 좋은 상품</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
