import { artistProfiles } from "@/lib/data/users";
import ArtistDetailClient from "./ArtistDetailClient";

export function generateStaticParams() {
  return Object.keys(artistProfiles).map((id) => ({ id }));
}

export default async function ArtistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArtistDetailClient userId={id} />;
}
