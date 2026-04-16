'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const CHARS = '!<>-_\\/[]{}—=+*^?#%&@$';

interface Props {
  children: string;
  className?: string;
  speed?: number;
  trigger?: 'mount' | 'hover' | 'inView';
}

export default function ScrambleText({ children, className, speed = 40, trigger = 'inView' }: Props) {
  const [display, setDisplay] = useState(children);
  const ref = useRef<HTMLSpanElement>(null);
  const rafId = useRef<number | null>(null);
  const running = useRef(false);

  const scramble = () => {
    if (running.current) return;
    running.current = true;
    const target = children;
    const duration = target.length * speed + 400;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * target.length);

      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < revealCount) out += target[i];
        else if (target[i] === ' ') out += ' ';
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(out);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        running.current = false;
      }
    };

    tick();
  };

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    } else if (trigger === 'inView' && ref.current) {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { scramble(); obs.disconnect(); }
      }, { threshold: 0.3 });
      obs.observe(ref.current);
      return () => obs.disconnect();
    }
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };

  }, [children, trigger]);

  return (
    <span
      ref={ref}
      className={cn('inline-block', className)}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
    >
      {display}
    </span>
  );
}
