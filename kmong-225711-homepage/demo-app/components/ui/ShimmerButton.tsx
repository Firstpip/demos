'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Shimmer Button — Magic UI style
 * A button with a visible rotating shimmer band around the edges.
 */
interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  shimmerColor?: string;
  shimmerDuration?: string;
  background?: string;
  textColor?: string;
}

export default function ShimmerButton({
  children,
  href,
  onClick,
  className,
  type = 'button',
  shimmerColor = '#c8ff00',
  shimmerDuration = '3s',
  background = '#c8ff00',
  textColor = '#050505',
}: Props) {
  const inner = (
    <span
      className={cn(
        'group relative inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-semibold transition-all duration-300 [background:var(--bg)] text-[var(--tc)]',
        'shadow-[inset_0_-6px_12px_rgba(0,0,0,0.1)]',
        className
      )}
      style={{
        ['--bg' as string]: background,
        ['--tc' as string]: textColor,
      }}
      data-hover
    >
      {/* shimmer rotator layer */}
      <div
        className="absolute inset-0 overflow-visible"
        style={{ containerType: 'size' as unknown as string }}
      >
        <div
          className="absolute inset-0 animate-shimmer-spin"
          style={{
            animationDuration: shimmerDuration,
          }}
        >
          <div
            className="absolute -inset-full h-[200%] w-[200%] [translate:-50%_-50%]"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${shimmerColor} 60deg, transparent 120deg)`,
              filter: 'blur(2px)',
            }}
          />
        </div>
      </div>
      {/* Inner mask that hides shimmer except on border */}
      <span className="absolute inset-[2px] rounded-full [background:var(--bg)]" style={{ ['--bg' as string]: background } as React.CSSProperties} />
      <span className="relative z-10">{children}</span>
      <style jsx>{`
        :global(.animate-shimmer-spin) {
          animation-name: shimmer-spin;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          transform-origin: center;
        }
        @keyframes shimmer-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return <button type={type} onClick={onClick}>{inner}</button>;
}
