'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CircleDot, RefreshCcw, X } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { integrations } from '@/data/integrations'
import type { IntegrationStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const stateColor: Record<IntegrationStatus['state'], string> = {
  connected: 'text-success',
  syncing: 'text-warn',
  error: 'text-danger',
  disconnected: 'text-text-muted',
}
const stateLabel: Record<IntegrationStatus['state'], string> = {
  connected: '연결됨',
  syncing: '동기화 중',
  error: '오류',
  disconnected: '미연결',
}

export default function IntegrationsPage() {
  const [logs, setLogs] = useState<IntegrationStatus | null>(null)

  function retry(key: string) {
    toast.success(`${key} 동기화를 재시도했어요 (mock)`)
  }

  return (
    <div>
      <AdminPageHeader
        title="외부 연동"
        description="ERP·사방넷·세금계산서·물류 4개 연동 상태와 동기화 로그"
      />

      <div className="grid gap-3 md:grid-cols-2">
        {integrations.map((it) => (
          <article
            key={it.key}
            id={`integration-card-${it.key}`}
            className="rounded-lg border bg-surface p-5"
          >
            <header className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-text-muted">{it.key}</p>
                <h2 className="mt-1 text-base font-semibold text-text">{it.label}</h2>
              </div>
              <span className={cn('inline-flex items-center gap-1 text-xs font-medium', stateColor[it.state])}>
                <CircleDot className="h-3.5 w-3.5" /> {stateLabel[it.state]}
              </span>
            </header>
            <p className="mt-2 text-xs text-text-muted">
              마지막 동기화 {it.lastSyncedAt.slice(0, 16).replace('T', ' ')}
            </p>
            <ul className="mt-3 space-y-1 text-xs">
              {it.logs.slice(0, 3).map((l, i) => (
                <li key={i} className={cn('rounded-md bg-surface-2 px-2 py-1', l.level === 'error' && 'bg-danger/10 text-danger')}>
                  <span className="text-text-muted">{l.at.slice(5, 16).replace('T', ' ')}</span>
                  <span className="ml-2">{l.msg}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                id="integration-sync-log"
                type="button"
                onClick={() => setLogs(it)}
                className="flex-1 rounded-md border bg-surface px-2 py-1.5 text-xs hover:bg-surface-2"
              >
                전체 로그
              </button>
              <button
                id={`integration-retry-${it.key}`}
                type="button"
                onClick={() => retry(it.label)}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-fg"
              >
                <RefreshCcw className="h-3 w-3" /> 재시도
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog.Root open={Boolean(logs)} onOpenChange={(o) => { if (!o) setLogs(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-surface p-6 shadow-md">
            <Dialog.Title className="text-base font-semibold">{logs?.label} 동기화 로그</Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-text-muted">
              최근 {logs?.logs.length}건. 데모 환경의 mock 데이터입니다.
            </Dialog.Description>
            <ul className="mt-4 max-h-80 space-y-1.5 overflow-y-auto text-sm">
              {logs?.logs.map((l, i) => (
                <li key={i} className={cn('rounded-md border bg-surface-2 px-3 py-2 text-xs', l.level === 'error' && 'border-danger/40 bg-danger/5 text-danger')}>
                  <p className="text-[11px] text-text-muted">{l.at.slice(0, 19).replace('T', ' ')}</p>
                  <p className="mt-0.5">{l.msg}</p>
                </li>
              ))}
            </ul>
            <Dialog.Close asChild>
              <button type="button" aria-label="닫기" className="absolute right-3 top-3 rounded-full bg-surface/90 p-1 hover:bg-surface-2">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
