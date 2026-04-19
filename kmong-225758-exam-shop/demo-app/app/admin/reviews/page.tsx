'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Check, Trash2, Star } from 'lucide-react';
import { reviews as baseReviews, products } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/lib/context';

type Status = '대기' | '승인' | '숨김';

function AdminReviewsInner() {
  const { showToast } = useToast();
  const [statuses, setStatuses] = useState<Record<number, Status>>(
    () => Object.fromEntries(baseReviews.map(r => [r.id, '승인' as Status]))
  );
  const [filter, setFilter] = useState<'전체' | Status>('전체');
  const [reviews, setReviews] = useState(baseReviews);

  const list = useMemo(() => {
    return reviews
      .filter(r => filter === '전체' || statuses[r.id] === filter)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [reviews, statuses, filter]);

  const remove = (id: number) => {
    if (!confirm('이 후기를 삭제하시겠습니까?')) return;
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('후기가 삭제되었습니다.', 'info');
  };

  const setStatus = (id: number, s: Status) => {
    setStatuses(prev => ({ ...prev, [id]: s }));
    showToast(`후기 상태 "${s}"로 변경됨`, 'info');
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">후기 관리</h1>
        <p className="text-xs text-gray-500 mt-1">전체 {reviews.length}개 후기</p>
      </div>

      <div className="flex gap-2 mb-4">
        {(['전체', '대기', '승인', '숨김'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              filter === s
                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map(r => {
          const product = products.find(p => p.id === r.productId);
          const status = statuses[r.id];
          return (
            <article
              key={r.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 min-w-0">
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
                  <span className="text-[11px] text-gray-400">{formatDate(r.createdAt)}</span>
                  <span
                    className={`ml-auto px-1.5 py-0.5 text-[10px] rounded ${
                      status === '승인'
                        ? 'bg-green-100 text-green-700'
                        : status === '숨김'
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{r.content}</p>
                {product && (
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-2 text-xs text-[#1B2A4A] hover:underline block"
                  >
                    📘 {product.title}
                  </Link>
                )}
              </div>
              <div className="flex md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => setStatus(r.id, status === '승인' ? '숨김' : '승인')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-xs rounded-md hover:bg-gray-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  {status === '승인' ? '숨김 처리' : '승인'}
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-xs text-red-500 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default function AdminReviewsPage() {
  return (
    <AdminLayout>
      <AdminReviewsInner />
    </AdminLayout>
  );
}
