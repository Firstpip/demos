import Link from "next/link";

export function ConsumerFooter() {
  return (
    <footer id="footer" className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">KWAVE</h2>
            <p className="text-sm leading-relaxed">
              (주) 케이웨이브<br />
              대표: 홍길동<br />
              사업자등록번호: 000-00-00000<br />
              통신판매업: 제2026-서울강남-0000호<br />
              서울특별시 강남구 테헤란로 123, 4층
            </p>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">고객센터</h3>
            <ul className="space-y-2 text-sm">
              <li>전화: 1588-0000</li>
              <li>이메일: help@kwave.com</li>
              <li>운영시간: 평일 09:00 - 18:00</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">약관 및 정책</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">환불 정책</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; 2026 KWAVE. All rights reserved. (데모 사이트)
        </div>
      </div>
    </footer>
  );
}
