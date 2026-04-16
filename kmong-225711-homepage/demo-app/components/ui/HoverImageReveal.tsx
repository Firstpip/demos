'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Item {
  id: string;
  label: string;
  meta?: string;
  secondary?: string;
  year?: string;
  color: string;
  href?: string;
}

export default function HoverImageReveal({ items }: { items: Item[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const hoveredItem = items.find(i => i.id === hovered);

  return (
    <div ref={wrapRef} onMouseMove={onMove} className="relative">
      {/* Floating image */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed pointer-events-none z-40 hidden md:block"
            style={{
              left: 0, top: 0,
              transform: `translate(${pos.x - 160 + (wrapRef.current?.getBoundingClientRect().left ?? 0)}px, ${pos.y - 110 + (wrapRef.current?.getBoundingClientRect().top ?? 0)}px)`,
              width: 320,
              height: 220,
            }}
          >
            <motion.div
              key={hoveredItem.id}
              initial={{ rotate: -4 }}
              animate={{ rotate: 0 }}
              className="w-full h-full rounded-lg overflow-hidden border border-[#1a1a1a] shadow-2xl relative"
              style={{ background: `linear-gradient(135deg, ${hoveredItem.color}18, #0a0a0a 60%)` }}
            >
              {/* Big letter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[10rem] font-bold leading-none select-none"
                  style={{ color: hoveredItem.color, opacity: 0.1, fontFamily: 'var(--font-display)' }}
                >
                  {hoveredItem.label.charAt(0)}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[10px] uppercase tracking-wider text-[#999990]">{hoveredItem.meta}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div>
        {items.map((item) => {
          const Wrapper = item.href ? Link : 'div';
          const extra = item.href ? { href: item.href } : {};
          return (
            // @ts-expect-error dynamic tag
            <Wrapper
              key={item.id}
              {...extra}
              data-hover
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className="block"
            >
              <motion.div
                animate={{ x: hovered === item.id ? 16 : 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-12 gap-4 items-center py-7 md:py-9 border-b border-[#1a1a1a] group"
              >
                <div className="col-span-1 hidden md:block">
                  <motion.span
                    className="text-[11px] font-mono block"
                    animate={{ color: hovered === item.id ? '#c8ff00' : '#333330' }}
                  >
                    {item.meta?.split(' ')[0] ?? ''}
                  </motion.span>
                </div>
                <div className="col-span-8 md:col-span-6">
                  <motion.h3
                    className="text-xl md:text-3xl font-bold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                    animate={{ color: hovered === item.id ? '#c8ff00' : '#f5f5f0' }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.label}
                  </motion.h3>
                </div>
                <div className="col-span-3 md:col-span-3 hidden md:block">
                  <span className="text-[11px] text-[#333330]">{item.secondary}</span>
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
                  <span className="text-[11px] text-[#333330]">{item.year}</span>
                  <motion.div
                    animate={{
                      borderColor: hovered === item.id ? '#c8ff00' : '#1a1a1a',
                      backgroundColor: hovered === item.id ? '#c8ff00' : 'transparent',
                    }}
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                  >
                    <motion.svg
                      animate={{ color: hovered === item.id ? '#050505' : '#333330' }}
                      className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                    </motion.svg>
                  </motion.div>
                </div>
              </motion.div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
