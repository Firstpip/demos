import { MaholnHeader, MaholnFooter } from '@/components/MaholnHeader'

export default function MaholnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="maholn-scope flex min-h-screen flex-col">
      <MaholnHeader />
      <main className="flex-1">{children}</main>
      <MaholnFooter />
    </div>
  )
}
