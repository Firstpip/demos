import Link from "next/link";
import HomeHero from "./home/HomeHero";
import { categories } from "@/lib/data/categories";
import { getActiveJobs } from "@/lib/data/jobs";
import { artistProfiles } from "@/lib/data/users";
import { getOpenProjects } from "@/lib/data/projects";
import JobCard from "@/components/common/JobCard";
import ArtistCard from "@/components/common/ArtistCard";
import ProjectCard from "@/components/common/ProjectCard";
import { ChevronRight, Search, Sparkles, Megaphone } from "lucide-react";

export default function HomePage() {
  const featuredJobs = getActiveJobs().slice(0, 8);
  const featuredArtists = Object.values(artistProfiles)
    .sort((a, b) => (b.followers || 0) - (a.followers || 0))
    .slice(0, 6);
  const recentProjects = getOpenProjects().slice(0, 6);

  return (
    <div>
      <HomeHero />

      <section id="home-categories" className="demo-container py-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">장르로 시작하기</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1">자신의 장르·관심사로 공고·예술인을 탐색해보세요.</p>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                href={`/jobs?cat=${c.slug}`}
                className="card card-hover focus-ring p-4 flex flex-col items-center justify-center gap-2 aspect-square text-center"
              >
                <Icon size={24} className="text-[var(--color-primary)]" aria-hidden />
                <span className="text-sm font-semibold">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="demo-container py-12">
        <SectionHeader
          title="지금 주목해야 할 공고"
          description="섭외 일정이 가까워진 공고를 먼저 보여드립니다."
          linkHref="/jobs"
          linkLabel="전체 공고"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-fr">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="py-12 bg-[var(--color-accent)] text-white">
        <div className="demo-container">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="lg:w-1/3">
              <span className="inline-flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold mb-3"><Sparkles size={14} /> 주목 예술인</span>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">오늘, 무대에 오를 준비가 된 예술인</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                영상·사진 포트폴리오와 경력 타임라인을 한 번에 확인할 수 있습니다.<br />
                장르·지역·경력 필터로 적합한 예술인을 빠르게 찾아보세요.
              </p>
              <Link href="/artists" className="inline-flex items-center gap-1 mt-5 text-sm font-semibold text-[var(--color-primary)]">
                예술인 전체 보기 <ChevronRight size={14} />
              </Link>
            </div>
            <div className="lg:flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
              {featuredArtists.map((a) => (
                <ArtistCard key={a.userId} profile={a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="demo-container py-12">
        <SectionHeader
          title="함께할 사람을 찾는 프로젝트"
          description="기업 공고와 다른 결의 협업 — 개인·팀이 직접 올린 프로젝트·공연 모집."
          linkHref="/projects"
          linkLabel="모집 전체 보기"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {recentProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className="demo-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GuideCard
            icon={<Search size={20} />}
            title="예술인을 위한 3단계"
            items={[
              "1. 프로필에 장르·경력·영상 포트폴리오를 등록합니다.",
              "2. 카테고리·지역·경력 필터로 자신에게 맞는 공고를 고릅니다.",
              "3. 지원서를 제출하면 마이페이지에서 진행 상태를 실시간 확인할 수 있습니다.",
            ]}
            cta={{ href: "/signup?as=general", label: "예술인으로 시작하기" }}
          />
          <GuideCard
            icon={<Megaphone size={20} />}
            title="섭외 담당자를 위한 3단계"
            items={[
              "1. 기업 계정을 만들고 회사 소개를 1회 작성합니다.",
              "2. 카테고리·지역·경력 조건을 담은 공고를 등록하고 승인을 기다립니다.",
              "3. 지원자 영상·경력을 확인하고 바로 메시지로 섭외를 시작합니다.",
            ]}
            cta={{ href: "/signup?as=company", label: "기업 계정 만들기" }}
            dark
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  linkHref,
  linkLabel,
}: {
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">{description}</p>
      </div>
      <Link href={linkHref} className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
        {linkLabel} <ChevronRight size={14} />
      </Link>
    </div>
  );
}

function GuideCard({
  icon,
  title,
  items,
  cta,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  cta: { href: string; label: string };
  dark?: boolean;
}) {
  return (
    <div className={`card p-6 ${dark ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]" : ""}`}>
      <div className={`w-10 h-10 rounded-xl grid place-items-center ${dark ? "bg-white/10" : "bg-[#FFE5DD] text-[var(--color-primary)]"}`}>
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {items.map((it, i) => (
          <li key={i} className={dark ? "text-white/80" : "text-[var(--color-muted)]"}>{it}</li>
        ))}
      </ul>
      <Link href={cta.href} className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${dark ? "text-[var(--color-primary)]" : "text-[var(--color-primary)]"}`}>
        {cta.label} <ChevronRight size={14} />
      </Link>
    </div>
  );
}
