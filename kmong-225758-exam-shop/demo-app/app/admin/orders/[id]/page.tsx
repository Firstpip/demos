import { orders } from '@/lib/data';
import AdminOrderDetailClient from './client';

export function generateStaticParams() {
  return orders.map(o => ({ id: String(o.id) }));
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminOrderDetailClient id={id} />;
}
