import { influencers } from "@/lib/data";
import { BridgeClient } from "./client";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return influencers.map((i) => ({ id: i.id }));
}

export default async function InfluencerBridgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const influencer = influencers.find((i) => i.id === id);
  if (!influencer) return notFound();
  return <BridgeClient influencer={influencer} />;
}
