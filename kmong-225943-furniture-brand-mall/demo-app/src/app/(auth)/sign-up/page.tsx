'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/lib/contexts/auth'

const schema = z.object({
  name: z.string().min(2, '이름을 입력해 주세요'),
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  password: z.string().min(8, '비밀번호는 8자 이상'),
  agreeService: z.boolean().refine((v) => v, '서비스 약관에 동의해 주세요'),
  agreePrivacy: z.boolean().refine((v) => v, '개인정보 처리방침에 동의해 주세요'),
  agreeMarketing: z.boolean().optional(),
})

type Values = z.infer<typeof schema>

export default function SignUpPage() {
  const router = useRouter()
  const { signInAs } = useAuth()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      agreeService: false,
      agreePrivacy: false,
      agreeMarketing: false,
    },
  })

  function onSubmit(values: Values) {
    signInAs('member')
    toast.success('가입이 완료됐어요', { description: 'WELCOME20 쿠폰이 자동 발급됐습니다.' })
    router.push('/account')
    void values
  }

  return (
    <section className="w-full max-w-md rounded-lg border bg-surface p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-text">회원가입</h1>
      <p className="mt-1 text-sm text-text-muted">가입 즉시 신규 회원 2만원 할인 쿠폰이 자동 발급됩니다.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <Field label="이름" error={form.formState.errors.name?.message}>
          <input {...form.register('name')} className="input" />
        </Field>
        <Field label="이메일" error={form.formState.errors.email?.message}>
          <input {...form.register('email')} className="input" type="email" />
        </Field>
        <Field label="비밀번호 (8자 이상)" error={form.formState.errors.password?.message}>
          <input {...form.register('password')} className="input" type="password" />
        </Field>
        <div className="space-y-1.5 rounded-md border bg-surface-2 p-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register('agreeService')} />
            <span>(필수) 서비스 이용약관 동의</span>
          </label>
          {form.formState.errors.agreeService && (
            <p className="text-[11px] text-danger">{form.formState.errors.agreeService.message}</p>
          )}
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register('agreePrivacy')} />
            <span>(필수) 개인정보 수집·이용 동의</span>
          </label>
          {form.formState.errors.agreePrivacy && (
            <p className="text-[11px] text-danger">{form.formState.errors.agreePrivacy.message}</p>
          )}
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register('agreeMarketing')} />
            <span className="text-text-muted">(선택) 신상·이벤트 알림 수신</span>
          </label>
        </div>
        <button type="submit" className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-fg">
          가입하기
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-text-muted">
        이미 계정이 있으신가요?{' '}
        <Link href="/sign-in" className="text-accent hover:underline">
          로그인
        </Link>
      </p>

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
    </section>
  )
}

interface FieldProps { label: string; children: React.ReactNode; error?: string }
function Field({ label, children, error }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-danger">{error}</span>}
    </label>
  )
}
