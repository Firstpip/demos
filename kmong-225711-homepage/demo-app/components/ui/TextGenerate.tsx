'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function TextGenerate({ words, className }: { words: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parts = el.querySelectorAll('.word');
    gsap.fromTo(parts,
      { opacity: 0, filter: 'blur(12px)' },
      {
        opacity: 1, filter: 'blur(0px)',
        duration: 1, ease: 'power2.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    );
    return () => { ScrollTrigger.getAll().forEach(t => { if (t.trigger === el) t.kill(); }); };
  }, [words]);

  return (
    <div ref={ref} className={cn('leading-[1.4]', className)}>
      {words.split(' ').map((w, i) => (
        <span key={i} className="word inline-block mr-[0.25em]" style={{ opacity: 0, filter: 'blur(12px)' }}>
          {w}
        </span>
      ))}
    </div>
  );
}
