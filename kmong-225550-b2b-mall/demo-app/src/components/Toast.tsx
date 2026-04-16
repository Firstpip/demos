'use client';

import { useToast } from '@/contexts/ToastContext';

const typeStyles: Record<string, { bg: string; icon: string }> = {
  success: { bg: 'bg-success', icon: '✓' },
  error: { bg: 'bg-error', icon: '✕' },
  warning: { bg: 'bg-warning', icon: '!' },
  info: { bg: 'bg-primary', icon: 'i' },
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2" id="toast-container">
      {toasts.map(toast => {
        const style = typeStyles[toast.type] || typeStyles.info;
        return (
          <div
            key={toast.id}
            className={`${style.bg} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in`}
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {style.icon}
            </span>
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
