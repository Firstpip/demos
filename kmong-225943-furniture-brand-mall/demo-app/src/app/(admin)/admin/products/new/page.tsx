'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AdminPageHeader } from '@/components/AdminPageHeader'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Dropdown } from '@/components/Dropdown'
import { brands } from '@/data/brands'
import { useAuth } from '@/lib/contexts/auth'
import { EmptyState } from '@/components/states'
import { cn } from '@/lib/utils'

const categories = ['침실', '거실', '주방', '수납', '사무용', '학생'] as const
const badges = ['NEW', 'BEST', 'LIMITED'] as const

const schema = z.object({
  name: z.string().min(2, '제품명은 2자 이상'),
  subtitle: z.string().min(2, '부제를 입력해 주세요'),
  brandId: z.string().min(1, '브랜드를 선택해 주세요'),
  category: z.enum(categories),
  priceRegular: z.number().min(0, '정가는 0 이상'),
  priceSale: z.number().min(0, '판매가는 0 이상'),
  stock: z.number().min(0, '재고는 0 이상'),
  colors: z.string().min(1, '색상 옵션을 입력해 주세요 (쉼표 구분)'),
  sizes: z.string().min(1, '사이즈 옵션을 입력해 주세요 (쉼표 구분)'),
  badge: z.enum([...badges, '없음'] as [string, ...string[]]),
  description: z.string().min(20, '상세 설명은 20자 이상'),
})

type Values = z.infer<typeof schema>

export default function ProductNewPage() {
  const router = useRouter()
  const { role } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      subtitle: '',
      brandId: brands[0]?.id ?? '',
      category: '거실',
      priceRegular: 0,
      priceSale: 0,
      stock: 10,
      colors: '오크, 월넛',
      sizes: 'S, M, L',
      badge: '없음',
      description: '<h2>제품 소개</h2><p>이 제품은 ...</p>',
    },
  })

  if (role === 'partner') {
    return (
      <div>
        <AdminPageHeader title="신규 제품 등록" />
        <EmptyState
          title="조합사 권한으로는 접근할 수 없습니다"
          description="신규 제품 등록은 본체 운영자만 가능합니다. 자기 브랜드 페이지의 가격·이미지·보조 카피는 좌측 '브랜드 페이지'에서 직접 수정하세요."
        />
      </div>
    )
  }

  function onSubmit(_values: Values) {
    setSubmitting(true)
    setTimeout(() => {
      toast.success('신규 제품이 등록됐어요 (mock)', { description: '데모에서는 데이터에 반영되지 않습니다.' })
      router.push('/admin/products')
    }, 500)
  }

  return (
    <div>
      <AdminPageHeader title="신규 제품 등록" description="제품 정보·옵션·상세 설명을 입력합니다." />

      <form id="product-new-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold">기본 정보</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="제품명" error={form.formState.errors.name?.message} className="sm:col-span-2">
                <input className="input" {...form.register('name')} />
              </Field>
              <Field label="부제" error={form.formState.errors.subtitle?.message} className="sm:col-span-2">
                <input className="input" {...form.register('subtitle')} />
              </Field>
              <Field label="브랜드" error={form.formState.errors.brandId?.message}>
                <Controller
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={field.onChange}
                      options={brands.map((b) => ({ value: b.id, label: b.name }))}
                      ariaLabel="브랜드"
                      className="w-full"
                      triggerClassName="w-full"
                    />
                  )}
                />
              </Field>
              <Field label="카테고리" error={form.formState.errors.category?.message}>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      options={categories.map((c) => ({ value: c, label: c }))}
                      ariaLabel="카테고리"
                      className="w-full"
                      triggerClassName="w-full"
                    />
                  )}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold">가격·재고·옵션</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="정가" error={form.formState.errors.priceRegular?.message}>
                <input className="input" type="number" {...form.register('priceRegular', { valueAsNumber: true })} />
              </Field>
              <Field label="판매가" error={form.formState.errors.priceSale?.message}>
                <input className="input" type="number" {...form.register('priceSale', { valueAsNumber: true })} />
              </Field>
              <Field label="기본 재고" error={form.formState.errors.stock?.message}>
                <input className="input" type="number" {...form.register('stock', { valueAsNumber: true })} />
              </Field>
              <Field label="색상 옵션 (쉼표 구분)" error={form.formState.errors.colors?.message} className="sm:col-span-2">
                <input className="input" {...form.register('colors')} />
              </Field>
              <Field label="사이즈 옵션 (쉼표 구분)" error={form.formState.errors.sizes?.message}>
                <input className="input" {...form.register('sizes')} />
              </Field>
              <Field label="강조 뱃지" error={form.formState.errors.badge?.message}>
                <Controller
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={(v) => field.onChange(v)}
                      options={[{ value: '없음', label: '없음' }, ...badges.map((b) => ({ value: b, label: b }))]}
                      ariaLabel="강조 뱃지"
                      className="w-full"
                      triggerClassName="w-full"
                    />
                  )}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-lg border bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold">상세 설명</h2>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} minHeight={200} placeholder="제품의 결, 사용 권장 환경, 케어 안내 등을 적어 주세요." />
              )}
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-[11px] text-danger">{form.formState.errors.description.message}</p>
            )}
          </section>
        </div>

        <aside>
          <div className="sticky top-[120px] rounded-lg border bg-surface p-5">
            <h2 className="mb-2 text-base font-semibold">등록 안내</h2>
            <ul className="space-y-1 text-xs text-text-muted">
              <li>· 등록 즉시 본체 카탈로그·SEO 사이트맵에 반영됩니다.</li>
              <li>· 데모에서는 mock 처리되어 실제 데이터에 추가되지 않습니다.</li>
              <li>· 본 개발에서는 이미지 업로드(R2)와 가격 검수 워크플로우가 추가됩니다.</li>
            </ul>
            <button
              id="product-new-submit"
              type="submit"
              disabled={submitting}
              className={cn(
                'mt-4 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-fg',
                submitting && 'opacity-60',
              )}
            >
              {submitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </aside>
      </form>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--surface);
          padding: 0.5rem 0.75rem;
          font-size: 14px;
          outline: none;
        }
        :global(.input:focus) { border-color: var(--primary); }
      `}</style>
    </div>
  )
}

interface FieldProps { label: string; error?: string; children: React.ReactNode; className?: string }
function Field({ label, error, children, className }: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1 block text-xs text-text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-danger">{error}</span>}
    </label>
  )
}
