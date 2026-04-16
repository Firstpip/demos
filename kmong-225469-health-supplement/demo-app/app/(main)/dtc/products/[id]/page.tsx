import DtcProductClient from './client'

export function generateStaticParams() { return [{ id: 'basic' }, { id: 'premium' }] }

export default async function DtcProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DtcProductClient id={id} />
}
