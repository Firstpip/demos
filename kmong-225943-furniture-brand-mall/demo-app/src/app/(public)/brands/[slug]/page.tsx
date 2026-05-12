import { notFound } from 'next/navigation'
import { brands, brandBySlug } from '@/data/brands'
import { productsByBrand } from '@/data/products'
import { BrandDetail } from './BrandDetail'

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }))
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = brandBySlug(slug)
  if (!brand) return notFound()
  const list = productsByBrand(brand.id)
  return <BrandDetail brand={brand} products={list} />
}
