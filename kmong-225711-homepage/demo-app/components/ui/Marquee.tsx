'use client';

import { cn } from '@/lib/utils';

export default function Marquee({ items, speed = 30, className, textClassName }: { items: string[]; speed?: number; className?: string; textClassName?: string }) {
  const row = items.join(' — ') + ' — ';
  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)}>
      <div className="inline-block" style={{ animation: `marquee ${speed}s linear infinite` }}>
        <span className={cn('inline-block pr-8', textClassName)}>{row}</span>
        <span className={cn('inline-block pr-8', textClassName)}>{row}</span>
      </div>
    </div>
  );
}
