'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <footer className="bg-[#1B2A4A] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">에듀프레스</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              수험생을 위한 최고의 모의고사 교재를 만들고 있습니다.<br />
              체계적인 문제 분석과 꼼꼼한 해설로 여러분의 합격을 응원합니다.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>고객센터: 02-1234-5678 (평일 09:00~18:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>cs@edupress.co.kr</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>서울시 마포구 독서로 123 에듀프레스 빌딩</span>
              </div>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-white font-semibold mb-4">쇼핑 안내</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">전체 교재</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">자료실</Link></li>
              <li><Link href="/notice" className="hover:text-white transition-colors">공지사항</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">자주 묻는 질문</Link></li>
            </ul>
          </div>

          {/* 고객 서비스 */}
          <div>
            <h3 className="text-white font-semibold mb-4">고객 서비스</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mypage/orders" className="hover:text-white transition-colors">주문 조회</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">배송 안내</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">교환/반품 안내</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">대량 구매 문의</Link></li>
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-8 pt-8 border-t border-gray-600 text-xs text-gray-400">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p>(주)에듀프레스 | 대표: 홍길동 | 사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제2026-서울마포-0001호</p>
            </div>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer">이용약관</span>
              <span className="hover:text-white cursor-pointer font-semibold">개인정보처리방침</span>
            </div>
          </div>
          <p className="mt-4">Copyright 2026 EduPress. All rights reserved. [데모 사이트]</p>
        </div>
      </div>
    </footer>
  );
}
