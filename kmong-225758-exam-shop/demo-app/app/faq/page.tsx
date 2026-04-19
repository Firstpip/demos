'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqData } from '@/lib/data';

export default function FaqPage() {
  const [openId, setOpenId] = useState<number | null>(faqData[0]?.id ?? null);
  const [search, setSearch] = useState('');

  const list = faqData.filter(f => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">자주 묻는 질문</h1>
      <p className="text-sm text-gray-500 mb-6">자주 묻는 질문을 모았습니다. 원하는 답이 없다면 고객센터로 연락주세요.</p>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="궁금한 내용을 검색해보세요"
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1B2A4A] mb-5"
      />

      <div className="space-y-2">
        {list.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-lg">
            검색 결과가 없습니다.
          </div>
        ) : (
          list.map(f => {
            const open = openId === f.id;
            return (
              <div
                key={f.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#E8653A] font-bold">Q.</span>
                    <span className="text-sm font-semibold text-gray-900">{f.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-4 pl-12 pr-5 text-sm text-gray-700 leading-relaxed whitespace-pre-line border-t border-gray-100 pt-4">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-8 p-5 bg-[#1B2A4A] text-white rounded-lg text-sm">
        <p className="font-semibold mb-1">더 궁금한 점이 있으신가요?</p>
        <p className="text-white/70 text-xs mb-3">고객센터에서 빠르게 답변해 드립니다.</p>
        <p>📞 02-1234-5678 (평일 09:00~18:00) / ✉ cs@edupress.co.kr</p>
      </div>
    </div>
  );
}
