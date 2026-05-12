import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Cta {
  href: string
  label: string
  variant?: 'primary' | 'ghost'
}

interface Props {
  cap?: string
  heading: string
  subheading?: string
  description?: string
  ctas?: Cta[]
  heroLetter: string
  tone?: 'light' | 'dark'
}

export function Hero({ cap, heading, subheading, description, ctas, heroLetter, tone = 'light' }: Props) {
  const isDark = tone === 'dark'
  return (
    <section
      className={
        'relative overflow-hidden border-b ' +
        (isDark ? 'bg-text text-primary-fg' : 'bg-surface-2 text-text')
      }
    >
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28 xl:py-32">
        <div>
          {cap && (
            <p className={'text-[11px] font-medium uppercase tracking-[0.24em] ' + (isDark ? 'text-primary-fg/70' : 'text-text-muted')}>
              {cap}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          {subheading && (
            <p className={'mt-2 text-base ' + (isDark ? 'text-primary-fg/80' : 'text-text-muted')}>
              {subheading}
            </p>
          )}
          {description && (
            <p className={'mt-5 max-w-md text-sm leading-relaxed ' + (isDark ? 'text-primary-fg/75' : 'text-text-muted')}>
              {description}
            </p>
          )}
          {ctas && ctas.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {ctas.map((c) => {
                const isGhost = c.variant === 'ghost'
                const className = isGhost
                  ? `inline-flex items-center gap-1.5 rounded-md border ${isDark ? 'border-primary-fg/40 text-primary-fg hover:bg-primary-fg/10' : 'border-text/30 text-text hover:bg-surface'} px-5 py-3 text-sm font-medium`
                  : `inline-flex items-center gap-1.5 rounded-md ${isDark ? 'bg-primary-fg text-text' : 'bg-text text-primary-fg'} px-5 py-3 text-sm font-medium hover:opacity-90`
                return (
                  <Link key={c.href} href={c.href} className={className}>
                    {c.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <div className="relative hidden h-[420px] items-center justify-center overflow-hidden rounded-lg lg:flex">
          <span
            className={
              'select-none text-[280px] font-light leading-none ' +
              (isDark ? 'text-primary-fg/15' : 'text-text-muted/25')
            }
            aria-hidden
          >
            {heroLetter}
          </span>
        </div>
      </div>
    </section>
  )
}
