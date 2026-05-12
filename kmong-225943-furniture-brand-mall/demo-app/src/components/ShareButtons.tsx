'use client'

import { Link2, MessageSquare, X } from 'lucide-react'
import { toast } from 'sonner'

export function ShareButtons({ url, title }: { url: string; title: string }) {
  function copy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => toast.success('링크가 복사됐어요'),
        () => toast.error('링크 복사에 실패했어요'),
      )
    }
  }

  function shareKakao() {
    toast.info('카카오톡 공유는 데모에서 mock 처리됩니다.', { description: title })
  }

  function shareX() {
    toast.info('X 공유는 데모에서 mock 처리됩니다.', { description: title })
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        id="share-kakao"
        type="button"
        onClick={shareKakao}
        className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-2"
        aria-label="카카오톡으로 공유"
      >
        <MessageSquare className="h-3.5 w-3.5" /> 카카오
      </button>
      <button
        id="share-x"
        type="button"
        onClick={shareX}
        className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-2"
        aria-label="X로 공유"
      >
        <X className="h-3.5 w-3.5" /> X
      </button>
      <button
        id="share-copy-link"
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 rounded-md border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-2"
        aria-label="링크 복사"
      >
        <Link2 className="h-3.5 w-3.5" /> 링크 복사
      </button>
    </div>
  )
}
