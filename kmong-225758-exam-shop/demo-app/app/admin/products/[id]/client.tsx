'use client';

import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { products } from '@/lib/data';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { useToast } from '@/lib/context';

const CATEGORIES = ['국어', '영어', '수학', '사회', '과학', '기타'];
const GRADES = ['고1', '고2', '고3'];

function EditInner({ id }: { id: string }) {
  const product = products.find(p => String(p.id) === id);
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState(() => ({
    title: product?.title ?? '',
    author: product?.author ?? '',
    publisher: product?.publisher ?? '',
    category: product?.category ?? '국어',
    grade: product?.grade ?? '고3',
    price: String(product?.price ?? 0),
    discountRate: String(product?.discountRate ?? 0),
    stock: String(product?.stock ?? 0),
    description: product?.description ?? '',
    isNew: product?.isNew ?? false,
    isBest: product?.isBest ?? false,
  }));

  if (!product) return notFound();

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`"${form.title}" 상품 정보가 저장되었습니다. (Mock)`);
    setTimeout(() => router.push('/admin/products'), 300);
  };

  return (
    <>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B2A4A] mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        상품 목록
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품 수정</h1>
          <p className="text-xs text-gray-500 mt-1">ID #{product.id}</p>
        </div>
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 text-xs text-[#1B2A4A] hover:underline"
          target="_blank"
        >
          사용자 페이지 보기 <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <form onSubmit={save} className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-gray-600">상품명</span>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">저자</span>
            <input
              type="text"
              value={form.author}
              onChange={e => update('author', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">출판사</span>
            <input
              type="text"
              value={form.publisher}
              onChange={e => update('publisher', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">과목</span>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="demo-select mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">학년</span>
            <select
              value={form.grade}
              onChange={e => update('grade', e.target.value)}
              className="demo-select mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {GRADES.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">정가</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={e => update('price', e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">할인율 (%)</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.discountRate}
              onChange={e => update('discountRate', e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">재고</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.stock}
              onChange={e => update('stock', e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
          </label>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-600">상세 설명</span>
          <p className="text-[11px] text-gray-500 mt-0.5 mb-1">
            기존 내용을 유지하거나 서식을 새로 적용해 보세요. 저장 시 사용자 상품 상세 페이지에 반영됩니다.
          </p>
          <RichTextEditor
            value={form.description}
            onChange={v => update('description', v)}
            placeholder="제품 구성, 수록 회차, 난이도, 학습 포인트, 해설 특징 등을 상세히 작성하세요."
            minHeight={220}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={e => update('isNew', e.target.checked)}
              className="w-4 h-4 accent-[#1B2A4A]"
            />
            NEW 뱃지
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isBest}
              onChange={e => update('isBest', e.target.checked)}
              className="w-4 h-4 accent-[#1B2A4A]"
            />
            BEST 뱃지
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-[#E8653A] text-white text-sm rounded-md hover:bg-[#d35529]"
          >
            저장
          </button>
        </div>
      </form>
    </>
  );
}

export default function AdminProductEditClient({ id }: { id: string }) {
  return (
    <AdminLayout>
      <EditInner id={id} />
    </AdminLayout>
  );
}
