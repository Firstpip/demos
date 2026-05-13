import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ContentModule } from '@/lib/types'
import { cn } from '@/lib/utils'
import { moduleImage } from '@/lib/imagePath'

const styleByType: Record<ContentModule['type'], string> = {
  'lookbook-card': 'bg-surface',
  story: 'bg-surface-2',
  banner: 'bg-primary text-primary-fg',
  'review-quote': 'bg-surface',
}

export function ContentModuleCard({ module }: { module: ContentModule }) {
  const isBanner = module.type === 'banner'
  const Wrapper = (props: { children: React.ReactNode; className?: string }) =>
    module.ctaHref ? <Link href={module.ctaHref} className={props.className}>{props.children}</Link> : <div className={props.className}>{props.children}</div>

  return (
    <Wrapper className={cn('group flex h-full flex-col gap-3 rounded-lg border p-5 transition hover:shadow-md overflow-hidden', styleByType[module.type])}>
      <div className="relative h-32 w-full overflow-hidden rounded-md bg-surface-2">
        <img
          src={moduleImage(module.id, module.type)}
          alt={module.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <p className={cn('text-sm font-semibold', isBanner ? 'text-primary-fg' : 'text-text')}>{module.title}</p>
        <p className={cn('text-xs leading-relaxed', isBanner ? 'text-primary-fg/85' : 'text-text-muted')}>{module.body}</p>
      </div>
      {module.ctaLabel && (
        <span className={cn('inline-flex items-center gap-1 text-xs font-medium', isBanner ? 'text-primary-fg' : 'text-accent')}>
          {module.ctaLabel} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      )}
    </Wrapper>
  )
}
