'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Role } from '@/lib/types'
import { useAuth } from '@/lib/contexts/auth'

interface Props {
  required: 'member' | 'admin' | 'partner' | Role[]
  redirectTo?: string
  children: React.ReactNode
}

export function AuthGuard({ required, redirectTo = '/sign-in', children }: Props) {
  const { hydrated, role } = useAuth()
  const router = useRouter()

  const isAllowed = (() => {
    if (!hydrated) return false
    if (Array.isArray(required)) return required.includes(role)
    if (required === 'member') return role === 'member' || role === 'admin' || role === 'partner'
    if (required === 'admin') return role === 'admin' || role === 'partner'
    if (required === 'partner') return role === 'partner' || role === 'admin'
    return false
  })()

  useEffect(() => {
    if (hydrated && !isAllowed) router.replace(redirectTo)
  }, [hydrated, isAllowed, redirectTo, router])

  if (!hydrated) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-text-muted text-sm">
        불러오는 중...
      </div>
    )
  }

  if (!isAllowed) return null
  return <>{children}</>
}
