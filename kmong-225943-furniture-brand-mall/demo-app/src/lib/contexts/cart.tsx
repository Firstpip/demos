'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { CartItem } from '@/lib/types'

const STORAGE_KEY = 'kmong225943:cart'

interface CartContextValue {
  items: CartItem[]
  hydrated: boolean
  addItem: (item: CartItem) => void
  updateQty: (productId: string, option: string, qty: number) => void
  removeItem: (productId: string, option: string) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw) as CartItem[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch { /* ignore */ }
  }, [items, hydrated])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId && i.option === item.option)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty }
        return next
      }
      return [...prev, item]
    })
  }, [])

  const updateQty = useCallback((productId: string, option: string, qty: number) => {
    setItems((prev) => prev.map((i) => i.productId === productId && i.option === option ? { ...i, qty: Math.max(1, qty) } : i))
  }, [])

  const removeItem = useCallback((productId: string, option: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.option === option)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => ({
    items,
    hydrated,
    addItem,
    updateQty,
    removeItem,
    clear,
    count: items.reduce((acc, i) => acc + i.qty, 0),
    subtotal: items.reduce((acc, i) => acc + i.qty * i.unitPrice, 0),
  }), [items, hydrated, addItem, updateQty, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
