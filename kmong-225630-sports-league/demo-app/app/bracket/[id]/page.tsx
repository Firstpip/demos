import { tournaments } from '@/lib/data';
import BracketDetailClient from './client';

export function generateStaticParams() {
  return tournaments.map(t => ({ id: t.id }));
}

export default async function BracketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BracketDetailClient id={id} />;
}
