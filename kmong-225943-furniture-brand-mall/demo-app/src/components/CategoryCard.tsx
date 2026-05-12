import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { imageForCategory } from '@/data/categoryTree'

interface Props {
  category: string
  letter?: string
  productCount: number
  cap?: string
  imageUrl?: string
}

export function CategoryCard({ category, productCount, cap, imageUrl }: Props) {
  const src = imageUrl ?? imageForCategory(category)
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category)}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg border bg-surface-2"
    >
      <img
        src={src}
        alt={category}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
      {cap && (
        <p className="absolute left-4 top-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">{cap}</p>
      )}
      <div className="relative p-4 text-white">
        <p className="text-xl font-semibold drop-shadow-sm">{category}</p>
        <p className="mt-1 text-xs text-white/80">{productCount.toLocaleString()}점</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/95 transition group-hover:gap-2">
          Shop {category} <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
