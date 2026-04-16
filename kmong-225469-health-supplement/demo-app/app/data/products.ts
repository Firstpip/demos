export interface Product {
  id: string
  name: string
  price: number
  subscriptionPrice: number
  category: string
  ingredients: string[]
  rating: number
  reviewCount: number
  description: string
  detailDescription: string
  howToTake: string
  caution: string
  targetUser: string
}

export const categories = ['전체', '간건강', '혈행건강', '뼈/면역', '혈당관리', '항산화', '엽산/비타민B', '장건강', '스트레스/수면', '운동/근력']

export const products: Product[] = [
  { id: 'P001', name: '프리미엄 밀크씨슬', price: 32000, subscriptionPrice: 25600, category: '간건강', ingredients: ['실리마린 130mg', 'NAC 200mg', '비타민B군'], rating: 4.8, reviewCount: 234, description: '간세포 보호와 해독 기능을 돕는 고함량 밀크씨슬',
    detailDescription: '밀크씨슬의 핵심 성분인 실리마린을 1일 기준 130mg 고함량으로 배합했습니다. 실리마린은 간세포막을 보호하고 손상된 간세포의 재생을 촉진하는 것으로 알려져 있습니다. 여기에 강력한 항산화 물질인 NAC(N-아세틸시스테인) 200mg과 간 대사에 필수적인 비타민B군을 함께 배합하여 간 건강을 종합적으로 관리합니다.\n\n특히 ALDH2 유전자 변이로 알코올 분해 능력이 저하된 분들에게 효과적이며, 건강검진에서 AST/ALT 수치가 상승한 경우 꾸준한 복용이 권장됩니다.',
    howToTake: '1일 1회, 1회 2캡슐을 식후에 충분한 물과 함께 복용하세요. 점심 또는 저녁 식후 복용을 권장합니다.', caution: '임산부, 수유부는 전문가와 상담 후 복용하세요. 간질환 치료제를 복용 중인 경우 의사와 상담이 필요합니다.', targetUser: '잦은 음주, 피로감, AST/ALT 수치 상승, ALDH2 유전자 변이 보유자' },
  { id: 'P002', name: 'rTG 오메가3 1000', price: 38000, subscriptionPrice: 30400, category: '혈행건강', ingredients: ['EPA 600mg', 'DHA 400mg', '비타민E'], rating: 4.9, reviewCount: 456, description: 'rTG 형태의 고순도 오메가3로 혈행 건강을 개선',
    detailDescription: '자연 상태와 동일한 rTG(re-esterified Triglyceride) 형태로 제조된 고순도 오메가3입니다. EE 형태 대비 흡수율이 약 70% 높아 적은 양으로도 효과적인 혈중 EPA/DHA 농도를 유지할 수 있습니다.\n\nEPA 600mg + DHA 400mg의 고함량 배합으로 혈중 중성지방 감소, 혈행 개선, 뇌 건강 지원에 효과적입니다. APOE 유전자 변이로 콜레스테롤 상승 위험이 있는 분들에게 특히 추천합니다.',
    howToTake: '1일 1회, 1회 2소프트젤을 식후에 복용하세요. 점심 식후 복용이 흡수율이 가장 높습니다.', caution: '혈액 응고 관련 약물 복용 시 전문가와 상담하세요. 수술 2주 전에는 복용을 중단하세요.', targetUser: '콜레스테롤 상승, 중성지방 관리, APOE 유전자 변이, 혈행 건강' },
  { id: 'P003', name: '활성형 비타민D 2000IU', price: 18000, subscriptionPrice: 14400, category: '뼈/면역', ingredients: ['콜레칼시페롤 2000IU', '칼슘 200mg'], rating: 4.7, reviewCount: 189, description: '흡수율 높은 활성형 비타민D로 골밀도와 면역력 지원',
    detailDescription: '비타민D3(콜레칼시페롤) 2000IU를 함유한 고함량 비타민D입니다. 비타민D는 칼슘 흡수를 촉진하여 골밀도를 유지하고, 면역 세포 활성화에 핵심적인 역할을 합니다.\n\nVDR 유전자 변이가 있는 경우 비타민D 수용체 기능이 저하되어 일반인보다 더 많은 비타민D가 필요합니다. 건강검진에서 비타민D 수치가 20ng/mL 이하인 분들에게 반드시 보충이 권장됩니다.',
    howToTake: '1일 1회, 1회 1정을 식후에 복용하세요. 지방 함유 식사 후 복용 시 흡수율이 높아집니다.', caution: '비타민D 과다 복용 시 고칼슘혈증이 발생할 수 있습니다. 1일 4000IU를 초과하지 마세요.', targetUser: '비타민D 부족(20ng/mL 이하), VDR 유전자 변이, 골밀도 저하, 실내 생활' },
  { id: 'P004', name: '혈당케어 바나바잎', price: 28000, subscriptionPrice: 22400, category: '혈당관리', ingredients: ['바나바잎추출물 300mg', '크롬 200mcg', '셀레늄 50mcg'], rating: 4.6, reviewCount: 123, description: '코로솔산 함유 바나바잎으로 건강한 혈당 관리',
    detailDescription: '바나바잎의 핵심 활성 성분인 코로솔산을 고농도로 함유한 제품입니다. 코로솔산은 인슐린과 유사한 작용으로 혈당 조절을 돕는 것으로 연구되어 있습니다.\n\n혈당 대사에 필수적인 미네랄 크롬 200mcg과 항산화 셀레늄 50mcg을 함께 배합하여 혈당 관리를 종합적으로 지원합니다. TCF7L2 유전자 변이로 제2형 당뇨 위험이 높은 분들, 공복혈당이 100mg/dL 이상인 분들에게 추천합니다.',
    howToTake: '1일 2회, 1회 1정을 식전 30분에 복용하세요. 아침, 저녁 식전이 가장 효과적입니다.', caution: '혈당 강하제를 복용 중인 경우 저혈당 위험이 있으므로 의사와 상담하세요.', targetUser: '공복혈당 100+ mg/dL, TCF7L2 유전자 변이, 당뇨 전단계' },
  { id: 'P005', name: '코엔자임Q10 플러스', price: 35000, subscriptionPrice: 28000, category: '항산화', ingredients: ['코엔자임Q10 100mg', '비타민E', '셀레늄'], rating: 4.8, reviewCount: 267, description: '세포 에너지 생성과 강력한 항산화 보호',
    detailDescription: '코엔자임Q10은 미토콘드리아에서 에너지(ATP)를 생성하는 데 핵심적인 역할을 하는 조효소입니다. 나이가 들수록 체내 CoQ10 합성이 감소하여 피로감이 증가하고 세포 노화가 촉진됩니다.\n\n고함량 100mg 배합에 비타민E와 셀레늄을 추가하여 항산화 시너지를 극대화했습니다. SOD2 유전자 변이로 산화 스트레스에 취약한 분들, 만성 피로를 느끼는 분들에게 효과적입니다.',
    howToTake: '1일 1회, 1회 1캡슐을 아침 식후에 복용하세요. CoQ10은 지용성이므로 식사와 함께 복용해야 흡수됩니다.', caution: '혈압약(와파린 등) 복용 시 효과가 감소할 수 있으므로 전문가 상담이 필요합니다.', targetUser: '만성 피로, SOD2 유전자 변이, 항산화, 혈압/심장 건강' },
  { id: 'P006', name: '활성형 엽산 B콤플렉스', price: 22000, subscriptionPrice: 17600, category: '엽산/비타민B', ingredients: ['활성형 엽산(5-MTHF) 400mcg', '비타민B6 25mg', '비타민B12 1000mcg'], rating: 4.7, reviewCount: 178, description: 'MTHFR 변이 보유자를 위한 활성형 엽산과 비타민B 복합제',
    detailDescription: '일반 합성 엽산(folic acid) 대신 체내에서 바로 활용 가능한 활성형 엽산(5-MTHF)을 사용한 제품입니다. MTHFR 유전자 변이(rs1801133)가 있는 경우 합성 엽산을 활성형으로 전환하는 효소 활성이 30~70% 감소합니다.\n\n활성형 엽산 400mcg에 호모시스테인 대사에 필수적인 비타민B6, B12를 고함량으로 배합하여 호모시스테인 수치를 정상 범위로 관리합니다. 심혈관 건강과 세포 분열에 중요합니다.',
    howToTake: '1일 1회, 1회 1정을 아침 식후에 복용하세요.', caution: '엽산 보충은 비타민B12 결핍 증상을 가릴 수 있으므로 정기적인 혈액 검사를 권장합니다.', targetUser: 'MTHFR 유전자 변이, 호모시스테인 상승, 임신 준비, 심혈관 건강' },
  { id: 'P007', name: '프로바이오틱스 19종', price: 25000, subscriptionPrice: 20000, category: '장건강', ingredients: ['유산균 19종 100억 CFU', '프리바이오틱스 3g'], rating: 4.9, reviewCount: 512, description: '장내 환경 개선을 위한 19종 프로바이오틱스',
    detailDescription: '식약처 고시 프로바이오틱스 19종을 100억 CFU 함유한 프리미엄 유산균입니다. 락토바실러스, 비피도박테리움 등 다양한 균주를 배합하여 장내 유익균 다양성을 높입니다.\n\n프리바이오틱스(유산균 먹이) 3g을 함께 배합하여 유산균의 정착과 증식을 돕습니다. LCT 유전자 변이로 유당불내증이 있는 분들의 장 건강 관리에도 효과적입니다.',
    howToTake: '1일 1회, 1회 1포를 취침 전 공복에 복용하세요. 상온 보관이 가능하나 냉장 보관을 권장합니다.', caution: '처음 복용 시 일시적으로 가스나 복부 팽만감이 있을 수 있습니다. 1~2주 후 적응됩니다.', targetUser: '변비/설사, LCT 유전자 변이, 장내 환경 개선, 면역력' },
  { id: 'P008', name: '마그네슘 트리플', price: 20000, subscriptionPrice: 16000, category: '스트레스/수면', ingredients: ['산화마그네슘 400mg', '테아닌 200mg', '로디올라 150mg'], rating: 4.6, reviewCount: 145, description: '스트레스 완화와 수면의 질 개선을 위한 트리플 포뮬러',
    detailDescription: '근육 이완과 신경 안정에 필수적인 마그네슘 400mg에 녹차 유래 테아닌 200mg과 적응성 허브 로디올라 150mg을 배합한 트리플 포뮬러입니다.\n\n테아닌은 알파파를 증가시켜 이완 상태를 유도하고, 로디올라는 코르티솔(스트레스 호르몬)을 조절하는 것으로 알려져 있습니다. COMT 유전자 변이로 스트레스에 민감한 분들에게 특히 효과적입니다.',
    howToTake: '1일 1회, 1회 2정을 저녁 식후 또는 취침 30분 전에 복용하세요.', caution: '신장 기능이 저하된 경우 마그네슘 축적 위험이 있으므로 전문가와 상담하세요.', targetUser: '스트레스, 수면 문제, COMT 유전자 변이, 근육 경련' },
  { id: 'P009', name: '글루타치온 항산화', price: 42000, subscriptionPrice: 33600, category: '항산화', ingredients: ['환원형 글루타치온 250mg', '비타민C 500mg'], rating: 4.8, reviewCount: 298, description: '체내 최강 항산화 물질 환원형 글루타치온',
    detailDescription: '글루타치온은 체내에서 가장 강력한 항산화 물질로, 활성산소를 제거하고 세포를 보호하는 핵심 역할을 합니다. 특히 환원형(reduced) 글루타치온 250mg을 사용하여 체내 흡수율을 극대화했습니다.\n\n비타민C 500mg과 함께 복용하면 항산화 시너지가 발생하여 글루타치온의 재활용이 촉진됩니다. 피부 미백, 간 해독, 면역력 강화에 효과적이며, SOD2 유전자 변이 보유자에게 추천합니다.',
    howToTake: '1일 1회, 1회 1캡슐을 공복에 복용하세요. 흡수율을 높이기 위해 식사 30분 전 복용을 권장합니다.', caution: '항암제 치료 중인 경우 전문가와 상담 후 복용하세요.', targetUser: '항산화, 피부 미백, SOD2 유전자 변이, 간 해독' },
  { id: 'P010', name: 'BCAA 근력 서포트', price: 30000, subscriptionPrice: 24000, category: '운동/근력', ingredients: ['BCAA 3000mg', '크레아틴 2000mg', '비타민D 1000IU'], rating: 4.5, reviewCount: 89, description: '근력 운동 효율과 회복을 돕는 BCAA 복합제',
    detailDescription: '분지쇄아미노산(BCAA) 3000mg에 근육 에너지 대사를 돕는 크레아틴 2000mg, 근육 기능에 중요한 비타민D 1000IU를 배합한 운동 전문 포뮬러입니다.\n\nBCAA는 류신, 이소류신, 발린 세 가지 필수아미노산으로, 근육 단백질 합성을 촉진하고 운동 후 근육 손상을 줄여줍니다. ACTN3 유전자(rs1815739) 분석 결과와 함께 개인에게 최적화된 운동 영양 설계가 가능합니다.',
    howToTake: '운동 30분 전에 1포를 물 200ml에 타서 섭취하세요. 비운동일에는 아침 공복에 복용합니다.', caution: '신장 질환이 있는 경우 크레아틴 섭취에 주의하세요. 충분한 수분 섭취가 필요합니다.', targetUser: '근력 운동, ACTN3 유전자 변이, 운동 후 회복, 근육량 증가' },
]
