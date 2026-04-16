export interface Patient {
  id: string
  name: string
  testStatus: '키트발송' | '분석 중' | '결과 완료'
  result: string
  recommendedProduct: string
  purchaseStatus: '구매완료' | '대기중'
  commission: number
}

export const patients: Patient[] = [
  { id: 'PT01', name: '홍OO', testStatus: '결과 완료', result: '혈당관리', recommendedProduct: '바나바잎추출물', purchaseStatus: '구매완료', commission: 2700 },
  { id: 'PT02', name: '김OO', testStatus: '분석 중', result: '-', recommendedProduct: '-', purchaseStatus: '대기중', commission: 0 },
  { id: 'PT03', name: '이OO', testStatus: '결과 완료', result: '골밀도관리', recommendedProduct: '칼슘+비타민D', purchaseStatus: '구매완료', commission: 2100 },
  { id: 'PT04', name: '박OO', testStatus: '키트발송', result: '-', recommendedProduct: '-', purchaseStatus: '대기중', commission: 0 },
  { id: 'PT05', name: '최OO', testStatus: '결과 완료', result: '지질대사', recommendedProduct: 'rTG오메가3', purchaseStatus: '구매완료', commission: 3200 },
  { id: 'PT06', name: '정OO', testStatus: '결과 완료', result: '간건강', recommendedProduct: '밀크씨슬', purchaseStatus: '대기중', commission: 0 },
  { id: 'PT07', name: '강OO', testStatus: '분석 중', result: '-', recommendedProduct: '-', purchaseStatus: '대기중', commission: 0 },
  { id: 'PT08', name: '조OO', testStatus: '결과 완료', result: '항산화', recommendedProduct: '코엔자임Q10', purchaseStatus: '구매완료', commission: 2800 },
  { id: 'PT09', name: '윤OO', testStatus: '결과 완료', result: '혈당+지질', recommendedProduct: '바나바잎+오메가3', purchaseStatus: '구매완료', commission: 4500 },
  { id: 'PT10', name: '장OO', testStatus: '키트발송', result: '-', recommendedProduct: '-', purchaseStatus: '대기중', commission: 0 },
]

export const monthlyRevenue = [
  { month: '11월', value: 32000 },
  { month: '12월', value: 45000 },
  { month: '1월', value: 52000 },
  { month: '2월', value: 41000 },
  { month: '3월', value: 58000 },
]
