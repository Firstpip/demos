export default function BarChart({ data }: { data: { label: string; value: number }[] }) {
  if (!data || data.length === 0) return <p className="text-xs text-[#64748B]">데이터 없음</p>
  const max = Math.max(...data.map(d => d.value)) || 1
  const W = 300, H = 160, PY = 20, PX = 10
  const barW = (W - PX * 2) / data.length * 0.6
  const gap = (W - PX * 2) / data.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[400px]">
      {data.map((d, i) => {
        const barH = ((d.value / max) * (H - PY * 2))
        const x = PX + i * gap + (gap - barW) / 2
        const y = H - PY - barH
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill="#1B2A4A" />
            <text x={x + barW / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="#64748B">{d.label}</text>
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="8" fill="#1E293B">₩{(d.value / 1000).toFixed(0)}k</text>
          </g>
        )
      })}
    </svg>
  )
}
