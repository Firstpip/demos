'use client'

import { useEffect, useRef } from 'react'
import { Bold, Italic, Underline, List, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
  id?: string
}

export function RichTextEditor({ value, onChange, placeholder = '내용을 입력하세요.', minHeight = 120, id }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  function exec(command: string, arg?: string) {
    if (typeof document === 'undefined') return
    document.execCommand(command, false, arg)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  function insertLink() {
    const url = typeof window === 'undefined' ? null : window.prompt('링크 URL을 입력하세요')
    if (url) exec('createLink', url)
  }

  return (
    <div className="rounded-md border bg-surface">
      <div className="flex items-center gap-0.5 border-b bg-surface-2 px-2 py-1.5" role="toolbar" aria-label="서식">
        <ToolButton onClick={() => exec('bold')} aria-label="굵게"><Bold className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('italic')} aria-label="기울임"><Italic className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('underline')} aria-label="밑줄"><Underline className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('insertUnorderedList')} aria-label="목록"><List className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={insertLink} aria-label="링크"><LinkIcon className="h-3.5 w-3.5" /></ToolButton>
      </div>
      <div
        ref={ref}
        id={id}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline
        aria-label={placeholder}
        data-placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className={cn(
          'rich-content w-full px-3 py-2 text-sm outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-text-muted/60',
        )}
        style={{ minHeight }}
      />
    </div>
  )
}

function ToolButton(props: React.ComponentProps<'button'>) {
  const { className, ...rest } = props
  return (
    <button
      type="button"
      className={cn('rounded p-1.5 text-text-muted hover:bg-surface hover:text-text', className)}
      onMouseDown={(e) => e.preventDefault()}
      {...rest}
    />
  )
}
