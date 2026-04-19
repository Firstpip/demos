'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { products as baseProducts } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/lib/context';

const CATEGORIES = ['전체', '국어', '영어', '수학', '사회', '과학', '기타'] as const;

function AdminProductsInner() {
  const { showToast } = useToast();
  const [products, setProducts] = useState(baseProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('전체');

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (category !== '전체' && p.category !== category) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    });
  }, [products, category, search]);

  const remove = (id: number, title: string) => {
    if (!confirm(`"${title}" 상품을 삭제하시겠습니까?`)) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('상품이 삭제되었습니다.', 'info');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
          <p className="text-xs text-gray-500 mt-1">전체 {products.length}개 · 필터링 {filtered.length}개</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#1B2A4A] text-white text-sm rounded-md hover:bg-[#2D4A7A]"
        >
          <Plus className="w-4 h-4" />
          상품 등록
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                category === c
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-64">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="상품명/저자 검색"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-3 py-3 text-left">ID</th>
                <th className="px-3 py-3 text-left">상품명</th>
                <th className="px-3 py-3 text-center">과목</th>
                <th className="px-3 py-3 text-center hidden md:table-cell">학년</th>
                <th className="px-3 py-3 text-right">판매가</th>
                <th className="px-3 py-3 text-center">재고</th>
                <th className="px-3 py-3 text-center">상태</th>
                <th className="px-3 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-xs text-gray-500">{p.id}</td>
                  <td className="px-3 py-3">
                    <Link href={`/admin/products/${p.id}`} className="hover:text-[#1B2A4A] line-clamp-1">
                      {p.title}
                    </Link>
                    <p className="text-[11px] text-gray-500 mt-0.5">{p.author}</p>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-700">{p.category}</td>
                  <td className="px-3 py-3 text-center text-xs text-gray-700 hidden md:table-cell">{p.grade}</td>
                  <td className="px-3 py-3 text-right text-xs font-semibold">{formatPrice(p.salePrice)}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded ${
                        p.stock < 100
                          ? 'bg-red-100 text-red-700'
                          : p.stock < 200
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {p.isBest && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-yellow-100 text-yellow-800 rounded mr-0.5">
                        BEST
                      </span>
                    )}
                    {p.isNew && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-orange-100 text-orange-800 rounded">
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 text-gray-500 hover:text-[#1B2A4A]"
                        aria-label="수정"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => remove(p.id, p.title)}
                        className="p-1.5 text-gray-500 hover:text-red-500"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminLayout>
      <AdminProductsInner />
    </AdminLayout>
  );
}
