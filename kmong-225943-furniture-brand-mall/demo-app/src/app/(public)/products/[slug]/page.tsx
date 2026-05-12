import { notFound } from 'next/navigation'
import { products, productBySlug } from '@/data/products'
import { ProductDetail } from './ProductDetail'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = productBySlug(slug)
  if (!product) return notFound()
  return <ProductDetail product={product} />
}
