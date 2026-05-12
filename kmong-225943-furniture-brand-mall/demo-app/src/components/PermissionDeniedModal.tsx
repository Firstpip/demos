'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Lock, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth'
import { brandById } from '@/data/brands'
import type { CmsAuditLog } from '@/lib/types'

interface DeniedState {
  open: boolean
  action: string
  partnerId: string
  loggedAt?: string
}

interface ContextValue {
  trigger: (action: string, partnerId?: string) => void
  pending: DeniedState
  appendLog: (log: CmsAuditLog) => void
  recentLogs: CmsAuditLog[]
}

const Ctx = createContext<ContextValue | null>(null)

export function PermissionDeniedProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [pending, setPending] = useState<DeniedState>({ open: false, action: '', partnerId: '' })
  const [recentLogs, setRecentLogs] = useState<CmsAuditLog[]>([])

  const trigger = useCallback((action: string, partnerId?: string) => {
    const target = partnerId ?? user.partnerBrandId ?? 'brand-raonwood'
    const at = new Date().toISOString()
    const log: CmsAuditLog = {
      id: `ca-runtime-${Date.now()}`,
      partnerId: target,
      userId: user.id,
      field: '__denied__',
      before: null,
      after: null,
      attemptedDeniedAction: action,
      at,
    }
    setRecentLogs((prev) => [log, ...prev])
    setPending({ open: true, action, partnerId: target, loggedAt: at })
  }, [user.id, user.partnerBrandId])

  const appendLog = useCallback((log: CmsAuditLog) => {
    setRecentLogs((prev) => [log, ...prev])
  }, [])

  const partnerName = brandById(pending.partnerId)?.name ?? '브랜드'

  return (
    <Ctx.Provider value={{ trigger, pending, appendLog, recentLogs }}>
      {children}
      <Dialog.Root open={pending.open} onOpenChange={(o) => setPending((p) => ({ ...p, open: o }))}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Dialog.Content
            id="permission-denied-modal"
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface p-6 shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-full bg-warn/15 p-2 text-warn">
                <ShieldAlert className="h-5 w-5" aria-hidden />
              </span>
              <div className="flex-1">
                <Dialog.Title className="text-base font-semibold text-text">
                  조합사 권한으로는 접근할 수 없습니다
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-text-muted">
                  {partnerName} 운영자 권한으로는 <strong className="text-text">{pending.action}</strong>을(를) 실행할 수 없습니다. 본체 관리자에게 요청해 주세요.
                </Dialog.Description>
                <p className="mt-3 inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-[11px] text-text-muted">
                  <Lock className="h-3 w-3" /> 시도 자동 로깅됨 · 변경 이력 카드에서 확인
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  id="permission-denied-action-back"
                  type="button"
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg"
                >
                  돌아가기
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Ctx.Provider>
  )
}

export function usePermissionDenied(): ContextValue {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePermissionDenied must be used within PermissionDeniedProvider')
  return ctx
}
