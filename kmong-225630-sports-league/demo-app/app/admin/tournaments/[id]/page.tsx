import { tournaments } from '@/lib/data';
import TournamentAdminClient from './client';

export function generateStaticParams() {
  return tournaments.map(t => ({ id: t.id }));
}

export default async function TournamentAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TournamentAdminClient id={id} />;
}
