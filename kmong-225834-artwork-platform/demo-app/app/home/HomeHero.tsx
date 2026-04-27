"use client";

import { motion } from "framer-motion";
import SearchAutocomplete from "@/components/common/SearchAutocomplete";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF4F0] via-[#FAFAF7] to-[#FFE9E0] -z-10" />
      <div className="demo-container pt-14 pb-10 md:pt-20 md:pb-14">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-5xl font-black leading-tight tracking-tight"
        >
          무대에 설 기회,<br />
          <span className="hero-accent">여기서 시작</span>됩니다.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-4 text-[15px] md:text-[17px] text-[var(--color-muted)] max-w-xl leading-relaxed"
        >
          댄서·음악가·배우·모델·서커스 아티스트를 위한 구인구직·프로젝트 허브.<br />
          일반 채용 플랫폼이 담지 못했던 단기 공연·협업까지 한 번에 탐색하세요.
        </motion.p>

        <div className="mt-7 max-w-2xl">
          <SearchAutocomplete
            size="lg"
            inputId="hero-search"
            placeholder="장르·지역·공고 타입으로 검색 (예: 레슨, 힙합, 서울)"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-[var(--color-muted)]">
          <StatItem label="등록 공고" value="2,480+" />
          <StatItem label="활동 예술인" value="6,200+" />
          <StatItem label="섭외 완료" value="950+" />
          <StatItem label="월 평균 신규 공고" value="340+" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-[var(--color-text)]">{value}</span>
      <span>{label}</span>
    </div>
  );
}
