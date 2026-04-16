'use client';

import Link from 'next/link';
import AuroraBackground from '@/components/ui/AuroraBackground';
import SplitText from '@/components/ui/SplitText';
import ShimmerButton from '@/components/ui/ShimmerButton';
import Marquee from '@/components/ui/Marquee';
import TargetCursor from '@/components/ui/TargetCursor';
import AnimatedPin from '@/components/ui/AnimatedPin';
import BlurFade from '@/components/ui/BlurFade';
import NumberTicker from '@/components/ui/NumberTicker';
import BackgroundBeams from '@/components/ui/BackgroundBeams';
import AnimatedGradientText from '@/components/ui/AnimatedGradientText';
import BackgroundBoxes from '@/components/ui/BackgroundBoxes';
import RotatingText from '@/components/ui/RotatingText';
import ScrambleText from '@/components/ui/ScrambleText';
import VerticalStepper from '@/components/ui/VerticalStepper';
import { company, services, projects, stats } from '@/data';

/* 1. Hero — Aurora + Split Text + True Focus */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <AuroraBackground />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 py-32">
        <BlurFade delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a1a1a] bg-[#050505]/60 backdrop-blur-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#999990]">{company.tagline}</span>
          </div>
        </BlurFade>

        <h1 className="text-[clamp(2.8rem,9vw,9rem)] font-bold leading-[0.9] tracking-[-0.03em] mb-10" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="block"><SplitText stagger={0.03}>We architect</SplitText></span>
          <span className="block">
            <AnimatedGradientText className="text-[clamp(2.8rem,9vw,9rem)] font-bold leading-[0.9] tracking-[-0.03em]" style={{ fontFamily: 'var(--font-display)' }}>
              digital futures.
            </AnimatedGradientText>
          </span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-4xl">
          <BlurFade delay={0.6}>
            <div className="max-w-md">
              <p className="text-lg md:text-xl font-bold uppercase tracking-wider">
                We build{' '}
                <RotatingText
                  words={['Strategy.', 'Design.', 'Systems.', 'Growth.']}
                  className="font-bold"
                />
              </p>
              <p className="text-[13px] text-[#999990] leading-relaxed mt-5">
                {company.description}
              </p>
            </div>
          </BlurFade>
          <BlurFade delay={0.8}>
            <ShimmerButton href="/contact">Get in Touch</ShimmerButton>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

/* 2. Tech marquee */
function TechMarquee() {
  return (
    <div className="py-6 border-y border-[#1a1a1a]">
      <Marquee
        items={['NEXT.JS', 'REACT', 'TYPESCRIPT', 'TAILWIND', 'FRAMER MOTION', 'GSAP', 'NODE.JS', 'POSTGRESQL', 'AWS', 'VERCEL']}
        textClassName="text-[11px] tracking-[0.4em] uppercase text-[#333330] font-medium"
        speed={45}
      />
    </div>
  );
}

/* 3. Services Bento */
function Services() {
  const bento = [
    { ...services[0], span: 'md:col-span-2' },
    { ...services[1], span: 'md:col-span-1' },
    { ...services[2], span: 'md:col-span-1' },
    { ...services[3], span: 'md:col-span-2' },
  ];

  return (
    <TargetCursor>
      <section className="py-28 md:py-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <BlurFade>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">Services</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 md:mb-24" style={{ fontFamily: 'var(--font-display)' }}>
              What we do<span className="text-[#c8ff00]">.</span>
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[260px] gap-5">
            {bento.map((s, i) => (
              <BlurFade key={s.id} delay={i * 0.08} className={s.span}>
                <Link
                  href="/services"
                  data-cursor-target
                  className="block h-full relative p-8 md:p-10 rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden transition-colors duration-500 hover:border-[#c8ff00]/20"
                >
                  <div className="flex flex-col h-full">
                    <span className="text-[11px] font-mono text-[#c8ff00]">{s.num}</span>
                    <h3 className="text-2xl md:text-3xl font-bold mt-6 leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display)', whiteSpace: 'pre-line' }}>
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-[#333330] mt-2">{s.titleKo}</p>
                    <p className="text-[12px] text-[#666660] leading-relaxed mt-auto pt-8">{s.brief}</p>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
    </TargetCursor>
  );
}

/* 4. Stats with beams */
function Stats() {
  return (
    <section className="relative py-24 md:py-32 border-y border-[#1a1a1a] overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, i) => {
            const numeric = parseInt(s.value.replace(/\D/g, '')) || 0;
            const suffix = s.value.replace(/[0-9]/g, '');
            return (
              <BlurFade key={s.label} delay={i * 0.08}>
                <div className="text-center md:text-left">
                  <p className="text-5xl md:text-7xl font-bold tracking-tight text-[#c8ff00] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    <NumberTicker value={numeric} suffix={suffix} />
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#333330]">{s.label}</p>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 5. Portfolio — 3D Pin Cards (Aceternity) */
function Portfolio() {
  return (
    <section className="py-28 md:py-40">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <BlurFade>
          <div className="flex justify-between items-end mb-14 md:mb-20">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">Portfolio</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Selected work<span className="text-[#c8ff00]">.</span>
              </h2>
            </div>
            <Link href="/portfolio" className="text-[11px] uppercase tracking-[0.15em] text-[#333330] hover:text-[#c8ff00] transition-colors hidden md:block" data-hover>
              View All →
            </Link>
          </div>
        </BlurFade>

        {/* 2x2 grid of pinned cards. Each row has extra top padding so the pin can descend without being clipped. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8 md:gap-y-24 place-items-center pt-20">
          {projects.map((project) => (
            <BlurFade key={project.id}>
              <AnimatedPin
                title={`${project.client} · ${project.year}`}
                href={`/portfolio/${project.id}`}
              >
                <div className="flex basis-full flex-col p-4 tracking-tight text-white/50 sm:basis-1/2 h-[20rem] w-[20rem]">
                  <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-white">
                    {project.title.replace('\n', ' ')}
                  </h3>
                  <div className="text-[13px] !m-0 !p-0 font-normal leading-relaxed">
                    <span className="text-[#666660]">
                      {project.description.length > 90 ? project.description.slice(0, 90) + '…' : project.description}
                    </span>
                  </div>
                  <div
                    className="flex flex-1 w-full rounded-lg mt-4 bg-cover bg-center overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${project.color}55, ${project.color}15 60%, transparent), url(https://picsum.photos/seed/nv-pin-${project.id}/600/400)`,
                    }}
                  />
                </div>
              </AnimatedPin>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}


/* 7. Process — Vertical Stepper */
function Process() {
  const steps = [
    { label: '01', title: 'Discover', desc: '비즈니스 요구사항과 기술 환경을 심층 분석하고 문제의 본질을 정의합니다.' },
    { label: '02', title: 'Design', desc: '사용자 경험과 기술 아키텍처를 함께 설계합니다. 디자인 시스템부터 API 스펙까지.' },
    { label: '03', title: 'Develop', desc: '애자일 2주 스프린트로 빠르게 구축하고 지속적으로 반복합니다. 품질은 자동화 테스트로 담보.' },
    { label: '04', title: 'Deliver', desc: '무중단 배포, 모니터링, 그리고 지속적인 운영 지원으로 가치를 장기적으로 전달합니다.' },
  ];
  return (
    <section className="py-28 md:py-40 border-t border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <BlurFade>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">Process</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 md:mb-24" style={{ fontFamily: 'var(--font-display)' }}>
            How we work<span className="text-[#c8ff00]">.</span>
          </h2>
        </BlurFade>
        <VerticalStepper steps={steps} />
      </div>
    </section>
  );
}

/* 8. CTA — Background Boxes */
function CTA() {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden border-t border-[#1a1a1a]">
      <BackgroundBoxes />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, #050505 70%)',
      }} />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 text-center">
        <BlurFade>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-8">Let&apos;s build</p>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-12" style={{ fontFamily: 'var(--font-display)' }}>
            <ScrambleText className="text-[#f5f5f0]">Ready to build</ScrambleText>
            <br />
            <ScrambleText className="text-[#c8ff00]" speed={50}>something great?</ScrambleText>
          </h2>
          <ShimmerButton href="/contact">Start a Project</ShimmerButton>
        </BlurFade>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Services />
      <Stats />
      <Portfolio />
      <Process />
      <CTA />
    </>
  );
}
