'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserRole } from './data';

interface AuthState {
  isLoggedIn: boolean;
  userName: string;
  userEmail: string;
  userId: string;
  role: UserRole;
}

interface AuthContextType extends AuthState {
  login: (name: string, email: string) => void;
  logout: () => void;
  toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('demo-auth');
      if (saved) return JSON.parse(saved);
    }
    return { isLoggedIn: false, userName: '', userEmail: '', userId: 'u1', role: 'user' as UserRole };
  });

  const login = useCallback((name: string, email: string) => {
    const state: AuthState = { isLoggedIn: true, userName: name || '데모 사용자', userEmail: email || 'demo@example.com', userId: 'u1', role: 'user' };
    setAuth(state);
    localStorage.setItem('demo-auth', JSON.stringify(state));
  }, []);

  const logout = useCallback(() => {
    const state: AuthState = { isLoggedIn: false, userName: '', userEmail: '', userId: 'u1', role: 'user' };
    setAuth(state);
    localStorage.removeItem('demo-auth');
  }, []);

  const toggleRole = useCallback(() => {
    setAuth(prev => {
      const next = { ...prev, role: (prev.role === 'user' ? 'admin' : 'user') as UserRole };
      localStorage.setItem('demo-auth', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
