'use client';

import { cn } from '@/lib/utils';

/**
 * Animated Gradient Text — Magic UI style
 * Subtle background-clip gradient that shifts via mask position.
 */
export default function AnimatedGradientText({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn('inline-block bg-clip-text text-transparent animate-gradient-x', className)}
      style={{
        backgroundImage:
          'linear-gradient(110deg, #c8ff00 0%, #00d4ff 30%, #a855f7 50%, #00d4ff 70%, #c8ff00 100%)',
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
        ...style,
      }}
    >
      {children}
      <style jsx>{`
        :global(.animate-gradient-x) {
          animation: gradient-x 6s ease-in-out infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </span>
  );
}
