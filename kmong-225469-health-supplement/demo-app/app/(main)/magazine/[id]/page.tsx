import Link from 'next/link'
import { articles } from '../../../data/magazine'

export function generateStaticParams() { return articles.map(a => ({ id: a.id })) }

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = articles.find(a => a.id === id)
  if (!article) return <div className="p-8 text-center">글을 찾을 수 없습니다.</div>
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/magazine" className="text-sm text-[#64748B] hover:text-[#1E293B] mb-4 inline-block">&larr; 매거진 목록</Link>
      <span className="text-xs bg-[#F8FAFC] text-[#64748B] px-2 py-1 rounded ml-3">{article.category}</span>
      <h1 className="text-2xl font-bold text-[#1E293B] mt-3 mb-2">{article.title}</h1>
      <p className="text-sm text-[#64748B] mb-6">{article.date} · {article.readTime} 읽기</p>
      <div className="prose prose-sm max-w-none text-[#1E293B] whitespace-pre-line">{article.content}</div>
    </div>
  )
}
