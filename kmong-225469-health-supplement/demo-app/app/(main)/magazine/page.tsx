import Link from 'next/link'
import { articles } from '../../data/magazine'

export default function MagazinePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">건강매거진</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map(a => (
          <Link key={a.id} href={`/magazine/${a.id}`} className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:shadow-md transition-shadow">
            <span className="text-xs bg-[#F8FAFC] text-[#64748B] px-2 py-1 rounded">{a.category}</span>
            <h3 className="font-bold text-[#1E293B] mt-2 mb-1">{a.title}</h3>
            <p className="text-sm text-[#64748B] line-clamp-2">{a.summary}</p>
            <p className="text-xs text-[#64748B] mt-2">{a.date} · {a.readTime} 읽기</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
