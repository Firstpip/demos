'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useAuth } from '@/lib/contexts/auth'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  password: z.string().min(4, '비밀번호는 4자 이상'),
})

type Values = z.infer<typeof schema>

const sns = [
  { key: 'kakao', label: '카카오', bg: 'bg-[#FEE500]', fg: 'text-[#000]' },
  { key: 'naver', label: '네이버', bg: 'bg-[#03C75A]', fg: 'text-white' },
  { key: 'google', label: '구글', bg: 'bg-white', fg: 'text-text border border-border' },
  { key: 'apple', label: '애플', bg: 'bg-black', fg: 'text-white' },
] as const

export default function SignInPage() {
  const router = useRouter()
  const { signInAs } = useAuth()
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'jiyun@example.com', password: 'demo1234' },
  })

  function onSubmit(_values: Values) {
    signInAs('member')
    toast.success('로그인됐어요')
    router.push('/account')
  }

  function snsLogin(label: string) {
    signInAs('member')
    toast.success(`${label} 계정으로 로그인됐어요 (mock)`)
    router.push('/account')
  }

  return (
    <section className="w-full max-w-md rounded-lg border bg-surface p-8 shadow-sm">
      <h1 className="text-xl font-semibold text-text">로그인</h1>
      <p className="mt-1 text-sm text-text-muted">데모 계정 비밀번호는 <code className="rounded bg-surface-2 px-1.5">demo1234</code>로 통일.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-3">
        <Field label="이메일" error={form.formState.errors.email?.message}>
          <input {...form.register('email')} className="input" type="email" />
        </Field>
        <Field label="비밀번호" error={form.formState.errors.password?.message}>
          <input {...form.register('password')} className="input" type="password" />
        </Field>
        <button type="submit" className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-fg hover:opacity-90">
          이메일로 로그인
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-text-muted">
        <div className="h-px flex-1 bg-border" />
        간편 로그인
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sns.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => snsLogin(s.label)}
            className={cn('rounded-md px-3 py-2 text-sm font-medium', s.bg, s.fg)}
          >
            {s.label}로 시작하기
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-text-muted">
        아직 계정이 없으신가요?{' '}
        <Link href="/sign-up" className="text-accent hover:underline">
          회원가입
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
