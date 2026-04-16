export interface Consultation {
  id: string
  expertName: string
  expertType: 'doctor' | 'pharmacist'
  type: 'chat' | 'video'
  date: string
  time: string
  status: '예약완료' | '상담완료' | '취소'
  notes: string
}

export const consultations: Consultation[] = [
  { id: 'CON01', expertName: '강정환 약사', expertType: 'pharmacist', type: 'video', date: '2026-04-02', time: '14:00', status: '예약완료', notes: '유전자 검사 결과 상담' },
  { id: 'CON02', expertName: '김민수 전문의', expertType: 'doctor', type: 'chat', date: '2026-03-28', time: '10:30', status: '상담완료', notes: '건강검진 결과 기반 영양제 추천' },
  { id: 'CON03', expertName: '박지현 약사', expertType: 'pharmacist', type: 'video', date: '2026-03-25', time: '15:00', status: '상담완료', notes: '정기구독 제품 변경 상담' },
  { id: 'CON04', expertName: '이서연 전문의', expertType: 'doctor', type: 'chat', date: '2026-03-20', time: '11:00', status: '상담완료', notes: '혈당 관리 상담' },
  { id: 'CON05', expertName: '당선 약사', expertType: 'pharmacist', type: 'video', date: '2026-03-15', time: '16:00', status: '취소', notes: '일정 변경으로 취소' },
]
