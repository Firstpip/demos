'use client'
import { useToast } from '../../components/Toast'
import { patients } from '../../data/patients'
import { products } from '../../data/products'

export default function RecommendPage() {
  const { toast } = useToast()
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">제품 추천</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div><label className="block text-sm font-medium mb-1">환자 선택</label>
        <select className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm bg-white">{patients.map(p => <option key={p.id}>{p.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-1">추천 제품</label>
        <select className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm bg-white">{products.map(p => <option key={p.id}>{p.name} ({p.subscriptionPrice.toLocaleString()}원)</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-1">추천 사유</label>
        <textarea placeholder="추천 사유를 입력하세요" className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm h-24" /></div>
        <button onClick={() => toast('제품을 추천했습니다')} className="bg-[#22C55E] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#16A34A]">추천하기</button>
      </div>
    </div>
  )
}
