import { projects } from '@/data';
import PortfolioDetailClient from './client';

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioDetailClient id={id} />;
}
