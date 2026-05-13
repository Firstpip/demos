'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, ArrowUpRight } from 'lucide-react'
import { categoryTree } from '@/data/categoryTree'
import { products } from '@/data/products'
import { cn } from '@/lib/utils'

interface Props {
  label?: string
}

const categoryAccent: Record<string, string> = {
  '거실': '#5C4632',
  '침실': '#7A6A4F',
  '주방·다이닝': '#A86F2A',
  '서재·홈오피스': '#3F3A33',
  '수납': '#6F6353',
  '조명': '#C58F2A',
  '키즈': '#A89272',
  '아웃도어': '#4F5B3F',
}

export function MegaMenu({ label = '카테고리' }: Props) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string>(categoryTree[0]?.category ?? '')
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  function handleEnter() {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    setOpen(true)
  }
  function handleLeave() {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 220)
  }

  const hoveredNode = categoryTree.find((c) => c.category === hovered) ?? categoryTree[0]
  const hoveredCount = products.filter((p) => p.axes.category === hoveredNode.category).length

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn('inline-flex items-center gap-1 text-sm hover:text-text', open ? 'text-text' : 'text-text-muted')}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div
          role="menu"
          className="fixed left-0 right-0 top-[88px] z-30 border-t border-b bg-surface shadow-md animate-fade-in"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[7fr_5fr]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {categoryTree.map((node) => {
                const count = products.filter((p) => p.axes.category === node.category).length
                const isHovered = node.category === hovered
                const accent = categoryAccent[node.category] ?? '#5C4632'
                return (
                  <Link
                    key={node.category}
                    href={`/products?category=${encodeURIComponent(node.category)}`}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setHovered(node.category)}
                    onFocus={() => setHovered(node.category)}
                    className={cn(
                      'group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-lg border transition',
                      isHovered ? 'border-primary shadow-md' : 'border-border hover:border-primary/40',
                    )}
                    style={{ backgroundColor: accent + '18' }}
                  >
                    <img
                      src={node.imageUrl}
                      alt={node.category}
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover opacity-30 transition group-hover:opacity-45 group-hover:scale-105"
                    />
                    <div className="relative">
                      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">CATEGORY</p>
                    </div>
                    <div className="relative">
                      <p className="text-sm font-semibold text-text">{node.category}</p>
                      <p className="mt-0.5 text-[11px] text-text-muted">{count}점 · {node.subCategories.length}개 세부</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-accent">
                        탐색하기 <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            <aside className="rounded-lg border bg-surface-2 p-5">
              <header className="mb-4 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted">DRILL DOWN</p>
                  <h3 className="mt-0.5 text-lg font-semibold text-text">{hoveredNode.category}</h3>
                  <p className="text-[11px] text-text-muted">{hoveredCount}점 · {hoveredNode.subCategories.length}개 세부 분류</p>
                </div>
                <Link
                  href={`/products?category=${encodeURIComponent(hoveredNode.category)}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-0.5 text-[11px] font-medium text-accent hover:underline"
                >
                  전체 보기 <ArrowUpRight className="h-3 w-3" />
                </Link>
              </header>
              <ul className="grid grid-cols-2 gap-2">
                {hoveredNode.subCategories.map((sub) => {
                  const subCount = products.filter(
                    (p) => p.axes.category === hoveredNode.category && p.axes.subCategory === sub,
                  ).length
                  return (
                    <li key={sub}>
                      <Link
                        href={`/products?category=${encodeURIComponent(hoveredNode.category)}&subCategory=${encodeURIComponent(sub)}`}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between gap-2 rounded-md border bg-surface px-3 py-2 hover:border-primary"
                      >
                        <span className="text-xs font-medium text-text">{sub}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-text-muted group-hover:text-accent">
                          {subCount} <ChevronRight className="h-3 w-3" />
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </div>
        </div>
      )}
    </div>
  )
}
