'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, UploadCloud } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { useToast } from '@/lib/context';

const CATEGORIES = ['국어', '영어', '수학', '사회', '과학', '기타'];
const GRADES = ['고1', '고2', '고3'];

function NewProductInner() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    author: '',
    publisher: '에듀프레스',
    category: '국어',
    grade: '고3',
    price: '',
    discountRate: '0',
    stock: '100',
    description: '',
    isNew: true,
    isBest: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [String(key)]: '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = '상품명을 입력해주세요.';
    if (!form.author.trim()) next.author = '저자를 입력해주세요.';
    if (!form.price.trim()) next.price = '가격을 입력해주세요.';
    else if (Number(form.price) <= 0) next.price = '가격은 0보다 커야 합니다.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      showToast('입력값을 확인해주세요.', 'error');
      return;
    }
    showToast(`"${form.title}" 상품이 등록되었습니다. (Mock)`);
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

      <h1 className="text-2xl font-bold text-gray-900 mb-6">상품 등록</h1>

      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold text-gray-600">
              상품명 <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-gray-600">
              저자 <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={form.author}
              onChange={e => update('author', e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
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
            <span className="text-xs font-semibold text-gray-600">
              정가 (원) <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={e => update('price', e.target.value.replace(/\D/g, ''))}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
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
            서식(제목/굵게/기울임/리스트/링크/이미지)을 적용할 수 있으며, 등록한 내용은 사용자 상품 상세 페이지에 그대로 표시됩니다.
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

        <div className="border-t border-dashed border-gray-300 rounded-md p-6 text-center text-sm text-gray-500">
          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p>이미지 업로드 (Mock, 실서비스에서는 Cloudflare R2로 연동)</p>
          <button
            type="button"
            onClick={() => showToast('이미지 업로드 플로우 (Mock)', 'info')}
            className="mt-2 px-3 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50"
          >
            파일 선택
          </button>
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
            className="px-4 py-2 bg-[#1B2A4A] text-white text-sm rounded-md hover:bg-[#2D4A7A]"
          >
            등록하기
          </button>
        </div>
      </form>
    </>
  );
}

export default function NewProductPage() {
  return (
    <AdminLayout>
      <NewProductInner />
    </AdminLayout>
  );
}
