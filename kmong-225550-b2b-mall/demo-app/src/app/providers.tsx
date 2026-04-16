'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { SearchProvider } from '@/contexts/SearchContext';
import Toast from '@/components/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
          <Toast />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
