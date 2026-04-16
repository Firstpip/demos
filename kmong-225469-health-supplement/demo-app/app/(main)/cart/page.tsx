'use client'
import Link from 'next/link'
import { useCart } from '../../contexts/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-[#64748B] mb-4">장바구니가 비어있습니다.</p>
        <Link href="/market" className="inline-block bg-[#22C55E] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#16A34A]">쇼핑하러 가기</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">장바구니 ({items.length})</h1>
      <div className="space-y-4 mb-6">
        {items.map(item => {
          const price = item.isSubscription ? item.product.subscriptionPrice : item.product.price
          return (
            <div key={item.product.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F8FAFC] rounded-lg flex items-center justify-center text-xs text-[#64748B] shrink-0">{item.product.category}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.product.name}</p>
                <p className="text-sm text-[#22C55E] font-medium">{price.toLocaleString()}원{item.isSubscription && <span className="text-xs text-[#64748B] ml-1">(구독)</span>}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 border border-[#E2E8F0] rounded text-sm hover:bg-[#F8FAFC]">-</button>
                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 border border-[#E2E8F0] rounded text-sm hover:bg-[#F8FAFC]">+</button>
              </div>
              <p className="text-sm font-bold w-20 text-right">{(price * item.quantity).toLocaleString()}원</p>
              <button onClick={() => removeItem(item.product.id)} className="text-[#64748B] hover:text-red-500 text-lg">&times;</button>
            </div>
          )
        })}
      </div>
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex justify-between items-center mb-6">
        <span className="font-bold">합계</span>
        <span className="text-xl font-bold text-[#22C55E]">{total.toLocaleString()}원</span>
      </div>
      <Link href="/checkout" className="block text-center bg-[#22C55E] text-white font-bold py-3 rounded-lg hover:bg-[#16A34A]">결제하기</Link>
    </div>
  )
}
