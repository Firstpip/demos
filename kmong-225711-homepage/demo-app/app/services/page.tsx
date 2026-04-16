'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import BlurFade from '@/components/ui/BlurFade';
import LampContainer from '@/components/ui/LampContainer';
import AnimatedGradientText from '@/components/ui/AnimatedGradientText';
import StickyScrollReveal from '@/components/ui/StickyScrollReveal';
import { AnimatedBeam } from '@/components/ui/AnimatedBeam';
import ShimmerButton from '@/components/ui/ShimmerButton';
import ThreeDMarquee from '@/components/ui/ThreeDMarquee';
import PageTransition from '@/components/layout/PageTransition';
import { services } from '@/data';

const processSteps = [
  { label: 'STEP 01', title: 'Discover', desc: '비즈니스 요구사항과 기술 환경을 심층 분석합니다.' },
  { label: 'STEP 02', title: 'Design', desc: '최적의 아키텍처와 기술 로드맵을 설계합니다.' },
  { label: 'STEP 03', title: 'Develop', desc: '애자일 방법론으로 빠르고 안정적으로 개발합니다.' },
  { label: 'STEP 04', title: 'Deliver', desc: '철저한 테스트와 안정적 배포로 가치를 전달합니다.' },
];

const colors = ['#c8ff00', '#00d4ff', '#a855f7', '#ff6b35'];

export default function ServicesPage() {
  const stickyItems = services.map((s, i) => ({
    title: s.title,
    subtitle: s.titleKo,
    description: s.brief,
    details: s.details,
    color: colors[i],
  }));

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero — Lamp Effect (Aceternity) */}
        <LampContainer>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-6"
          >
            Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeInOut' }}
            className="text-center text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-br from-[#f5f5f0] to-[#666660] bg-clip-text text-transparent px-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Technology<br />
            that <AnimatedGradientText>delivers.</AnimatedGradientText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-[13px] md:text-[15px] text-[#666660] mt-10 max-w-lg leading-relaxed text-center"
          >
            비즈니스의 가능성을 기술로 실현합니다. 복잡한 문제를 단순하고 우아한 솔루션으로 전환합니다.
          </motion.p>
        </LampContainer>

        {/* Sticky Scroll Reveal */}
        <section className="py-20 md:py-32 border-t border-[#1a1a1a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <BlurFade>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">What we do</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-display)' }}>
                Four core areas<span className="text-[#c8ff00]">.</span>
              </h2>
            </BlurFade>
            <StickyScrollReveal items={stickyItems} />
          </div>
        </section>

        {/* Process — Animated Beam */}
        <ProcessSection />

        {/* CTA — ThreeDMarquee 배경 + 텍스트 오버레이 */}
        <section className="relative py-32 md:py-40 text-center border-t border-[#1a1a1a] overflow-hidden">
          {/* 3D Marquee 배경 — 24개 작품이 흐름 */}
          <div className="absolute inset-0 opacity-60">
            <ThreeDMarquee
              images={Array.from({ length: 24 }, (_, i) =>
                `https://picsum.photos/seed/nv-cta-${i}/970/700`
              )}
            />
          </div>
          {/* 가독성 마스크: 상하 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-[#050505]/95 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_85%)] pointer-events-none" />

          {/* 텍스트 오버레이 */}
          <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10">
            <BlurFade>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-6 font-mono">Let&apos;s build</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Ready to start your next project<span className="text-[#c8ff00]">?</span>
              </h2>
              <p className="text-[13px] md:text-[14px] text-[#999990] leading-relaxed mb-10 max-w-md mx-auto">
                위 작품들을 만든 우리와 함께 다음 프로젝트를 시작하세요.
              </p>
              <ShimmerButton href="/contact">Start a Project</ShimmerButton>
            </BlurFade>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const r0 = useRef<HTMLDivElement>(null);
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const refs = [r0, r1, r2, r3];

  return (
    <section className="py-28 md:py-40 border-t border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <BlurFade>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">Process</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-20" style={{ fontFamily: 'var(--font-display)' }}>
            How we work<span className="text-[#c8ff00]">.</span>
          </h2>
        </BlurFade>

        <div ref={containerRef} className="relative flex items-center justify-between gap-4 md:gap-8 px-2 md:px-8">
          {processSteps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center flex-1 max-w-[220px]">
              <div
                ref={refs[i]}
                className="mb-5 w-14 h-14 rounded-full border-2 border-[#c8ff00] bg-[#050505] flex items-center justify-center shadow-[0_0_30px_rgba(200,255,0,0.2),inset_0_0_12px_rgba(200,255,0,0.12)]"
              >
                <span className="text-[11px] font-mono font-bold text-[#c8ff00]">
                  {step.label.replace('STEP ', '')}
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c8ff00] font-mono mb-2">{step.label}</p>
              <h3 className="text-base md:text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{step.title}</h3>
              <p className="text-[11px] md:text-[12px] text-[#666660] leading-relaxed">{step.desc}</p>
            </div>
          ))}

          <AnimatedBeam containerRef={containerRef} fromRef={r0} toRef={r1} duration={4} delay={0} gradientStartColor="#c8ff00" gradientStopColor="#00d4ff" pathColor="#1a1a1a" />
          <AnimatedBeam containerRef={containerRef} fromRef={r1} toRef={r2} duration={4} delay={0.5} gradientStartColor="#00d4ff" gradientStopColor="#a855f7" pathColor="#1a1a1a" />
          <AnimatedBeam containerRef={containerRef} fromRef={r2} toRef={r3} duration={4} delay={1} gradientStartColor="#a855f7" gradientStopColor="#c8ff00" pathColor="#1a1a1a" />
        </div>
      </div>
    </section>
  );
}
