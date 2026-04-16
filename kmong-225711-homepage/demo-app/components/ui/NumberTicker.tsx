'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

/**
 * Number Ticker — Magic UI style
 * Uses framer-motion useMotionValue + useSpring + useInView for smooth counting.
 */
export default function NumberTicker({
  value,
  suffix = '',
  direction = 'up',
  delay = 0,
  decimalPlaces = 0,
}: {
  value: number;
  suffix?: string;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(t);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsub = springValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent =
          Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces))) + suffix;
      }
    });
    return () => unsub();
  }, [springValue, decimalPlaces, suffix]);

  return (
    <motion.span ref={ref} className="inline-block tabular-nums">
      0{suffix}
    </motion.span>
  );
}
