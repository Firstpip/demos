"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Package } from "lucide-react";
import type { Product } from "@/lib/data";
import { getDiscountedPrice, formatKRW, getCategory } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const discounted = getDiscountedPrice(product);
  const category = getCategory(product.categoryId);

  return (
    <Link href={`/products/${product.id}/`} id={`product-card-${product.id}`}>
      <Card className="group h-full overflow-hidden border border-gray-200 transition-shadow hover:shadow-lg !pt-0 !gap-0">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {imgError ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-200">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}
          {product.discountRate > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500 text-white">
              -{product.discountRate}%
            </Badge>
          )}
          {product.status === "soldout" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-white font-bold text-lg">SOLD OUT</span>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          {category && (
            <p className="text-xs text-gray-500 mb-1">{category.icon} {category.name}</p>
          )}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-1">
            {product.discountRate > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatKRW(product.price)}</span>
            )}
          </div>
          <p className="text-base font-bold text-gray-900">{formatKRW(discounted)}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
