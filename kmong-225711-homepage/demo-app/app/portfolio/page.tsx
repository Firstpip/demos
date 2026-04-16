'use client';

import ParallaxHeroImages from '@/components/ui/ParallaxHeroImages';
import AnimatedGradientText from '@/components/ui/AnimatedGradientText';
import PageTransition from '@/components/layout/PageTransition';
import { projects } from '@/data';

export default function PortfolioPage() {
  // HeroParallax = the whole portfolio. 15 products (3 rows × 5) — cycle through actual projects.
  const products = Array.from({ length: 15 }, (_, i) => {
    const project = projects[i % projects.length];
    const variant = Math.floor(i / projects.length);
    const captions = [
      project.title.replace('\n', ' '),
      `${project.client} — ${project.category}`,
      project.tags.slice(0, 2).join(' / '),
      `${project.year} · ${project.category}`,
    ];
    return {
      title: captions[variant % captions.length],
      link: `/portfolio/${project.id}`,
      thumbnail: `https://picsum.photos/seed/nv-work-${project.id}-${variant}/600/600`,
    };
  });

  return (
    <PageTransition>
      <div className="pt-20">
        <ParallaxHeroImages
          products={products}
          headerTitle={<>Selected<br /> <AnimatedGradientText>work.</AnimatedGradientText></>}
          headerSubtitle="우리가 만들어온 프로젝트들. 각 카드를 탭하여 비즈니스 문제와 기술적 해결 과정을 확인하세요."
        />
      </div>
    </PageTransition>
  );
}
