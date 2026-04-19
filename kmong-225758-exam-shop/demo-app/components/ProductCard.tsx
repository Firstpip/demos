'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { type Product } from '@/lib/data';
import { formatPrice, generateBookCover } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const cover = generateBookCover(product.title, product.category);

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* 책 커버 */}
        <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: cover.bg + '15' }}>
          <div
            className="absolute inset-4 rounded-md shadow-md flex flex-col items-center justify-center p-4 text-center"
            style={{ backgroundColor: cover.bg }}
          >
            {(product.isNew || product.isBest) && (
              <div className="absolute top-2 left-2 flex gap-1">
                {product.isBest && (
                  <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded">BEST</span>
                )}
                {product.isNew && (
                  <span className="px-1.5 py-0.5 bg-white text-gray-800 text-[10px] font-bold rounded">NEW</span>
                )}
              </div>
            )}
            <span className="text-white/60 text-xs mb-1">{product.category}</span>
            <h3 className="text-white font-bold text-sm leading-tight line-clamp-3">{product.title}</h3>
            <span className="text-white/70 text-xs mt-2">{product.author}</span>
          </div>
        </div>

        {/* ��품 정보 */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#1B2A4A] min-h-[2.5rem]">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{product.author}</p>
          <div className="mt-2">
            {product.discountRate > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[#E8653A] font-bold text-sm">{product.discountRate}%</span>
                <span className="text-gray-400 text-xs line-through">{formatPrice(product.price)}</span>
              </div>
            )}
            <p className="text-base font-bold text-gray-900">{formatPrice(product.salePrice)}</p>
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating} ({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
