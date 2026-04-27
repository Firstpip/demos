"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  id?: string;
  widthClass?: string;
}

export default function Modal({ open, onClose, title, children, id, widthClass }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id ? `${id}-title` : undefined}
      id={id}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${widthClass || ""}`}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-line)]">
            <h2 id={id ? `${id}-title` : undefined} className="font-bold text-lg">{title}</h2>
            <button aria-label="닫기" className="btn btn-ghost btn-sm" onClick={onClose} type="button">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
