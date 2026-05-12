import { notFound } from 'next/navigation'
import { brands, brandBySlug } from '@/data/brands'
import { productsByBrand } from '@/data/products'
import { PartnerCmsEditor } from './PartnerCmsEditor'

export function generateStaticParams() {
  return brands.map((b) => ({ id: b.slug }))
}

export default async function PartnerCmsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const brand = brandBySlug(id)
  if (!brand) return notFound()
  const list = productsByBrand(brand.id)
  return <PartnerCmsEditor brand={brand} products={list} />
}
