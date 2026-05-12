'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: string | number
  onSave: (next: string) => void
  format?: (v: string) => string
  type?: 'text' | 'number'
  id?: string
  className?: string
}

export function InlineEditableCell({ value, onSave, format, type = 'text', id, className }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(String(value))
  }, [value, editing])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commit() {
    setEditing(false)
    if (draft !== String(value)) onSave(draft)
  }

  function cancel() {
    setEditing(false)
    setDraft(String(value))
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }}
        className={cn('w-full rounded-md border border-primary bg-surface px-2 py-1 text-sm outline-none', className)}
      />
    )
  }
  return (
    <button
      id={id}
      type="button"
      onClick={() => setEditing(true)}
      className={cn('group inline-flex w-full items-center justify-between gap-1 rounded-md border border-transparent px-2 py-1 text-left text-sm hover:border-primary/40 hover:bg-surface-2', className)}
    >
      <span>{format ? format(String(value)) : String(value)}</span>
      <Pencil className="h-3 w-3 text-text-muted opacity-0 group-hover:opacity-100" aria-hidden />
    </button>
  )
}
