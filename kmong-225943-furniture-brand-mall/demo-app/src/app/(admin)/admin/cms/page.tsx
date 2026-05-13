'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { RichTextEditor } from '@/components/RichTextEditor'
import { contentModules } from '@/data/contentModules'
import type { ContentModule } from '@/lib/types'
import { cn } from '@/lib/utils'
import { moduleImage } from '@/lib/imagePath'

const typeLabel: Record<ContentModule['type'], string> = {
  'lookbook-card': '룩북 카드',
  story: '스토리',
  banner: '배너',
  'review-quote': '후기 인용',
}

const usedInLabel: Record<ContentModule['usedIn'][number], string> = {
  home: '본체 홈',
  'maholn-home': '마홀앤 홈',
  'product-detail': '상품 상세',
  'collection-detail': '컬렉션 상세',
  category: '카테고리',
}

export default function AdminCmsPage() {
  const [selected, setSelected] = useState<ContentModule | null>(null)
  const [draft, setDraft] = useState({ title: '', body: '', ctaLabel: '', ctaHref: '' })

  function open(m: ContentModule) {
    setSelected(m)
    setDraft({ title: m.title, body: `<p>${m.body}</p>`, ctaLabel: m.ctaLabel ?? '', ctaHref: m.ctaHref ?? '' })
  }

  function save() {
    if (!selected) return
    toast.success('콘텐츠 모듈이 저장됐어요 (mock)', {
      description: `사용처: ${selected.usedIn.map((u) => usedInLabel[u]).join(', ')}`,
    })
    setSelected(null)
  }

  return (
    <div>
      <AdminPageHeader
        title="콘텐츠 모듈 관리"
        description={`${contentModules.length}개 · 본체 홈·상품 상세·마홀앤 마이크로사이트에서 재사용`}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contentModules.map((m) => (
          <article
            key={m.id}
            id={`cms-module-card-${m.id}`}
            className="flex flex-col gap-3 rounded-lg border bg-surface p-4"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{typeLabel[m.type]}</span>
              <span className="text-[10px] text-text-muted">{m.id}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-md bg-surface-2">
                <img src={moduleImage(m.id, m.type)} alt={m.title} className="absolute inset-0 h-full w-full object-cover" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text">{m.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-text-muted">{m.body}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {m.usedIn.map((u) => (
                <span key={u} className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-muted">
                  {usedInLabel[u]}
                </span>
              ))}
            </div>
            <button
              id={`cms-module-edit-${m.id}`}
              type="button"
              onClick={() => open(m)}
              className="mt-auto rounded-md bg-primary py-1.5 text-xs font-medium text-primary-fg"
            >
              편집
            </button>
          </article>
        ))}
      </div>

      <Dialog.Root open={Boolean(selected)} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-surface p-6 shadow-md">
            <Dialog.Title className="text-base font-semibold">콘텐츠 모듈 편집</Dialog.Title>
            <Dialog.Description className="mt-1 text-xs text-text-muted">
              사용처: {selected?.usedIn.map((u) => usedInLabel[u]).join(', ')}
            </Dialog.Description>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs text-text-muted">제목</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
                />
              </label>
              <div>
                <span className="mb-1 block text-xs text-text-muted">본문</span>
                <RichTextEditor
                  value={draft.body}
                  onChange={(html) => setDraft({ ...draft, body: html })}
                  minHeight={120}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-text-muted">CTA 라벨</span>
                  <input
                    type="text"
                    value={draft.ctaLabel}
                    onChange={(e) => setDraft({ ...draft, ctaLabel: e.target.value })}
                    className="w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-text-muted">CTA href</span>
                  <input
                    type="text"
                    value={draft.ctaHref}
                    onChange={(e) => setDraft({ ...draft, ctaHref: e.target.value })}
                    className="w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-primary"
                    placeholder="/path/"
                  />
                </label>
              </div>
            </div>
            <div className={cn('mt-5 flex justify-end gap-2')}>
              <Dialog.Close asChild>
                <button type="button" className="rounded-md border bg-surface px-3 py-1.5 text-sm hover:bg-surface-2">
                  취소
                </button>
              </Dialog.Close>
              <button type="button" onClick={save} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg">
                저장하기
              </button>
            </div>
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
