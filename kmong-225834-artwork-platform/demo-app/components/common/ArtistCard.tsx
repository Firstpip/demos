import Link from "next/link";
import { ArtistProfile } from "@/lib/types";
import { getUser } from "@/lib/data/users";
import { Play, MapPin } from "lucide-react";

export default function ArtistCard({ profile }: { profile: ArtistProfile }) {
  const user = getUser(profile.userId);
  const mainVideo = profile.portfolioVideos[0];

  return (
    <Link
      href={`/artists/${profile.userId}`}
      className="card card-hover focus-ring h-full flex flex-col overflow-hidden"
      aria-label={`${user?.name || "예술인"} 프로필 보기`}
    >
      <div className="aspect-[4/3] relative bg-[#1A1A1A] overflow-hidden shrink-0">
        {mainVideo ? (
          <img src={mainVideo.thumb} alt={mainVideo.title} className="w-full h-full object-cover opacity-90" loading="lazy" />
        ) : profile.portfolioImages[0] ? (
          <img src={profile.portfolioImages[0].url} alt={profile.portfolioImages[0].caption} className="w-full h-full object-cover" loading="lazy" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="font-bold text-[17px] leading-tight truncate">{user?.name}</div>
          <div className="text-[12px] opacity-90 line-clamp-1 mt-1">{profile.headline}</div>
        </div>
        {mainVideo && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 grid place-items-center shadow-sm">
            <Play size={14} className="text-[var(--color-primary)]" fill="currentColor" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {profile.genres.slice(0, 3).map((g) => (
            <span key={g} className="tag">{g}</span>
          ))}
          <span className="tag">{profile.experienceYears}년차</span>
        </div>
        <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-[var(--color-muted)]">
          <MapPin size={13} className="shrink-0" /> <span className="truncate">{profile.location}</span>
        </div>
      </div>
    </Link>
  );
}
