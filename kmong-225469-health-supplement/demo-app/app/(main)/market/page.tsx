'use client'
import { useState } from 'react'
import { products, categories } from '../../data/products'
import ProductCard from '../../components/ProductCard'

export default function MarketPage() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('전체')
  const filtered = products.filter(p => (cat === '전체' || p.category === cat) && p.name.includes(search))
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">맞춤형 건강기능식품</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input id="search-bar" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="상품 검색..." className="flex-1 border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]" />
        <div id="filter-panel" className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${cat === c ? 'bg-[#22C55E] text-white border-[#22C55E]' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#22C55E]'}`}>{c}</button>
          ))}
        </div>
      </div>
      <div id="product-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {filtered.length === 0 && <p className="text-center text-[#64748B] py-12">검색 결과가 없습니다.</p>}
    </div>
  )
}
