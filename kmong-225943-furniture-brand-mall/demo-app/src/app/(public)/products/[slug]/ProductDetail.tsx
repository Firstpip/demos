'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ShoppingBag, BellRing } from 'lucide-react'
import { toast } from 'sonner'
import type { Product, Review } from '@/lib/types'
import { brandById } from '@/data/brands'
import { products } from '@/data/products'
import { coupons } from '@/data/coupons'
import { reviewsByProduct, qnaByProduct } from '@/data/reviews'
import { contentModules } from '@/data/contentModules'
import { useCart } from '@/lib/contexts/cart'
import { usePartnerOverrides } from '@/lib/contexts/partnerOverrides'
import { formatKRW, formatDate, cn } from '@/lib/utils'
import { MediaGallery } from '@/components/MediaGallery'
import { TabsPanel } from '@/components/TabsPanel'
import { StarRating, RatingDistribution } from '@/components/StarRating'
import { ShippingCalculator } from '@/components/ShippingCalculator'
import { ShareButtons } from '@/components/ShareButtons'
import { ProductCard } from '@/components/ProductCard'
import { ContentModuleCard } from '@/components/ContentModuleCard'
import { EmptyState } from '@/components/states'

interface Props {
  product: Product
}

const FREE_SHIPPING_THRESHOLD = 70000
type ReviewSortKey = 'recent' | 'rating' | 'helpful'

