"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "./data";

export interface CartItem {
  product: Product;
  quantity: number;
  influencerId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, influencerId?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  totalItems: number;
  subtotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "demo-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  const addItem = (product: Product, quantity = 1, influencerId?: string) => {
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      persist(items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
      persist([...items, { product, quantity, influencerId }]);
    }
  };

  const removeItem = (productId: string) => {
    persist(items.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    persist(items.map((i) => i.product.id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    persist([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const coupons: Record<string, number> = {
      SARAH15: 15, MIKE10: 10, EMILY20: 20, DAVIDFIT: 5000,
      WELCOME2026: 10, SPRING30: 30, FREESHIP: 3000, JESSMOM: 12,
    };
    const upper = code.toUpperCase();
    if (coupons[upper] !== undefined) {
      setAppliedCoupon(upper);
      const val = coupons[upper];
      if (["DAVIDFIT", "FREESHIP"].includes(upper)) {
        setCouponDiscount(val);
      } else {
        setCouponDiscount(Math.round(subtotal * (val / 100)));
      }
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const getDiscountedPrice = (p: Product) => Math.round(p.price * (1 - p.discountRate / 100));

  const subtotal = items.reduce((s, i) => s + getDiscountedPrice(i.product) * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const total = Math.max(0, subtotal - couponDiscount);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, appliedCoupon, couponDiscount, applyCoupon, removeCoupon, totalItems, subtotal, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
