'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product } from '../data/products'

interface CartItem { product: Product; quantity: number; isSubscription: boolean }
interface CartCtx {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, isSubscription?: boolean) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const Ctx = createContext<CartCtx>({ items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {}, clearCart: () => {}, total: 0 })
export const useCart = () => useContext(Ctx)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('enerringer-cart')
    if (saved) try { setItems(JSON.parse(saved)) } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem('enerringer-cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1, isSubscription = false) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
      return [...prev, { product, quantity, isSubscription }]
    })
  }

  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.product.id !== productId))

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeItem(productId); return }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((acc, i) => acc + (i.isSubscription ? i.product.subscriptionPrice : i.product.price) * i.quantity, 0)

  return <Ctx.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>{children}</Ctx.Provider>
}
