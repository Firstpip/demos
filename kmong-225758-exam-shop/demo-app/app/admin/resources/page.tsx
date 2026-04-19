'use client';

import { useState } from 'react';
import { UploadCloud, Trash2, Download } from 'lucide-react';
import { resources as baseResources } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/lib/context';

function AdminResourcesInner() {
  const { showToast } = useToast();
  const [resources, setResources] = useState(baseResources);

  const remove = (id: number, title: string) => {
    if (!confirm(`"${title}" 자료를 삭제하시겠습니까?`)) return;
    setResources(prev => prev.filter(r => r.id !== id));
    showToast('자료가 삭제되었습니다.', 'info');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">자료실 관리</h1>
          <p className="text-xs text-gray-500 mt-1">전체 {resources.length}개 자료</p>
        </div>
        <button
          onClick={() => showToast('파일 업로드 플로우 (Mock, 실제로는 Cloudflare R2 연동)', 'info')}
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#1B2A4A] text-white text-sm rounded-md hover:bg-[#2D4A7A]"
        >
          <UploadCloud className="w-4 h-4" />
          자료 업로드
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-3 py-3 text-left">자료명</th>
                <th className="px-3 py-3 text-left hidden md:table-cell">관련 교재</th>
                <th className="px-3 py-3 text-center">형식</th>
                <th className="px-3 py-3 text-center hidden sm:table-cell">크기</th>
                <th className="px-3 py-3 text-center">다운로드</th>
                <th className="px-3 py-3 text-center hidden md:table-cell">등록일</th>
                <th className="px-3 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resources.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-900 font-medium">{r.title}</td>
                  <td className="px-3 py-3 text-xs text-gray-600 hidden md:table-cell max-w-xs line-clamp-1">
                    {r.productTitle}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded">
                      {r.fileType}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-500 hidden sm:table-cell">
                    {r.fileSize}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-600">
                    {r.downloadCount.toLocaleString('ko-KR')}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-500 hidden md:table-cell">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => showToast(`${r.title} 다운로드 (Mock)`, 'info')}
                        className="p-1.5 text-gray-500 hover:text-[#1B2A4A]"
                        aria-label="다운로드"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(r.id, r.title)}
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

export default function AdminResourcesPage() {
  return (
    <AdminLayout>
      <AdminResourcesInner />
    </AdminLayout>
  );
}
