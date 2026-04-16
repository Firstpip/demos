import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#E2E8F0] py-8 text-[#64748B] text-xs hidden md:block">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-bold text-[#1E293B] text-sm mb-2">HL Science 에이치엘사이언스</p>
            <p>대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
            <p>서울특별시 강남구 테헤란로 123, 10층</p>
            <p>고객센터: 1588-0000 (평일 10:00~18:00)</p>
          </div>
          <div className="flex gap-6">
            <Link href="/cs" className="hover:text-[#1E293B]">이용약관</Link>
            <Link href="/cs" className="hover:text-[#1E293B] font-bold">개인정보처리방침</Link>
            <Link href="/cs" className="hover:text-[#1E293B]">고객센터</Link>
          </div>
        </div>
        <p className="mt-4 text-[10px]">&copy; 2026 Hlscience Co.,Ltd. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  )
}
