import Link from 'next/link'
import { ArrowRight, Camera, Film } from 'lucide-react'
import { lookbooks } from '@/data/lookbooks'
import { products } from '@/data/products'
import { contentModules } from '@/data/contentModules'
import { ContentModuleCard } from '@/components/ContentModuleCard'
import { ProductCard } from '@/components/ProductCard'

export default function MaholnHomePage() {
  const maholnProducts = products.filter((p) => p.brandId === 'brand-maholn')
  const featured = lookbooks.slice(0, 3)
  const reusedModules = contentModules.filter((m) => m.usedIn.includes('maholn-home'))

  return (
    <div>
      <section className="border-b border-[var(--maholn-text)]/10 bg-[var(--maholn-bg)]">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-6 py-20 lg:grid-cols-[1fr_auto] lg:py-28">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">2026 Spring Collection</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[var(--maholn-text)] sm:text-5xl">
              가구의 결을<br />기록하는 시간
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--maholn-text)]/70">
              마홀앤은 단단한 가구 한 점이 거실에 머무는 시간을 기록합니다. 봄의 첫 햇살이 닿는 자리, 가족의 결이 자라는 자리에 마홀앤이 있습니다.
            </p>
            <p className="mt-3 max-w-md text-[11px] leading-relaxed text-[var(--maholn-text)]/55">
              마홀앤은 가구페스타 협동조합의 자체 대표 브랜드입니다. 나머지 29개 조합사 브랜드는 본체 통합 쇼핑몰에서 운영되며, 마홀앤만 프리미엄 톤의 마이크로사이트로 별도 구성됩니다.
            </p>
            <div className="mt-6 flex gap-2">
              <Link
                href="/maholn/lookbook/2026-spring"
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--maholn-text)] px-4 py-2.5 text-sm font-medium text-[var(--maholn-bg)]"
              >
                2026 Spring 룩북 보기 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/brands/maholn"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--maholn-text)]/30 px-4 py-2.5 text-sm font-medium text-[var(--maholn-text)]"
              >
                본체에서 구매
              </Link>
            </div>
          </div>
          <div className="hidden h-[320px] w-[320px] shrink-0 items-center justify-center rounded-md bg-[var(--maholn-text)]/5 text-[180px] font-light text-[var(--maholn-text)]/30 lg:flex">
            春
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Lookbook</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--maholn-text)]">시즌의 결</h2>
          </div>
          <Link href="/maholn/lookbook/2026-spring" className="text-xs text-[var(--maholn-text)]/70 hover:text-[var(--maholn-text)]">
            전체 룩북
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((lb) => (
            <Link
              key={lb.id}
              href={`/maholn/lookbook/${lb.slug}`}
              className="group flex flex-col overflow-hidden border border-[var(--maholn-text)]/10 bg-[var(--maholn-bg)]"
            >
              <div className="flex aspect-[4/5] items-center justify-center bg-[var(--maholn-text)]/5 text-[120px] font-light text-[var(--maholn-text)]/30">
                {lb.heroLetter}
              </div>
              <div className="border-t border-[var(--maholn-text)]/10 p-4">
                <p className="text-[11px] uppercase tracking-wide text-[var(--maholn-text)]/60">{lb.publishedAt}</p>
                <p className="mt-1 text-sm font-medium tracking-wide text-[var(--maholn-text)]">{lb.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--maholn-text)]/70">{lb.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--maholn-text)]/10 bg-[var(--maholn-text)]/5">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Stories</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--maholn-text)]">동일한 카드, 본체에서도</h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--maholn-text)]/70">
                마이크로사이트의 룩북 카드는 본체 가구·상품 상세에서도 동일한 컴포넌트로 등장합니다. 브랜드의 결이 끊기지 않습니다.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {reusedModules.slice(0, 3).map((m) => (
              <ContentModuleCard key={m.id} module={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--maholn-text)]">Shop the Collection</h2>
          <Link href="/brands/maholn" className="text-xs text-[var(--maholn-text)]/70 hover:text-[var(--maholn-text)]">
            본체에서 모두 보기
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {maholnProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--maholn-text)]/10">
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <div className="mb-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Social</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--maholn-text)]">Instagram · YouTube</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative flex aspect-square items-center justify-center bg-[var(--maholn-text)]/5">
                <Camera className="h-6 w-6 text-[var(--maholn-text)]/40" aria-hidden />
                <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wide text-[var(--maholn-text)]/60">@maholn_official #{i}</span>
              </div>
            ))}
            <div className="relative flex aspect-square items-center justify-center bg-[var(--maholn-text)] text-[var(--maholn-bg)]">
              <Film className="h-7 w-7" aria-hidden />
              <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wide">시즌 필름</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
