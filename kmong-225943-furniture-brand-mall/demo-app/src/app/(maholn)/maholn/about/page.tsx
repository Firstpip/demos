import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function MaholnAboutPage() {
  return (
    <div>
      <section className="border-b border-[var(--maholn-text)]/10 bg-[var(--maholn-text)]/5">
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">About Maholn</p>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[var(--maholn-text)] sm:text-4xl">
            가구의 결을 시간에 새기는 일
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--maholn-text)]/70">
            마홀앤은 단단한 가구 한 점이 거실에 머무는 동안 가족의 결이 자라는 시간을 기록합니다. 우리가 만드는 것은 가구지만 결국 남는 것은 그 가구가 머문 자리에 쌓이는 시간입니다.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--maholn-text)]/60">Story</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--maholn-text)]">처음부터 마지막까지, 한 결로</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--maholn-text)]/80">
              마홀앤은 2018년에 시작했습니다. 작은 공방에서 출발해 지금은 30개 조합사가 함께 운영하는 통합 쇼핑몰의 자체 브랜드로 자리 잡았습니다. 처음의 마음, 단정한 비례와 정직한 마감이라는 결만큼은 한 번도 바꾸지 않았습니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[var(--maholn-text)]/80">
              마홀앤의 가구는 시간이 지날수록 사용자에게 익숙해지도록 설계됩니다. 손에 닿는 모서리, 시선이 머무는 비례, 가구 사이의 호흡까지. 거실의 첫인상이 아니라 거실에서 보내는 매일의 결을 다듬습니다.
            </p>
          </div>
          <div className="flex aspect-[4/5] items-center justify-center bg-[var(--maholn-text)]/5 text-[160px] font-light text-[var(--maholn-text)]/30">時</div>
        </div>
      </section>

      <section className="border-y border-[var(--maholn-text)]/10 bg-[var(--maholn-text)]/5">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-6 py-16 md:grid-cols-3">
          {[
            { title: '국내 공방형 제작', body: '주요 라인은 국내 공방에서 직접 제작합니다. 도장과 마감까지 한 공간에서 일관되게 마무리됩니다.' },
            { title: '시즌이 아닌 시간', body: '시즌 컬렉션은 새 가구를 보여주는 자리가 아니라 같은 결의 가구가 어떻게 더 깊어지는지 보여주는 자리입니다.' },
            { title: '본체와 통합 운영', body: '마이크로사이트는 시각적으로 분리되지만 결제·계정·배송은 본체 통합몰과 한 시스템으로 연결됩니다.' },
          ].map((b, i) => (
            <div key={i} className="border-l-2 border-[var(--maholn-accent)] pl-4">
              <p className="text-sm font-semibold text-[var(--maholn-text)]">{b.title}</p>
              <p className="mt-2 text-sm text-[var(--maholn-text)]/70">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--maholn-text)]">2026 Spring 컬렉션이 공개됐습니다</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--maholn-text)]/70">
          오크와 린넨, 햇살이 머무는 자리. 룩북 안에서 본체 상품으로 바로 이동할 수 있습니다.
        </p>
        <Link
          href="/maholn/lookbook/2026-spring"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-[var(--maholn-text)] px-5 py-3 text-sm font-medium text-[var(--maholn-bg)]"
        >
          2026 Spring 룩북 보기 <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
