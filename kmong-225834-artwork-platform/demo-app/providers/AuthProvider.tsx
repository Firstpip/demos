"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserType } from "@/lib/types";

const STORAGE_KEY = "artwork225834:auth";

interface AuthSession {
  userId: string;
  type: UserType;
  name: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  hydrated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  scraps: string[];
  toggleScrap: (jobId: string) => void;
  myApplications: string[];
  addApplication: (jobId: string) => void;
  pendingJobAdjust: number;
  markJobApproved: () => void;
  markJobRejected: () => void;
  notificationCountOffset: number;
  bumpNotificationCount: () => void;
}

const defaultValue: AuthContextValue = {
  session: null,
  hydrated: false,
  login: () => {},
  logout: () => {},
  scraps: [],
  toggleScrap: () => {},
  myApplications: [],
  addApplication: () => {},
  pendingJobAdjust: 0,
  markJobApproved: () => {},
  markJobRejected: () => {},
  notificationCountOffset: 0,
  bumpNotificationCount: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultValue);

interface StoredState {
  session: AuthSession | null;
  scraps: string[];
  myApplications: string[];
  pendingJobAdjust: number;
  notificationCountOffset: number;
}

const defaultStored: StoredState = {
  session: null,
  scraps: [],
  myApplications: [],
  pendingJobAdjust: 0,
  notificationCountOffset: 0,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>(defaultStored);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredState>;
        setState({ ...defaultStored, ...parsed });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const login = useCallback((session: AuthSession) => {
    setState((s) => ({ ...s, session }));
  }, []);

  const logout = useCallback(() => {
    setState({ ...defaultStored });
  }, []);

  const toggleScrap = useCallback((jobId: string) => {
    setState((s) => ({
      ...s,
      scraps: s.scraps.includes(jobId)
        ? s.scraps.filter((id) => id !== jobId)
        : [...s.scraps, jobId],
    }));
  }, []);

  const addApplication = useCallback((jobId: string) => {
    setState((s) =>
      s.myApplications.includes(jobId)
        ? s
        : {
            ...s,
            myApplications: [...s.myApplications, jobId],
            notificationCountOffset: s.notificationCountOffset + 1,
          }
    );
  }, []);

  const markJobApproved = useCallback(() => {
    setState((s) => ({ ...s, pendingJobAdjust: s.pendingJobAdjust - 1 }));
  }, []);

  const markJobRejected = useCallback(() => {
    setState((s) => ({ ...s, pendingJobAdjust: s.pendingJobAdjust - 1 }));
  }, []);

  const bumpNotificationCount = useCallback(() => {
    setState((s) => ({ ...s, notificationCountOffset: s.notificationCountOffset + 1 }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session: state.session,
      hydrated,
      login,
      logout,
      scraps: state.scraps,
      toggleScrap,
      myApplications: state.myApplications,
      addApplication,
      pendingJobAdjust: state.pendingJobAdjust,
      markJobApproved,
      markJobRejected,
      notificationCountOffset: state.notificationCountOffset,
      bumpNotificationCount,
    }),
    [state, hydrated, login, logout, toggleScrap, addApplication, markJobApproved, markJobRejected, bumpNotificationCount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
