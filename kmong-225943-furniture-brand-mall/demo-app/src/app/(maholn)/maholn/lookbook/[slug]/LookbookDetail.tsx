'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import type { Lookbook, Product } from '@/lib/types'
import { LookbookHero } from '@/components/LookbookHero'
import { QuickViewModal } from '@/components/QuickViewModal'
import { ProductCard } from '@/components/ProductCard'
import { ContentModuleCard } from '@/components/ContentModuleCard'
import { contentModules } from '@/data/contentModules'
import { lookbooks } from '@/data/lookbooks'

interface Props {
  lookbook: Lookbook
  lookbookProducts: Product[]
}

const maholnLetters = new Set(['春', '夜', '輪', '時', '匠', '評', '結', '響'])

export function LookbookDetail({ lookbook, lookbookProducts }: Props) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const otherLookbooks = lookbooks.filter((l) => l.id !== lookbook.id).slice(0, 3)

  const reusedInModules = useMemo(() => {
    const heroLetterMatch = contentModules.filter((m) => m.letter === lookbook.heroLetter)
    const maholnMatch = contentModules.filter(
      (m) => maholnLetters.has(m.letter) && m.usedIn.includes('maholn-home') && m.usedIn.includes('product-detail'),
    )
    const merged = [...heroLetterMatch, ...maholnMatch]
    const seen = new Set<string>()
    return merged.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true))).slice(0, 3)
  }, [lookbook.heroLetter])

  const sameContentModules = useMemo(() => {
    return contentModules
      .filter((m) => maholnLetters.has(m.letter) && m.usedIn.includes('maholn-home'))
      .slice(0, 4)
  }, [])

  return (
    <div>
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mx-auto mt-4 max-w-[1280px] px-6 text-xs text-[var(--maholn-text)]/60">
        <span className="inline-flex items-center gap-1">
          <Link href="/maholn" className="hover:text-[var(--maholn-text)]">Maholn</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/maholn/lookbook/2026-spring" className="hover:text-[var(--maholn-text)]">Lookbook</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[var(--maholn-text)]">{lookbook.title}</span>
        </span>
      </nav>

      <section className="mx-auto mt-4 max-w-[1280px] px-6">
        <LookbookHero
          letter={lookbook.heroLetter}
          title={lookbook.title}
          subtitle={lookbook.subtitle}
          hotspots={lookbook.hotspots}
          slug={lookbook.slug}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-[var(--maholn-text)]/70">{lookbook.description}</p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Featured</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--maholn-text)]">룩북 안의 가구</h2>
            <p className="mt-1 text-xs text-[var(--maholn-text)]/70">아래 카드를 클릭하면 본체 상품 상세로 이동합니다 (계정·결제 통합).</p>
          </div>
          <Link href="/brands/maholn" className="inline-flex items-center gap-1 text-xs text-[var(--maholn-text)]/70 hover:text-[var(--maholn-text)]">
            본체로 가서 더 보기 <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div id="lookbook-product-grid" className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {lookbookProducts.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={() => setQuickViewProduct(p)} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--maholn-text)]/10 bg-[var(--maholn-text)]/5">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Same content, our own pace</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--maholn-text)]">마홀앤의 결</h2>
              <p className="mt-1 max-w-md text-xs text-[var(--maholn-text)]/70">아래 카드들은 본체 홈·상품 상세에서도 동일한 컴포넌트로 다시 등장합니다. 마이크로사이트와 본체의 결이 끊기지 않습니다.</p>
            </div>
          </div>
          <div id="lookbook-same-content-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sameContentModules.map((m) => (
              <ContentModuleCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Same module, different place</p>
        <h2 className="mt-1 mb-5 text-xl font-semibold tracking-tight text-[var(--maholn-text)]">본체에서도 동일하게</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reusedInModules.map((m) => (
            <ContentModuleCard key={m.id} module={m} />
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--maholn-text)]/60">
          위 카드는 본체 홈·상품 상세에서도 동일한 컴포넌트로 등장합니다. 마이크로사이트와 본체의 결이 끊기지 않습니다.
        </p>
      </section>

      <section className="border-t border-[var(--maholn-text)]/10">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-[var(--maholn-text)]">다른 룩북</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {otherLookbooks.map((l) => (
              <Link
                key={l.id}
                href={`/maholn/lookbook/${l.slug}`}
                className="group flex flex-col overflow-hidden border border-[var(--maholn-text)]/10 bg-[var(--maholn-bg)]"
              >
                <div className="flex aspect-[4/5] items-center justify-center bg-[var(--maholn-text)]/5 text-[100px] font-light text-[var(--maholn-text)]/30">
                  {l.heroLetter}
                </div>
                <div className="border-t border-[var(--maholn-text)]/10 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--maholn-text)]/60">{l.publishedAt}</p>
                  <p className="mt-1 text-sm font-medium text-[var(--maholn-text)]">{l.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onOpenChange={(o) => { if (!o) setQuickViewProduct(null) }}
      />
    </div>
  )
}
