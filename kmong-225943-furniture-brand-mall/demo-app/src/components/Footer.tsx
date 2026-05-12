import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-surface-2">
      <div className="mx-auto max-w-[1280px] px-4 py-10 text-sm text-text-muted">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-base font-semibold text-text">가구몰</p>
            <p className="mt-2">30개 조합사가 한 결로 모이는 통합 쇼핑몰. 마홀앤 마이크로사이트 운영.</p>
          </div>
          <div>
            <p className="font-medium text-text">고객 지원</p>
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/support/faq">자주 묻는 질문</Link></li>
              <li><Link href="/support/notice">공지사항</Link></li>
              <li><Link href="/support/contact">1:1 문의</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-text">브랜드</p>
            <ul className="mt-2 space-y-1.5">
              <li><Link href="/about">회사 소개</Link></li>
              <li><Link href="/maholn">마홀앤 마이크로사이트</Link></li>
              <li><Link href="/products">전체 가구</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-text">사업자 정보</p>
            <p className="mt-2 leading-6">상호: 가구페스타 협동조합<br />사업자 613-81-65278<br />서울특별시 마포구 양화로 12<br />고객센터 평일 10:00 ~ 18:00</p>
          </div>
        </div>
        <p className="mt-10 text-xs">© 2026 가구페스타 협동조합. 데모 사이트입니다.</p>
      </div>
    </footer>
  )
}
