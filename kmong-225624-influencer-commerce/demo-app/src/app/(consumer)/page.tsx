"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, ChevronLeft, ChevronRight, User } from "lucide-react";
import { products, categories, influencers, getCategory } from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [scrollPos, setScrollPos] = useState(0);

  const categoryProducts = products.filter((p) => p.categoryId === activeCategory && p.status === "active").slice(0, 4);
  const popularProducts = [...products].filter((p) => p.status === "active").sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);

  return (
    <div id="page-home">
      {/* Hero Banner */}
      <section id="home-hero" className="relative bg-gradient-to-br from-[#2563EB] via-[#3b82f6] to-[#60a5fa] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Discover Korea<br className="sm:hidden" /> Through Influencers
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            미국 인플루언서가 직접 큐레이션한 한국의 베스트 상품을 만나보세요.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-[#2563EB] hover:bg-blue-50 font-semibold"
              onClick={() => router.push("/products/")}
            >
              쇼핑하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-white/10 hover:bg-white/20"
              onClick={() => {
                document.getElementById("home-influencers")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              인플루언서 보기
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Popular Influencer PICK */}
      <section id="home-influencers" className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">인기 인플루언서 PICK</h2>
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {influencers.map((inf) => (
              <Link
                key={inf.id}
                href={`/influencer/${inf.id}/`}
                className="snap-start shrink-0 w-32 sm:w-36"
              >
                <Card className="h-full border border-gray-200 hover:shadow-md transition-shadow text-center">
                  <CardContent className="p-4 flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={inf.avatar}
                      alt={inf.name}
                      className="h-16 w-16 rounded-full border-2 border-[#2563EB] mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className = "h-16 w-16 rounded-full border-2 border-[#2563EB] mb-2 bg-gray-200 flex items-center justify-center";
                        fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                        (e.target as HTMLImageElement).parentNode?.insertBefore(fallback, e.target as HTMLImageElement);
                      }}
                    />
                    <p className="text-sm font-semibold text-gray-900 truncate w-full">{inf.name}</p>
                    <p className="text-xs text-gray-500">{(inf.followers / 1000).toFixed(0)}K followers</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">진행 중인 프로모션</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { code: "SARAH15", desc: "Sarah Johnson 추천 상품 15% 할인", bg: "from-indigo-500 to-purple-600" },
            { code: "WELCOME2026", desc: "신규 가입 회원 10% 할인", bg: "from-blue-500 to-cyan-500" },
            { code: "SPRING30", desc: "봄 맞이 특별 할인 30%", bg: "from-pink-500 to-rose-500" },
          ].map((promo) => (
            <div key={promo.code} className={`shrink-0 w-72 sm:w-80 rounded-xl bg-gradient-to-r ${promo.bg} p-5 text-white`}>
              <p className="text-xs font-medium opacity-80 mb-1">프로모션 코드</p>
              <p className="text-xl font-extrabold mb-2">{promo.code}</p>
              <p className="text-sm opacity-90">{promo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Recommendations */}
      <section className="bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">카테고리별 추천 상품</h2>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === c.id
                    ? "bg-[#2563EB] text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {categoryProducts.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400 mb-4">해당 카테고리에 상품이 없습니다.</p>
                <Button
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
                  onClick={() => router.push("/products/")}
                >
                  전체 상품 보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section id="home-products" className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">인기 상품</h2>
          <Link href="/products/" className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
            전체보기 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
