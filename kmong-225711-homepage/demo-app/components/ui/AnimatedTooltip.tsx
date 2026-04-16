'use client';

import React, { useState, useRef } from 'react';
import { motion, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

/**
 * Animated Tooltip — Aceternity UI (reference: https://ui.aceternity.com/components/animated-tooltip)
 * Verbatim demo structure. Content = items with id/name/designation/image.
 */
interface Item {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export default function AnimatedTooltip({ items }: { items: Item[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    const target = event.currentTarget;
    const nativeEvent = event.nativeEvent;
    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = target.offsetWidth / 2;
      x.set(nativeEvent.offsetX - halfWidth);
    });
  };

  return (
    <div className="flex flex-row items-center justify-center">
      {items.map((item) => (
        <div
          className="group relative -mr-4"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 260, damping: 10 },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate, whiteSpace: 'nowrap' }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-[#0a0a0a] px-4 py-2 text-xs shadow-xl border border-[#1a1a1a]"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-[#c8ff00] to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" />
                <div className="relative z-30 text-base font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.name}
                </div>
                <div className="text-[10px] text-[#999990] mt-0.5 font-mono">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-14 w-14 rounded-full border-2 border-[#050505] object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
