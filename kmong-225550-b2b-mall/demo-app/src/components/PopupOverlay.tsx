'use client';

import { useState, useEffect } from 'react';
import { popups } from '@/data/popups';

export default function PopupOverlay() {
  const [visible, setVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(popups.find(p => p.status === 'active'));

  useEffect(() => {
    if (!currentPopup) return;
    const dismissed = localStorage.getItem(`popup-dismissed-${currentPopup.id}`);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      if (
        dismissedDate.getFullYear() === now.getFullYear() &&
        dismissedDate.getMonth() === now.getMonth() &&
        dismissedDate.getDate() === now.getDate()
      ) {
        return; // Already dismissed today
      }
    }
    setVisible(true);
  }, [currentPopup]);

  if (!visible || !currentPopup) return null;

  const handleDismissToday = () => {
    localStorage.setItem(`popup-dismissed-${currentPopup.id}`, new Date().toISOString());
    setVisible(false);
  };

  return (
    <div id="popup-overlay" className="fixed inset-0 z-[900] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => setVisible(false)} />
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden" style={{ maxWidth: currentPopup.width }}>
        {/* Popup image placeholder */}
        <div
          className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white"
          style={{ height: 250 }}
        >
          <div className="text-center px-8">
            <div className="text-2xl font-bold mb-2">{currentPopup.title}</div>
            <p className="text-white/80 text-sm">{currentPopup.content}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex border-t border-neutral-200">
          <button
            onClick={handleDismissToday}
            className="flex-1 py-3 text-sm text-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            오늘 하루 보지 않기
          </button>
          <div className="w-px bg-neutral-200" />
          <button
            onClick={() => setVisible(false)}
            className="flex-1 py-3 text-sm text-primary font-medium hover:bg-primary/5 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
