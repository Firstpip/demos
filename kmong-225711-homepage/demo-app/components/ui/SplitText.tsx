'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  className?: string;
  stagger?: number;
  delay?: number;
  from?: 'bottom' | 'top';
  trigger?: boolean;
}

export default function SplitText({ children, className, stagger = 0.04, delay = 0, from = 'bottom', trigger = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll('.split-char');
    const y = from === 'bottom' ? '110%' : '-110%';

    const anim = gsap.fromTo(
      chars,
      { y, opacity: 0 },
      {
        y: '0%', opacity: 1,
        duration: 1, ease: 'power4.out', stagger, delay,
        ...(trigger ? { scrollTrigger: { trigger: el, start: 'top 85%' } } : {}),
      }
    );

    return () => { anim.kill(); ScrollTrigger.getAll().forEach(t => { if (t.trigger === el) t.kill(); }); };
  }, [stagger, delay, from, trigger]);

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {children.split('').map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="split-char inline-block" style={{ transform: `translateY(${from === 'bottom' ? '110%' : '-110%'})`, opacity: 0 }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
