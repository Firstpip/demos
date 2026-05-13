'use client'

import { useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { brandById } from '@/data/brands'
import { useCart } from '@/lib/contexts/cart'
import { formatKRW, cn } from '@/lib/utils'
import { productImage } from '@/lib/imagePath'

interface Props {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: Props) {
  const { addItem } = useCart()
  const [color, setColor] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [qty, setQty] = useState(1)

  useMemo(() => {
    if (product) {
      setColor(product.options.color[0] ?? '')
      setSize(product.options.size[0] ?? '')
      setQty(1)
    }
  }, [product])

  if (!product) return null
  const brand = brandById(product.brandId)
  const stockKey = `${color}|${size}`
  const stock = product.stock[stockKey] ?? 0
  const inStock = stock > 0

  function handleAdd() {
    if (!product || !inStock) return
    addItem({ productId: product.id, option: stockKey, qty, unitPrice: product.priceSale })
    toast.success(`${product.name} 장바구니에 담았어요`, { description: `${color} / ${size} · ${qty}개` })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 animate-fade-in" />
        <Dialog.Content
          id="quick-view-modal"
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-surface shadow-md animate-fade-in"
          aria-describedby={undefined}
        >
          <div className="grid gap-0 sm:grid-cols-[280px_1fr]">
            <div className="relative aspect-square overflow-hidden bg-surface-2">
              <img
                src={productImage(product.axes.category, product.axes.subCategory, product.id, 0, { name: product.name, slug: product.slug })}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 p-5">
              <Dialog.Title asChild>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{brand?.name}</p>
                  <p className="mt-0.5 text-base font-semibold text-text">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.subtitle}</p>
                </div>
              </Dialog.Title>
              <p className="text-lg font-semibold">{formatKRW(product.priceSale)}</p>
              <div className="space-y-2">
                <div>
                  <p id="quick-color-label" className="mb-1 text-xs text-text-muted">색상</p>
                  <div role="radiogroup" aria-labelledby="quick-color-label" className="flex flex-wrap gap-1.5">
                    {product.options.color.map((c) => (
                      <button
                        key={c}
                        id={`quick-option-color-${c}`}
                        type="button"
                        role="radio"
                        aria-checked={color === c}
                        onClick={() => setColor(c)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setColor(c) } }}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          color === c ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p id="quick-size-label" className="mb-1 text-xs text-text-muted">사이즈</p>
                  <div role="radiogroup" aria-labelledby="quick-size-label" className="flex flex-wrap gap-1.5">
                    {product.options.size.map((s) => (
                      <button
                        key={s}
                        id={`quick-option-size-${s}`}
                        type="button"
                        role="radio"
                        aria-checked={size === s}
                        onClick={() => setSize(s)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSize(s) } }}
                        className={cn(
                          'rounded-md border px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          size === s ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface text-text-muted hover:border-primary',
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-text-muted">수량</p>
                  <div className="inline-flex items-center rounded-md border bg-surface">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2 py-1 text-sm">-</button>
                    <span className="w-8 text-center text-sm">{qty}</span>
                    <button type="button" onClick={() => setQty((q) => q + 1)} className="px-2 py-1 text-sm">+</button>
                  </div>
                  <p className="text-xs text-text-muted">{inStock ? `남은 재고 ${stock}` : '품절'}</p>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  id="quick-view-add-cart"
                  type="button"
                  onClick={handleAdd}
                  disabled={!inStock}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-fg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" /> 장바구니
                </button>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center justify-center rounded-md border bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-2"
                >
                  상세 보기
                </Link>
              </div>
            </div>
          </div>
          <Dialog.Close asChild>
            <button type="button" aria-label="닫기" className="absolute right-3 top-3 rounded-full bg-surface/90 p-1 hover:bg-surface-2">
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
