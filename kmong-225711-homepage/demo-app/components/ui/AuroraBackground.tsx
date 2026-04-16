'use client';

import { cn } from '@/lib/utils';

/**
 * Aurora Background — react-bits style
 * Multiple repeating gradient layers with blur and mask for a flowing aurora effect
 */
export default function AuroraBackground({
  className,
  showRadialGradient = true,
}: {
  className?: string;
  showRadialGradient?: boolean;
}) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <div
        className="absolute -inset-[10px]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(100deg, #050505 0%, #050505 7%, transparent 10%, transparent 12%, #050505 16%),
            repeating-linear-gradient(100deg,
              #c8ff00 10%,
              #6bff00 15%,
              #00d4ff 20%,
              #a855f7 25%,
              #c8ff00 30%
            )
          `,
          backgroundSize: '300% 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          filter: 'blur(10px) invert(0)',
          opacity: 0.45,
          WebkitMaskImage: showRadialGradient
            ? 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)'
            : undefined,
          maskImage: showRadialGradient
            ? 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)'
            : undefined,
          animation: 'aurora 60s linear infinite',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
      <style jsx>{`
        @keyframes aurora {
          0% {
            background-position: 50% 50%, 50% 50%;
          }
          100% {
            background-position: 350% 50%, 350% 50%;
          }
        }
      `}</style>
    </div>
  );
}
