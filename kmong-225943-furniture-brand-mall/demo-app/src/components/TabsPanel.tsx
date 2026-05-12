'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export interface TabItem {
  key: string
  label: string
  count?: number
  content: React.ReactNode
}

export function TabsPanel({ items, defaultValue }: { items: TabItem[]; defaultValue?: string }) {
  const initial = defaultValue ?? items[0]?.key
  return (
    <Tabs.Root defaultValue={initial} className="w-full">
      <Tabs.List className="flex border-b" aria-label="상세 탭">
        {items.map((it) => (
          <Tabs.Trigger
            key={it.key}
            id={`detail-tab-${it.key}`}
            value={it.key}
            className={cn(
              'relative px-4 py-3 text-sm font-medium text-text-muted transition data-[state=active]:text-text',
              'data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary',
              'hover:text-text focus-visible:outline-none',
            )}
          >
            {it.label}
            {typeof it.count === 'number' && (
              <span className="ml-1 text-xs text-text-muted">({it.count.toLocaleString()})</span>
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((it) => (
        <Tabs.Content key={it.key} value={it.key} className="pt-6 focus-visible:outline-none">
          {it.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
