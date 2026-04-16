'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BlurFade from '@/components/ui/BlurFade';
import SplitText from '@/components/ui/SplitText';
import ShimmerButton from '@/components/ui/ShimmerButton';
import PageTransition from '@/components/layout/PageTransition';
import { projects } from '@/data';

export default function PortfolioDetailClient({ id }: { id: string }) {
  const project = projects.find(p => p.id === id);
  const idx = projects.findIndex(p => p.id === id);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  if (!project) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="text-[#333330]">Not found</p></div>;

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Gradient Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${project.color}, transparent 55%)` }}
          />
          <div
            className="absolute inset-0 opacity-25"
            style={{ background: `radial-gradient(circle at 20% 30%, ${project.color}40, transparent 50%)` }}
          />
          <div className="relative py-32 md:py-48 max-w-[1400px] mx-auto px-6 md:px-10">
            <BlurFade>
              <Link href="/portfolio" className="text-[10px] uppercase tracking-[0.2em] text-[#333330] hover:text-[#c8ff00] transition-colors mb-10 inline-flex items-center gap-2" data-hover>
                ← Back to Work
              </Link>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-[9px] px-3 py-1.5 rounded-full border border-[#1a1a1a] text-[#333330] uppercase tracking-wider font-mono">{project.category}</span>
                <span className="text-[9px] px-3 py-1.5 rounded-full border border-[#1a1a1a] text-[#333330] font-mono">{project.year}</span>
              </div>
            </BlurFade>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <SplitText>{project.title.replace('\n', ' ')}</SplitText>
            </h1>
            <BlurFade delay={0.3}>
              <p className="text-[13px] text-[#333330] mt-4 uppercase tracking-wider font-mono">{project.client}</p>
            </BlurFade>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 md:py-32 border-t border-[#1a1a1a]">
          <div className="max-w-[900px] mx-auto px-6 md:px-10">
            <BlurFade>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-4">Overview</p>
                </div>
                <div className="md:col-span-8">
                  <p className="text-[15px] text-[#999990] leading-[1.8]">{project.description}</p>
                </div>
              </div>
            </BlurFade>
            <BlurFade delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-14 pt-14 border-t border-[#111111]">
                <div className="md:col-span-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-4">Stack</p>
                </div>
                <div className="md:col-span-8 flex flex-wrap gap-2">
                  {project.tags.map(t => (
                    <motion.span
                      key={t}
                      whileHover={{ scale: 1.05 }}
                      className="text-[11px] px-4 py-2 rounded-full border border-[#1a1a1a] text-[#666660] hover:border-[#c8ff00]/30 hover:text-[#c8ff00] transition-all duration-300"
                      data-hover
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* Parallax Gallery */}
        <section className="pb-24 md:pb-32">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: (n % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`aspect-[3/4] rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden ${n % 3 === 1 ? 'mt-12' : n % 3 === 2 ? 'mt-6' : ''}`}
                >
                  <div className="absolute inset-0 opacity-[0.06]" style={{ background: `linear-gradient(${n * 45}deg, ${project.color}, transparent 60%)` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[#222222] tracking-wider">SCREEN {String(n + 1).padStart(2, '0')}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nav — Big typo */}
        <section className="border-t border-[#1a1a1a]">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2">
            {prev ? (
              <Link href={`/portfolio/${prev.id}`} className="group p-10 md:p-16 border-r border-[#1a1a1a] hover:bg-[#0a0a0a] transition-colors" data-hover>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#333330] mb-4">← Previous</p>
                <p className="text-xl md:text-3xl font-bold group-hover:text-[#c8ff00] transition-colors tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {prev.title.replace('\n', ' ')}
                </p>
              </Link>
            ) : <div className="border-r border-[#1a1a1a]" />}
            {next ? (
              <Link href={`/portfolio/${next.id}`} className="group p-10 md:p-16 text-right hover:bg-[#0a0a0a] transition-colors" data-hover>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#333330] mb-4">Next →</p>
                <p className="text-xl md:text-3xl font-bold group-hover:text-[#c8ff00] transition-colors tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {next.title.replace('\n', ' ')}
                </p>
              </Link>
            ) : <div />}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center border-t border-[#1a1a1a]">
          <BlurFade>
            <p className="text-[12px] text-[#333330] mb-8">Interested in similar work?</p>
            <ShimmerButton href="/contact">Start a Project</ShimmerButton>
          </BlurFade>
        </section>
      </div>
    </PageTransition>
  );
}
