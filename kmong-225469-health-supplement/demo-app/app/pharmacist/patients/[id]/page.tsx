import { patients } from '../../../data/patients'
import { geneMarkers } from '../../../data/gene-markers'
import { healthCheckupItems, healthScore } from '../../../data/health-checkup'

export function generateStaticParams() { return patients.filter(p => p.testStatus === '결과 완료').map(p => ({ id: p.id })) }

export default async function PatientViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const patient = patients.find(p => p.id === id)
  if (!patient) return <div className="p-8">환자를 찾을 수 없습니다.</div>
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">{patient.name} 환자 데이터</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-bold text-[#1E293B] mb-3">DTC 유전자 결과 요약</h2>
          <p className="text-sm text-[#64748B] mb-2">건강점수: {healthScore}점</p>
          <div className="space-y-2">{geneMarkers.filter(m => m.risk === 'HIGH').slice(0, 3).map(m => (
            <div key={m.gene} className="flex justify-between text-sm p-2 bg-red-50 rounded"><span>{m.gene} ({m.category})</span><span className="text-red-600 font-medium">위험</span></div>
          ))}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-bold text-[#1E293B] mb-3">건강검진 결과 요약</h2>
          <div className="space-y-2">{healthCheckupItems.filter(i => i.status !== 'normal').slice(0, 4).map(i => (
            <div key={i.name} className="flex justify-between text-sm p-2 bg-yellow-50 rounded"><span>{i.name}: {i.value}{i.unit}</span><span className={`font-medium ${i.status === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}>{i.status === 'danger' ? '위험' : '주의'}</span></div>
          ))}</div>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
        <h2 className="font-bold text-[#1E293B] mb-3">추천 제품</h2>
        <p className="text-sm">{patient.recommendedProduct}</p>
        <p className="text-sm text-[#64748B] mt-1">검사 결과: {patient.result}</p>
      </div>
    </div>
  )
}
