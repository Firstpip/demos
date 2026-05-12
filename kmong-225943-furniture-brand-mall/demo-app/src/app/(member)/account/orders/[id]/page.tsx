import { notFound } from 'next/navigation'
import { orders, orderById } from '@/data/orders'
import { OrderDetail } from './OrderDetail'

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }))
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = orderById(id)
  if (!order) return notFound()
  return <OrderDetail order={order} />
}
