"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/product-card";
import { products, categories, getDiscountedPrice } from "@/lib/data";

type SortKey = "popular" | "newest" | "price_asc" | "discount";

const sortLabels: Record<SortKey, string> = {
  popular: "인기순",
  newest: "최신순",
  price_asc: "가격 낮은순",
  discount: "할인율순",
};

export function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const initialQuery = searchParams.get("q") ?? "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortKey, setSortKey] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status === "active");

    if (activeCategory !== "all") {
      list = list.filter((p) => p.categoryId === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortKey) {
      case "popular":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
        list = [...list].sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "price_asc":
        list = [...list].sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
        break;
      case "discount":
        list = [...list].sort((a, b) => b.discountRate - a.discountRate);
        break;
    }

    return list;
  }, [activeCategory, searchQuery, sortKey]);

  return (
    <div id="page-products" className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">상품 목록</h1>

      {/* Filters */}
      <div id="product-filter" className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-[#2563EB] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            전체
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === c.id
                  ? "bg-[#2563EB] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Sort */}
      <div id="product-search" className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="상품명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
          <SelectTrigger className="w-40">
            <SelectValue>{sortLabels[sortKey]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">인기순</SelectItem>
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="price_asc">가격 낮은순</SelectItem>
            <SelectItem value="discount">할인율순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product grid */}
      <div id="product-list" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">검색 결과가 없습니다.</p>
          <p className="text-sm mt-1">다른 검색어를 입력해보세요.</p>
        </div>
      )}
    </div>
  );
}
