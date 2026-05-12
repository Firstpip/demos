'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Role, User } from '@/lib/types'
import { presetByRole, userById, users } from '@/data/users'

const STORAGE_KEY = 'kmong225943:auth'

interface AuthState {
  userId: string
  role: Role
}

interface AuthContextValue extends AuthState {
  user: User
  hydrated: boolean
  signInAs: (role: Role) => void
  signInById: (userId: string) => void
  signOut: () => void
  isLoggedIn: boolean
}

const initial: AuthState = { userId: presetByRole.guest, role: 'guest' }

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initial)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AuthState
        if (parsed?.userId && parsed?.role) {
          setState(parsed)
        }
      }
    } catch {
      /* corrupt cache, fall back to initial */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated])

  const signInAs = useCallback((role: Role) => {
    const userId = presetByRole[role]
    setState({ userId, role })
  }, [])

  const signInById = useCallback((userId: string) => {
    const user = userById(userId)
    if (!user) return
    setState({ userId: user.id, role: user.role })
  }, [])

  const signOut = useCallback(() => {
    setState(initial)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const user = userById(state.userId) ?? users[0]
    return {
      ...state,
      user,
      hydrated,
      signInAs,
      signInById,
      signOut,
      isLoggedIn: state.role !== 'guest',
    }
  }, [state, hydrated, signInAs, signInById, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
