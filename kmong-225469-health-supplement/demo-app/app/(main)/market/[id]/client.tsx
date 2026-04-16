'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '../../../data/products'
import { useToast } from '../../../components/Toast'
import { useCart } from '../../../contexts/cart-context'

const dummyReviews = [
  { name: '김**', date: '2026-03-25', rating: 5, text: '한 달 복용 후 건강검진 수치가 개선되었습니다. 꾸준히 먹을 예정입니다.' },
  { name: '이**', date: '2026-03-20', rating: 4, text: '알약 크기가 적당하고 복용하기 편해요. 정기구독 할인도 좋습니다.' },
  { name: '박**', date: '2026-03-15', rating: 5, text: '약사 상담 후 추천받아서 구매했는데, 확실히 컨디션이 좋아진 느낌이에요.' },
  { name: '최**', date: '2026-03-10', rating: 4, text: '성분 함량이 높아서 만족합니다. 배송도 빠르고요.' },
]

type DetailTab = 'detail' | 'howto' | 'caution' | 'review'

export default function ProductDetailClient({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [isSub, setIsSub] = useState(false)
  const [tab, setTab] = useState<DetailTab>('detail')
  const { toast } = useToast()
  const { addItem } = useCart()
  const price = isSub ? product.subscriptionPrice : product.price

  const handleAddCart = () => { addItem(product, qty, isSub); toast('장바구니에 담았습니다') }

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'detail', label: '상세 설명' },
    { key: 'howto', label: '복용법' },
    { key: 'caution', label: '주의사항' },
    { key: 'review', label: `후기 (${product.reviewCount})` },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 상단: 이미지 + 구매 영역 */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="h-64 md:h-80 bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#64748B]">{product.category}</div>
        <div>
          <span className="text-xs bg-[#F8FAFC] text-[#64748B] px-2 py-1 rounded mb-2 inline-block">{product.category}</span>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#F59E0B]">★ {product.rating}</span>
            <span className="text-xs text-[#64748B]">({product.reviewCount}개 리뷰)</span>
          </div>
          <p className="text-sm text-[#64748B] mb-4">{product.description}</p>
          <div className="mb-4">
            <p className="text-xs text-[#64748B]">일반가 <span className="line-through">{product.price.toLocaleString()}원</span></p>
            <p className="text-2xl font-bold text-[#22C55E]">{price.toLocaleString()}원</p>
          </div>
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={isSub} onChange={e => setIsSub(e.target.checked)} className="w-4 h-4 accent-[#22C55E]" />
            <span className="text-sm">정기구독 (20% 할인)</span>
            {isSub && <span className="text-xs text-[#22C55E] font-medium">매월 자동 배송</span>}
          </label>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm">수량</span>
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 border border-[#E2E8F0] rounded hover:bg-[#F8FAFC]">-</button>
            <span className="text-sm font-bold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="w-8 h-8 border border-[#E2E8F0] rounded hover:bg-[#F8FAFC]">+</button>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddCart} className="flex-1 border border-[#22C55E] text-[#22C55E] py-3 rounded-lg font-bold hover:bg-green-50">장바구니</button>
            <Link href="/checkout" className="flex-1 bg-[#22C55E] text-white py-3 rounded-lg font-bold text-center hover:bg-[#16A34A]">바로구매</Link>
          </div>
        </div>
      </div>

      {/* 주요 성분 */}
      <div className="mb-6">
        <h3 className="font-bold text-sm text-[#1E293B] mb-2">주요 성분</h3>
        <div className="flex flex-wrap gap-2">{product.ingredients.map(i => <span key={i} className="bg-[#F8FAFC] text-xs px-3 py-1.5 rounded-full border border-[#E2E8F0]">{i}</span>)}</div>
      </div>

      {/* 추천 대상 */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
        <p className="text-xs font-bold text-green-700 mb-1">이런 분에게 추천합니다</p>
        <p className="text-sm text-green-800">{product.targetUser}</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-[#E2E8F0] mb-6">
        <div className="flex gap-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-[#22C55E] text-[#22C55E]' : 'border-transparent text-[#64748B] hover:text-[#1E293B]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {tab === 'detail' && (
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line text-sm text-[#1E293B] leading-relaxed">{product.detailDescription}</div>
        </div>
      )}

      {tab === 'howto' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h3 className="font-bold text-[#1E293B] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#22C55E] text-white rounded-full flex items-center justify-center text-sm">💊</span>
              복용 방법
            </h3>
            <p className="text-sm text-[#1E293B]">{product.howToTake}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-6">
            <h3 className="font-bold text-[#1E293B] mb-3">복용 팁</h3>
            <ul className="text-sm text-[#64748B] space-y-2">
              <li>- 매일 같은 시간에 복용하면 효과가 높아집니다</li>
              <li>- 최소 3개월 이상 꾸준히 복용해야 체감 효과를 느낄 수 있습니다</li>
              <li>- 복약 알림 기능을 활용하면 빠짐없이 챙길 수 있습니다</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'caution' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-700 mb-3">주의사항</h3>
            <p className="text-sm text-red-800">{product.caution}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-6">
            <h3 className="font-bold text-[#1E293B] mb-3">보관 방법</h3>
            <ul className="text-sm text-[#64748B] space-y-2">
              <li>- 직사광선을 피해 서늘한 곳에 보관하세요</li>
              <li>- 어린이 손에 닿지 않는 곳에 보관하세요</li>
              <li>- 개봉 후 가능한 빨리 드시는 것을 권장합니다</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#1E293B]">{product.rating}</p>
              <p className="text-[#F59E0B]">{'★'.repeat(Math.round(product.rating))}</p>
              <p className="text-xs text-[#64748B]">{product.reviewCount}개 리뷰</p>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 62 : star === 4 ? 28 : star === 3 ? 7 : star === 2 ? 2 : 1
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-6 text-right">{star}★</span>
                    <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full"><div className="h-2 bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} /></div>
                    <span className="w-8 text-[#64748B]">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
          {dummyReviews.map((r, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{r.name}</span>
                  <span className="text-[#F59E0B] text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <span className="text-xs text-[#64748B]">{r.date}</span>
              </div>
              <p className="text-sm text-[#1E293B]">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
