'use client';

import Link from 'next/link';
import { useState } from 'react';
import { notices } from '@/lib/data';
import { formatDate } from '@/lib/utils';

const CATEGORIES = ['전체', '공지', '이벤트', '안내'] as const;

export default function NoticePage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('전체');

  const list = [...notices]
    .filter(n => category === '전체' || n.category === category)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
      <p className="text-sm text-gray-500 mb-6">에듀프레스의 새 소식을 확인하세요.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              category === c
                ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {list.length === 0 ? (
          <p className="p-16 text-center text-sm text-gray-500">등록된 공지가 없습니다.</p>
        ) : (
          list.map(n => (
            <Link
              key={n.id}
              href={`/notice/${n.id}`}
              className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                  n.category === '이벤트'
                    ? 'bg-[#E8653A]/10 text-[#E8653A]'
                    : n.category === '안내'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[#1B2A4A]/10 text-[#1B2A4A]'
                }`}
              >
                {n.category}
              </span>
              <p className="flex-1 text-sm text-gray-900 line-clamp-1">{n.title}</p>
              <span className="text-xs text-gray-400 shrink-0">{formatDate(n.createdAt)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
