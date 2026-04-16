import { tournaments } from '@/lib/data';
import ApplyClient from './client';

export function generateStaticParams() {
  return tournaments.map(t => ({ id: t.id }));
}

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ApplyClient id={id} />;
}
