"use client";

import { useState } from "react";
import AuthGuard from "@/components/common/AuthGuard";
import RichTextEditor from "@/components/common/RichTextEditor";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { artistProfiles, companyProfiles, getUser } from "@/lib/data/users";
import { Plus, X, Check, Circle } from "lucide-react";

const GENRE_POOL = ["힙합", "얼번", "왁킹", "보깅", "크럼프", "컨템퍼러리", "현대무용", "케이팝", "재즈", "보컬", "연극", "뮤지컬", "런웨이", "피팅", "서커스", "에어리얼", "마술", "성우", "나레이션"];

export default function ProfileEditPage() {
  return (
    <AuthGuard requireLogin>
      <ProfileEditInner />
    </AuthGuard>
  );
}

function ProfileEditInner() {
  const { session } = useAuth();
  const { show } = useToast();
  const user = session ? getUser(session.userId) : null;
  const isCompany = session?.type === "company";
  const artistSeed = session ? artistProfiles[session.userId] : undefined;
  const companySeed = session ? companyProfiles[session.userId] : undefined;

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [headline, setHeadline] = useState(artistSeed?.headline || "");
  const [location, setLocation] = useState(artistSeed?.location || companySeed?.description ? artistSeed?.location || "서울" : "서울");
  const [bio, setBio] = useState(artistSeed?.bio || companySeed?.description || "");
  const [genres, setGenres] = useState<string[]>(artistSeed?.genres || []);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(artistSeed ? artistSeed.portfolioVideos.map((v) => v.url) : [""]);
  const [industry, setIndustry] = useState(companySeed?.industry || "");
  const [rep, setRep] = useState(companySeed?.representative || "");
  const [bizNo, setBizNo] = useState(companySeed?.businessNumber || "");

  const toggleGenre = (g: string) => {
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const addLink = () => setPortfolioLinks((l) => [...l, ""]);
  const removeLink = (idx: number) => setPortfolioLinks((l) => l.filter((_, i) => i !== idx));
  const updateLink = (idx: number, v: string) => setPortfolioLinks((l) => l.map((x, i) => (i === idx ? v : x)));

  const save = () => {
    show("프로필이 저장되었어요", "success");
  };

  return (
    <div className="demo-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">프로필 편집</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">프로필이 상세할수록 섭외 제안 확률이 높아집니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-5">
          <section className="card p-6">
            <h2 className="font-bold mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label={isCompany ? "회사명" : "이름"} required>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="연락처">
                <input type="text" inputMode="numeric" className="input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ""))} />
              </Field>
              {isCompany ? (
                <>
                  <Field label="업종">
                    <input className="input" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                  </Field>
                  <Field label="사업자등록번호">
                    <input type="text" inputMode="numeric" className="input" value={bizNo} onChange={(e) => setBizNo(e.target.value.replace(/[^\d-]/g, ""))} />
                  </Field>
                  <Field label="대표자명">
                    <input className="input" value={rep} onChange={(e) => setRep(e.target.value)} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="한 줄 소개">
                    <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="예: 힙합·얼번 5년차, 공연·촬영 양쪽 경험" />
                  </Field>
                  <Field label="활동 지역">
                    <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </Field>
                </>
              )}
            </div>
          </section>

          {!isCompany && (
            <section className="card p-6">
              <h2 className="font-bold mb-4">장르</h2>
              <div className="flex flex-wrap gap-2">
                {GENRE_POOL.map((g) => (
                  <button key={g} type="button" onClick={() => toggleGenre(g)} className={`badge ${genres.includes(g) ? "badge-dark" : "badge-neutral"}`}>{g}</button>
                ))}
              </div>
            </section>
          )}

          <section className="card p-6">
            <h2 className="font-bold mb-2">{isCompany ? "회사 소개" : "자기소개"}</h2>
            <p className="text-xs text-[var(--color-muted)] mb-3">5~8줄 이상 작성하면 섭외 요청이 평균 1.8배 늘어납니다.</p>
            <RichTextEditor value={bio} onChange={setBio} minHeight={220} placeholder={isCompany ? "회사와 주요 활동을 소개해주세요" : "활동 이력·협업 스타일을 자유롭게 써주세요"} />
          </section>

          {!isCompany && (
            <section className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold">포트폴리오 링크</h2>
                <button type="button" className="btn btn-ghost btn-sm" onClick={addLink}><Plus size={14} /> 추가</button>
              </div>
              <div className="space-y-2">
                {portfolioLinks.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input className="input flex-1" value={link} onChange={(e) => updateLink(idx, e.target.value)} placeholder="YouTube·Vimeo·Instagram URL" />
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeLink(idx)} aria-label="링크 삭제">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {portfolioLinks.length === 0 && (
                  <div className="text-sm text-[var(--color-muted)] py-6 text-center">포트폴리오를 추가해 섭외자에게 보여주세요.</div>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 self-start space-y-3">
          <div className="card p-5 text-sm">
            <div className="font-bold mb-2">프로필 품질 체크</div>
            <ul className="space-y-1.5 text-[var(--color-muted)]">
              <CheckRow done={!!name} label="이름/회사명 입력" />
              <CheckRow done={bio.replace(/<[^>]+>/g, "").length >= 80} label="소개 80자 이상" />
              {!isCompany && <CheckRow done={genres.length >= 2} label="장르 2개 이상" />}
              {!isCompany && <CheckRow done={portfolioLinks.filter((l) => l.trim()).length >= 1} label="포트폴리오 링크 1개 이상" />}
              {isCompany && <CheckRow done={!!industry} label="업종 입력" />}
            </ul>
          </div>
          <button type="button" className="btn btn-primary btn-lg btn-full" onClick={save}>프로필 저장</button>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label} {required && <span className="text-[var(--color-primary)]">*</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function CheckRow({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {done ? (
        <Check size={14} className="text-[var(--color-success,#16a34a)]" aria-label="완료" />
      ) : (
        <Circle size={14} className="text-[var(--color-line)]" aria-label="미완료" />
      )}
      <span>{label}</span>
    </li>
  );
}
