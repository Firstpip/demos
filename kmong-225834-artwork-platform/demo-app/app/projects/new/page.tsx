"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthGuard from "@/components/common/AuthGuard";
import RichTextEditor from "@/components/common/RichTextEditor";
import { categories } from "@/lib/data/categories";
import { useToast } from "@/providers/ToastProvider";

const LOCATIONS = ["서울 강남구", "서울 마포구", "서울 종로구", "서울 성수동", "서울 홍대", "경기 성남시", "인천 중구"];
const PAY_TYPES = ["유보수", "수익 배분", "무보수"];

export default function ProjectNewPage() {
  return (
    <AuthGuard requireLogin>
      <ProjectNewInner />
    </AuthGuard>
  );
}

function ProjectNewInner() {
  const router = useRouter();
  const { show } = useToast();
  const [title, setTitle] = useState("유튜브 단편 뮤직비디오 여성 댄서 2명 모집");
  const [cat, setCat] = useState("dance");
  const [loc, setLoc] = useState("서울 마포구");
  const [headcount, setHeadcount] = useState(2);
  const [duration, setDuration] = useState("1주 (촬영 1일 + 리허설 1일)");
  const [pay, setPay] = useState("유보수");
  const [payDetail, setPayDetail] = useState("1일 20만원 + 교통비");
  const [deadline, setDeadline] = useState("2026-05-10");
  const [description, setDescription] = useState("<h2>프로젝트 개요</h2><p>개인 유튜브 채널에 올릴 단편 MV 촬영에 함께해주실 댄서 2분을 찾습니다. 로맨틱·무드 컨셉이며 야외·스튜디오 양쪽 로케이션.</p>");

  const save = (publish: boolean) => {
    if (title.trim().length < 6) return show("제목을 조금 더 구체적으로 적어주세요", "error");
    if (description.replace(/<[^>]+>/g, "").trim().length < 30) return show("상세 내용 30자 이상 필요해요", "error");
    if (publish) {
      show("모집글이 게시되었어요. 프로젝트 리스트 최상단을 확인해보세요.", "success");
      router.push("/projects?new=1");
    } else {
      show("임시 저장되었어요", "success");
    }
  };

  return (
    <div className="demo-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">프로젝트 모집글 작성</h1>
        <p className="text-sm text-[var(--color-muted)] mt-2">기업 공고와 달리 개인·팀이 직접 올리는 모집입니다. 참여자는 댓글·메시지로 먼저 대화를 시작해요.</p>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-5">
          <div className="card p-5 md:p-6 space-y-4">
            <Field label="제목" required>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="분야" required>
                <select className="input demo-select" value={cat} onChange={(e) => setCat(e.target.value)}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="지역" required>
                <select className="input demo-select" value={loc} onChange={(e) => setLoc(e.target.value)}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="모집 인원" required>
                <input className="input" type="text" inputMode="numeric" value={String(headcount)} onChange={(e) => setHeadcount(Number(e.target.value.replace(/\D/g, "")) || 0)} />
              </Field>
              <Field label="기간" required>
                <input className="input" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </Field>
              <Field label="보수 유형" required>
                <select className="input demo-select" value={pay} onChange={(e) => setPay(e.target.value)}>
                  {PAY_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="보수 상세">
                <input className="input" value={payDetail} onChange={(e) => setPayDetail(e.target.value)} />
              </Field>
              <Field label="마감일" required>
                <input type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="card p-5 md:p-6">
            <div className="font-bold mb-3">상세 설명</div>
            <RichTextEditor value={description} onChange={setDescription} minHeight={240} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 self-start space-y-3">
          <div className="card p-5 text-sm">
            <div className="font-bold mb-2">게시 전 확인</div>
            <ul className="space-y-1.5 text-[var(--color-muted)]">
              <li>· 개인 연락처는 상세에 적지 말고 댓글·메시지로 교환합니다.</li>
              <li>· 참여자 간 합의 사항이 본문보다 우선입니다.</li>
              <li>· 마감 후에도 글은 24시간 동안 유지됩니다.</li>
            </ul>
          </div>
          <button type="button" className="btn btn-primary btn-lg btn-full" onClick={() => save(true)}>모집 시작</button>
          <button type="button" className="btn btn-outline btn-md btn-full" onClick={() => save(false)}>임시 저장</button>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label} {required && <span className="text-[var(--color-primary)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
