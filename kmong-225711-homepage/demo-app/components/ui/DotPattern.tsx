'use client';

import { cn } from '@/lib/utils';

export default function DotPattern({ className, size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      style={{
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
      }}
    >
      <defs>
        <pattern id="dot-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={size / 2} cy={size / 2} r="1" fill="#333330" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}
