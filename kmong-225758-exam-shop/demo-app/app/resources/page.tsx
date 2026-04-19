'use client';

import { useMemo, useState } from 'react';
import { Download, FileText, Archive, File, Search } from 'lucide-react';
import Link from 'next/link';
import { resources } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/lib/context';

const FILE_ICON: Record<string, React.ElementType> = {
  PDF: FileText,
  HWP: File,
  ZIP: Archive,
};

const TYPES = ['전체', 'PDF', 'HWP', 'ZIP'] as const;

export default function ResourcesPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<(typeof TYPES)[number]>('전체');

  const filtered = useMemo(() => {
    return resources
      .filter(r => type === '전체' || r.fileType === type)
      .filter(r => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.productTitle.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [search, type]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">자료실</h1>
      <p className="text-sm text-gray-500 mb-6">
        교재별 정오표, 듣기 음성 파일, 보충 해설 등 학습 자료를 다운로드하세요.
      </p>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                type === t
                  ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B2A4A]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="자료명 또는 교재명으로 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1B2A4A]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center text-sm text-gray-500">
          조건에 맞는 자료가 없습니다.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">자료명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">관련 교재</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 hidden sm:table-cell">크기</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 hidden sm:table-cell">다운로드</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 hidden md:table-cell">등록일</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">받기</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => {
                const Icon = FILE_ICON[r.fileType] ?? File;
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#1B2A4A]/10 text-[#1B2A4A]">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{r.title}</p>
                          <p className="text-xs text-gray-500 md:hidden">
                            {r.productTitle} · {r.fileSize}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      <Link
                        href={`/products/${r.productId}`}
                        className="text-xs hover:text-[#1B2A4A] line-clamp-1"
                      >
                        {r.productTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500 hidden sm:table-cell">
                      {r.fileSize}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500 hidden sm:table-cell">
                      {r.downloadCount.toLocaleString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500 hidden md:table-cell">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => showToast(`${r.title} 다운로드 시작 (Mock)`, 'info')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1B2A4A] text-white text-xs rounded-md hover:bg-[#2D4A7A]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        받기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
