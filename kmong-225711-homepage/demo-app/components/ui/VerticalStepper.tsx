'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Step {
  label: string;
  title: string;
  desc: string;
}

export default function VerticalStepper({ steps, className }: { steps: Step[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        steps.forEach((_, i) => setTimeout(() => setActive(i), 400 + i * 400));
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [steps]);

  return (
    <div ref={ref} className={cn('relative max-w-2xl mx-auto', className)}>
      {steps.map((s, i) => {
        const isActive = i <= active;
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="relative grid grid-cols-[auto_1fr] gap-6 pb-12 last:pb-0">
            {/* Left: number + vertical line */}
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500"
                style={{
                  borderColor: isActive ? '#c8ff00' : '#1a1a1a',
                  background: isActive ? 'rgba(200,255,0,0.05)' : 'transparent',
                  boxShadow: isActive ? '0 0 20px rgba(200,255,0,0.3)' : 'none',
                }}
              >
                <span
                  className="text-[11px] font-mono font-bold transition-colors duration-500"
                  style={{ color: isActive ? '#c8ff00' : '#333330' }}
                >
                  {s.label}
                </span>
              </div>
              {!isLast && (
                <div className="relative flex-1 w-px mt-2 bg-[#111111] overflow-hidden min-h-[3rem]">
                  <div
                    className="absolute top-0 left-0 w-full bg-[#c8ff00] transition-transform duration-700 ease-out origin-top"
                    style={{ height: '100%', transform: `scaleY(${isActive && active > i ? 1 : 0})` }}
                  />
                </div>
              )}
            </div>
            {/* Right: content */}
            <div
              className="pt-3 transition-all duration-500"
              style={{
                opacity: isActive ? 1 : 0.25,
                transform: isActive ? 'translateX(0)' : 'translateX(-8px)',
              }}
            >
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {s.title}
              </h3>
              <p className="text-[13px] text-[#666660] leading-relaxed">{s.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
