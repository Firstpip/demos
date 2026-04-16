"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { Camera, Play, ExternalLink } from "lucide-react";
import {
  type InfluencerProfile,
  deepLinks,
  products,
  getProduct,
} from "@/lib/data";

interface BridgeClientProps {
  influencer: InfluencerProfile;
}

export function BridgeClient({ influencer }: BridgeClientProps) {
  const influencerDeepLinks = deepLinks.filter((dl) => dl.influencerId === influencer.id);
  const recommendedProducts = influencerDeepLinks
    .map((dl) => getProduct(dl.productId))
    .filter(Boolean);

  return (
    <div id="page-bridge" className="mx-auto max-w-7xl px-4 py-8">
      {/* Profile */}
      <section id="bridge-profile" className="text-center mb-12">
        <div className="mx-auto max-w-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={influencer.avatar}
            alt={influencer.name}
            className="mx-auto h-24 w-24 rounded-full border-4 border-[#2563EB] mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{influencer.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {(influencer.followers / 1000).toFixed(0)}K followers
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{influencer.bio}</p>

          {/* SNS Links */}
          <div className="flex items-center justify-center gap-3">
            {influencer.snsLinks.instagram && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-gray-200">
                <Camera className="h-3.5 w-3.5" /> {influencer.snsLinks.instagram}
              </Badge>
            )}
            {influencer.snsLinks.youtube && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-gray-200">
                <Play className="h-3.5 w-3.5" /> {influencer.snsLinks.youtube}
              </Badge>
            )}
            {influencer.snsLinks.tiktok && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-gray-200">
                <ExternalLink className="h-3.5 w-3.5" /> {influencer.snsLinks.tiktok}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section id="bridge-products">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {influencer.name}&apos;s PICK
        </h2>
        {recommendedProducts.length === 0 ? (
          <p className="text-center text-gray-400 py-12">아직 추천 상품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.map(
              (p) => p && <ProductCard key={p.id} product={p} />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
