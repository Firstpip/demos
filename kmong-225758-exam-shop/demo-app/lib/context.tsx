'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { products, type Product } from './data';

const STORAGE_KEY = 'edupress-demo';

function loadStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem(`${STORAGE_KEY}:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

// Auth Context
interface AuthContextType {
  isLoggedIn: boolean;
  role: 'user' | 'admin';
  userName: string;
  hydrated: boolean;
  login: (name: string) => void;
  logout: () => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [userName, setUserName] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const auth = loadStored<{ isLoggedIn: boolean; role: 'user' | 'admin'; userName: string }>('auth', {
      isLoggedIn: false,
      role: 'user',
      userName: '',
    });
    setIsLoggedIn(auth.isLoggedIn);
    setRole(auth.role);
    setUserName(auth.userName);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveStored('auth', { isLoggedIn, role, userName });
  }, [hydrated, isLoggedIn, role, userName]);

  const login = useCallback((name: string) => {
    setIsLoggedIn(true);
    setUserName(name || '홍길동');
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserName('');
    setRole('user');
  }, []);

  const toggleRole = useCallback(() => {
    setRole(prev => prev === 'user' ? 'admin' : 'user');
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userName, hydrated, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Cart Context
export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelect: (productId: number) => void;
  toggleSelectAll: () => void;
  removeSelected: () => void;
  clearCart: () => void;
  totalAmount: number;
  totalSelectedAmount: number;
  shippingFee: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStored<{ productId: number; quantity: number; selected: boolean }[]>('cart', []);
    const rehydrated: CartItem[] = stored
      .map(s => {
        const p = products.find(x => x.id === s.productId);
        return p ? { product: p, quantity: s.quantity, selected: s.selected } : null;
      })
      .filter((x): x is CartItem => x !== null);
    setItems(rehydrated);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveStored(
        'cart',
        items.map(i => ({ productId: i.product.id, quantity: i.quantity, selected: i.selected }))
      );
    }
  }, [hydrated, items]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const product = products.find(p => p.id === productId);
      if (!product) return prev;
      return [...prev, { product, quantity, selected: true }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const toggleSelect = useCallback((productId: number) => {
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setItems(prev => {
      const allSelected = prev.every(item => item.selected);
      return prev.map(item => ({ ...item, selected: !allSelected }));
    });
  }, []);

  const removeSelected = useCallback(() => {
    setItems(prev => prev.filter(item => !item.selected));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalAmount = items.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const totalSelectedAmount = items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  const shippingFee = totalSelectedAmount >= 30000 ? 0 : totalSelectedAmount > 0 ? 3000 : 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity,
      toggleSelect, toggleSelectAll, removeSelected, clearCart,
      totalAmount, totalSelectedAmount, shippingFee, itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// Toast Context
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm animate-slide-up ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
