'use client';

import { useEffect, useRef } from 'react';

/**
 * Particles — react-bits style (canvas 2D)
 * Subtle starfield with gentle drift + mouse influence.
 */
export default function Particles({
  quantity = 120,
  staticity = 50,
  ease = 50,
  color = '#f5f5f0',
}: {
  quantity?: number;
  staticity?: number;
  ease?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    type P = {
      x: number; y: number;
      vx: number; vy: number;
      dx: number; dy: number;
      size: number;
      baseAlpha: number;
      twinkle: number;
    };
    const [cR, cG, cB] = hexToRgb(color);
    const particles: P[] = [];
    const rect = () => canvas.getBoundingClientRect();
    const init = () => {
      const r = rect();
      particles.length = 0;
      for (let i = 0; i < quantity; i++) {
        particles.push({
          x: Math.random() * r.width,
          y: Math.random() * r.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          dx: 0, dy: 0,
          size: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.15,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };
    init();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', () => { resize(); init(); });

    let raf: number;
    let t = 0;
    const animate = () => {
      t += 0.016;
      const r = rect();
      ctx.clearRect(0, 0, r.width, r.height);

      particles.forEach(p => {
        const ix = (mouse.current.x - p.x) / staticity;
        const iy = (mouse.current.y - p.y) / staticity;
        p.dx += (ix - p.dx) / ease;
        p.dy += (iy - p.dy) / ease;

        p.x += p.vx + p.dx;
        p.y += p.vy + p.dy;

        if (p.x < 0) p.x = r.width;
        if (p.x > r.width) p.x = 0;
        if (p.y < 0) p.y = r.height;
        if (p.y > r.height) p.y = 0;

        const a = p.baseAlpha + Math.sin(t * 2 + p.twinkle) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cR},${cG},${cB},${Math.max(0, a)})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [quantity, staticity, ease, color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
