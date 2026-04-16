'use client';

import { useState } from 'react';
import { popups, type Popup } from '@/data/popups';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { useToast } from '@/contexts/ToastContext';

export default function AdminPopupsPage() {
  const { showToast } = useToast();
  const [popupList, setPopupList] = useState<Popup[]>(popups);
  const [showForm, setShowForm] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [previewPopup, setPreviewPopup] = useState<Popup | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');

  const openAdd = () => {
    setEditingPopup(null);
    setFormTitle('');
    setFormContent('');
    setFormLinkUrl('');
    setFormStartDate('');
    setFormEndDate('');
    setShowForm(true);
  };

  const openEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormTitle(popup.title);
    setFormContent(popup.content);
    setFormLinkUrl(popup.linkUrl);
    setFormStartDate(popup.startDate);
    setFormEndDate(popup.endDate);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      showToast('제목을 입력해주세요.', 'warning');
      return;
    }
    if (editingPopup) {
      setPopupList(prev => prev.map(p =>
        p.id === editingPopup.id ? {
          ...p,
          title: formTitle,
          content: formContent,
          linkUrl: formLinkUrl,
          startDate: formStartDate,
          endDate: formEndDate,
        } : p
      ));
      showToast('팝업이 수정되었습니다.', 'success');
    } else {
      const newPopup: Popup = {
        id: `POP${String(popupList.length + 1).padStart(3, '0')}`,
        title: formTitle,
        content: formContent,
        imageUrl: '',
        linkUrl: formLinkUrl,
        position: 'center',
        width: 500,
        height: 400,
        status: 'scheduled',
        startDate: formStartDate,
        endDate: formEndDate,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPopupList(prev => [...prev, newPopup]);
      showToast('팝업이 추가되었습니다.', 'success');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setPopupList(prev => prev.filter(p => p.id !== id));
    showToast('팝업이 삭제되었습니다.', 'info');
  };

  const popupStatusMap: Record<string, { label: string; className: string }> = {
    active: { label: '활성', className: 'bg-green-100 text-green-800' },
    scheduled: { label: '예약', className: 'bg-blue-100 text-blue-800' },
    ended: { label: '종료', className: 'bg-gray-100 text-gray-600' },
  };

  return (
    <div id="admin-popups">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">팝업관리</h1>
        <button onClick={openAdd} className="btn-secondary">+ 팝업 추가</button>
      </div>

      {/* Popup list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popupList.map(popup => {
          const status = popupStatusMap[popup.status];
          return (
            <div key={popup.id} className="card overflow-hidden">
              {/* Preview image */}
              <div className="h-40 bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white p-4">
                <div className="text-center">
                  <p className="font-bold">{popup.title}</p>
                  <p className="text-xs text-white/70 mt-1 line-clamp-2">{popup.content}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm truncate">{popup.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-3">
                  {popup.startDate} ~ {popup.endDate}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPreviewPopup(popup)} className="btn-outline text-xs !py-1 !px-2 flex-1">
                    미리보기
                  </button>
                  <button onClick={() => openEdit(popup)} className="btn-outline text-xs !py-1 !px-2 flex-1">
                    수정
                  </button>
                  <button onClick={() => handleDelete(popup.id)} className="text-xs text-error hover:underline cursor-pointer px-2">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit form modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingPopup ? '팝업 수정' : '팝업 추가'}>
        <div className="space-y-4">
          <div>
            <label className="label-field">제목 <span className="text-error">*</span></label>
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="input-field" placeholder="팝업 제목" />
          </div>
          <div>
            <label className="label-field">내용</label>
            <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} className="input-field h-24 resize-none" placeholder="팝업 내용" />
          </div>
          <div>
            <label className="label-field">링크 URL</label>
            <input value={formLinkUrl} onChange={(e) => setFormLinkUrl(e.target.value)} className="input-field" placeholder="/products" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">시작일</label>
              <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label-field">종료일</label>
              <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
            <button onClick={() => setShowForm(false)} className="btn-outline">취소</button>
            <button onClick={handleSave} className="btn-primary">저장</button>
          </div>
        </div>
      </Modal>

      {/* Preview modal */}
      <Modal isOpen={!!previewPopup} onClose={() => setPreviewPopup(null)} title="팝업 미리보기">
        {previewPopup && (
          <div className="text-center">
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 rounded-lg mb-4">
              <h3 className="text-xl font-bold mb-2">{previewPopup.title}</h3>
              <p className="text-white/80 text-sm">{previewPopup.content}</p>
            </div>
            <div className="flex border-t border-neutral-200">
              <button className="flex-1 py-2 text-sm text-neutral-400 cursor-pointer">오늘 하루 보지 않기</button>
              <div className="w-px bg-neutral-200" />
              <button onClick={() => setPreviewPopup(null)} className="flex-1 py-2 text-sm text-primary font-medium cursor-pointer">닫기</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
