'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  words: string[];
  className?: string;
  interval?: number;
}

/**
 * Rotating Text — react-bits style
 * Fixed-height masked container; words slide up with spring ease.
 */
export default function RotatingText({ words, className, interval = 2400 }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  // Fixed height via inline-flex + overflow clip to prevent layout shift
  return (
    <span className={cn('relative inline-flex overflow-hidden align-baseline', className)} style={{ lineHeight: 1 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[idx]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
          className="inline-block text-[#c8ff00]"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
