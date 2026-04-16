'use client'
import { products } from '../../data/products'
import { recommendedNutrients } from '../../data/health-checkup'
import { useToast } from '../../components/Toast'

export default function PharmacistProductsPage() {
  const { toast } = useToast()
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">제품 조합</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-[#1E293B] mb-3">환자 추천 성분</h2>
        <div className="flex flex-wrap gap-2">{recommendedNutrients.map(n => <span key={n} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">{n}</span>)}</div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-[#1E293B] mb-3">제품 선택</h2>
        <div className="space-y-3">
          {products.map(p => (
            <label key={p.id} className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#22C55E]" />
              <div className="flex-1"><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-[#64748B]">{p.ingredients.join(', ')}</p></div>
              <span className="text-sm font-medium text-[#22C55E]">{p.subscriptionPrice.toLocaleString()}원</span>
            </label>
          ))}
        </div>
        <button onClick={() => toast('조합이 저장되었습니다')} className="mt-4 bg-[#22C55E] text-white font-bold px-6 py-2 rounded-lg hover:bg-[#16A34A]">조합 저장</button>
      </div>
    </div>
  )
}
