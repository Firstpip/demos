import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { CategoryCard } from '@/components/CategoryCard'
import { BrandCard } from '@/components/BrandCard'
import { CollectionCard } from '@/components/CollectionCard'
import { ProductCard } from '@/components/ProductCard'
import { ContentModuleCard } from '@/components/ContentModuleCard'
import { collections } from '@/data/collections'
import { products } from '@/data/products'
import { brands } from '@/data/brands'
import { contentModules } from '@/data/contentModules'
import { categoryTree } from '@/data/categoryTree'


export default function HomePage() {
  const featuredCollections = collections.filter((c) => c.season === '26SS').slice(0, 4)
  const featuredProducts = products
    .filter((p) => p.badges.includes('NEW') || p.badges.includes('BEST'))
    .slice(0, 8)
  const featuredBrands = brands.filter((b) => b.partnerUserIds.length > 0 || b.isMicrosite).slice(0, 4)
  const homeBanner = contentModules.find((m) => m.id === 'cm-2')
  const homeStory = contentModules.find((m) => m.id === 'cm-3')
  const homeReview = contentModules.find((m) => m.id === 'cm-4')
  const maholnEntry = contentModules.find((m) => m.id === 'cm-1')
  const filterReview = contentModules.find((m) => m.id === 'cm-17')
  const partnerStory = contentModules.find((m) => m.id === 'cm-18')

  return (
    <>
      <Hero
        cap="2026 SPRING COLLECTION"
        heading="거실의 호흡을 다시"
        subheading="Warm Living 26SS, 마홀앤 큐레이션"
        description="30개 조합사가 함께 빚어낸 봄의 거실. 마홀앤 큐레이션과 시즌 컬렉션을 한 호흡으로 정리했습니다."
        ctas={[
          { href: '/collections/warm-living-26ss', label: 'Warm Living 보기', variant: 'primary' },
          { href: '/products', label: '전체 카탈로그', variant: 'ghost' },
        ]}
        heroLetter="春"
      />

      <section aria-label="가구" className="mx-auto max-w-[1280px] px-4 py-16">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">SHOP BY ROOM</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">가구 둘러보기</h2>
          </div>
          <Link href="/products" className="text-xs text-accent hover:underline">전체 가구</Link>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
          {categoryTree.map((node) => {
            const count = products.filter((p) => p.axes.category === node.category).length
            return (
              <CategoryCard
                key={node.category}
                category={node.category}
                letter={node.letter}
                productCount={count}
                cap="CATEGORY"
              />
            )
          })}
        </div>
      </section>

      <section aria-label="이번 시즌 컬렉션" className="mx-auto max-w-[1280px] px-4 py-16">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">EXPLORE COLLECTIONS</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">이번 주 컬렉션</h2>
            <p className="mt-1 text-sm text-text-muted">시즌·테마 단위로 정리된 이번 주 컬렉션입니다.</p>
          </div>
          <Link href="/collections" className="text-xs text-accent hover:underline">전체 보기</Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCollections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      </section>

      {homeBanner && (
        <section className="mx-auto max-w-[1280px] px-4 pb-4">
          <ContentModuleCard module={homeBanner} />
        </section>
      )}

      <section aria-label="신상·베스트" className="mx-auto max-w-[1280px] px-4 py-16">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">JUST ARRIVED</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">MD&apos;s Pick</h2>
          </div>
          <Link href="/products" className="text-xs text-accent hover:underline">전체 카탈로그</Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section aria-label="자체 운영 브랜드" className="mx-auto max-w-[1280px] px-4 py-16">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">HOUSE BRANDS</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">자체 운영 브랜드</h2>
            <p className="mt-1 text-sm text-text-muted">30개 조합사 중 4개는 자체 운영. 나머지는 협력 브랜드로 통합 운영됩니다.</p>
          </div>
          <Link href="/brands" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
            모든 브랜드 보기 <ArrowRight className="h-3 w-3" />
          </Link>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBrands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </section>

      {maholnEntry && (
        <section id="maholn-entry-banner" className="mx-auto max-w-[1280px] px-4 py-8">
          <ContentModuleCard module={maholnEntry} />
        </section>
      )}

      <section aria-label="브랜드 스토리·후기" className="mx-auto max-w-[1280px] grid gap-4 px-4 py-16 md:grid-cols-2">
        {homeStory && <ContentModuleCard module={homeStory} />}
        {homeReview && <ContentModuleCard module={homeReview} />}
      </section>

      <section aria-label="필터·운영 안내" className="mx-auto max-w-[1280px] grid gap-4 px-4 pb-16 md:grid-cols-2">
        {filterReview && <ContentModuleCard module={filterReview} />}
        {partnerStory && <ContentModuleCard module={partnerStory} />}
      </section>
    </>
  )
}
