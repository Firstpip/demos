'use client';

import Link from 'next/link';
import { company } from '@/data';

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="text-sm font-bold tracking-[0.2em] uppercase mb-4">
              NV<span className="text-[#c8ff00]">.</span>
            </p>
            <p className="text-[13px] text-[#666660] leading-relaxed max-w-xs">
              {company.description}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[10px] text-[#333330] uppercase tracking-[0.2em] mb-4">Menu</p>
            {['About', 'Services', 'Work', 'Contact'].map(item => (
              <Link key={item} href={`/${item.toLowerCase() === 'work' ? 'portfolio' : item.toLowerCase()}`}
                className="block text-[13px] text-[#666660] hover:text-[#f5f5f0] transition-colors py-1" data-hover>
                {item}
              </Link>
            ))}
          </div>
          <div className="md:col-span-4">
            <p className="text-[10px] text-[#333330] uppercase tracking-[0.2em] mb-4">Contact</p>
            <p className="text-[13px] text-[#666660] py-1">{company.email}</p>
            <p className="text-[13px] text-[#666660] py-1">{company.phone}</p>
            <p className="text-[13px] text-[#666660] py-1">{company.address}</p>
          </div>
        </div>
        <div className="mt-16 pt-6 border-t border-[#111111] flex justify-between items-center">
          <p className="text-[10px] text-[#333330] tracking-wider">&copy; 2025 {company.nameEn}</p>
          <p className="text-[10px] text-[#333330] tracking-wider">Seoul, KR</p>
        </div>
      </div>
    </footer>
  );
}
