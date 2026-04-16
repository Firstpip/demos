import Header from '../components/Header'
import Footer from '../components/Footer'
import MobileTabBar from '../components/MobileTabBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </>
  )
}
