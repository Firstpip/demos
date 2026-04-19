import { products } from '@/lib/data';
import AdminProductEditClient from './client';

export function generateStaticParams() {
  return products.map(p => ({ id: String(p.id) }));
}

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminProductEditClient id={id} />;
}
