'use client'
import Link from 'next/link'
import type { Product } from '../data/products'
import { useToast } from './Toast'
import { useCart } from '../contexts/cart-context'

export default function ProductCard({ product }: { product: Product }) {
  const { toast } = useToast()
  const { addItem } = useCart()
  const handleAdd = () => { addItem(product, 1, true); toast('장바구니에 담았습니다') }
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-[#F8FAFC] flex items-center justify-center text-[#64748B] text-sm">{product.category}</div>
      <div className="p-3">
        <Link href={`/market/${product.id}`} className="font-bold text-sm text-[#1E293B] hover:text-[#22C55E] line-clamp-1">{product.name}</Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-[#64748B] line-through">{product.price.toLocaleString()}원</span>
          <span className="text-sm font-bold text-[#22C55E]">{product.subscriptionPrice.toLocaleString()}원</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-[#F59E0B]">
          <span>★ {product.rating}</span>
          <span className="text-[#64748B]">({product.reviewCount})</span>
        </div>
        <button onClick={handleAdd} className="mt-2 w-full bg-[#22C55E] text-white text-xs py-2 rounded-lg hover:bg-[#16A34A] transition-colors">장바구니</button>
      </div>
    </div>
  )
}
