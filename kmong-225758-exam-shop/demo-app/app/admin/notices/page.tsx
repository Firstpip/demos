'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { notices as baseNotices, Notice } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { useToast } from '@/lib/context';

const CATEGORIES = ['공지', '이벤트', '안내'];

function AdminNoticesInner() {
  const { showToast } = useToast();
  const [notices, setNotices] = useState<Notice[]>(baseNotices);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: '공지' });
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const startCreate = () => {
    setForm({ title: '', content: '', category: '공지' });
    setErrors({});
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (n: Notice) => {
    setForm({ title: n.title, content: n.content, category: n.category });
    setErrors({});
    setEditing(n);
    setCreating(false);
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = '제목을 입력해주세요.';
    if (!form.content.trim()) next.content = '내용을 입력해주세요.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (creating) {
      const id = Math.max(0, ...notices.map(n => n.id)) + 1;
      setNotices(prev => [
        { id, ...form, createdAt: new Date().toISOString().slice(0, 10) },
        ...prev,
      ]);
      showToast('공지가 등록되었습니다.');
    } else if (editing) {
      setNotices(prev =>
        prev.map(n => (n.id === editing.id ? { ...n, ...form } : n))
      );
      showToast('공지가 수정되었습니다.');
    }
    close();
  };

  const remove = (id: number) => {
    if (!confirm('이 공지를 삭제하시겠습니까?')) return;
    setNotices(prev => prev.filter(n => n.id !== id));
    showToast('공지가 삭제되었습니다.', 'info');
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">공지 관리</h1>
          <p className="text-xs text-gray-500 mt-1">전체 {notices.length}건</p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#1B2A4A] text-white text-sm rounded-md hover:bg-[#2D4A7A]"
        >
          <Plus className="w-4 h-4" />
          공지 등록
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {notices.map(n => (
          <div key={n.id} className="flex items-center gap-3 p-4">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                n.category === '이벤트'
                  ? 'bg-[#E8653A]/10 text-[#E8653A]'
                  : n.category === '안내'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-[#1B2A4A]/10 text-[#1B2A4A]'
              }`}
            >
              {n.category}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{n.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(n.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={`/notice/${n.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-500 hover:text-[#1B2A4A]"
                aria-label="보기"
              >
                <Eye className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => startEdit(n)}
                className="p-1.5 text-gray-500 hover:text-[#1B2A4A]"
                aria-label="수정"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => remove(n.id)}
                className="p-1.5 text-gray-500 hover:text-red-500"
                aria-label="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <form
            onSubmit={save}
            className="bg-white rounded-lg w-full max-w-lg p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {creating ? '공지 등록' : '공지 수정'}
            </h2>

            <label className="block">
              <span className="text-xs font-semibold text-gray-600">카테고리</span>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
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
              <span className="text-xs font-semibold text-gray-600">
                제목 <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </label>

            <div>
              <span className="text-xs font-semibold text-gray-600">
                내용 <span className="text-red-500">*</span>
              </span>
              <div className="mt-1">
                <RichTextEditor
                  value={form.content}
                  onChange={v => setForm(f => ({ ...f, content: v }))}
                  placeholder="공지 본문을 입력하세요. 서식과 링크·이미지를 사용할 수 있습니다."
                  minHeight={200}
                />
              </div>
              {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1B2A4A] text-white text-sm rounded-md hover:bg-[#2D4A7A]"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default function AdminNoticesPage() {
  return (
    <AdminLayout>
      <AdminNoticesInner />
    </AdminLayout>
  );
}
