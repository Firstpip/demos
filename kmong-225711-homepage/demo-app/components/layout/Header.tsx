'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-2xl' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="text-sm font-bold tracking-[0.2em] uppercase" data-hover>
            NV<span className="text-[#c8ff00]">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${path.startsWith(l.href) ? 'text-[#c8ff00]' : 'text-[#666660] hover:text-[#f5f5f0]'}`}
                data-hover
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-[5px]" onClick={() => setOpen(!open)} data-hover>
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }} className="block w-5 h-[1px] bg-[#f5f5f0]" transition={{ duration: 0.2 }} />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="block w-5 h-[1px] bg-[#f5f5f0]" transition={{ duration: 0.15 }} />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }} className="block w-5 h-[1px] bg-[#f5f5f0]" transition={{ duration: 0.2 }} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505] flex flex-col items-start justify-center px-10"
          >
            {links.map((l, i) => (
              <motion.div key={l.href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
              >
                <Link href={l.href} className="block text-5xl font-bold tracking-tight py-3 text-[#f5f5f0] hover:text-[#c8ff00] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
