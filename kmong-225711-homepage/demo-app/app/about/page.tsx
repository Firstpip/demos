'use client';

import BlurFade from '@/components/ui/BlurFade';
import TextGenerate from '@/components/ui/TextGenerate';
import TrueFocus from '@/components/ui/TrueFocus';
import DotPattern from '@/components/ui/DotPattern';
import FocusCards from '@/components/ui/FocusCards';
import Timeline from '@/components/ui/Timeline';
import { CardContainer, CardBody, CardItem } from '@/components/ui/ThreeDCardEffect';
import PageTransition from '@/components/layout/PageTransition';
import { company, team, history } from '@/data';

const values = [
  { word: 'Innovate', ko: '혁신', desc: '기술의 최전선에서 검증된 혁신을 비즈니스에 적용합니다.' },
  { word: 'Trust', ko: '신뢰', desc: '투명한 커뮤니케이션과 약속 이행으로 장기적 신뢰를 구축합니다.' },
  { word: 'Execute', ko: '실행', desc: '전략을 실행으로. 완성도 높은 결과물을 기한 내에 전달합니다.' },
  { word: 'Grow', ko: '성장', desc: '고객의 비즈니스를 우리의 비즈니스처럼 이해하고 함께 성장합니다.' },
];

export default function AboutPage() {
  // Focus Cards items — 4 values with picsum images
  const valueCards = values.map(v => ({
    title: v.word,
    subtitle: v.desc,
    src: `https://picsum.photos/seed/nv-value-${v.word.toLowerCase()}/800/600`,
  }));

  // Timeline entries from history data
  const timelineData = history.map(h => ({
    title: h.year,
    content: (
      <div>
        <p className="text-[#999990] text-base md:text-lg leading-relaxed mb-4">{h.event}</p>
        <div
          className="aspect-[16/9] rounded-lg border border-[#1a1a1a] bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(200,255,0,0.08), rgba(10,10,10,0.5) 60%), url(https://picsum.photos/seed/nv-history-${h.year}/800/450)`,
          }}
        />
      </div>
    ),
  }));


  return (
    <PageTransition>
      <div className="pt-20">
        {/* Hero — Text Generate */}
        <section className="relative py-32 md:py-48 overflow-hidden">
          <DotPattern />
          <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
            <BlurFade>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-8">About</p>
            </BlurFade>
            <BlurFade delay={0.1}>
              <TrueFocus
                sentence="Build Beyond Boundaries Together"
                className="text-[1.75rem] md:text-5xl lg:text-6xl font-bold tracking-tight mb-12 leading-[1.1]"
                animationDuration={0.5}
                pauseBetweenAnimations={1.2}
                blurAmount={4}
              />
            </BlurFade>
            <TextGenerate
              words={company.mission}
              className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.4] tracking-tight max-w-4xl"
            />
          </div>
        </section>

        {/* Values — Focus Cards (Aceternity) */}
        <section className="py-28 md:py-40 border-t border-[#1a1a1a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <BlurFade>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">Values</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-display)' }}>
                What drives us<span className="text-[#c8ff00]">.</span>
              </h2>
            </BlurFade>
            <BlurFade>
              <FocusCards cards={valueCards} />
            </BlurFade>
          </div>
        </section>

        {/* History — Timeline (Aceternity) */}
        <section className="py-28 md:py-32 border-t border-[#1a1a1a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <BlurFade>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">History</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-display)' }}>
                Milestones<span className="text-[#c8ff00]">.</span>
              </h2>
            </BlurFade>
          </div>
          <Timeline data={timelineData} />
        </section>

        {/* Team — Animated Tooltip (Aceternity) */}
        <section className="py-28 md:py-40 border-t border-[#1a1a1a]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <BlurFade>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] mb-3">Team</p>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-display)' }}>
                The people<span className="text-[#c8ff00]">.</span>
              </h2>
            </BlurFade>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((m) => (
                <BlurFade key={m.name}>
                  <CardContainer containerClassName="!p-0">
                    <CardBody className="bg-[#0a0a0a] relative group/card border border-[#1a1a1a] hover:border-[#c8ff00]/30 transition-colors w-full sm:w-[22rem] h-auto rounded-2xl p-6 md:p-8">
                      <CardItem translateZ={40} className="text-[10px] uppercase tracking-[0.3em] text-[#c8ff00] font-mono">
                        {m.role}
                      </CardItem>
                      <CardItem translateZ={60} as="h3" className="text-2xl md:text-3xl font-bold mt-3 tracking-tight text-[#f5f5f0]">
                        {m.name}
                      </CardItem>
                      <CardItem translateZ={30} as="p" className="text-[11px] text-[#666660] mt-1 font-mono">
                        prev · {m.previous}
                      </CardItem>
                      <CardItem translateZ={80} className="w-full mt-5">
                        <img
                          src={`https://picsum.photos/seed/nv-team-${m.name}/600/400`}
                          alt={m.name}
                          className="w-full h-48 rounded-xl object-cover border border-[#1a1a1a] group-hover/card:shadow-[0_20px_40px_rgba(200,255,0,0.15)] transition-shadow"
                        />
                      </CardItem>
                      <CardItem translateZ={40} as="p" className="text-[12px] text-[#999990] mt-5 leading-relaxed">
                        {m.bio}
                      </CardItem>
                      <CardItem translateZ={50} className="flex flex-wrap gap-1.5 mt-5">
                        {m.specialties.slice(0, 3).map(s => (
                          <span key={s} className="text-[10px] px-2.5 py-1 rounded-full border border-[#1a1a1a] text-[#666660]">
                            {s}
                          </span>
                        ))}
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
