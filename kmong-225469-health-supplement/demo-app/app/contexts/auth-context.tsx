'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserRole } from '../data/users'

interface AuthState {
  isLoggedIn: boolean
  userName: string
  role: UserRole
}

interface AuthContextType extends AuthState {
  login: (name: string, role?: UserRole) => void
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, userName: '', role: 'user' })

  useEffect(() => {
    const saved = localStorage.getItem('enerringer-auth')
    if (saved) {
      try { setAuth(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('enerringer-auth', JSON.stringify(auth))
  }, [auth])

  const login = (name: string, role: UserRole = 'user') => {
    setAuth({ isLoggedIn: true, userName: name, role })
  }

  const logout = () => {
    setAuth({ isLoggedIn: false, userName: '', role: 'user' })
  }

  const switchRole = (role: UserRole) => {
    setAuth(prev => ({ ...prev, role }))
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
