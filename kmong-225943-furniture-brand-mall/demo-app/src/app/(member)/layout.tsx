import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthGuard } from '@/components/AuthGuard'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AuthGuard required="member">{children}</AuthGuard>
      </main>
      <Footer />
    </div>
  )
}
