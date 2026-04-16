'use client'
import { useState } from 'react'
import { products, categories } from '../../data/products'
import { useToast } from '../../components/Toast'
import Modal from '../../components/Modal'

const emptyForm = { name: '', price: '', subscriptionPrice: '', category: '', description: '', detailDescription: '', howToTake: '', caution: '', targetUser: '', ingredients: '' }

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  const handleSave = () => {
    if (!formData.name || !formData.price) { toast('상품명과 가격을 입력해주세요', 'error'); return }
    toast('제품이 저장되었습니다')
    setShowForm(false)
    setFormData(emptyForm)
  }

  const openEdit = (p: typeof products[0]) => {
    setFormData({
      name: p.name, price: String(p.price), subscriptionPrice: String(p.subscriptionPrice),
      category: p.category, description: p.description, detailDescription: p.detailDescription,
      howToTake: p.howToTake, caution: p.caution, targetUser: p.targetUser,
      ingredients: p.ingredients.join(', ')
    })
    setShowForm(true)
  }

  const set = (key: string, value: string) => setFormData(p => ({ ...p, [key]: value }))

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">제품 관리</h1>
        <button onClick={() => { setFormData(emptyForm); setShowForm(true) }} className="bg-[#22C55E] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#16A34A]">+ 제품 추가</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-[#F8FAFC] text-[#64748B] text-xs"><th className="py-3 px-4 text-left">상품명</th><th className="py-3 px-4 text-left">카테고리</th><th className="py-3 px-4 text-right">가격</th><th className="py-3 px-4 text-right">구독가</th><th className="py-3 px-4 text-center">평점</th><th className="py-3 px-4 text-center">관리</th></tr></thead>
          <tbody>{products.map(p => (
            <tr key={p.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
              <td className="py-3 px-4 font-medium">{p.name}</td><td className="py-3 px-4 text-xs">{p.category}</td><td className="py-3 px-4 text-right">{p.price.toLocaleString()}</td><td className="py-3 px-4 text-right text-[#22C55E]">{p.subscriptionPrice.toLocaleString()}</td><td className="py-3 px-4 text-center">★{p.rating}</td>
              <td className="py-3 px-4 text-center">
                <button onClick={() => openEdit(p)} className="text-xs text-[#3B82F6] mr-2">수정</button>
                <button onClick={() => toast('삭제되었습니다')} className="text-xs text-red-500">삭제</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={formData.name ? '제품 수정' : '제품 추가'}>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium mb-1">상품명 <span className="text-red-500">*</span></label>
          <input type="text" value={formData.name} onChange={e => set('name', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" placeholder="프리미엄 밀크씨슬" /></div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium mb-1">가격 <span className="text-red-500">*</span></label>
            <input type="text" inputMode="numeric" value={formData.price} onChange={e => set('price', e.target.value.replace(/\D/g, ''))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" placeholder="32000" /></div>
            <div><label className="block text-xs font-medium mb-1">구독가</label>
            <input type="text" inputMode="numeric" value={formData.subscriptionPrice} onChange={e => set('subscriptionPrice', e.target.value.replace(/\D/g, ''))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" placeholder="25600" /></div>
          </div>

          <div><label className="block text-xs font-medium mb-1">카테고리</label>
          <select value={formData.category} onChange={e => set('category', e.target.value)} className="w-full appearance-none border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">선택</option>{categories.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>

          <div><label className="block text-xs font-medium mb-1">성분 (쉼표 구분)</label>
          <input type="text" value={formData.ingredients} onChange={e => set('ingredients', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" placeholder="실리마린 130mg, NAC 200mg" /></div>

          <div><label className="block text-xs font-medium mb-1">간단 설명</label>
          <input type="text" value={formData.description} onChange={e => set('description', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" placeholder="간세포 보호와 해독 기능을 돕는 고함량 밀크씨슬" /></div>

          <div><label className="block text-xs font-medium mb-1">상세 설명</label>
          <textarea value={formData.detailDescription} onChange={e => set('detailDescription', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm h-28" placeholder="제품의 효능, 유전자 연관 설명 등 상세 내용을 입력하세요" /></div>

          <div><label className="block text-xs font-medium mb-1">복용법</label>
          <textarea value={formData.howToTake} onChange={e => set('howToTake', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm h-16" placeholder="1일 1회, 1회 2캡슐을 식후에 복용" /></div>

          <div><label className="block text-xs font-medium mb-1">주의사항</label>
          <textarea value={formData.caution} onChange={e => set('caution', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm h-16" placeholder="임산부, 수유부는 전문가와 상담 후 복용" /></div>

          <div><label className="block text-xs font-medium mb-1">추천 대상</label>
          <input type="text" value={formData.targetUser} onChange={e => set('targetUser', e.target.value)} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" placeholder="잦은 음주, AST/ALT 수치 상승, ALDH2 유전자 변이" /></div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-[#E2E8F0] py-2 rounded-lg text-sm">취소</button>
            <button onClick={handleSave} className="flex-1 bg-[#22C55E] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#16A34A]">저장</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
