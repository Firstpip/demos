"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Role } from "./data";

interface AuthState {
  isLoggedIn: boolean;
  role: Role;
  userName: string;
}

interface AuthContextType extends AuthState {
  login: (name: string, role?: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "demo-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    role: "consumer",
    userName: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAuth(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (state: AuthState) => {
    setAuth(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const login = (name: string, role: Role = "consumer") => {
    persist({ isLoggedIn: true, role, userName: name || "데모 사용자" });
  };

  const logout = () => {
    persist({ isLoggedIn: false, role: "consumer", userName: "" });
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: Role) => {
    persist({ ...auth, role, isLoggedIn: true, userName: auth.userName || "데모 사용자" });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
