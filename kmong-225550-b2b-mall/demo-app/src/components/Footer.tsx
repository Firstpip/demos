export default function Footer() {
  return (
    <footer id="footer" className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">B2B MALL</h3>
            <p className="text-sm leading-relaxed">
              기업 전용 B2B 도매 쇼핑몰<br />
              사업자 회원만 이용 가능한 폐쇄몰입니다.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">사업자 정보</h4>
            <div className="text-sm space-y-1">
              <p>상호: (주)비투비커머스 (데모)</p>
              <p>대표: 홍길동</p>
              <p>사업자등록번호: 000-00-00000</p>
              <p>통신판매업신고: 제2025-서울강남-0000호</p>
              <p>주소: 서울특별시 강남구 테헤란로 000</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">고객센터</h4>
            <div className="text-sm space-y-1">
              <p className="text-white text-xl font-bold">1588-0000</p>
              <p>운영시간: 평일 09:00 ~ 18:00</p>
              <p>이메일: support@b2bmall-demo.co.kr</p>
              <p>팩스: 02-0000-0000</p>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-xs">
          <p>&copy; 2025 B2B MALL. 이 사이트는 데모 목적으로 제작되었습니다.</p>
        </div>
      </div>
    </footer>
  );
}
