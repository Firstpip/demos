export interface Pharmacist {
  id: string
  name: string
  pharmacy: string
  consultCount: number
  specialty: string
}

export interface Doctor {
  id: string
  name: string
  hospital: string
  specialty: string
  refCode: string
  patientsReferred: number
  conversionRate: number
  totalRevenue: number
}

export const pharmacists: Pharmacist[] = [
  { id: 'PH01', name: '강정환', pharmacy: '올리브영약국', consultCount: 14, specialty: '영양상담' },
  { id: 'PH02', name: '김영안', pharmacy: '건강한약국', consultCount: 30, specialty: '만성질환관리' },
  { id: 'PH03', name: '당선', pharmacy: '미래약국', consultCount: 211, specialty: '소화기건강' },
  { id: 'PH04', name: '박지현', pharmacy: '해피약국', consultCount: 85, specialty: '여성건강' },
  { id: 'PH05', name: '이준호', pharmacy: '하늘약국', consultCount: 156, specialty: '노인건강' },
]

export const doctors: Doctor[] = [
  { id: 'DR01', name: '김민수', hospital: '서울대학교병원', specialty: '내과', refCode: 'DR0042', patientsReferred: 24, conversionRate: 62, totalRevenue: 186000 },
  { id: 'DR02', name: '이서연', hospital: '세브란스병원', specialty: '가정의학과', refCode: 'DR0087', patientsReferred: 18, conversionRate: 55, totalRevenue: 142000 },
  { id: 'DR03', name: '박준혁', hospital: '삼성서울병원', specialty: '내분비내과', refCode: 'DR0115', patientsReferred: 31, conversionRate: 71, totalRevenue: 245000 },
]
