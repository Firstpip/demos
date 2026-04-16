'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/Toast'
import { useCart } from '../../contexts/cart-context'

export default function CheckoutPage() {
  const { toast } = useToast()
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [payment, setPayment] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = '수령인을 입력해주세요'
    if (!form.phone.trim()) e.phone = '연락처를 입력해주세요'
    if (!form.address.trim()) e.address = '주소를 입력해주세요'
    if (!payment) e.payment = '결제 수단을 선택해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = () => {
    if (!validate()) { toast('필수 항목을 입력해주세요', 'error'); return }
    clearCart()
    toast('결제가 완료되었습니다')
    setTimeout(() => router.push('/mypage/orders'), 1500)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">결제</h1>
      {items.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-6">
          <h2 className="font-bold text-sm mb-3">주문 상품</h2>
          {items.map(i => <p key={i.product.id} className="text-sm text-[#64748B]">{i.product.name} x {i.quantity} — {((i.isSubscription ? i.product.subscriptionPrice : i.product.price) * i.quantity).toLocaleString()}원</p>)}
          <p className="font-bold text-[#22C55E] mt-2">{total.toLocaleString()}원</p>
        </div>
      )}
      <div className="space-y-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h2 className="font-bold mb-4">배송지 정보</h2>
          <div className="space-y-3">
            <div>
              <input type="text" placeholder="수령인 *" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.name ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="text" placeholder="연락처 *" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.phone ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input type="text" placeholder="주소 *" value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${errors.address ? 'border-red-400' : 'border-[#E2E8F0]'}`} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
          <h2 className="font-bold mb-4">결제 수단 <span className="text-red-500">*</span></h2>
          <div className="flex gap-3">
            {['카드 결제', '계좌이체'].map(m => (
              <button key={m} onClick={() => setPayment(m)}
                className={`flex-1 border py-3 rounded-lg text-sm transition-colors ${payment === m ? 'border-[#22C55E] bg-green-50 text-[#22C55E] font-bold' : 'border-[#E2E8F0] hover:border-[#22C55E]'}`}>{m}</button>
            ))}
          </div>
          {errors.payment && <p className="text-xs text-red-500 mt-1">{errors.payment}</p>}
        </div>
        <button onClick={handlePay} className="w-full bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A]">결제하기</button>
      </div>
    </div>
  )
}
