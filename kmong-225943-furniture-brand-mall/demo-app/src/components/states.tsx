'use client'

import { Inbox, AlertTriangle, RefreshCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-surface-2', className)} aria-hidden />
}

export function EmptyState({
  title,
  description,
  ctaLabel,
  onCta,
}: {
  title: string
  description: string
  ctaLabel?: string
  onCta?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-surface px-6 py-16 text-center">
      <Inbox className="h-9 w-9 text-text-muted" aria-hidden />
      <div>
        <p className="text-base font-medium text-text">{title}</p>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>
      {ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="mt-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg hover:opacity-90"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}

export function ErrorState({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-surface px-6 py-16 text-center" role="alert">
      <AlertTriangle className="h-9 w-9 text-warn" aria-hidden />
      <div>
        <p className="text-base font-medium text-text">{title}</p>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 rounded-md border bg-surface px-3 py-2 text-sm font-medium hover:bg-surface-2"
        >
          <RefreshCcw className="h-4 w-4" /> 다시 시도
        </button>
      )}
    </div>
  )
}
