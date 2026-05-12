import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b bg-surface">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            가구몰
          </Link>
          <Link href="/" className="text-xs text-text-muted hover:text-text">
            메인으로 돌아가기
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">{children}</main>
    </div>
  )
}
