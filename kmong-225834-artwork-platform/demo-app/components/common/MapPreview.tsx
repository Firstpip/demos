"use client";

import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

type MapPreviewProps = {
  location: string;
  detail?: string;
  height?: number;
  compact?: boolean;
};

const HASH = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export default function MapPreview({ location, detail, height = 220, compact = false }: MapPreviewProps) {
  const { show } = useToast();
  const seed = HASH(location);
  const pinX = 38 + (seed % 25);
  const pinY = 40 + ((seed >> 5) % 20);

  const onOpen = () => {
    show("실서비스에서는 카카오 지도 앱·웹으로 길찾기가 연결됩니다.");
  };

  return (
    <div className="card overflow-hidden">
      <div
        className="relative bg-[#E9F1EE]"
        style={{ height }}
        role="img"
        aria-label={`${location} 지도 미리보기 (실서비스에서는 카카오 지도 연동)`}
      >
        <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="mapGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(31,99,82,0.08)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="70" fill="url(#mapGrid)" />
          <path d="M -5 22 Q 30 18 55 30 T 110 28" stroke="rgba(255,255,255,0.95)" strokeWidth="3.5" fill="none" />
          <path d="M -5 22 Q 30 18 55 30 T 110 28" stroke="rgba(31,99,82,0.18)" strokeWidth="0.4" fill="none" />
          <path d="M 20 -5 Q 26 25 38 45 T 52 80" stroke="rgba(255,255,255,0.85)" strokeWidth="2.4" fill="none" />
          <path d="M 70 -5 Q 66 25 78 50 T 82 80" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" fill="none" />
          <circle cx="18" cy="55" r="9" fill="rgba(31,99,82,0.08)" />
          <circle cx="82" cy="14" r="6" fill="rgba(31,99,82,0.08)" />
          <rect x={pinX - 14} y={pinY - 8} width="28" height="16" rx="2" fill="rgba(31,99,82,0.12)" />
        </svg>

        <div
          className="absolute"
          style={{ left: `${pinX}%`, top: `${pinY}%`, transform: "translate(-50%, -100%)" }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] grid place-items-center shadow-lg shadow-black/25 ring-4 ring-white">
              <MapPin size={18} className="text-white" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 mt-1 bg-white text-[12px] font-semibold text-[var(--color-text)] px-2.5 py-1 rounded-md shadow whitespace-nowrap border border-[var(--color-line)]">
              {location}
            </div>
          </div>
        </div>

        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-white/95 text-[11px] font-semibold text-[var(--color-text)] px-2.5 py-1 rounded-md shadow-sm border border-[var(--color-line)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FAE100]" aria-hidden />
          카카오 지도 연동 예정
        </div>

        {!compact && (
          <div className="absolute right-3 bottom-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 bg-white text-[12px] font-semibold text-[var(--color-text)] px-3 py-1.5 rounded-md shadow-sm border border-[var(--color-line)] hover:border-[var(--color-text)] focus-ring"
            >
              <Navigation size={12} /> 길찾기
            </button>
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1.5 bg-white text-[12px] font-semibold text-[var(--color-text)] px-3 py-1.5 rounded-md shadow-sm border border-[var(--color-line)] hover:border-[var(--color-text)] focus-ring"
            >
              <ExternalLink size={12} /> 큰 지도
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-3 flex items-start gap-2 border-t border-[var(--color-line)]">
        <MapPin size={14} className="mt-0.5 text-[var(--color-primary)] shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[var(--color-text)] truncate">{location}</div>
          {detail && <div className="text-xs text-[var(--color-muted)] mt-0.5 truncate">{detail}</div>}
        </div>
        <span className="text-[11px] text-[var(--color-muted)] shrink-0">데모 미리보기</span>
      </div>
    </div>
  );
}
