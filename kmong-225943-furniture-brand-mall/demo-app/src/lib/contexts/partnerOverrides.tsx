'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/lib/types'

const STORAGE_KEY = 'kmong225943:partnerOverrides'

export interface BrandBanner {
  id: string
  title: string
  body: string
  cta: string
}

interface OverrideState {
  prices: Record<string, number>
  subtitles: Record<string, string>
  thumbs: Record<string, string>
  brandDesc: Record<string, string>
  curated: Record<string, string[]>
  brandBanners: Record<string, BrandBanner[]>
}

const initial: OverrideState = {
  prices: {}, subtitles: {}, thumbs: {},
  brandDesc: {}, curated: {}, brandBanners: {},
}

interface ContextValue extends OverrideState {
  hydrated: boolean
  setPrice: (productId: string, value: number) => void
  setSubtitle: (productId: string, value: string) => void
  setThumb: (productId: string, value: string) => void
  setBrandDesc: (brandId: string, html: string) => void
  addCurated: (brandId: string, productIds: string[]) => void
  removeCurated: (brandId: string, productId: string) => void
  moveCurated: (brandId: string, productId: string, direction: -1 | 1) => void
  resetCurated: (brandId: string) => void
  setBrandBanners: (brandId: string, banners: BrandBanner[]) => void
  apply: (product: Product) => Product
  applyBrandProducts: (brandId: string, products: Product[]) => Product[]
  reset: () => void
}

const Ctx = createContext<ContextValue | null>(null)

export function PartnerOverridesProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OverrideState>(initial)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OverrideState>
        setState({ ...initial, ...parsed })
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state, hydrated])

  const setPrice = useCallback((productId: string, value: number) => {
    setState((prev) => ({ ...prev, prices: { ...prev.prices, [productId]: value } }))
  }, [])
  const setSubtitle = useCallback((productId: string, value: string) => {
    setState((prev) => ({ ...prev, subtitles: { ...prev.subtitles, [productId]: value } }))
  }, [])
  const setThumb = useCallback((productId: string, value: string) => {
    setState((prev) => ({ ...prev, thumbs: { ...prev.thumbs, [productId]: value } }))
  }, [])
  const setBrandDesc = useCallback((brandId: string, html: string) => {
    setState((prev) => ({ ...prev, brandDesc: { ...prev.brandDesc, [brandId]: html } }))
  }, [])
  const addCurated = useCallback((brandId: string, productIds: string[]) => {
    setState((prev) => {
      const existing = prev.curated[brandId] ?? []
      const set = new Set(existing)
      const next = [...existing]
      productIds.forEach((id) => {
        if (!set.has(id)) {
          set.add(id)
          next.push(id)
        }
      })
      return { ...prev, curated: { ...prev.curated, [brandId]: next } }
    })
  }, [])
  const removeCurated = useCallback((brandId: string, productId: string) => {
    setState((prev) => {
      const existing = prev.curated[brandId] ?? []
      return { ...prev, curated: { ...prev.curated, [brandId]: existing.filter((id) => id !== productId) } }
    })
  }, [])
  const moveCurated = useCallback((brandId: string, productId: string, direction: -1 | 1) => {
    setState((prev) => {
      const current = prev.curated[brandId] ?? []
      const idx = current.indexOf(productId)
      if (idx < 0) return prev
      const target = idx + direction
      if (target < 0 || target >= current.length) return prev
      const next = [...current]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return { ...prev, curated: { ...prev.curated, [brandId]: next } }
    })
  }, [])
  const resetCurated = useCallback((brandId: string) => {
    setState((prev) => {
      const { [brandId]: _omit, ...rest } = prev.curated
      return { ...prev, curated: rest }
    })
  }, [])
  const setBrandBanners = useCallback((brandId: string, banners: BrandBanner[]) => {
    setState((prev) => ({ ...prev, brandBanners: { ...prev.brandBanners, [brandId]: banners } }))
  }, [])
  const reset = useCallback(() => setState(initial), [])

  const apply = useCallback(
    (product: Product): Product => ({
      ...product,
      priceSale: state.prices[product.id] ?? product.priceSale,
      subtitle: state.subtitles[product.id] ?? product.subtitle,
      thumbLetter: state.thumbs[product.id] ?? product.thumbLetter,
    }),
    [state.prices, state.subtitles, state.thumbs],
  )

  const applyBrandProducts = useCallback(
    (brandId: string, products: Product[]): Product[] => {
      const curated = state.curated[brandId] ?? []
      if (curated.length === 0) return products
      const byId = new Map(products.map((p) => [p.id, p]))
      return curated.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p))
    },
    [state.curated],
  )

  const value = useMemo<ContextValue>(
    () => ({
      ...state, hydrated,
      setPrice, setSubtitle, setThumb,
      setBrandDesc, addCurated, removeCurated, moveCurated, resetCurated, setBrandBanners,
      apply, applyBrandProducts, reset,
    }),
    [state, hydrated, setPrice, setSubtitle, setThumb, setBrandDesc, addCurated, removeCurated, moveCurated, resetCurated, setBrandBanners, apply, applyBrandProducts, reset],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePartnerOverrides(): ContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePartnerOverrides must be used within PartnerOverridesProvider')
  return ctx
}
