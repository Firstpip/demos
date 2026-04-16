'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { members, type Member } from '@/data/members';

type Role = 'guest' | 'member' | 'admin';

interface AuthContextType {
  currentUser: Member | null;
  role: Role;
  isLoading: boolean;
  login: (loginId: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('b2b-role') as Role | null;
      const savedUser = localStorage.getItem('b2b-user');
      if (savedRole && savedRole !== 'guest') {
        setRole(savedRole);
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        } else if (savedRole === 'admin') {
          setCurrentUser(null);
        } else {
          const defaultMember = members.find(m => m.status === 'approved');
          if (defaultMember) {
            setCurrentUser(defaultMember);
            localStorage.setItem('b2b-user', JSON.stringify(defaultMember));
          }
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((loginId: string, _password: string) => {
    // Demo: any credentials work. Try to find matching member, otherwise use first approved.
    const found = members.find(m => m.loginId === loginId && m.status === 'approved');
    const member = found || members.find(m => m.status === 'approved')!;

    setCurrentUser(member);
    setRole('member');
    localStorage.setItem('b2b-role', 'member');
    localStorage.setItem('b2b-user', JSON.stringify(member));
    return true;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setRole('guest');
    localStorage.removeItem('b2b-role');
    localStorage.removeItem('b2b-user');
    localStorage.removeItem('b2b-cart');
  }, []);

  const switchRole = useCallback((newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('b2b-role', newRole);

    if (newRole === 'guest') {
      setCurrentUser(null);
      localStorage.removeItem('b2b-user');
    } else if (newRole === 'admin') {
      setCurrentUser(null);
      localStorage.removeItem('b2b-user');
    } else {
      const member = members.find(m => m.status === 'approved');
      if (member) {
        setCurrentUser(member);
        localStorage.setItem('b2b-user', JSON.stringify(member));
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, role, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
