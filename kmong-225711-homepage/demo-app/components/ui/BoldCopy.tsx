'use client';

import { cn } from '@/lib/utils';

export default function BoldCopy({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn('group relative flex items-center justify-center', className)}>
      <span
        className="text-[clamp(4rem,14vw,14rem)] font-bold leading-[0.85] tracking-[-0.04em] text-[#f5f5f0] transition-all duration-700 group-hover:text-[#c8ff00] group-hover:-translate-x-2 group-hover:-translate-y-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="absolute text-[clamp(4rem,14vw,14rem)] font-bold leading-[0.85] tracking-[-0.04em] text-[#c8ff00] transition-all duration-700 group-hover:text-[#f5f5f0] group-hover:translate-x-2 group-hover:translate-y-2"
        style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '1px currentColor', WebkitTextFillColor: 'transparent' }}
      >
        {text}
      </span>
    </div>
  );
}
