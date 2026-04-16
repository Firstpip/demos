import type { GeneMarker } from '../data/gene-markers'

const riskStyle = { HIGH: { bg: 'bg-red-100 text-red-700', label: '위험' }, MID: { bg: 'bg-yellow-100 text-yellow-700', label: '주의' }, LOW: { bg: 'bg-green-100 text-green-700', label: '양호' } }

export default function GeneMarkerCard({ marker }: { marker: GeneMarker }) {
  const style = riskStyle[marker.risk]
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold text-[#1E293B]">{marker.gene}</h3>
          <p className="text-xs text-[#64748B]">{marker.snp}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${style.bg}`}>{style.label}</span>
      </div>
      <p className="text-xs text-[#64748B] mb-1">{marker.category}</p>
      <p className="text-sm text-[#1E293B] mb-3">{marker.description}</p>
      <p className="text-xs text-[#64748B] mb-1">추천 영양소</p>
      <div className="flex flex-wrap gap-1">
        {marker.nutrients.map(n => <span key={n} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{n}</span>)}
      </div>
    </div>
  )
}
