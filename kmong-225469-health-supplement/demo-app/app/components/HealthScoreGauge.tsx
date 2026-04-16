'use client'

export default function HealthScoreGauge({ score }: { score: number }) {
  const color = score < 60 ? '#EF4444' : score < 80 ? '#F59E0B' : '#22C55E'
  const label = score < 60 ? '경고' : score < 80 ? '주의' : '양호'
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="flex flex-col items-center" id="health-score">
      <svg width="160" height="160" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="45" fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle cx="60" cy="60" r="45" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 60 60)" className="transition-all duration-1000" />
        <text x="60" y="55" textAnchor="middle" className="text-3xl font-bold" fill="#1E293B" fontSize="28">{score}</text>
        <text x="60" y="72" textAnchor="middle" fill="#64748B" fontSize="10">/ 100점</text>
      </svg>
      <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }}>{label}</span>
    </div>
  )
}
