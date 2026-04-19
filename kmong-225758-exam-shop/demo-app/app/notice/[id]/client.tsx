'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { notices } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export default function NoticeDetailClient({ id }: { id: string }) {
  const notice = notices.find(n => String(n.id) === id);
  if (!notice) return notFound();

  const sorted = [...notices].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const idx = sorted.findIndex(n => n.id === notice.id);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/notice"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B2A4A] mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        공지사항 목록
      </Link>

      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <header className="px-6 py-5 border-b border-gray-200">
          <span
            className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mb-3 ${
              notice.category === '이벤트'
                ? 'bg-[#E8653A]/10 text-[#E8653A]'
                : notice.category === '안내'
                ? 'bg-green-100 text-green-700'
                : 'bg-[#1B2A4A]/10 text-[#1B2A4A]'
            }`}
          >
            {notice.category}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{notice.title}</h1>
          <p className="text-xs text-gray-500 mt-2">작성일 {formatDate(notice.createdAt)}</p>
        </header>

        <div
          className="rich-content px-6 py-6 text-sm text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: /<[a-z][\s\S]*>/i.test(notice.content)
              ? notice.content
              : notice.content
                  .split(/\n{2,}/)
                  .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                  .join(''),
          }}
        />
      </article>

      <div className="flex gap-2 mt-4">
        {prev && (
          <Link
            href={`/notice/${prev.id}`}
            className="flex-1 p-3 border border-gray-200 rounded-md text-xs hover:bg-gray-50"
          >
            <span className="text-gray-400">← 이전 글</span>
            <p className="text-gray-800 line-clamp-1 mt-0.5">{prev.title}</p>
          </Link>
        )}
        {next && (
          <Link
            href={`/notice/${next.id}`}
            className="flex-1 p-3 border border-gray-200 rounded-md text-xs hover:bg-gray-50 text-right"
          >
            <span className="text-gray-400">다음 글 →</span>
            <p className="text-gray-800 line-clamp-1 mt-0.5">{next.title}</p>
          </Link>
        )}
      </div>
    </div>
  );
}
