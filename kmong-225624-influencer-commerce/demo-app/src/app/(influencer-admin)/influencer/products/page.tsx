"use client";

import { useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { products, getCategory, formatKRW } from "@/lib/data";

// Deterministic commission rates by product index
const commissionRates = [12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14, 12, 15, 13, 14];

export default function InfluencerProductsPage() {
  const activeProducts = useMemo(
    () => products.filter((p) => p.status === "active"),
    []
  );

  const handleGenerateLink = (productName: string) => {
    toast.success("Deep link generated!", {
      description: `Link for "${productName}" has been created.`,
    });
  };

  return (
    <div id="page-inf-products" className="space-y-6">
      <div id="inf-products">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Products
        </h2>
        <p className="text-gray-500 mt-1">
          Browse products you can promote. Generate deep links to start earning.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeProducts.map((product, idx) => {
          const category = getCategory(product.categoryId);
          const commRate = commissionRates[idx % commissionRates.length];
          const discountedPrice = Math.round(
            product.price * (1 - product.discountRate / 100)
          );

          return (
            <Card key={product.id} className="overflow-hidden flex flex-col !pt-0 !gap-0">
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={product.images[0]}
                  alt={product.nameEn}
                  className="h-full w-full object-cover"
                />
                {product.discountRate > 0 && (
                  <Badge
                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-500"
                  >
                    -{product.discountRate}%
                  </Badge>
                )}
                <Badge
                  className="absolute top-2 left-2 text-white hover:bg-indigo-600"
                  style={{ backgroundColor: "#6366F1" }}
                >
                  {commRate}% commission
                </Badge>
              </div>

              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {category?.nameEn ?? "Other"}
                  </Badge>
                </div>

                <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                  {product.nameEn}
                </h3>

                <div className="flex items-baseline gap-2 mb-3">
                  {product.discountRate > 0 ? (
                    <>
                      <span className="text-lg font-bold text-gray-900">
                        {formatKRW(discountedPrice)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatKRW(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {formatKRW(product.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                  <span className="text-yellow-500">&#9733;</span>
                  <span>{product.rating}</span>
                  <span>({product.reviewCount} reviews)</span>
                </div>

                <div className="mt-auto">
                  <Button
                    className="w-full"
                    style={{ backgroundColor: "#6366F1", color: "white" }}
                    onClick={() => handleGenerateLink(product.nameEn)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Generate Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
