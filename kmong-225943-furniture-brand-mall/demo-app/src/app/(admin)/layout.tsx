import { Header } from '@/components/Header'
import { AuthGuard } from '@/components/AuthGuard'
import { AdminSidebar } from '@/components/AdminSidebar'

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AuthGuard required="admin">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1">
          <AdminSidebar />
          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </AuthGuard>
    </div>
  )
}
