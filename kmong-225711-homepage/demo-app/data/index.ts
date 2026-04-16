export const company = {
  name: '넥스트비전',
  nameEn: 'NEXTVISION',
  slogan: 'We architect\ndigital futures',
  sloganKo: '디지털의 미래를\n설계합니다',
  tagline: 'B2B Digital Partner',
  description: '기술과 전략의 교차점에서, 비즈니스의 다음 단계를 설계합니다.',
  vision: '복잡한 비즈니스 문제를 명쾌한 기술 솔루션으로 전환합니다.',
  mission: '10년간 150개 이상의 프로젝트를 통해, 데이터와 기술이 만들어내는 실질적 가치를 증명해왔습니다.',
  founded: '2015',
  email: 'hello@nextvision.kr',
  phone: '02-1234-5678',
  address: '서울시 강남구 테헤란로 152',
};

export const services = [
  {
    id: 'dx',
    num: '01',
    title: 'Digital\nTransformation',
    titleKo: '디지털 전환',
    brief: '레거시를 현대적 시스템으로. 비즈니스 프로세스 자동화와 클라우드 네이티브 전환.',
    details: ['레거시 마이그레이션', '프로세스 자동화', '클라우드 전환', 'API 설계'],
  },
  {
    id: 'data',
    num: '02',
    title: 'Data\nIntelligence',
    titleKo: '데이터 인텔리전스',
    brief: '데이터에서 인사이트를. 파이프라인 구축부터 AI 기반 예측 분석까지.',
    details: ['데이터 파이프라인', 'BI 대시보드', 'ML 모델링', '예측 분석'],
  },
  {
    id: 'cloud',
    num: '03',
    title: 'Cloud\nSolutions',
    titleKo: '클라우드 솔루션',
    brief: '안정적이고 확장 가능한 인프라. 비용 최적화된 클라우드 아키텍처 설계.',
    details: ['멀티클라우드', '인프라 자동화', '보안 설계', '비용 최적화'],
  },
  {
    id: 'consulting',
    num: '04',
    title: 'IT\nConsulting',
    titleKo: 'IT 컨설팅',
    brief: '전략에서 실행까지. 비즈니스 목표에 맞는 기술 로드맵 설계.',
    details: ['기술 전략', '로드맵 설계', '벤더 선정', '프로젝트 관리'],
  },
];

export const projects = [
  {
    id: 'smartfactory',
    title: '스마트팩토리\n통합 관제',
    client: 'K Manufacturing',
    year: '2025',
    category: 'Platform',
    description: 'IoT 센서 데이터 실시간 수집·분석. 공장 라인별 가동률, 불량률, 에너지 사용량을 한눈에 모니터링하는 통합 관제 시스템.',
    tags: ['React', 'Node.js', 'InfluxDB', 'WebSocket'],
    color: '#c8ff00',
  },
  {
    id: 'fintech-dashboard',
    title: '핀테크 리스크\n분석 대시보드',
    client: 'S Financial',
    year: '2024',
    category: 'Dashboard',
    description: '금융 거래 데이터를 AI로 분석하여 이상 거래를 탐지하고 리스크 지표를 시각화하는 실시간 대시보드.',
    tags: ['Next.js', 'Python', 'TensorFlow', 'PostgreSQL'],
    color: '#ff6b35',
  },
  {
    id: 'logistics-app',
    title: '물류 최적화\n모바일 앱',
    client: 'L Logistics',
    year: '2024',
    category: 'Mobile',
    description: '배송 경로 최적화와 실시간 차량 추적으로 배송 효율을 30% 향상시킨 물류 관리 앱.',
    tags: ['React Native', 'Go', 'Redis', 'Maps API'],
    color: '#00d4ff',
  },
  {
    id: 'healthcare',
    title: '헬스케어\n데이터 플랫폼',
    client: 'H Medical',
    year: '2023',
    category: 'Platform',
    description: 'FHIR 기반 의료 데이터 표준화. 병원 간 데이터 연동과 환자 건강 기록 통합 조회.',
    tags: ['Vue.js', 'Spring Boot', 'MongoDB', 'HL7'],
    color: '#a855f7',
  },
];

export const stats = [
  { value: '150+', label: 'Projects' },
  { value: '80+', label: 'Clients' },
  { value: '10Y', label: 'Experience' },
  { value: '98%', label: 'Satisfaction' },
];

export const team = [
  {
    name: '김도현',
    role: 'CEO',
    desc: '전략 15년',
    previous: '삼성SDS',
    bio: 'IT 전략 15년. 대기업 디지털 트랜스포메이션 전문. 비즈니스 가치 기반의 기술 의사결정을 설계합니다.',
    specialties: ['IT 전략', 'DX 컨설팅', '기술 로드맵', '벤더 선정'],
  },
  {
    name: '이서윤',
    role: 'CTO',
    desc: '풀스택 12년',
    previous: 'Naver',
    bio: '풀스택 12년. 대규모 트래픽 서비스 아키텍처 설계 경험. 프로덕트와 엔지니어링의 교차점에서 결정을 내립니다.',
    specialties: ['시스템 아키텍처', '마이크로서비스', '클라우드 네이티브', 'DevOps'],
  },
  {
    name: '박준혁',
    role: 'Design Lead',
    desc: 'BX 디자인 8년',
    previous: 'Plus X',
    bio: 'BX 디자인 8년. 브랜드 경험 설계부터 UI/UX까지. 은유적 표현과 기능성이 공존하는 디자인을 추구합니다.',
    specialties: ['Brand Experience', 'UI/UX', '모션 디자인', '디자인 시스템'],
  },
  {
    name: '최민지',
    role: 'Dev Lead',
    desc: '백엔드 10년',
    previous: 'Kakao',
    bio: '백엔드 10년. 핀테크·커머스 대규모 플랫폼 구축. API·데이터 모델링·성능 최적화가 주 영역입니다.',
    specialties: ['API 설계', '데이터 모델링', '성능 최적화', '분산 시스템'],
  },
  {
    name: '정하은',
    role: 'PM',
    desc: '프로젝트 관리 7년',
    previous: 'LG CNS',
    bio: '프로젝트 관리 7년. SI 대형 프로젝트 일정/리스크 관리. 고객 커뮤니케이션과 개발팀의 가교 역할을 수행합니다.',
    specialties: ['애자일/스크럼', '리스크 관리', '이해관계자 커뮤니케이션', '품질 관리'],
  },
  {
    name: '한승우',
    role: 'Consultant',
    desc: 'IT 컨설팅 9년',
    previous: 'McKinsey',
    bio: 'IT 컨설팅 9년. 비즈니스 분석부터 디지털 전환 전략까지. 데이터 기반 의사결정 프레임워크를 설계합니다.',
    specialties: ['비즈니스 분석', '디지털 전략', 'ROI 분석', '변화 관리'],
  },
];

export const history = [
  { year: '2015', event: '넥스트비전 설립 — 3인 창업' },
  { year: '2017', event: '첫 대형 DX 프로젝트 수주' },
  { year: '2019', event: 'AI/ML 데이터 사업부 신설' },
  { year: '2022', event: '50인 규모, 매출 100억 돌파' },
  { year: '2025', event: '싱가포르 진출, 글로벌 확장' },
];
