'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products, categoryInfo } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

const SUBJECTS = ['전체', '국어', '영어', '수학', '사회', '과학', '기타'] as const;
const GRADES = ['전체', '고1', '고2', '고3'] as const;
const SORTS = [
  { value: 'popular', label: '인기순' },
  { value: 'new', label: '최신순' },
  { value: 'priceAsc', label: '낮은 가격순' },
  { value: 'priceDesc', label: '높은 가격순' },
  { value: 'discount', label: '할인율순' },
] as const;
const PAGE_SIZE = 12;

function ProductsListInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') ?? '전체';
  const grade = searchParams.get('grade') ?? '전체';
  const sort = searchParams.get('sort') ?? 'popular';
  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const [searchInput, setSearchInput] = useState(search);

  const updateQuery = (patch: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === '전체') {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });
    if (!('page' in patch)) params.delete('page');
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== '전체') list = list.filter(p => p.category === category);
    if (grade !== '전체') list = list.filter(p => p.grade === grade);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case 'new':
        list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case 'priceAsc':
        list.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'discount':
        list.sort((a, b) => b.discountRate - a.discountRate);
        break;
      default:
        list.sort((a, b) => b.soldCount - a.soldCount);
    }
    return list;
  }, [category, grade, sort, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const submitSearch = () => {
    updateQuery({ search: searchInput });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">전체 교재</h1>
      <p className="text-sm text-gray-500 mb-6">
        총 <span className="font-semibold text-[#1B2A4A]">{filtered.length}</span>권의 교재
      </p>

      <section id="product-filters" className="bg-white rounded-lg border border-gray-200 p-4 md:p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-800">
          <SlidersHorizontal className="w-4 h-4" />
          과목별
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {SUBJECTS.map(s => (
            <button
              key={s}
              onClick={() => updateQuery({ category: s })}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                category === s
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
              }`}
            >
              {s === '전체' ? s : `${categoryInfo[s]?.icon ?? ''} ${s}`}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">학년</span>
            {GRADES.map(g => (
              <button
                key={g}
                onClick={() => updateQuery({ grade: g })}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  grade === g
                    ? 'bg-[#E8653A] text-white border-[#E8653A]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#E8653A]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="sort-select" className="text-xs font-semibold text-gray-600">
              정렬
            </label>
            <select
              id="sort-select"
              className="demo-select text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-800"
              value={sort}
              onChange={e => updateQuery({ sort: e.target.value })}
            >
              {SORTS.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative mt-4">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitSearch()}
            placeholder="교재명, 저자, 과목으로 검색..."
            className="w-full px-4 py-2.5 pr-20 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A]"
          />
          <button
            onClick={submitSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 bg-[#1B2A4A] text-white text-xs rounded-md hover:bg-[#2D4A7A]"
          >
            <Search className="w-3.5 h-3.5" />
            검색
          </button>
        </div>
      </section>

      {current.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 py-20 text-center">
          <p className="text-gray-500 text-sm">조건에 맞는 교재가 없습니다.</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 text-sm text-[#1B2A4A] hover:text-[#E8653A]"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <section id="product-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {current.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <nav id="product-pagination" className="flex items-center justify-center gap-1 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                onClick={() => updateQuery({ page: n })}
                className={`min-w-9 h-9 px-2 text-sm rounded-md border transition-colors ${
                  page === n
                    ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
                }`}
              >
                {n}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8">불러오는 중...</div>}>
      <ProductsListInner />
    </Suspense>
  );
}
