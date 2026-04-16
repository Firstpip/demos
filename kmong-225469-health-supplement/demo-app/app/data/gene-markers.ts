export type RiskLevel = 'HIGH' | 'MID' | 'LOW'

export interface GeneMarker {
  gene: string
  snp: string
  category: string
  risk: RiskLevel
  symptom: string
  nutrients: string[]
  description: string
}

export const geneMarkers: GeneMarker[] = [
  { gene: 'FTO', snp: 'rs9939609', category: '비만/체중', risk: 'HIGH', symptom: '체지방 증가 경향', nutrients: ['가르시니아(HCA)', 'CLA', '클레우스포스콜리'], description: '체지방 축적과 식욕 조절에 관여하는 유전자입니다. 이 변이를 가진 경우 체중 관리에 더 주의가 필요합니다.' },
  { gene: 'TCF7L2', snp: 'rs7903146', category: '혈당 대사', risk: 'HIGH', symptom: '제2형 당뇨 위험', nutrients: ['바나바잎', '크롬', '알파리포산', '여주추출물'], description: '인슐린 분비와 혈당 조절에 관여합니다. 혈당 관리를 위한 식이 조절이 권장됩니다.' },
  { gene: 'APOE', snp: 'rs429358', category: '지질 대사', risk: 'HIGH', symptom: '콜레스테롤 상승', nutrients: ['rTG오메가3(EPA+DHA)', '폴리코사놀'], description: '콜레스테롤과 스테로이드 합성을 조절하는 유전자입니다.' },
  { gene: 'CYP1A2', snp: 'rs762551', category: '카페인 대사', risk: 'MID', symptom: '카페인 과민반응', nutrients: ['테아닌', '마그네슘', '감마아미노부티르산'], description: '카페인 분해 속도에 영향을 미치는 유전자입니다.' },
  { gene: 'VDR', snp: 'rs2228570', category: '비타민D 대사', risk: 'MID', symptom: '비타민D 흡수 저하', nutrients: ['콜레칼시페롤 2000IU+', '칼슘'], description: '비타민D 수용체 기능에 관여하며, 흡수율에 영향을 줍니다.' },
  { gene: 'MTHFR', snp: 'rs1801133', category: '엽산 대사', risk: 'HIGH', symptom: '호모시스테인 상승', nutrients: ['활성형 엽산(5-MTHF)', '비타민B6', 'B12'], description: '엽산을 활성형으로 전환하는 효소 유전자입니다. 변이 시 활성형 엽산 보충이 필요합니다.' },
  { gene: 'SOD2', snp: 'rs4880', category: '항산화', risk: 'MID', symptom: '산화 스트레스', nutrients: ['코엔자임Q10', '글루타치온', '비타민C'], description: '미토콘드리아 내 항산화 효소 유전자입니다.' },
  { gene: 'LCT', snp: 'rs4988235', category: '유당 분해', risk: 'LOW', symptom: '유당불내증', nutrients: ['프로바이오틱스(유산균19종)', '칼슘'], description: '유당 분해 효소 생성에 관여합니다.' },
  { gene: 'ACTN3', snp: 'rs1815739', category: '근력/운동', risk: 'LOW', symptom: '근육 특성 차이', nutrients: ['분지아미노산(BCAA)', '크레아틴'], description: '근섬유 유형과 운동 능력에 영향을 미칩니다.' },
  { gene: 'IL6', snp: 'rs1800795', category: '면역/염증', risk: 'MID', symptom: '만성 염증 경향', nutrients: ['커큐민', '프로폴리스', '비타민D'], description: '염증 반응을 조절하는 사이토카인 유전자입니다.' },
  { gene: 'ALDH2', snp: 'rs671', category: '알코올 대사', risk: 'MID', symptom: '알코올 분해 저하', nutrients: ['밀크씨슬(실리마린)', 'NAC', '비타민B'], description: '알코올 대사 과정에서 아세트알데히드 분해에 관여합니다.' },
  { gene: 'COMT', snp: 'rs4680', category: '스트레스', risk: 'MID', symptom: '스트레스 민감', nutrients: ['마그네슘', '테아닌', '로디올라'], description: '카테콜아민(도파민, 노르에피네프린) 분해에 관여하여 스트레스 반응에 영향을 줍니다.' },
]
