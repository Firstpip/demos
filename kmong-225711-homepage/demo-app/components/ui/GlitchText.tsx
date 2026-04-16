'use client';

import { cn } from '@/lib/utils';

export default function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn('relative inline-block', className)} data-text={text}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden
        className="absolute top-0 left-0 w-full h-full text-[#c8ff00]"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          animation: 'glitch-1 3s infinite linear alternate-reverse',
        }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="absolute top-0 left-0 w-full h-full text-[#00d4ff]"
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          animation: 'glitch-2 2.5s infinite linear alternate-reverse',
        }}
      >
        {text}
      </span>
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(2px, -1px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(1px, 1px); }
        }
      `}</style>
    </span>
  );
}
