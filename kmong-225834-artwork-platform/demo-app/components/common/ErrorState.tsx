"use client";

import { AlertTriangle } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "데이터를 불러오지 못했습니다",
  description = "잠시 후 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해 주세요.",
  onRetry,
}: Props) {
  return (
    <div role="alert" className="text-center py-16 px-6" data-testid="error-state">
      <div className="mx-auto w-14 h-14 rounded-full bg-[#FBEAE5] grid place-items-center text-[#B91C1C]">
        <AlertTriangle size={22} />
      </div>
      <h3 className="mt-4 font-semibold text-base">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">{description}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 btn btn-outline btn-sm">
          다시 시도
        </button>
      )}
    </div>
  );
}
