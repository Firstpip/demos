'use client';

import { useEffect, useRef, useMemo, ReactNode } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

/**
 * Target Cursor — react-bits (reference: https://reactbits.dev/animations/target-cursor)
 * Verbatim demo structure adapted to scope wrapper (fires only inside wrapRef).
 * - dot follows mouse (always)
 * - 4 corners rotate around dot in idle
 * - on target hover: spin stops, corners animate to target's 4 corners
 * - on mousedown: dot scale 0.7, wrapper scale 0.9
 */
interface Props {
  children: ReactNode;
  className?: string;
  targetSelector?: string;
  spinDuration?: number;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

export default function TargetCursor({
  children,
  className,
  targetSelector = '[data-cursor-target]',
  spinDuration = 2,
  hoverDuration = 0.2,
  parallaxOn = true,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const small = window.innerWidth <= 768;
    return (hasTouch && small);
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  useEffect(() => {
    if (isMobile) return;
    const wrap = wrapRef.current;
    const cursor = cursorRef.current;
    if (!wrap || !cursor) return;

    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) target.removeEventListener('mouseleave', currentLeaveHandler);
      currentLeaveHandler = null;
    };

    // Initial position: center of wrap
    const wr0 = wrap.getBoundingClientRect();
    gsap.set(cursor, {
      xPercent: -50, yPercent: -50,
      x: wr0.width / 2, y: wr0.height / 2,
      opacity: 0,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;
        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX, y: finalY,
          duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto',
        });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveCursor = (x: number, y: number) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
    };

    const enterWrap = () => { gsap.to(cursor, { opacity: 1, duration: 0.2 }); };
    const leaveWrap = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      // force reset target if we were hovering
      if (activeTarget && currentLeaveHandler) currentLeaveHandler();
    };

    const moveHandler = (e: MouseEvent) => {
      const wr = wrap.getBoundingClientRect();
      moveCursor(e.clientX - wr.left, e.clientY - wr.top);
    };

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const wr = wrap.getBoundingClientRect();
      const mx = (gsap.getProperty(cursorRef.current, 'x') as number) + wr.left;
      const my = (gsap.getProperty(cursorRef.current, 'y') as number) + wr.top;
      const el = document.elementFromPoint(mx, my);
      const isStill = el && (el === activeTarget || el.closest(targetSelector) === activeTarget);
      if (!isStill) currentLeaveHandler?.();
    };

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    const enterHandler = (e: MouseEvent) => {
      const direct = e.target as Element | null;
      if (!direct || !wrap.contains(direct)) return;
      const targets: Element[] = [];
      let current: Element | null = direct;
      while (current && current !== document.body) {
        if (current.matches?.(targetSelector)) targets.push(current);
        current = current.parentElement;
      }
      const target = targets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(c => gsap.killTweensOf(c));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;

      targetCornerPositionsRef.current = [
        { x: rect.left - wr.left - borderWidth, y: rect.top - wr.top - borderWidth },
        { x: rect.right - wr.left + borderWidth - cornerSize, y: rect.top - wr.top - borderWidth },
        { x: rect.right - wr.left + borderWidth - cornerSize, y: rect.bottom - wr.top + borderWidth - cornerSize },
        { x: rect.left - wr.left - borderWidth, y: rect.bottom - wr.top + borderWidth - cornerSize },
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current!);
      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;
      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out',
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
          ];
          const tl = gsap.timeline();
          corners.forEach((corner, i) => {
            tl.to(corner, { x: positions[i].x, y: positions[i].y, duration: 0.3, ease: 'power3.out' }, 0);
          });
        }
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const rot = gsap.getProperty(cursorRef.current, 'rotation') as number;
            const normalized = rot % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            gsap.to(cursorRef.current, {
              rotation: normalized + 360,
              duration: spinDuration * (1 - normalized / 360),
              ease: 'none',
              onComplete: () => { spinTl.current?.restart(); },
            });
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    wrap.addEventListener('mouseenter', enterWrap);
    wrap.addEventListener('mouseleave', leaveWrap);
    wrap.addEventListener('mousemove', moveHandler);
    wrap.addEventListener('mouseover', enterHandler as EventListener);
    wrap.addEventListener('mousedown', mouseDownHandler);
    wrap.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      wrap.removeEventListener('mouseenter', enterWrap);
      wrap.removeEventListener('mouseleave', leaveWrap);
      wrap.removeEventListener('mousemove', moveHandler);
      wrap.removeEventListener('mouseover', enterHandler as EventListener);
      wrap.removeEventListener('mousedown', mouseDownHandler);
      wrap.removeEventListener('mouseup', mouseUpHandler);
      window.removeEventListener('scroll', scrollHandler);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl.current?.kill();
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [targetSelector, spinDuration, hoverDuration, parallaxOn, isMobile, constants]);

  return (
    <div ref={wrapRef} className={cn('relative target-cursor-scope', className)}>
      {children}

      {/* Always render — CSS hides on mobile to avoid hydration mismatch */}
      {true && (
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 pointer-events-none z-50 hidden md:block"
          style={{ width: 0, height: 0 }}
        >
          <div
            ref={dotRef}
            className="absolute rounded-full bg-[#c8ff00]"
            style={{
              width: 4, height: 4,
              top: -2, left: -2,
            }}
          />
          {/* 4 corners: tl, tr, br, bl */}
          <div className="target-cursor-corner absolute" style={cornerStyle({ tl: true })} />
          <div className="target-cursor-corner absolute" style={cornerStyle({ tr: true })} />
          <div className="target-cursor-corner absolute" style={cornerStyle({ br: true })} />
          <div className="target-cursor-corner absolute" style={cornerStyle({ bl: true })} />
        </div>
      )}
    </div>
  );
}

function cornerStyle(pos: { tl?: boolean; tr?: boolean; br?: boolean; bl?: boolean }): React.CSSProperties {
  const size = 12;
  const bw = 3;
  const color = '#c8ff00';
  // initial offset: corner positioned in a + shape around dot
  const base: React.CSSProperties = {
    width: size, height: size, top: 0, left: 0,
    boxSizing: 'border-box',
  };
  if (pos.tl) return {
    ...base,
    transform: `translate(${-size * 1.5}px, ${-size * 1.5}px)`,
    borderTop: `${bw}px solid ${color}`, borderLeft: `${bw}px solid ${color}`,
  };
  if (pos.tr) return {
    ...base,
    transform: `translate(${size * 0.5}px, ${-size * 1.5}px)`,
    borderTop: `${bw}px solid ${color}`, borderRight: `${bw}px solid ${color}`,
  };
  if (pos.br) return {
    ...base,
    transform: `translate(${size * 0.5}px, ${size * 0.5}px)`,
    borderBottom: `${bw}px solid ${color}`, borderRight: `${bw}px solid ${color}`,
  };
  if (pos.bl) return {
    ...base,
    transform: `translate(${-size * 1.5}px, ${size * 0.5}px)`,
    borderBottom: `${bw}px solid ${color}`, borderLeft: `${bw}px solid ${color}`,
  };
  return base;
}
