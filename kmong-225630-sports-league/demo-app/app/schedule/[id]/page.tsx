import { tournaments } from '@/lib/data';
import TournamentDetailClient from './client';

export function generateStaticParams() {
  return tournaments.map(t => ({ id: t.id }));
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TournamentDetailClient id={id} />;
}
