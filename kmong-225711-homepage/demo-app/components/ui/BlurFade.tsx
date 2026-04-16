'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Blur Fade — Magic UI style
 * Uses framer-motion whileInView (useInView) for entrance, no external scroll lib.
 */
interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: string;
  once?: boolean;
}

export default function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 20,
  blur = '8px',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-80px' });

  const variants: Variants = {
    hidden: { opacity: 0, y, filter: `blur(${blur})` },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
