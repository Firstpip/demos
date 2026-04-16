'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  color: string;
}

/**
 * Sticky Scroll Reveal — Aceternity style
 * Left column: cards stack vertically; right column stays sticky and morphs to the active card.
 * Active card in left column gets a subtle highlight too.
 */
export default function StickyScrollReveal({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const nodes = document.querySelectorAll('[data-sticky-step]');
      const vh = window.innerHeight;
      nodes.forEach((node, i) => {
        const r = (node as HTMLElement).getBoundingClientRect();
        if (r.top < vh * 0.6 && r.bottom > vh * 0.3) {
          setActive(i);
        }
      });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = items[active];

  return (
    <div ref={ref} className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Scroll column */}
        <div>
          {items.map((item, i) => {
            const isActive = active === i;
            return (
              <div key={i} data-sticky-step className="min-h-[55vh] flex items-center py-10">
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.35, scale: isActive ? 1 : 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative max-w-md"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] font-mono mb-3" style={{ color: item.color }}>
                    {String(i + 1).padStart(2, '0')} / {items.length.toString().padStart(2, '0')}
                  </p>
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}>
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[#666660] leading-relaxed mb-6">{item.description}</p>
                  <ul className="space-y-2">
                    {item.details.map(d => (
                      <li key={d} className="flex items-center gap-3 text-[12px] text-[#999990]">
                        <span className="w-1 h-1 rounded-full" style={{ background: item.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Sticky visual */}
        <div className="hidden md:block">
          <div className="sticky top-24 aspect-square rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {/* Animated radial gradient following color */}
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    background: [
                      `radial-gradient(circle at 30% 40%, ${current.color}28, transparent 60%)`,
                      `radial-gradient(circle at 70% 60%, ${current.color}28, transparent 60%)`,
                      `radial-gradient(circle at 30% 40%, ${current.color}28, transparent 60%)`,
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[14rem] font-bold leading-none select-none" style={{ color: current.color, opacity: 0.06, fontFamily: 'var(--font-display)' }}>
                    {String(active + 1).padStart(2, '0')}
                  </span>
                </div>
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[11px] uppercase tracking-[0.2em] font-mono" style={{ color: current.color }}>{current.subtitle}</p>
                  <h4 className="text-2xl font-bold mt-2" style={{ fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}>
                    {current.title}
                  </h4>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
