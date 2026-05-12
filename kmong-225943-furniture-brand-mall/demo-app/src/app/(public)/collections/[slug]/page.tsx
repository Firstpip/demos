import { notFound } from 'next/navigation'
import { collections, collectionBySlug } from '@/data/collections'
import { products } from '@/data/products'
import { CollectionDetail } from './CollectionDetail'

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }))
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const collection = collectionBySlug(slug)
  if (!collection) return notFound()
  const sourceProducts = products.filter((p) => collection.productIds.includes(p.id))
  return <CollectionDetail collection={collection} sourceProducts={sourceProducts} />
}
