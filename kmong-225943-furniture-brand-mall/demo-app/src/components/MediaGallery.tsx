'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  letters: string[]
  alt: string
}

export function MediaGallery({ letters, alt }: Props) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setActive((i) => (i === 0 ? letters.length - 1 : i - 1))
      if (e.key === 'ArrowRight') setActive((i) => (i === letters.length - 1 ? 0 : i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [letters.length])

  return (
    <div>
      <div
        id="product-gallery-main"
        aria-label={alt}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-surface-2"
      >
        <span role="img" aria-label={alt} className="text-[140px] font-light text-text-muted/50">{letters[active]}</span>
        {letters.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((i) => (i === 0 ? letters.length - 1 : i - 1))}
              aria-label="이전 이미지"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-surface/90 p-1.5 shadow-sm hover:bg-surface"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i === letters.length - 1 ? 0 : i + 1))}
              aria-label="다음 이미지"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-surface/90 p-1.5 shadow-sm hover:bg-surface"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <div role="tablist" aria-label="이미지 썸네일" className="mt-3 grid grid-cols-5 gap-2">
        {letters.map((l, i) => (
          <button
            key={i}
            id={`product-gallery-thumb-${i}`}
            type="button"
            role="tab"
            onClick={() => setActive(i)}
            aria-label={`이미지 ${i + 1}`}
            aria-selected={i === active}
            className={cn(
              'flex aspect-square items-center justify-center rounded-md border bg-surface-2 text-2xl font-light text-text-muted/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              i === active ? 'border-primary' : 'border-border hover:border-primary/50',
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}
