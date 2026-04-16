import { products } from '../../../data/products'
import ProductDetailClient from './client'

export function generateStaticParams() {
  return products.map(p => ({ id: p.id }))
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = products.find(p => p.id === id)
  if (!product) return <div className="p-8 text-center">상품을 찾을 수 없습니다.</div>
  return <ProductDetailClient product={product} />
}
