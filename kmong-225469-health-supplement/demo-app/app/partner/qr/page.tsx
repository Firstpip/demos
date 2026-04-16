'use client'
import { useToast } from '../../components/Toast'

export default function QrPage() {
  const { toast } = useToast()
  return (
    <div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-6">QR/링크 설정</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div><p className="text-sm text-[#64748B] mb-1">추천 코드</p><p className="text-2xl font-bold text-[#1B2A4A]">DR0042</p></div>
        <div><p className="text-sm text-[#64748B] mb-2">UTM 추천 링크</p>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 flex items-center gap-3">
          <code className="text-sm flex-1 break-all">https://genetichealth.co.kr/?ref=DR0042</code>
          <button onClick={() => { navigator.clipboard?.writeText('https://genetichealth.co.kr/?ref=DR0042'); toast('복사되었습니다') }} className="bg-[#22C55E] text-white text-xs px-4 py-2 rounded-lg whitespace-nowrap">복사</button>
        </div></div>
        <div><p className="text-sm text-[#64748B] mb-2">QR 코드</p>
        <div className="w-48 h-48 border-2 border-dashed border-[#E2E8F0] rounded-lg flex items-center justify-center text-[#64748B]">QR 코드</div>
        <button onClick={() => toast('QR 코드가 생성되었습니다')} className="mt-3 bg-[#1B2A4A] text-white text-sm px-4 py-2 rounded-lg">QR 코드 생성</button></div>
        <div className="bg-[#F8FAFC] rounded-lg p-4">
          <p className="text-sm font-bold text-[#1E293B] mb-2">병원 내 POP패널 안내</p>
          <p className="text-xs text-[#64748B]">QR코드를 다운로드하여 병원 내 POP패널에 배치하시면, 환자가 스마트폰으로 QR을 스캔하여 바로 서비스에 접속할 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}
