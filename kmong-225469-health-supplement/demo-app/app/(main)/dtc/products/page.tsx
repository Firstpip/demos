import Link from 'next/link'

const kits = [
  { id: 'basic', name: '기본 검사 (42종)', price: 99000, items: '비만/체중, 혈당, 지질, 카페인, 비타민D, 엽산, 항산화 등 42가지', duration: '약 2~3주' },
  { id: 'premium', name: '프리미엄 검사 (70종)', price: 189000, items: '기본 42종 + 피부/모발, 운동능력, 식습관, 개인특성 등 70가지', duration: '약 3~4주' },
]

export default function DtcProductsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1E293B] mb-8">DTC 유전자검사 키트</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {kits.map(k => (
          <div key={k.id} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-[#F8FAFC] flex items-center justify-center text-[#64748B]">HL GEN CHECK</div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-[#1E293B] mb-2">{k.name}</h2>
              <p className="text-2xl font-bold text-[#22C55E] mb-4">{k.price.toLocaleString()}원</p>
              <p className="text-sm text-[#64748B] mb-2">검사 항목: {k.items}</p>
              <p className="text-sm text-[#64748B] mb-4">소요 기간: {k.duration}</p>
              <Link href={`/dtc/products/${k.id}`} className="block text-center bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A]">신청하기</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
