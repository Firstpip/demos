'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Background Beams — Aceternity UI (reference: https://ui.aceternity.com/components/background-beams)
 * Verbatim demo structure: 50 curved SVG paths + 50 motion.linearGradient with animated x1/x2/y1/y2.
 * Static base path uses radialGradient. Color palette kept official (cyan → purple → magenta).
 */
const PATHS = Array.from({ length: 50 }, (_, i) => {
  const x = -380 + i * 7;
  const y = -189 - i * 8;
  return `M${x} ${y}C${x} ${y} ${x + 68} ${y + 405} ${x + 532} ${y + 532}C${x + 996} ${y + 659} ${x + 1064} ${y + 1064} ${x + 1064} ${y + 1064}`;
});

// Deterministic pseudo-random per path index — avoids SSR hydration mismatch
const VARIANTS = PATHS.map((_, i) => ({
  duration: 10 + ((i * 13) % 10),
  delay: (i * 7) % 10,
  y2End: 93 + ((i * 3) % 8),
}));

const BackgroundBeamsBase = ({ className }: { className?: string }) => {
  const variants = VARIANTS;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999, active: false });

  /**
   * Window-level mousemove. Compute mouse position relative to BackgroundBeams
   * wrap and only activate when cursor is within wrap bounds. This sidesteps
   * any pointer-events-none / stacking issues with descendant HTML.
   */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside = x >= 0 && x <= r.width && y >= 0 && y <= r.height;
      if (inside) {
        setPos({ x, y, active: true });
      } else {
        setPos(p => (p.active ? { ...p, active: false } : p));
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        'absolute inset-0 h-full w-full pointer-events-none',
        '[mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]',
        className
      )}
    >
      {/* Cursor-follow spotlight — reacts to hover over wrap OR child HTML (event bubbling) */}
      <div
        className="absolute pointer-events-none transition-opacity duration-300"
        style={{
          left: pos.x,
          top: pos.y,
          width: 600,
          height: 600,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(24,204,252,0.15), rgba(99,68,245,0.08) 35%, transparent 65%)',
          opacity: pos.active ? 1 : 0,
          mixBlendMode: 'screen',
        }}
      />
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Static base path */}
        <path
          d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
          stroke="url(#paint0_radial_242_278)"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        />

        {/* Animated paths */}
        {PATHS.map((d, i) => (
          <motion.path
            key={`path-${i}`}
            d={d}
            stroke={`url(#linearGradient-${i})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        ))}

        <defs>
          {PATHS.map((_, i) => (
            <motion.linearGradient
              id={`linearGradient-${i}`}
              key={`linearGradient-${i}`}
              initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
              animate={{
                x1: ['0%', '100%'],
                x2: ['0%', '95%'],
                y1: ['0%', '100%'],
                y2: ['0%', `${variants[i].y2End}%`],
              }}
              transition={{
                duration: variants[i].duration,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: variants[i].delay,
              }}
            >
              <stop stopColor="#18CCFC" stopOpacity="0" />
              <stop stopColor="#18CCFC" />
              <stop offset="32.5%" stopColor="#6344F5" />
              <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
            </motion.linearGradient>
          ))}
          <radialGradient
            id="paint0_radial_242_278"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
          >
            <stop offset="0.0666667" stopColor="#d4d4d4" />
            <stop offset="0.243243" stopColor="#d4d4d4" />
            <stop offset="0.43594" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const BackgroundBeams = React.memo(BackgroundBeamsBase);
BackgroundBeams.displayName = 'BackgroundBeams';
export default BackgroundBeams;
