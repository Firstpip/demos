'use client'
import { useState } from 'react'
import { useToast } from '../../../components/Toast'

const meds = ['밀크씨슬', 'rTG 오메가3', '비타민D', '바나바잎', '프로바이오틱스']
const times = ['아침 식후', '점심 식후', '저녁 식후']
const weekDays = ['월', '화', '수', '목', '금', '토', '일']
const weeklyData = [85, 100, 71, 57, 85, 42, 0]

export default function MedicationPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [alarmTimes, setAlarmTimes] = useState({ morning: '08:00', lunch: '12:30', evening: '19:00' })
  const { toast } = useToast()
  const toggle = (key: string) => setChecks(p => ({ ...p, [key]: !p[key] }))
  const total = Object.values(checks).filter(Boolean).length
  const maxChecks = meds.length * times.length
  const rate = maxChecks > 0 ? Math.round((total / maxChecks) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">복약 관리</h1>

      {/* 오늘 복약률 */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <h2 className="font-bold text-[#1E293B] mb-2">오늘의 복약률</h2>
        <div className="w-full bg-[#E2E8F0] rounded-full h-4 mb-1">
          <div className="bg-[#22C55E] h-4 rounded-full transition-all" style={{ width: `${rate}%` }} />
        </div>
        <p className="text-sm text-[#64748B]">{rate}% 완료 ({total}/{maxChecks})</p>
      </div>

      {/* 알림 시간 설정 */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
        <h2 className="font-bold text-[#1E293B] mb-4">섭취 알림 시간 설정</h2>
        <div className="grid grid-cols-3 gap-4">
          {[{ label: '아침', key: 'morning' as const }, { label: '점심', key: 'lunch' as const }, { label: '저녁', key: 'evening' as const }].map(t => (
            <div key={t.key}>
              <label className="block text-xs text-[#64748B] mb-1">{t.label}</label>
              <input type="time" value={alarmTimes[t.key]} onChange={e => setAlarmTimes(p => ({ ...p, [t.key]: e.target.value }))}
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
        <button onClick={() => toast('알림 시간이 저장되었습니다')} className="mt-3 bg-[#22C55E] text-white text-xs px-4 py-2 rounded-lg hover:bg-[#16A34A]">알림 저장</button>
      </div>

      {/* 오늘 복약 체크 */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead><tr className="bg-[#F8FAFC]"><th className="py-2 px-3 text-left">영양제</th>{times.map(t => <th key={t} className="py-2 px-3 text-center">{t}</th>)}</tr></thead>
          <tbody>{meds.map(m => (
            <tr key={m} className="border-t border-[#E2E8F0]">
              <td className="py-3 px-3 font-medium">{m}</td>
              {times.map(t => { const key = `${m}-${t}`; return (
                <td key={t} className="py-3 px-3 text-center">
                  <button onClick={() => toggle(key)} className={`w-7 h-7 rounded border-2 text-sm transition-colors ${checks[key] ? 'bg-[#22C55E] border-[#22C55E] text-white' : 'border-[#E2E8F0] hover:border-[#22C55E]'}`}>
                    {checks[key] && '✓'}
                  </button>
                </td>
              )})}
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* 이번 주 복약률 */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
        <h2 className="font-bold text-[#1E293B] mb-4">이번 주 복약률</h2>
        <div className="flex items-end gap-2 h-32">
          {weekDays.map((d, i) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#E2E8F0] rounded-t relative" style={{ height: '100px' }}>
                <div className="absolute bottom-0 w-full rounded-t transition-all" style={{ height: `${weeklyData[i]}%`, backgroundColor: weeklyData[i] >= 80 ? '#22C55E' : weeklyData[i] >= 50 ? '#F59E0B' : '#E2E8F0' }} />
              </div>
              <span className="text-xs text-[#64748B]">{d}</span>
              <span className="text-xs font-medium">{weeklyData[i]}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-[#64748B]">주간 평균 복약률</p>
          <p className="text-2xl font-bold text-[#22C55E]">{Math.round(weeklyData.reduce((a, b) => a + b, 0) / 7)}%</p>
          <p className="text-xs text-[#64748B] mt-1">꾸준히 복용하면 섭취 리워드(최대 30% 할인)를 받을 수 있어요!</p>
        </div>
      </div>
    </div>
  )
}
