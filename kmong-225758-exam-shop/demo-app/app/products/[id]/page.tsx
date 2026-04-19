import { products } from '@/lib/data';
import ProductDetailClient from './client';

export function generateStaticParams() {
  return products.map(p => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
