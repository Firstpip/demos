'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Background Boxes — Aceternity UI (reference: https://ui.aceternity.com/components/background-boxes)
 * Verbatim demo structure. Hover detection uses `window mousemove` + `document.elementsFromPoint`
 * so cells covered by child HTML (z-10 content) still react.
 */
const COLORS = ['#c8ff00', '#6bff00', '#00d4ff', '#a855f7', '#ff6b35', '#ff3cac'];

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<HTMLElement | null>(null);
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // elementsFromPoint returns ALL elements at point regardless of z-index
      // → finds box cells even when content (z-10) is on top
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      const cell = els.find(
        (el): el is HTMLElement =>
          el instanceof HTMLElement && el.dataset.boxCell !== undefined
      );
      if (!cell || cell === lastCellRef.current) return;

      lastCellRef.current = cell;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      // Apply color instantly
      cell.style.transition = 'none';
      cell.style.backgroundColor = `${color}33`;
      cell.style.borderColor = `${color}66`;

      // Decay: in next frame, transition back to nothing
      requestAnimationFrame(() => {
        cell.style.transition = 'background-color 1.4s ease-out, border-color 1.4s ease-out';
        cell.style.backgroundColor = '';
        cell.style.borderColor = '';
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        'absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4',
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row${i}`} className="relative h-8 w-16 border-l border-slate-700">
          {cols.map((_, j) => (
            <div
              key={`col${j}`}
              data-box-cell
              className="relative h-8 w-16 border-t border-r border-slate-700"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const Boxes = React.memo(BoxesCore);
export default Boxes;
