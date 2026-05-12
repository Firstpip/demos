'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { RewardLedger } from '@/lib/types'
import { rewardLedger } from '@/data/orders'

const STORAGE_KEY = 'kmong225943:rewards'

interface RewardsContextValue {
  entries: RewardLedger[]
  hydrated: boolean
  addEntry: (entry: RewardLedger) => void
  balanceForUser: (userId: string) => number
  reset: () => void
}

const RewardsContext = createContext<RewardsContextValue | null>(null)

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<RewardLedger[]>(rewardLedger)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) setEntries(JSON.parse(raw) as RewardLedger[])
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries)) } catch { /* ignore */ }
  }, [entries, hydrated])

  const addEntry = useCallback((entry: RewardLedger) => {
    setEntries((prev) => [entry, ...prev])
  }, [])

  const balanceForUser = useCallback((userId: string) => {
    return entries.filter((e) => e.userId === userId).reduce((acc, e) => acc + e.delta, 0)
  }, [entries])

  const reset = useCallback(() => setEntries(rewardLedger), [])

  const value = useMemo<RewardsContextValue>(() => ({ entries, hydrated, addEntry, balanceForUser, reset }), [entries, hydrated, addEntry, balanceForUser, reset])

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>
}

export function useRewards(): RewardsContextValue {
  const ctx = useContext(RewardsContext)
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider')
  return ctx
}
