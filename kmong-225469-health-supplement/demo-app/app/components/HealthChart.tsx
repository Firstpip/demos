export default function HealthChart({ data }: { data: { date: string; value: number }[] }) {
  if (!data || data.length === 0) return <p className="text-xs text-[#64748B]">이력 데이터 없음</p>
  if (data.length === 1) {
    return (
      <div className="text-xs text-[#64748B]">
        <span className="font-medium">{data[0].date}</span>: {data[0].value}
      </div>
    )
  }
  const W = 300, H = 120, PX = 40, PY = 15
  const vals = data.map(d => d.value)
  const rawMin = Math.min(...vals), rawMax = Math.max(...vals)
  const range = rawMax - rawMin || 1
  const min = rawMin - range * 0.1, max = rawMax + range * 0.1
  const x = (i: number) => PX + (i / (data.length - 1)) * (W - PX * 2)
  const y = (v: number) => PY + (1 - (v - min) / (max - min)) * (H - PY * 2)
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[300px]">
      <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="2" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.value)} r="4" fill="#3B82F6" />
          <text x={x(i)} y={H - 2} textAnchor="middle" fontSize="8" fill="#64748B">{d.date}</text>
          <text x={x(i)} y={y(d.value) - 8} textAnchor="middle" fontSize="8" fill="#1E293B">{d.value}</text>
        </g>
      ))}
    </svg>
  )
}
