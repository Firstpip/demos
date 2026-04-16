'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  optionValues: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, optionValues: string) => void;
  updateQuantity: (productId: string, optionValues: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('b2b-cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('b2b-cart', JSON.stringify(newItems));
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.optionValues === item.optionValues);
      let newItems: CartItem[];
      if (existing) {
        newItems = prev.map(i =>
          i.productId === item.productId && i.optionValues === item.optionValues
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...prev, item];
      }
      localStorage.setItem('b2b-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((productId: string, optionValues: string) => {
    setItems(prev => {
      const newItems = prev.filter(i => !(i.productId === productId && i.optionValues === optionValues));
      localStorage.setItem('b2b-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, optionValues: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => {
      const newItems = prev.map(i =>
        i.productId === productId && i.optionValues === optionValues
          ? { ...i, quantity }
          : i
      );
      localStorage.setItem('b2b-cart', JSON.stringify(newItems));
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalQuantity, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
