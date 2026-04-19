import { notices } from '@/lib/data';
import NoticeDetailClient from './client';

export function generateStaticParams() {
  return notices.map(n => ({ id: String(n.id) }));
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoticeDetailClient id={id} />;
}
