"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Play, Share2, Heart, MessageCircle, Star } from "lucide-react";
import { artistProfiles, getUser } from "@/lib/data/users";
import { getActiveJobs } from "@/lib/data/jobs";
import JobCard from "@/components/common/JobCard";
import ArtistCard from "@/components/common/ArtistCard";
import Modal from "@/components/common/Modal";
import { useToast } from "@/providers/ToastProvider";

export default function ArtistDetailClient({ userId }: { userId: string }) {
  const profile = artistProfiles[userId];
  const user = profile ? getUser(profile.userId) : null;
  const [videoOpen, setVideoOpen] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<"intro" | "reviews">("intro");
  const { show } = useToast();

  if (!profile || !user) {
    return (
      <div className="demo-container py-24 text-center">
        <p className="text-[var(--color-muted)]">프로필을 찾을 수 없습니다.</p>
        <Link href="/artists" className="mt-4 btn btn-outline btn-md inline-flex">예술인 목록</Link>
      </div>
    );
  }

  const recommendedJobs = getActiveJobs()
    .filter((j) => profile.genres.some((g) => j.title.includes(g) || j.categoryId === "dance"))
    .slice(0, 4);

  const otherArtists = Object.values(artistProfiles)
    .filter((p) => p.userId !== userId)
    .slice(0, 4);

  const mainVideo = profile.portfolioVideos[0];
  const avgRating = profile.reviews?.length ? profile.reviews.reduce((s, r) => s + r.rating, 0) / profile.reviews.length : 0;

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--color-accent)] text-white">
        <div className="absolute inset-0 opacity-30">
          {mainVideo && <img src={mainVideo.thumb} alt="" className="w-full h-full object-cover blur-md scale-110" />}
        </div>
        <div className="relative demo-container py-14 md:py-20 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden bg-white/10 ring-4 ring-white/20">
            {mainVideo && <img src={mainVideo.thumb} alt={user.name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <div className="text-xs text-[var(--color-primary)] font-bold tracking-wider uppercase">{profile.genres.join(" · ")} · {profile.experienceYears}년차</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-black leading-tight">{user.name}</h1>
            <p className="mt-3 text-white/80 max-w-xl leading-relaxed">{profile.headline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>
              <span>팔로워 {(profile.followers || 0).toLocaleString()}명</span>
              {profile.reviews && profile.reviews.length > 0 && (
                <span className="inline-flex items-center gap-1"><Star size={14} className="text-[var(--color-warning)]" fill="currentColor" /> {avgRating.toFixed(1)} · 후기 {profile.reviews.length}</span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary btn-md" onClick={() => show("제안 드로어가 열립니다 (데모)", "success")}>
                <MessageCircle size={14} /> 섭외 제안
              </button>
              <button type="button" className="btn btn-outline btn-md" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }} onClick={() => { setFollowing((v) => !v); show(following ? "팔로우를 해제했어요" : "팔로우했어요", "success"); }}>
                <Heart size={14} fill={following ? "currentColor" : "none"} /> {following ? "팔로잉" : "팔로우"}
              </button>
              <button type="button" className="btn btn-ghost btn-md" style={{ color: "#fff" }} onClick={() => show("공유 링크가 복사되었어요", "success")}>
                <Share2 size={14} /> 공유
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-container py-10">
        <h2 className="text-xl font-bold mb-5">포트폴리오</h2>
        <div id="artist-portfolio-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profile.portfolioVideos.map((v, i) => (
            <motion.button
              key={i}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setVideoOpen(v.url)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-[#EDEDE8] focus-ring"
            >
              <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition grid place-items-center">
                <div className="w-12 h-12 rounded-full bg-white grid place-items-center shadow-lg">
                  <Play size={16} className="text-[var(--color-primary)]" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-2 left-3 right-3 text-xs text-white font-semibold line-clamp-1">{v.title}</div>
            </motion.button>
          ))}
          {profile.portfolioImages.map((img, i) => (
            <motion.div
              key={`img-${i}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="relative aspect-video rounded-xl overflow-hidden bg-[#EDEDE8]"
            >
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-3 right-3 text-xs text-white font-semibold line-clamp-1">{img.caption}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="demo-container border-b border-[var(--color-line)] flex gap-1" role="tablist">
        {([{ id: "intro", label: "소개" }, { id: "reviews", label: `후기 ${profile.reviews?.length || 0}` }] as const).map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`px-4 py-3 text-sm font-semibold border-b-2 ${tab === t.id ? "border-[var(--color-primary)] text-[var(--color-text)]" : "border-transparent text-[var(--color-muted)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="demo-container py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {tab === "intro" && (
            <>
              <section>
                <h3 className="font-bold text-base mb-2">자기소개</h3>
                <p className="text-[15px] leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </section>
              <section className="mt-8">
                <h3 className="font-bold text-base mb-4">경력 타임라인</h3>
                <ol className="relative border-l-2 border-[var(--color-line)] pl-5 space-y-5">
                  {profile.careerTimeline.map((c, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                      <div className="text-xs text-[var(--color-muted)]">{c.year}</div>
                      <div className="font-semibold mt-0.5">{c.title}</div>
                      <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{c.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
              <section className="mt-8">
                <h3 className="font-bold text-base mb-3">보유 기술</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => <span key={s} className="tag">{s}</span>)}
                </div>
              </section>
            </>
          )}
          {tab === "reviews" && (
            <div className="space-y-4">
              {profile.reviews && profile.reviews.length > 0 ? (
                profile.reviews.map((r, i) => (
                  <div key={i} className="card p-5">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">{r.author}</div>
                      <div className="flex items-center gap-1 text-[var(--color-warning)]">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} size={14} fill={idx < r.rating ? "currentColor" : "none"} stroke={idx < r.rating ? "currentColor" : "#999"} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">{r.body}</p>
                    <div className="mt-2 text-xs text-[var(--color-muted)]">{r.createdAt}</div>
                  </div>
                ))
              ) : (
                <div className="card p-8 text-center text-sm text-[var(--color-muted)]">아직 등록된 후기가 없어요.</div>
              )}
            </div>
          )}
        </div>

        <aside>
          <div className="card p-5">
            <h3 className="font-bold text-base mb-3">활동 가능 지역</h3>
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] mb-3">
              <MapPin size={13} className="shrink-0" />
              <span>거점 — {profile.location}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.availableAreas.map((a) => (
                <span key={a} className="tag">{a}</span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[var(--color-muted)] leading-relaxed">
              상세 출장 조건·이동 비용은 섭외 제안 시 협의합니다.
            </p>
          </div>
          {recommendedJobs.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-base mb-3">추천 공고</h3>
              <div className="space-y-3">
                {recommendedJobs.slice(0, 3).map((j) => (
                  <Link key={j.id} href={`/jobs/${j.id}`} className="card card-hover p-4 block">
                    <div className="text-xs text-[var(--color-muted)]">{j.location} · {j.experience}</div>
                    <div className="mt-1 font-semibold text-sm line-clamp-2">{j.title}</div>
                    <div className="mt-2 text-xs text-[var(--color-primary)] font-semibold">{j.budget}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {otherArtists.length > 0 && (
        <div className="demo-container pb-16">
          <h2 className="text-xl font-bold mb-5">함께 자주 본 예술인</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {otherArtists.map((a) => <ArtistCard key={a.userId} profile={a} />)}
          </div>
        </div>
      )}

      <Modal open={!!videoOpen} onClose={() => setVideoOpen(null)} title="포트폴리오 재생" id="video-modal" widthClass="max-w-2xl">
        {videoOpen && (
          <div className="aspect-video w-full">
            <iframe
              src={videoOpen}
              title="포트폴리오 영상"
              className="w-full h-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
