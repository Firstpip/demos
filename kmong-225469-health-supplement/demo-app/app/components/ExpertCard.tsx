export default function ExpertCard({ name, org, specialty, count, countLabel }: { name: string; org: string; specialty: string; count: number; countLabel?: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow min-w-[160px]">
      <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border-2 border-[#22C55E] flex items-center justify-center text-xl font-bold text-[#1B2A4A] mb-2">{name[0]}</div>
      <p className="font-bold text-sm text-[#1E293B]">{name}</p>
      <p className="text-xs text-[#64748B]">{org}</p>
      <p className="text-xs text-[#64748B]">{specialty}</p>
      <p className="text-xs text-[#22C55E] mt-1 font-medium">{countLabel || '누적 상담'} {count}{countLabel ? '' : '회'}</p>
    </div>
  )
}
