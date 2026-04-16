export type HealthStatus = 'normal' | 'caution' | 'danger'

export interface HealthCheckupItem {
  name: string
  value: number
  unit: string
  normalRange: string
  cautionThreshold: string
  status: HealthStatus
  nutrient: string
  keyIngredient: string
  expectedEffect: string
  history: { date: string; value: number }[]
}

export const healthCheckupItems: HealthCheckupItem[] = [
  { name: '공복혈당(FBS)', value: 105, unit: 'mg/dL', normalRange: '70~99', cautionThreshold: '100+', status: 'caution', nutrient: '혈당케어 바나바잎', keyIngredient: '바나바잎, 크롬, 셀레늄', expectedEffect: '혈당 정상화', history: [{ date: '2017-12', value: 92 }, { date: '2020-06', value: 98 }, { date: '2023-03', value: 102 }, { date: '2025-11', value: 105 }] },
  { name: '총콜레스테롤', value: 215, unit: 'mg/dL', normalRange: '~199', cautionThreshold: '200+', status: 'caution', nutrient: '오메가3/폴리코사놀', keyIngredient: 'EPA+DHA, 폴리코사놀', expectedEffect: '지질 개선', history: [{ date: '2017-12', value: 185 }, { date: '2020-06', value: 195 }, { date: '2023-03', value: 208 }, { date: '2025-11', value: 215 }] },
  { name: '중성지방(TG)', value: 160, unit: 'mg/dL', normalRange: '~149', cautionThreshold: '150+', status: 'caution', nutrient: 'rTG오메가3', keyIngredient: 'EPA+DHA 1000mg', expectedEffect: '중성지방 감소', history: [{ date: '2017-12', value: 120 }, { date: '2020-06', value: 138 }, { date: '2023-03', value: 152 }, { date: '2025-11', value: 160 }] },
  { name: '간기능(AST)', value: 35, unit: 'IU/L', normalRange: '~40', cautionThreshold: '41+', status: 'normal', nutrient: '밀크씨슬', keyIngredient: '실리마린, 비타민B', expectedEffect: '간 보호', history: [{ date: '2017-12', value: 28 }, { date: '2020-06', value: 30 }, { date: '2023-03', value: 33 }, { date: '2025-11', value: 35 }] },
  { name: '간기능(ALT)', value: 38, unit: 'IU/L', normalRange: '~35', cautionThreshold: '36+', status: 'caution', nutrient: '밀크씨슬+NAC', keyIngredient: '실리마린, NAC, 비타민B', expectedEffect: '간세포 회복', history: [{ date: '2017-12', value: 25 }, { date: '2020-06', value: 30 }, { date: '2023-03', value: 35 }, { date: '2025-11', value: 38 }] },
  { name: '혈압(수축기)', value: 128, unit: 'mmHg', normalRange: '~129', cautionThreshold: '130+', status: 'normal', nutrient: '코큐텐+오메가3', keyIngredient: '코큐텐, EPA, 마그네슘', expectedEffect: '혈압 관리', history: [{ date: '2017-12', value: 118 }, { date: '2020-06', value: 122 }, { date: '2023-03', value: 125 }, { date: '2025-11', value: 128 }] },
  { name: '헤모글로빈', value: 13.2, unit: 'g/dL', normalRange: '남13+/여12+', cautionThreshold: '남12-/여11-', status: 'normal', nutrient: '철분+엽산+비타민C', keyIngredient: '헴철, 활성형엽산', expectedEffect: '빈혈 개선', history: [{ date: '2017-12', value: 14.1 }, { date: '2020-06', value: 13.8 }, { date: '2023-03', value: 13.5 }, { date: '2025-11', value: 13.2 }] },
  { name: '비타민D', value: 18, unit: 'ng/mL', normalRange: '30+', cautionThreshold: '20 이하', status: 'danger', nutrient: '비타민D 보충제', keyIngredient: '콜레칼시페롤 2000IU', expectedEffect: '골밀도/면역', history: [{ date: '2017-12', value: 25 }, { date: '2020-06', value: 22 }, { date: '2023-03', value: 20 }, { date: '2025-11', value: 18 }] },
  { name: 'BMI', value: 25.3, unit: 'kg/m²', normalRange: '18.5~24.9', cautionThreshold: '25+', status: 'caution', nutrient: '가르시니아/CLA', keyIngredient: 'HCA, 클레우스포스콜리', expectedEffect: '체중 관리', history: [{ date: '2017-12', value: 23.5 }, { date: '2020-06', value: 24.2 }, { date: '2023-03', value: 24.8 }, { date: '2025-11', value: 25.3 }] },
  { name: 'eGFR(신장)', value: 85, unit: 'mL/min', normalRange: '90+', cautionThreshold: '60~89', status: 'caution', nutrient: '코큐텐+항산화', keyIngredient: '코큐텐, 비타민C, 셀레늄', expectedEffect: '신장 보호', history: [{ date: '2017-12', value: 95 }, { date: '2020-06', value: 92 }, { date: '2023-03', value: 88 }, { date: '2025-11', value: 85 }] },
  { name: '골밀도(T-score)', value: -0.8, unit: '', normalRange: '-1.0 이상', cautionThreshold: '-1.0 이하', status: 'normal', nutrient: '칼마디', keyIngredient: '칼슘, Mg, 비타민D, 아연', expectedEffect: '골밀도 유지', history: [{ date: '2017-12', value: -0.3 }, { date: '2020-06', value: -0.5 }, { date: '2023-03', value: -0.7 }, { date: '2025-11', value: -0.8 }] },
  { name: '장건강(자가)', value: 3, unit: '점', normalRange: '쾌변', cautionThreshold: '변비/설사', status: 'caution', nutrient: '프로바이오틱스', keyIngredient: '유산균19종+프리바이오틱스', expectedEffect: '장내환경', history: [] },
]

export const healthScore = 55
export const healthGrades = {
  good: ['빈혈', '시력'],
  caution: ['고혈압', '당뇨', '신장질환'],
  danger: ['체중관리', '이상지질혈증', '간건강'],
}
export const recommendedNutrients = [
  '밀크씨슬추출물', '오메가3(EPA 및 DHA 함유 유지)', '바나바잎추출물',
  '미네랄', '코엔자임Q10', '비타민B', '녹차추출물',
  '비타민/미네랄', '가르시니아추출물', '프로바이오틱스',
]
