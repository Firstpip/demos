'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { reviews as baseReviews, products, users } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { useAuth, useToast } from '@/lib/context';
import AuthGuard from '@/components/AuthGuard';

function MyReviewsInner() {
  const { userName } = useAuth();
  const { showToast } = useToast();
  const me = users.find(u => u.name === userName) ?? users[0];
  const [list, setList] = useState(baseReviews.filter(r => r.userName === userName || r.userId === me.id));

  const remove = (id: number) => {
    setList(prev => prev.filter(r => r.id !== id));
    showToast('후기가 삭제되었습니다.', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4">
        <Link href="/mypage" className="hover:text-[#1B2A4A]">마이페이지</Link> &nbsp;›&nbsp;
        <span className="text-gray-700">내 후기</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">내 후기</h1>
      <p className="text-sm text-gray-500 mb-6">
        작성한 후기 <span className="font-semibold text-[#1B2A4A]">{list.length}</span>개
      </p>

      {list.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center text-sm text-gray-500">
          작성한 후기가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(r => {
            const product = products.find(p => p.id === r.productId);
            return (
              <article key={r.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">{formatDate(r.createdAt)}</span>
                    </div>
                    {product && (
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm font-semibold text-[#1B2A4A] hover:underline mt-1 block"
                      >
                        {product.title}
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => remove(r.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    aria-label="후기 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{r.content}</p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyReviewsPage() {
  return (
    <AuthGuard type="loggedIn">
      <MyReviewsInner />
    </AuthGuard>
  );
}
