export default function StatCard({ label, value, subText, color }: { label: string; value: string; subText?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border-t-4" style={{ borderTopColor: color }}>
      <p className="text-xs text-[#64748B] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
      {subText && <p className="text-xs text-[#64748B] mt-1">{subText}</p>}
    </div>
  )
}
