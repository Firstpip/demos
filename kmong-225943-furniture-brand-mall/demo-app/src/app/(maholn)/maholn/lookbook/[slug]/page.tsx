import { notFound } from 'next/navigation'
import { lookbooks, lookbookBySlug } from '@/data/lookbooks'
import { products } from '@/data/products'
import { LookbookDetail } from './LookbookDetail'

export function generateStaticParams() {
  return lookbooks.map((l) => ({ slug: l.slug }))
}

export default async function MaholnLookbookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lookbook = lookbookBySlug(slug)
  if (!lookbook) return notFound()
  const lookbookProducts = products.filter((p) => lookbook.hotspots.some((h) => h.productId === p.id))
  return <LookbookDetail lookbook={lookbook} lookbookProducts={lookbookProducts} />
}