export function ProductDetail({ product: original }: Props) {
  const router = useRouter()
  const { addItem } = useCart()
  const { apply } = usePartnerOverrides()
  const product = apply(original)
  const brand = brandById(product.brandId)
  const isMaholn = brand?.isMicrosite
  const productReviews = useMemo(() => reviewsByProduct(product.id), [product.id])
  const productQna = useMemo(() => qnaByProduct(product.id), [product.id])

  const [color, setColor] = useState(product.options.color[0] ?? '')
  const [size, setSize] = useState(product.options.size[0] ?? '')
  const [qty, setQty] = useState(1)
  const [reviewSort, setReviewSort] = useState<ReviewSortKey>('recent')
  const [photoOnly, setPhotoOnly] = useState(false)
  const [openQna, setOpenQna] = useState<string | null>(null)
  const [helpful, setHelpful] = useState<Record<string, number>>({})

  const stockKey = `${color}|${size}`
  const stock = product.stock[stockKey] ?? 0
  const inStock = stock > 0

  const discount = product.priceRegular > product.priceSale
    ? Math.round(((product.priceRegular - product.priceSale) / product.priceRegular) * 100)
    : 0
  const couponPrice = Math.round(product.priceSale * 0.95 / 1000) * 1000
  const lineTotal = product.priceSale * qty
  const freeShippingProgress = Math.min(100, Math.round((lineTotal / FREE_SHIPPING_THRESHOLD) * 100))

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]
    productReviews.forEach((r) => { dist[r.rating - 1] += 1 })
    return dist
  }, [productReviews])

  const filteredReviews = useMemo(() => {
    const list = photoOnly ? productReviews.filter((r) => r.hasPhoto) : productReviews
    const sorted = [...list]
    if (reviewSort === 'recent') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (reviewSort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (reviewSort === 'helpful') sorted.sort((a, b) => (b.helpfulCount + (helpful[b.id] ?? 0)) - (a.helpfulCount + (helpful[a.id] ?? 0)))
    return sorted
  }, [productReviews, photoOnly, reviewSort, helpful])

  const related = useMemo(() => {
    const sameCollection = products.filter((p) =>
      p.id !== product.id && p.collectionIds.some((c) => product.collectionIds.includes(c)),
    ).slice(0, 4)
    const sameBrand = products.filter((p) =>
      p.id !== product.id && p.brandId === product.brandId && !sameCollection.includes(p),
    ).slice(0, 4)
    return { sameCollection, sameBrand }
  }, [product.id, product.brandId, product.collectionIds])

  const applicableCoupons = useMemo(
    () => coupons.filter((c) => lineTotal >= c.minOrder).slice(0, 4),
    [lineTotal],
  )

  function handleAddCart() {
    if (!inStock) return
    addItem({ productId: product.id, option: stockKey, qty, unitPrice: product.priceSale })
    toast.success(`${product.name} 장바구니에 담았어요`, { description: `${color} / ${size} · ${qty}개` })
  }

  function handleBuyNow() {
    if (!inStock) return
    addItem({ productId: product.id, option: stockKey, qty, unitPrice: product.priceSale })
    router.push('/checkout')
  }

  function handleHelpful(reviewId: string) {
    setHelpful((prev) => ({ ...prev, [reviewId]: (prev[reviewId] ?? 0) + 1 }))
    toast.success('도움이 됐어요로 표시했어요')
  }

  function handleRestockNotify() {
    toast.success('입고 알림을 신청했어요', { description: '재입고 시 알림으로 안내드립니다.' })
  }

  function handleAskQna() {
    toast.info('1:1 문의 폼이 열립니다 (데모에서는 mock 처리).')
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8">
      <nav id="breadcrumb-nav" aria-label="브레드크럼" className="mb-3 flex items-center gap-1 text-xs text-text-muted">
        <Link href="/" className="hover:text-text">홈</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${encodeURIComponent(product.axes.category)}`} className="hover:text-text">{product.axes.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/brands/${brand?.slug}`} className="hover:text-text">{brand?.name}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <MediaGallery letters={product.galleryLetters} alt={product.name} />

        <div className="flex flex-col gap-5">
          <div>
            <Link href={`/brands/${brand?.slug}`} className="text-[11px] font-medium uppercase tracking-wide text-text-muted hover:text-text">
              {brand?.name}
            </Link>
            <h1 className="mt-1 text-2xl font-semibold text-text">{product.name}</h1>
            <p className="mt-1 text-sm text-text-muted">{product.subtitle}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.badges.map((b) => (
                <span
                  key={b}
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[10px] font-medium',
                    b === 'NEW' && 'bg-success text-white',
                    b === 'BEST' && 'bg-accent text-white',
                    b === 'LIMITED' && 'bg-danger text-white',
                  )}
                >
                  {b}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <StarRating value={product.rating} /> {product.rating.toFixed(1)} · 후기 {product.reviewCount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="rounded-lg border bg-surface p-4">
            <div className="flex items-baseline gap-2">
              {discount > 0 && <span className="text-base font-semibold text-danger">{discount}%</span>}
              <span className="text-2xl font-semibold text-text">{formatKRW(product.priceSale)}</span>
              {discount > 0 && (
                <span className="text-sm text-text-muted line-through">{formatKRW(product.priceRegular)}</span>
              )}
            </div>
            <p className="mt-1 text-sm text-text-muted">
              쿠폰가 <strong className="text-text">{formatKRW(couponPrice)}</strong> · 적립 {product.rewardPoint.toLocaleString()}P
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-text">색상</p>
              <div className="flex flex-wrap gap-1.5">
                {product.options.color.map((c) => (
                  <button
                    key={c}
                    id={`option-color-${c}`}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs',
                      color === c ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-text">사이즈</p>
              <div className="flex flex-wrap gap-1.5">
                {product.options.size.map((s) => {
                  const combo = `${color}|${s}`
                  const sStock = product.stock[combo] ?? 0
                  const disabled = sStock === 0
                  return (
                    <button
                      key={s}
                      id={`option-size-${s}`}
                      type="button"
                      onClick={() => !disabled && setSize(s)}
                      disabled={disabled}
                      className={cn(
                        'rounded-md border px-3 py-1 text-xs',
                        size === s ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
                        disabled && 'cursor-not-allowed opacity-40 line-through',
                      )}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-text">수량</p>
              <div className="inline-flex items-center rounded-md border bg-surface">
                <button id="qty-minus" type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2.5 py-1.5 text-sm" aria-label="수량 감소">-</button>
                <input
                  id="qty-input"
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  className="w-12 border-x bg-transparent text-center text-sm outline-none"
                  aria-label="수량"
                  min={1}
                />
                <button id="qty-plus" type="button" onClick={() => setQty((q) => q + 1)} className="px-2.5 py-1.5 text-sm" aria-label="수량 증가">+</button>
              </div>
              <p id="stock-status" className={cn('text-xs', !inStock ? 'text-danger' : stock <= 5 ? 'text-warn font-medium' : 'text-text-muted')}>
                {inStock ? (stock <= 5 ? `마지막 ${stock}개 남았습니다` : `남은 재고 ${stock}`) : '품절'}
              </p>
            </div>
            {!inStock && (
              <button
                id="restock-notify-button"
                type="button"
                onClick={handleRestockNotify}
                className="inline-flex items-center gap-1 rounded-md border bg-surface px-3 py-1.5 text-xs hover:bg-surface-2"
              >
                <BellRing className="h-3.5 w-3.5" /> 재입고 알림 받기
              </button>
            )}
          </div>

          <div className="rounded-lg border bg-surface-2 p-4">
            <p className="text-xs text-text-muted">
              합계 <strong className="text-text">{formatKRW(lineTotal)}</strong> · 무료 배송까지 {Math.max(0, FREE_SHIPPING_THRESHOLD - lineTotal).toLocaleString()}원
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-success" style={{ width: `${freeShippingProgress}%` }} aria-hidden />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {applicableCoupons.map((c) => (
                <span key={c.id} className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] text-text">
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              id="add-to-cart"
              type="button"
              onClick={handleAddCart}
              disabled={!inStock}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border bg-surface px-4 py-3 text-sm font-medium hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> 장바구니
            </button>
            <button
              id="buy-now"
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-fg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              바로구매
            </button>
          </div>

          <ShareButtons url={`https://demo.gagumall.kr/products/${product.slug}`} title={product.name} />
        </div>
      </div>

      <section className="mt-12">
        <TabsPanel
          items={[
            {
              key: 'description',
              label: '상세 설명',
              content: (
                <div className="rich-content max-w-3xl text-sm text-text" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
              ),
            },
            {
              key: 'review',
              label: '후기',
              count: productReviews.length,
              content: productReviews.length === 0 ? (
                <EmptyState
                  title="아직 후기가 없어요"
                  description="첫 후기를 남겨 다른 분들께 도움이 되어 보세요."
                />
              ) : (
                <ReviewSection
                  productId={product.id}
                  rating={product.rating}
                  distribution={ratingDistribution}
                  reviews={filteredReviews}
                  sort={reviewSort}
                  onSort={setReviewSort}
                  photoOnly={photoOnly}
                  onPhotoOnly={setPhotoOnly}
                  onHelpful={handleHelpful}
                  helpful={helpful}
                />
              ),
            },
            {
              key: 'qna',
              label: 'Q&A',
              count: productQna.length,
              content: (
                <div className="max-w-3xl space-y-2">
                  <div className="mb-3 flex justify-end">
                    <button
                      id="qna-ask-button"
                      type="button"
                      onClick={handleAskQna}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg"
                    >
                      문의하기
                    </button>
                  </div>
                  {productQna.length === 0 ? (
                    <EmptyState
                      title="아직 등록된 문의가 없어요"
                      description="궁금한 점은 위 문의하기 버튼으로 남겨주세요. 영업일 1일 내 답변드립니다."
                    />
                  ) : null}
                  {productQna.map((q) => {
                    const isOpen = openQna === q.id
                    return (
                      <div key={q.id} id={`qna-accordion-${q.id}`} className="rounded-md border bg-surface">
                        <button
                          type="button"
                          onClick={() => setOpenQna(isOpen ? null : q.id)}
                          className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm"
                          aria-expanded={isOpen}
                        >
                          <span className="font-medium text-text">Q. {q.question}</span>
                          <span className="text-xs text-text-muted">{q.answer ? '답변 완료' : '답변 대기'}</span>
                        </button>
                        {isOpen && (
                          <div className="border-t bg-surface-2 px-3 py-2.5 text-sm text-text-muted">
                            {q.answer ? `A. ${q.answer}` : '아직 답변이 등록되지 않았습니다. 영업일 기준 1일 이내 답변드립니다.'}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ),
            },
            {
              key: 'shipping',
              label: '배송·환불',
              content: <ShippingCalculator deliveryDays={product.axes.deliveryDays} />,
            },
          ]}
        />
      </section>

      {related.sameCollection.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-text">이 컬렉션의 다른 가구</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {related.sameCollection.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {related.sameBrand.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-text">{brand?.name}의 다른 가구</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {related.sameBrand.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {isMaholn && (
        <section className="mt-12 rounded-lg border bg-surface-2 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Brand Story</p>
          <h2 className="mt-1 text-lg font-semibold text-text">마홀앤 — 가구의 결을 기록하는 시간</h2>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            마홀앤은 단단한 가구 한 점이 거실에 머무는 시간을 기록합니다. 봄의 햇살이 닿는 자리, 침실의 첫 호흡이 이루어지는 자리, 가족의 결이 자라는 자리에 마홀앤의 가구가 있습니다.
          </p>
          <Link href="/maholn" className="mt-3 inline-flex text-xs font-medium text-accent hover:underline">
            마홀앤 마이크로사이트로 가기
          </Link>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {contentModules
              .filter((m) => m.usedIn.includes('product-detail'))
              .slice(0, 3)
              .map((m) => (
                <ContentModuleCard key={m.id} module={m} />
              ))}
          </div>
        </section>
      )}
    </div>
  )
}

interface ReviewSectionProps {
  productId: string
  rating: number
  distribution: number[]
  reviews: Review[]
  sort: ReviewSortKey
  onSort: (k: ReviewSortKey) => void
  photoOnly: boolean
  onPhotoOnly: (v: boolean) => void
  onHelpful: (id: string) => void
  helpful: Record<string, number>
}

function ReviewSection({ rating, distribution, reviews, sort, onSort, photoOnly, onPhotoOnly, onHelpful, helpful }: ReviewSectionProps) {
  return (
    <div className="grid gap-8 md:grid-cols-[260px_1fr]">
      <aside className="rounded-lg border bg-surface p-4">
        <p className="text-xs text-text-muted">평균 평점</p>
        <p className="mt-1 text-3xl font-semibold text-text">{rating.toFixed(1)}</p>
        <StarRating value={rating} size={16} className="mt-1" />
        <p className="mt-1 text-xs text-text-muted">후기 {reviews.length.toLocaleString()}개</p>
        <div className="mt-4">
          <RatingDistribution distribution={distribution} />
        </div>
      </aside>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {(['recent', 'rating', 'helpful'] as ReviewSortKey[]).map((k) => (
            <button
              key={k}
              id={`review-sort-${k}`}
              type="button"
              onClick={() => onSort(k)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs',
                sort === k ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted',
              )}
            >
              {k === 'recent' ? '최신순' : k === 'rating' ? '평점순' : '도움순'}
            </button>
          ))}
          <label id="review-photo-only" className="ml-2 inline-flex items-center gap-1 text-xs text-text-muted">
            <input type="checkbox" checked={photoOnly} onChange={(e) => onPhotoOnly(e.target.checked)} />
            사진 후기만
          </label>
        </div>
        <ul className="space-y-3">
          {reviews.slice(0, 8).map((r) => {
            const totalHelpful = r.helpfulCount + (helpful[r.id] ?? 0)
            return (
              <li key={r.id} className="rounded-md border bg-surface p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} />
                    <span className="text-xs text-text-muted">{formatDate(r.createdAt)}</span>
                    {r.hasPhoto && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-muted">사진</span>}
                  </div>
                  <button
                    id={`helpful-button-${r.id}`}
                    type="button"
                    onClick={() => onHelpful(r.id)}
                    className="rounded-md border bg-surface px-2 py-0.5 text-[11px] text-text-muted hover:bg-surface-2"
                  >
                    도움이 됐어요 {totalHelpful}
                  </button>
                </div>
                <p className="text-sm text-text">{r.body}</p>
              </li>
            )
          })}
        </ul>
        {reviews.length > 8 && (
          <p className="mt-3 text-center text-xs text-text-muted">
            (데모에서는 상위 8개 후기만 표시)
          </p>
        )}
      </div>
    </div>
  )
}

