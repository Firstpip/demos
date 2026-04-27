import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="demo-container py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)] grid place-items-center text-white font-bold">A</span>
            <span className="font-bold text-base">ARTWORK</span>
          </div>
          <p className="text-[var(--color-muted)] leading-relaxed">
            예술인을 위한 채용·공연·협업 허브.<br />
            일반 채용 플랫폼으로는 닿기 어려운 단기 프로젝트와 팀 모집을 한 곳에서.
          </p>
        </div>

        <div>
          <div className="font-semibold mb-3">서비스</div>
          <ul className="space-y-2 text-[var(--color-muted)]">
            <li><Link href="/jobs" className="hover:text-[var(--color-text)]">채용공고</Link></li>
            <li><Link href="/projects" className="hover:text-[var(--color-text)]">프로젝트 모집</Link></li>
            <li><Link href="/artists" className="hover:text-[var(--color-text)]">예술인</Link></li>
            <li><Link href="/jobs/new" className="hover:text-[var(--color-text)]">공고 등록 (기업)</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">안내</div>
          <ul className="space-y-2 text-[var(--color-muted)]">
            <li><span className="opacity-70">서비스 이용약관 (데모)</span></li>
            <li><span className="opacity-70">개인정보 처리방침 (데모)</span></li>
            <li><span className="opacity-70">보수·계약 가이드 (데모)</span></li>
            <li><span className="opacity-70">공지사항 (데모)</span></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">문의</div>
          <ul className="space-y-2 text-[var(--color-muted)]">
            <li>운영 시간: 평일 10:00 – 18:00</li>
            <li>이메일: hello@artwork.demo</li>
            <li>응답 기준: 영업일 1일 이내</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)]">
        <div className="demo-container py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-[var(--color-muted)]">
          <span>© 2026 ARTWORK (데모 프로젝트). 본 페이지는 제안용 시연입니다.</span>
          <span>kmong-225834-artwork-platform · Firstpip 데모</span>
        </div>
      </div>
    </footer>
  );
}
