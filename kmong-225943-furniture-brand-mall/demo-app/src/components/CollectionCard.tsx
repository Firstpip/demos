import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Collection } from '@/lib/types'
import { collectionImage } from '@/lib/imagePath'

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      id={`collection-card-${collection.slug}`}
      href={`/collections/${collection.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-surface transition hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-surface-2 overflow-hidden">
        <img
          src={collectionImage(collection.slug)}
          alt={collection.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-surface/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
          {collection.season}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-base font-semibold text-text">{collection.title}</p>
        <p className="line-clamp-2 text-sm text-text-muted">{collection.subtitle}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent group-hover:gap-2">
          탐색하기 <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
