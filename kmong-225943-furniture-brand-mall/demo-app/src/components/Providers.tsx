'use client'

import { useEffect, useRef } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/lib/contexts/auth'
import { CartProvider, useCart } from '@/lib/contexts/cart'
import { RewardsProvider } from '@/lib/contexts/rewards'
import { PartnerOverridesProvider } from '@/lib/contexts/partnerOverrides'
import { PermissionDeniedProvider } from './PermissionDeniedModal'

function AuthSyncEffect() {
  const { user, hydrated } = useAuth()
  const { clear, hydrated: cartHydrated } = useCart()
  const prevUserId = useRef<string | null>(null)

  useEffect(() => {
    if (!hydrated || !cartHydrated) return
    if (prevUserId.current !== null && prevUserId.current !== user.id) {
      clear()
    }
    prevUserId.current = user.id
  }, [user.id, hydrated, cartHydrated, clear])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <RewardsProvider>
          <PartnerOverridesProvider>
            <PermissionDeniedProvider>
              <AuthSyncEffect />
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </PermissionDeniedProvider>
          </PartnerOverridesProvider>
        </RewardsProvider>
      </CartProvider>
    </AuthProvider>
  )
}
