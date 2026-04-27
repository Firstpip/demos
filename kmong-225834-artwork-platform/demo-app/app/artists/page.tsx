"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ArtistCard from "@/components/common/ArtistCard";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { SkeletonCard } from "@/components/common/Skeleton";
import { artistProfiles, getUser } from "@/lib/data/users";

const GENRE_CHIPS = ["힙합", "왁킹", "보깅", "크럼프", "컨템퍼러리", "케이팝", "재즈", "연극", "뮤지컬", "런웨이", "서커스", "마술", "성우"];
const LOCATIONS = ["서울", "경기", "인천", "부산"];
const EXP_OPTIONS: { label: string; value: number }[] = [
  { label: "전체", value: 0 },
  { label: "1년+", value: 1 },
  { label: "3년+", value: 3 },
  { label: "5년+", value: 5 },
  { label: "7년+", value: 7 },
];

function ArtistsPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const errorMode = params.get("error") === "1";
  const [genre, setGenre] = useState<string>("");
  const [loc, setLoc] = useState<string>("");
  const [minExp, setMinExp] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, [genre, loc, minExp]);

  const list = useMemo(() => {
    return Object.values(artistProfiles).filter((p) => {
      if (genre && !p.genres.includes(genre)) return false;
      if (loc && !p.location.startsWith(loc)) return false;
      if (minExp > 0 && p.experienceYears < minExp) return false;
      return true;
    });
  }, [genre, loc, minExp]);

  return (
    <div className="demo-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">예술인 찾기</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">장르·지역·경력으로 검색하고, 포트폴리오 영상을 한 번에 확인하세요.</p>
      </div>

      <FilterRow label="장르">
        <button
          type="button"
          onClick={() => setGenre("")}
          aria-pressed={genre === ""}
          className={`chip ${genre === "" ? "chip-active" : ""}`}
        >
          전체
        </button>
        {GENRE_CHIPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGenre(genre === g ? "" : g)}
            aria-pressed={genre === g}
            className={`chip ${genre === g ? "chip-active" : ""}`}
          >
            {g}
          </button>
        ))}
      </FilterRow>

      <FilterRow label="지역">
        <button
          type="button"
          onClick={() => setLoc("")}
          aria-pressed={loc === ""}
          className={`chip ${loc === "" ? "chip-active" : ""}`}
        >
          전체
        </button>
        {LOCATIONS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLoc(loc === l ? "" : l)}
            aria-pressed={loc === l}
            className={`chip ${loc === l ? "chip-active" : ""}`}
          >
            {l}
          </button>
        ))}
      </FilterRow>

      <FilterRow label="최소 경력">
        {EXP_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setMinExp(o.value)}
            aria-pressed={minExp === o.value}
            className={`chip ${minExp === o.value ? "chip-active" : ""}`}
          >
            {o.label}
          </button>
        ))}
      </FilterRow>

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-line)] text-sm">
        <span className="text-[var(--color-muted)]">
          총 <strong className="text-[var(--color-text)]">{list.length}</strong>명
        </span>
        {(genre || loc || minExp > 0) && (
          <button
            type="button"
            onClick={() => { setGenre(""); setLoc(""); setMinExp(0); }}
            className="text-xs font-semibold text-[var(--color-primary)]"
          >
            필터 초기화
          </button>
        )}
      </div>

      {errorMode ? (
        <ErrorState onRetry={() => router.replace("/artists")} />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState title="조건에 맞는 예술인이 없어요" description="필터를 넓혀 다시 시도해보세요." cta={{ label: "필터 초기화", onClick: () => { setGenre(""); setLoc(""); setMinExp(0); } }} />
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}>
          {list.map((a) => {
            const user = getUser(a.userId);
            if (!user) return null;
            return (
              <motion.div key={a.userId} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="h-full">
                <ArtistCard profile={a} />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[88px_1fr] items-start gap-2 md:gap-4 mb-3">
      <div className="text-xs font-semibold text-[var(--color-muted)] tracking-wider md:pt-2 md:text-right">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <Suspense fallback={<div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">불러오는 중…</div>}>
      <ArtistsPageInner />
    </Suspense>
  );
}
