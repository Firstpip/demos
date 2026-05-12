'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DropdownOption {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  ariaLabel?: string
  id?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = '선택하세요',
  ariaLabel,
  id,
  className,
  triggerClassName,
  disabled,
  size = 'md',
}: Props) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const baseId = useId()
  const listId = `${id ?? baseId}-list`

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        listRef.current && !listRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open) {
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    }
  }, [open, selectedIndex])

  function commit(idx: number) {
    const opt = options[idx]
    if (!opt) return
    onChange(opt.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKey(e: React.KeyboardEvent) {
    if (disabled) return
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (activeIndex >= 0) commit(activeIndex)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIndex(options.length - 1)
    }
  }

  const paddingY = size === 'sm' ? 'py-1' : 'py-1.5'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className={cn('relative inline-block', className)} onKeyDown={onKey}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'inline-flex w-full min-w-[140px] items-center justify-between gap-2 rounded-md border bg-surface px-2.5 text-text outline-none',
          'hover:border-primary/50 focus-visible:border-primary',
          paddingY, textSize,
          disabled && 'cursor-not-allowed opacity-50',
          triggerClassName,
        )}
      >
        <span className={cn('truncate', !selected && 'text-text-muted')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-text-muted transition', open && 'rotate-180')} />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
          className="absolute left-0 z-30 mt-1 max-h-72 min-w-full overflow-y-auto rounded-md border bg-surface py-1 shadow-md animate-fade-in"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            const isActive = i === activeIndex
            return (
              <li
                id={`${listId}-opt-${i}`}
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => { e.preventDefault(); commit(i) }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 px-2.5',
                  paddingY, textSize,
                  isActive ? 'bg-surface-2 text-text' : 'text-text-muted',
                  isSelected && 'text-text',
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-accent" aria-hidden />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
