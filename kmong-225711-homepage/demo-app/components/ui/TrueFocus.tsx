'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  sentence: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

/**
 * True Focus — react-bits style
 * Cycles focus bracket through each word; active word is sharp, others blurred.
 */
export default function TrueFocus({
  sentence,
  manualMode = false,
  blurAmount = 5,
  borderColor = '#c8ff00',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className,
}: Props) {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(
      () => setCurrentIndex(prev => (prev + 1) % words.length),
      (animationDuration + pauseBetweenAnimations) * 1000
    );
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    const parent = containerRef.current;
    const active = wordRefs.current[currentIndex];
    if (!parent || !active) return;
    const pr = parent.getBoundingClientRect();
    const ar = active.getBoundingClientRect();
    setFocusRect({
      x: ar.left - pr.left,
      y: ar.top - pr.top,
      width: ar.width,
      height: ar.height,
    });
  }, [currentIndex, words.length]);

  return (
    <div ref={containerRef} className={cn('relative flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]', className)}>
      {words.map((word, i) => {
        const isActive = i === currentIndex;
        return (
          <span
            key={i}
            ref={el => { wordRefs.current[i] = el; }}
            className="relative"
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.55,
              transition: `filter ${animationDuration}s ease, opacity ${animationDuration}s ease`,
              willChange: 'filter, opacity',
            }}
            onMouseEnter={() => {
              if (manualMode) {
                setLastActiveIndex(i);
                setCurrentIndex(i);
              }
            }}
            onMouseLeave={() => {
              if (manualMode) setCurrentIndex(lastActiveIndex ?? 0);
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Focus bracket frame */}
      <div
        className="pointer-events-none absolute top-0 left-0"
        style={{
          transform: `translate(${focusRect.x - 6}px, ${focusRect.y - 4}px)`,
          width: focusRect.width + 12,
          height: focusRect.height + 8,
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), width 0.4s cubic-bezier(0.22,1,0.36,1), height 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <span className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2" style={{ borderColor }} />
        <span className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2" style={{ borderColor }} />
        <span className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2" style={{ borderColor }} />
        <span className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2" style={{ borderColor }} />
      </div>
    </div>
  );
}
