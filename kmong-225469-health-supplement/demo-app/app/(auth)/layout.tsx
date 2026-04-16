export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#1B2A4A] flex flex-col items-center justify-center p-4">
      <div className="text-white text-2xl font-bold tracking-wider mb-8">ENER RINGER</div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">{children}</div>
    </div>
  )
}
