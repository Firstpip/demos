// 더미 데이터

export interface Product {
  id: number;
  title: string;
  author: string;
  publisher: string;
  price: number;
  discountRate: number;
  salePrice: number;
  category: string;
  grade: string;
  image: string;
  description: string;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBest: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userPhone: string;
  items: { productId: number; title: string; price: number; quantity: number }[];
  totalAmount: number;
  shippingFee: number;
  status: string;
  shippingAddress: string;
  shippingMemo: string;
  trackingNumber: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  points: number;
  orderCount: number;
  createdAt: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Resource {
  id: number;
  productId: number;
  productTitle: string;
  title: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export interface Qna {
  id: number;
  productId: number;
  userName: string;
  question: string;
  answer: string;
  answeredBy: string;
  createdAt: string;
  answeredAt: string;
}

// 상품 상세 설명은 제품 특성·구성·대상·학습 포인트·부가 자료를 5~8줄로 서술. 광고/과장 어휘는 사용하지 않는다 (톤 규칙: CLAUDE.md 참고).
const DESC_1 = '2026학년도 수능 출제 경향을 반영한 고3 대상 국어 실전 모의고사. 독서, 문학, 화법과 작문, 언어와 매체 4개 영역을 모두 포함한 실전 8회분과 복습용 미니 모의고사 4회분 수록. 45문항 80분 본시험과 동일한 형식으로 출제했으며 최근 3개년 평가원 기출 분석을 바탕으로 오답 선지를 배치. 지문별 핵심 독해 포인트, 오답 근거, 문단 요약 풀이를 단계별 해설로 제공하며 자주 나오는 어휘는 본문 외 별도 표로 정리. 자료실에서 정오표와 추가 해설 PDF를 받을 수 있다.';
const DESC_2 = '문학 영역을 집중 대비하는 고2 대상 모의고사 12회분. 고전 시가·고전 산문·현대 시·현대 소설·극/수필 5개 하위 영역을 회차별 균형 있게 배치했다. 수능·학평·모평 출제 빈도가 높은 작품 80편을 기준 작품으로 선정해 지문으로 활용하며 낯선 작품에 대한 독해 전략을 함께 다룬다. 해설은 작품 배경, 주제, 화자의 태도, 서술상 특징을 표로 정리하고 유사 작품 연계 학습을 위한 추천 목록을 포함한다.';
const DESC_3 = '고1 내신 국어 시험을 대비하는 학기별 대비 모의고사. 중간·기말 범위에 자주 출제되는 문법, 비문학 독서, 문학 감상 단원을 학교 시험 형식(객관식+서술형)으로 재구성했다. 교과서 수록 작품의 학교 시험 포인트를 문항화해 학습 효과를 높였으며, 단원별 취약점 진단표와 오답노트 템플릿을 함께 제공한다. 서술형 답안 채점 기준과 부분 점수 가이드를 수록해 실제 채점 흐름을 미리 경험할 수 있다.';
const DESC_4 = '수능 비문학 독서 영역을 집중 훈련하는 고3 대상 모의고사 10회분. 인문, 사회, 과학, 기술, 예술, 융합형까지 제재를 고르게 분포시켰으며 회차별 3개 지문·15문항 체제로 실전 감각을 유지한다. 지문 난이도는 최근 평가원 고난도 세트를 기준으로 조정했고, 정보량 많은 지문에서 문단 요약과 구조도를 그리는 방법을 해설 전면에 배치했다. 주제별 어휘·개념 정리 부록과 풀이 시간 관리 체크리스트를 포함한다.';
const DESC_5 = '수능 영어 1등급을 목표로 하는 고3 대상 실전 모의고사 8회분. 듣기 17문항+독해 28문항 전체 구성이며 빈칸 추론, 순서 배열, 문장 삽입, 글의 요지/주제 등 고난도 유형을 회차별 동일 비율로 배치했다. 최근 평가원·EBS 연계 패턴을 반영해 오답 선지 패턴을 분석하고, 지문별 문장 구조도, 패러프레이징 노트, 유사 어휘 묶음을 해설에 수록한다. 자료실에서 듣기 MP3 전체와 어휘 리스트 PDF를 내려받을 수 있다.';
const DESC_6 = '수능·학평 영어 듣기를 집중 대비하는 고2 대상 모의고사 15회분. 회차별 17문항 표준 구성이며 담화 주제, 의도 파악, 숫자 정보, 일정 등 유형을 균형 있게 배치했다. 듣기 MP3는 QR 코드와 자료실 다운로드를 모두 지원하고 원어민 속도 0.8배/1.0배/1.2배 세 가지 버전을 제공한다. 대본, 주요 표현 정리, 섀도잉 훈련 포인트, 유형별 빈출 어휘표를 함께 담아 듣기 후 리스닝 루틴을 완성하도록 구성했다.';
const DESC_7 = '고1 영어 학교 시험과 수능 기초를 동시에 대비하는 통합 모의고사 10회분. 학교 기출에서 반복되는 어법, 어휘, 독해 유형을 학기별 범위에 맞춰 구성했고 수능형 독해 지문을 각 회차마다 4지문씩 포함한다. 서술형 문항은 실제 학교 출제 양식(빈칸 채우기, 문장 재배열, 오류 수정)을 반영했으며, 해설에는 교과서 문법 포인트와 연계 표를 실었다. 매 회 학습 계획표와 단원별 성취 체크리스트가 함께 제공된다.';
const DESC_8 = '수능 영어 어법·어휘 영역을 집중 공략하는 고3 대상 모의고사 10회분. 밑줄 어법, 문맥 어휘, 문장 구조 파악, 문장 삽입 등 어법 빈출 유형을 회차별 균형 있게 배치했다. 각 문항 해설에는 어법 포인트, 품사/시제 비교표, 유사 구조 예문을 함께 제공해 문법 이론과 실전 감각을 연결한다. 부록으로 평가원 기출 어법 포인트 150선과 혼동하기 쉬운 어휘 짝표 80쌍을 수록했다.';
const DESC_9 = '2026학년도 수능 수학 실전 모의고사 8회분. 공통 과목(수학1, 수학2)과 선택 과목(미적분, 확률과 통계, 기하)을 모두 포함해 실제 시험지와 동일한 구성으로 제공한다. 각 회차는 30문항 100분 체제이며 22번·30번 등 킬러 문항을 최신 경향에 맞춰 출제했다. 해설은 풀이 순서, 풀이 시간 배분 전략, 대체 풀이를 함께 제시하고 오답 유형별 복습 경로를 트리 형태로 제공한다. 계산 실수를 줄이기 위한 계산 패드 양식이 별책 부록으로 포함된다.';
const DESC_10 = '수능 수학 킬러 문항만 엄선한 고3 대상 집중 훈련 모의고사. 4점 후반~킬러 난이도 120문항을 21번, 22번, 29번, 30번 유형별로 분류해 수록했으며 풀이 단계별 사고 과정을 시각화한 해설을 제공한다. 하나의 문항에 대해 수식 풀이, 그래프/도형 풀이, 조건 역추론 풀이 등 2~3가지 접근을 병기하고 유사 기출 문항을 비교해 유형 감각을 키운다. 별책으로 고난도 기출 오답 포인트 정리와 풀이 시간 단축 워크북을 제공한다.';
const DESC_11 = '고2 대상 수능 수학 기초 모의고사 10회분으로 수학1·수학2 전 범위를 커버한다. 개념-기본-응용-실전 4단계 난이도로 회차를 배치해 단계별 실력 점검이 가능하며, 각 회차 마지막에 단원별 취약점 진단표를 배치해 다음 회차 학습 방향을 제시한다. 해설은 개념 요약, 공식 유도 과정, 실수 포인트 순으로 정리했고 자주 틀리는 유형을 모은 오답 워크북을 별책으로 제공한다.';
const DESC_12 = '고1 수학 학교 내신을 대비하는 학기별 모의고사 12회분. 중간·기말 범위에 맞춰 실수와 유리식, 일차함수·이차함수, 도형 단원을 집중 배치했으며 객관식과 서술형을 7:3 비율로 구성했다. 서술형 답안은 단계별 부분 점수 채점 기준까지 제공하고, 풀이 과정 기록 훈련을 위한 서술 전용 답안 양식을 부록에 수록했다. 단원별 요점 정리와 교과서 예제 연계 표를 함께 제공한다.';
const DESC_13 = '수능 사회탐구 생활과윤리 실전 모의고사 12회분. 동양윤리, 서양윤리, 사회윤리, 문화윤리, 평화윤리 5개 단원을 기출 비율에 맞춰 배치했다. 최근 5개년 평가원 기출에서 반복되는 사상가 핵심 명제 50개를 기준으로 문항을 구성했으며 각 문항 해설에 사상가별 주장 비교표, 오답 선지의 왜 틀렸는지 단락 해설, 빈출 사례 추가 설명을 제공한다. 사상가별 핵심 명제 암기 카드(앞·뒤면) 부록이 포함된다.';
const DESC_14 = '수능 사회탐구 사회문화 과목의 개념을 모의고사 형태로 점검하는 고2 대상 교재. 문화와 사회, 사회 불평등, 사회 변동, 세계화 등 주요 단원을 4회차 세트로 구성했으며 각 세트는 개념 확인-도표 분석-사례 적용-통합 실전 순으로 난이도가 상승한다. 도표·그래프 해석 유형에 강점을 두었으며 실제 통계 자료를 변형한 사례 문항을 다수 포함한다. 개념 지도와 주요 용어 사전이 별책 부록으로 제공된다.';
const DESC_15 = '수능 사회탐구 한국지리 실전 모의고사 10회분. 국토 인식, 지형 환경, 기후 환경, 거주·생산·교통, 인구·도시 등 단원을 기출 빈도에 맞춰 배치했다. 지도·도표·사진 자료를 각 지문에 풍부히 포함해 자료 해석 능력을 훈련하며, 해설에는 자료별 판독 포인트와 혼동하기 쉬운 지역/기후 비교표를 수록했다. 부록으로 우리나라 지형도 및 기후 구분도 포스터 1장이 포함된다.';
const DESC_16 = '수능 사회탐구 동아시아사 기출 분석 모의고사 10회분. 선사시대부터 근현대까지 시대 구분을 균형 있게 배치했으며 한국·중국·일본·동남아 4개 축으로 사건을 비교할 수 있도록 지문과 문항을 설계했다. 해설은 시대별 핵심 사건 연표, 주요 인물 정리, 출제 빈도 상위 50개 주제의 비교 분석을 함께 제공한다. 별책으로 시대 흐름을 그림으로 보여주는 연표 카드와 기출 빈출 사료 원문 20선이 수록된다.';
const DESC_17 = '수능 과학탐구 물리학1 실전 모의고사 10회분. 역학(등가속도, 운동량, 에너지 보존), 파동(파동의 기본·광학·전자기파), 열역학까지 전 범위를 균형 있게 배치했다. 최근 평가원 고난도 문항 유형을 반영해 조건 해석이 까다로운 문항을 회차마다 포함했으며, 해설은 공식 유도, 그래프 분석, 조건 변경 시 풀이 변화를 단계별로 제공한다. 실험 장치 이해를 돕는 도해와 공식 카드 부록이 함께 제공된다.';
const DESC_18 = '수능 과학탐구 화학1 개념과 실전을 한 권에서 다루는 고2 대상 교재. 원자 구조, 주기율, 화학 결합, 화학 반응, 산·염기, 산화 환원 단원을 개념 요약-예제-응용-실전 모의고사 순으로 배치했다. 각 단원 실전 회차 2회씩 총 12회분을 수록했으며 실험 기반 문항은 실제 고교 실험 사진과 수치 데이터를 활용한다. 공식·주요 반응식 카드와 오답 빈출 개념 요약이 별책 부록으로 포함된다.';
const DESC_19 = '수능 과학탐구 생명과학1 실전 모의고사 10회분. 세포와 에너지, 항상성, 유전, 진화, 생태계 단원을 고루 배치했으며 특히 고난도 킬러 유형으로 꼽히는 유전과 항상성 문항을 회차당 2문항 이상 포함한다. 해설은 가계도 분석법, 실험 조건 재구성, 자료 해석 순으로 구조화되어 있고 헷갈리기 쉬운 개념 쌍을 비교표로 정리했다. 세포 구조도·유전 교차 다이어그램 부록이 함께 제공된다.';
const DESC_20 = '수능 과학탐구 지구과학1 기출 분석 모의고사 10회분. 고체 지구, 대기와 해양, 우주 세 개 대단원을 기출 빈도에 맞춰 배치했으며 최근 3개년 평가원 자료 해석 유형을 중심으로 재구성했다. 자료 해석 문항은 실제 관측 자료와 비슷한 형태로 제작했고 해설에는 판독 순서, 자주 등장하는 시험용 그래프 패턴, 오답 유도 트릭을 정리했다. 지질시대 연대표와 대기·해양 순환 개요도가 부록으로 포함된다.';
const DESC_21 = '수능 필수 과목인 한국사를 모의고사로 반복 학습하는 교재. 선사시대부터 현대까지 주요 사건 120개를 기준으로 회차별 20문항 총 10회분을 구성했다. 고대-고려-조선-근대-일제강점기-현대 시대 구분을 명확히 하고, 자주 출제되는 사료 원문과 그림 자료를 지문에 활용했다. 해설은 사건 배경, 주요 인물, 관련 기구, 비교 사건을 표로 정리했으며 별책으로 시대 흐름 요약 연표와 주요 인물 카드 50장을 제공한다.';
const DESC_22 = '수능 제2외국어 일본어1 대비 모의고사 10회분. 어휘·문법·독해·문화 4개 영역을 회차별 균형 있게 출제했으며 수능형 30문항 체제를 그대로 따른다. 해설은 어법 포인트, 관용 표현, 문화 배경 설명을 함께 제공하며 초중급 학습자를 위한 한자 읽기 가이드와 기본 동사 활용 표가 별책으로 포함된다. 자료실에서 듣기용 발음 음성 파일과 핵심 어휘 300선 PDF를 다운로드 받을 수 있다.';
const DESC_23 = '대입 논술을 대비하는 고3 대상 통합형 모의고사 8회분. 인문 계열 4회, 사회 계열 2회, 자연 계열 2회로 구성했으며 각 회차는 제시문 3~4개와 논제 2~3개로 실제 대학 논술 형식을 따른다. 모범 답안은 논증 구조, 제시문 활용도, 비판적 사고 포인트 세 기준으로 단계별 설명하고, 논술 첨삭용 자기 점검표와 예상 평가 루브릭을 함께 제공한다. 주요 대학별 출제 경향 비교표가 부록으로 포함된다.';
const DESC_24 = '고1 대상 전국연합학력평가를 대비하는 국어·영어·수학 3과목 통합 모의고사 6회분. 실제 학평 시험지와 동일한 과목 배치와 시간 구성을 따라 회차 단위로 전 과목을 함께 푸는 실전 훈련이 가능하다. 각 과목 해설은 오답 유형별 분석표, 과목별 시간 관리 전략, 단원별 취약점 진단표 순으로 정리했다. 별책으로 학평 채점표 양식과 주요 빈출 개념 카드 세트가 함께 제공된다.';

const products_raw = [
  { id: 1, title: '2026 수능 국어 실전 모의고사 시즌1', author: '김현우', publisher: '에듀프레스', price: 18000, discountRate: 10, salePrice: 16200, category: '국어', grade: '고3', description: DESC_1, stock: 150, soldCount: 892, rating: 4.7, reviewCount: 45, isNew: false, isBest: true, createdAt: '2026-01-15' },
  { id: 2, title: '국어 문학 기출 분석 모의고사', author: '박서연', publisher: '에듀프레스', price: 15000, discountRate: 15, salePrice: 12750, category: '국어', grade: '고2', description: DESC_2, stock: 200, soldCount: 634, rating: 4.5, reviewCount: 32, isNew: false, isBest: true, createdAt: '2025-11-20' },
  { id: 3, title: '고1 국어 내신 대비 모의고사', author: '이지민', publisher: '에듀프레스', price: 13000, discountRate: 5, salePrice: 12350, category: '국어', grade: '고1', description: DESC_3, stock: 300, soldCount: 421, rating: 4.3, reviewCount: 18, isNew: true, isBest: false, createdAt: '2026-03-01' },
  { id: 4, title: '비문학 독서 집중 훈련 모의고사', author: '정하은', publisher: '에듀프레스', price: 16000, discountRate: 10, salePrice: 14400, category: '국어', grade: '고3', description: DESC_4, stock: 180, soldCount: 567, rating: 4.6, reviewCount: 28, isNew: false, isBest: false, createdAt: '2025-12-10' },
  { id: 5, title: '2026 수능 영어 실전 모의고사', author: '제임스 리', publisher: '에듀프레스', price: 18000, discountRate: 10, salePrice: 16200, category: '영어', grade: '고3', description: DESC_5, stock: 170, soldCount: 945, rating: 4.8, reviewCount: 52, isNew: false, isBest: true, createdAt: '2026-01-20' },
  { id: 6, title: '영어 듣기 실전 모의고사', author: '사라 김', publisher: '에듀프레스', price: 16000, discountRate: 15, salePrice: 13600, category: '영어', grade: '고2', description: DESC_6, stock: 250, soldCount: 389, rating: 4.4, reviewCount: 22, isNew: true, isBest: false, createdAt: '2026-02-15' },
  { id: 7, title: '고1 영어 내신+수능 대비 모의고사', author: '이영훈', publisher: '에듀프레스', price: 14000, discountRate: 5, salePrice: 13300, category: '영어', grade: '고1', description: DESC_7, stock: 280, soldCount: 312, rating: 4.2, reviewCount: 15, isNew: true, isBest: false, createdAt: '2026-03-10' },
  { id: 8, title: '영어 어법 집중 공략 모의고사', author: '제임스 리', publisher: '에듀프레스', price: 15000, discountRate: 10, salePrice: 13500, category: '영어', grade: '고3', description: DESC_8, stock: 190, soldCount: 478, rating: 4.5, reviewCount: 25, isNew: false, isBest: false, createdAt: '2025-10-05' },
  { id: 9, title: '2026 수능 수학 실전 모의고사', author: '최준혁', publisher: '에듀프레스', price: 19000, discountRate: 10, salePrice: 17100, category: '수학', grade: '고3', description: DESC_9, stock: 160, soldCount: 1023, rating: 4.9, reviewCount: 67, isNew: false, isBest: true, createdAt: '2026-01-10' },
  { id: 10, title: '수학 킬러문항 정복 모의고사', author: '최준혁', publisher: '에듀프레스', price: 17000, discountRate: 15, salePrice: 14450, category: '수학', grade: '고3', description: DESC_10, stock: 140, soldCount: 756, rating: 4.7, reviewCount: 41, isNew: false, isBest: true, createdAt: '2025-12-01' },
  { id: 11, title: '고2 수학 수능 기초 모의고사', author: '한지수', publisher: '에듀프레스', price: 15000, discountRate: 5, salePrice: 14250, category: '수학', grade: '고2', description: DESC_11, stock: 220, soldCount: 445, rating: 4.4, reviewCount: 20, isNew: true, isBest: false, createdAt: '2026-02-20' },
  { id: 12, title: '고1 수학 내신 완성 모의고사', author: '한지수', publisher: '에듀프레스', price: 13000, discountRate: 5, salePrice: 12350, category: '수학', grade: '고1', description: DESC_12, stock: 310, soldCount: 523, rating: 4.3, reviewCount: 24, isNew: false, isBest: false, createdAt: '2025-09-15' },
  { id: 13, title: '2026 수능 사회탐구 실전 모의고사 - 생활과윤리', author: '윤서영', publisher: '에듀프레스', price: 14000, discountRate: 10, salePrice: 12600, category: '사회', grade: '고3', description: DESC_13, stock: 200, soldCount: 534, rating: 4.5, reviewCount: 30, isNew: false, isBest: true, createdAt: '2026-01-25' },
  { id: 14, title: '사회문화 개념완성 모의고사', author: '윤서영', publisher: '에듀프레스', price: 13000, discountRate: 10, salePrice: 11700, category: '사회', grade: '고2', description: DESC_14, stock: 230, soldCount: 378, rating: 4.3, reviewCount: 17, isNew: true, isBest: false, createdAt: '2026-03-05' },
  { id: 15, title: '한국지리 실전 모의고사', author: '김태호', publisher: '에듀프레스', price: 14000, discountRate: 5, salePrice: 13300, category: '사회', grade: '고3', description: DESC_15, stock: 180, soldCount: 289, rating: 4.4, reviewCount: 14, isNew: false, isBest: false, createdAt: '2025-11-10' },
  { id: 16, title: '동아시아사 기출 분석 모의고사', author: '김태호', publisher: '에듀프레스', price: 13000, discountRate: 10, salePrice: 11700, category: '사회', grade: '고3', description: DESC_16, stock: 150, soldCount: 234, rating: 4.2, reviewCount: 11, isNew: false, isBest: false, createdAt: '2025-10-20' },
  { id: 17, title: '2026 수능 과학탐구 실전 모의고사 - 물리학I', author: '이동현', publisher: '에듀프레스', price: 15000, discountRate: 10, salePrice: 13500, category: '과학', grade: '고3', description: DESC_17, stock: 170, soldCount: 612, rating: 4.6, reviewCount: 35, isNew: false, isBest: true, createdAt: '2026-01-18' },
  { id: 18, title: '화학I 개념+실전 모의고사', author: '박진우', publisher: '에듀프레스', price: 15000, discountRate: 15, salePrice: 12750, category: '과학', grade: '고2', description: DESC_18, stock: 210, soldCount: 445, rating: 4.5, reviewCount: 23, isNew: true, isBest: false, createdAt: '2026-02-25' },
  { id: 19, title: '생명과학I 실전 모의고사', author: '이동현', publisher: '에듀프레스', price: 14000, discountRate: 10, salePrice: 12600, category: '과학', grade: '고3', description: DESC_19, stock: 190, soldCount: 523, rating: 4.7, reviewCount: 29, isNew: false, isBest: false, createdAt: '2025-12-15' },
  { id: 20, title: '지구과학I 기출 분석 모의고사', author: '박진우', publisher: '에듀프레스', price: 14000, discountRate: 5, salePrice: 13300, category: '과학', grade: '고2', description: DESC_20, stock: 200, soldCount: 312, rating: 4.3, reviewCount: 16, isNew: false, isBest: false, createdAt: '2025-11-05' },
  { id: 21, title: '수능 한국사 필수 모의고사', author: '정민석', publisher: '에듀프레스', price: 12000, discountRate: 10, salePrice: 10800, category: '기타', grade: '고3', description: DESC_21, stock: 350, soldCount: 1245, rating: 4.8, reviewCount: 58, isNew: false, isBest: true, createdAt: '2026-01-05' },
  { id: 22, title: '제2외국어 일본어 모의고사', author: '다나카 유미', publisher: '에듀프레스', price: 13000, discountRate: 15, salePrice: 11050, category: '기타', grade: '고3', description: DESC_22, stock: 120, soldCount: 178, rating: 4.1, reviewCount: 9, isNew: false, isBest: false, createdAt: '2025-09-20' },
  { id: 23, title: '논술 대비 통합형 모의고사', author: '이지민', publisher: '에듀프레스', price: 16000, discountRate: 5, salePrice: 15200, category: '기타', grade: '고3', description: DESC_23, stock: 160, soldCount: 267, rating: 4.4, reviewCount: 13, isNew: true, isBest: false, createdAt: '2026-03-15' },
  { id: 24, title: '학력평가 대비 종합 모의고사', author: '에듀프레스 편집부', publisher: '에듀프레스', price: 20000, discountRate: 20, salePrice: 16000, category: '기타', grade: '고1', description: DESC_24, stock: 280, soldCount: 689, rating: 4.6, reviewCount: 37, isNew: false, isBest: true, createdAt: '2025-08-10' },
];

export const products: Product[] = products_raw.map(p => ({ ...p, image: '' }));

export const orders: Order[] = [
  { id: 1, orderNumber: 'ORD-20260415-001', userId: 1, userName: '김수현', userPhone: '010-1234-5678', items: [{ productId: 1, title: '2026 수능 국어 실전 모의고사 시즌1', price: 16200, quantity: 1 }, { productId: 9, title: '2026 수능 수학 실전 모의고사', price: 17100, quantity: 2 }], totalAmount: 50400, shippingFee: 0, status: '배송완료', shippingAddress: '서울시 강남구 테헤란로 123', shippingMemo: '부재 시 경비실에 맡겨주세요', trackingNumber: '1234567890', createdAt: '2026-04-15' },
  { id: 2, orderNumber: 'ORD-20260414-002', userId: 2, userName: '이민재', userPhone: '010-2345-6789', items: [{ productId: 5, title: '2026 수능 영어 실전 모의고사', price: 16200, quantity: 1 }], totalAmount: 16200, shippingFee: 3000, status: '배송중', shippingAddress: '부산시 해운대구 해운대로 456', shippingMemo: '', trackingNumber: '2345678901', createdAt: '2026-04-14' },
  { id: 3, orderNumber: 'ORD-20260413-003', userId: 3, userName: '박지현', userPhone: '010-3456-7890', items: [{ productId: 13, title: '2026 수능 사회탐구 실전 모의고사 - 생활과윤리', price: 12600, quantity: 1 }, { productId: 17, title: '2026 수능 과학탐구 실전 모의고사 - 물리학I', price: 13500, quantity: 1 }], totalAmount: 26100, shippingFee: 0, status: '배송중', shippingAddress: '대전시 유성구 대학로 789', shippingMemo: '문 앞에 놓아주세요', trackingNumber: '3456789012', createdAt: '2026-04-13' },
  { id: 4, orderNumber: 'ORD-20260412-004', userId: 4, userName: '정하늘', userPhone: '010-4567-8901', items: [{ productId: 21, title: '수능 한국사 필수 모의고사', price: 10800, quantity: 3 }], totalAmount: 32400, shippingFee: 0, status: '배송완료', shippingAddress: '인천시 남동구 예술로 321', shippingMemo: '', trackingNumber: '4567890123', createdAt: '2026-04-12' },
  { id: 5, orderNumber: 'ORD-20260411-005', userId: 5, userName: '최윤서', userPhone: '010-5678-9012', items: [{ productId: 10, title: '수학 킬러문항 정복 모의고사', price: 14450, quantity: 1 }], totalAmount: 14450, shippingFee: 3000, status: '결제완료', shippingAddress: '광주시 서구 상무대로 654', shippingMemo: '전화 부탁드립니다', trackingNumber: '', createdAt: '2026-04-11' },
  { id: 6, orderNumber: 'ORD-20260410-006', userId: 6, userName: '강서준', userPhone: '010-6789-0123', items: [{ productId: 2, title: '국어 문학 기출 분석 모의고사', price: 12750, quantity: 2 }, { productId: 8, title: '영어 어법 집중 공략 모의고사', price: 13500, quantity: 1 }], totalAmount: 39000, shippingFee: 0, status: '배송준비', shippingAddress: '대구시 수성구 범어로 987', shippingMemo: '', trackingNumber: '', createdAt: '2026-04-10' },
  { id: 7, orderNumber: 'ORD-20260409-007', userId: 7, userName: '임채원', userPhone: '010-7890-1234', items: [{ productId: 24, title: '학력평가 대비 종합 모의고사', price: 16000, quantity: 1 }], totalAmount: 16000, shippingFee: 3000, status: '배송중', shippingAddress: '울산시 남구 삼산로 147', shippingMemo: '빠른 배송 부탁드립니다', trackingNumber: '7890123456', createdAt: '2026-04-09' },
  { id: 8, orderNumber: 'ORD-20260408-008', userId: 1, userName: '김수현', userPhone: '010-1234-5678', items: [{ productId: 6, title: '영어 듣기 실전 모의고사', price: 13600, quantity: 1 }], totalAmount: 13600, shippingFee: 3000, status: '배송완료', shippingAddress: '서울시 강남구 테헤란로 123', shippingMemo: '', trackingNumber: '8901234567', createdAt: '2026-04-08' },
  { id: 9, orderNumber: 'ORD-20260407-009', userId: 2, userName: '이민재', userPhone: '010-2345-6789', items: [{ productId: 19, title: '생명과학I 실전 모의고사', price: 12600, quantity: 2 }], totalAmount: 25200, shippingFee: 0, status: '결제완료', shippingAddress: '부산시 해운대구 해운대로 456', shippingMemo: '', trackingNumber: '', createdAt: '2026-04-07' },
  { id: 10, orderNumber: 'ORD-20260406-010', userId: 3, userName: '박지현', userPhone: '010-3456-7890', items: [{ productId: 3, title: '고1 국어 내신 대비 모의고사', price: 12350, quantity: 1 }, { productId: 12, title: '고1 수학 내신 완성 모의고사', price: 12350, quantity: 1 }], totalAmount: 24700, shippingFee: 0, status: '배송준비', shippingAddress: '대전시 유성구 대학로 789', shippingMemo: '', trackingNumber: '', createdAt: '2026-04-06' },
  { id: 11, orderNumber: 'ORD-20260405-011', userId: 5, userName: '최윤서', userPhone: '010-5678-9012', items: [{ productId: 23, title: '논술 대비 통합형 모의고사', price: 15200, quantity: 1 }], totalAmount: 15200, shippingFee: 3000, status: '취소', shippingAddress: '광주시 서구 상무대로 654', shippingMemo: '', trackingNumber: '', createdAt: '2026-04-05' },
  { id: 12, orderNumber: 'ORD-20260404-012', userId: 4, userName: '정하늘', userPhone: '010-4567-8901', items: [{ productId: 14, title: '사회문화 개념완성 모의고사', price: 11700, quantity: 1 }, { productId: 20, title: '지구과학I 기출 분석 모의고사', price: 13300, quantity: 1 }], totalAmount: 25000, shippingFee: 0, status: '결제완료', shippingAddress: '인천시 남동구 예술로 321', shippingMemo: '주말 배송 부탁드립니다', trackingNumber: '', createdAt: '2026-04-04' },
];

export const users: User[] = [
  { id: 1, name: '김수현', email: 'suhyun@example.com', phone: '010-1234-5678', role: 'user', points: 5200, orderCount: 8, createdAt: '2025-06-15' },
  { id: 2, name: '이민재', email: 'minjae@example.com', phone: '010-2345-6789', role: 'user', points: 3100, orderCount: 5, createdAt: '2025-07-20' },
  { id: 3, name: '박지현', email: 'jihyun@example.com', phone: '010-3456-7890', role: 'user', points: 4800, orderCount: 12, createdAt: '2025-05-10' },
  { id: 4, name: '정하늘', email: 'haneul@example.com', phone: '010-4567-8901', role: 'user', points: 2300, orderCount: 3, createdAt: '2025-09-01' },
  { id: 5, name: '최윤서', email: 'yunseo@example.com', phone: '010-5678-9012', role: 'user', points: 1500, orderCount: 4, createdAt: '2025-10-15' },
  { id: 6, name: '강서준', email: 'seojun@example.com', phone: '010-6789-0123', role: 'user', points: 6700, orderCount: 15, createdAt: '2025-04-01' },
  { id: 7, name: '임채원', email: 'chaewon@example.com', phone: '010-7890-1234', role: 'user', points: 900, orderCount: 2, createdAt: '2026-01-20' },
  { id: 8, name: '관리자', email: 'admin@edupress.co.kr', phone: '02-1234-5678', role: 'admin', points: 0, orderCount: 0, createdAt: '2025-01-01' },
];

export const reviews: Review[] = [
  { id: 1, productId: 1, userId: 1, userName: '김수현', rating: 5, content: '수능 국어 실전 감각을 잡기에 좋았습니다. 난이도가 실제 수능과 비슷하고 특히 화법과 작문 지문이 최근 평가원 출제 경향과 잘 맞았습니다. 오답 해설이 단락별로 왜 틀렸는지 단계별로 풀어줘서 복습 시 이해가 빨랐습니다. 3회차부터 시간 내 마무리가 가능해졌고, 문학 지문에서는 작품별 주제·화자 비교표가 암기에 큰 도움이 되었습니다.', createdAt: '2026-04-10' },
  { id: 2, productId: 1, userId: 3, userName: '박지현', rating: 4, content: '해설이 자세해서 좋았습니다. 지문 구조를 문단별로 도식화한 점이 특히 마음에 들어요. 다만 비문학 2지문 일부는 배경 지식 없이는 풀이 시간이 꽤 걸리는 편이라 별 하나 뺐습니다. 그래도 최근 수능 트렌드 파악에는 확실히 유용합니다.', createdAt: '2026-04-05' },
  { id: 3, productId: 1, userId: 6, userName: '강서준', rating: 5, content: '3회독째 풀고 있는데 매번 새롭게 보이는 포인트가 있습니다. 처음에는 정답률에만 신경 썼는데 해설을 따라 풀이 과정을 재구성해보니 오답 선지의 패턴이 보이기 시작했고 평소 시험에서도 확신 있게 답을 고를 수 있게 되었습니다. 오답 노트 양식이 책 뒤에 있어 정리도 편했어요.', createdAt: '2026-03-28' },
  { id: 4, productId: 5, userId: 2, userName: '이민재', rating: 5, content: '영어 1등급 목표로 두 달 동안 썼는데 체감 난이도가 실제 수능과 거의 같습니다. 빈칸 추론 문제의 해설이 특히 좋았고, 정답 도출 과정에서 왜 다른 선지가 틀렸는지 문장 구조 분석까지 제공해 오답 원인을 확실히 알 수 있었습니다. 듣기 MP3 다운로드 속도도 빠르고 자료실 관리가 잘 되어 있습니다.', createdAt: '2026-04-12' },
  { id: 5, productId: 5, userId: 5, userName: '최윤서', rating: 4, content: '문제 퀄리티가 높고 해설이 꼼꼼합니다. 어휘 정리 부록이 특히 좋아 시험 직전 복습용으로 계속 쓰게 됩니다. 회차별 난이도 편차가 약간 있는 점만 아쉽고, 듣기 음성 파일 버전이 여러 속도로 제공되는 점은 연습에 도움이 많이 되었습니다.', createdAt: '2026-04-08' },
  { id: 6, productId: 9, userId: 1, userName: '김수현', rating: 5, content: '수학은 이 교재만 믿고 갔습니다. 킬러 문항의 풀이가 여러 접근 방식으로 제시되어 있어 문제 하나당 사고의 폭을 넓힐 수 있었습니다. 22번·30번 유형 반복 학습에 최적이고, 해설 끝에 달려 있는 유사 기출 연계 목록으로 추가 학습 경로를 잡기 좋습니다.', createdAt: '2026-04-11' },
  { id: 7, productId: 9, userId: 4, userName: '정하늘', rating: 5, content: '단계별 난이도 조절이 잘 되어 있어서 꾸준히 풀어나가면 실력이 확실히 오릅니다. 특히 미적분 단원 해설은 개념 복습과 실전 풀이를 연결하는 흐름이 좋아 학원 교재 대신 메인 교재로 사용 중입니다. 계산 실수 줄이는 별책 부록도 마음에 들어요.', createdAt: '2026-04-03' },
  { id: 8, productId: 9, userId: 6, userName: '강서준', rating: 4, content: '좋은 교재입니다. 다만 초판 기준으로 일부 문항에 오타가 있었는데 자료실 정오표에서 바로 수정본을 받을 수 있어 큰 불편은 없었습니다. 해설에서 그래프 풀이와 수식 풀이를 병기한 부분이 유용했고 오답 복습 트리 자료가 독특하면서 효과적이었습니다.', createdAt: '2026-03-25' },
  { id: 9, productId: 13, userId: 3, userName: '박지현', rating: 5, content: '생활과윤리 필수로 챙겨야 하는 교재라고 생각합니다. 사상가별 핵심 명제 비교표가 각 문항 해설에 함께 들어 있어 개념 암기와 문제 풀이를 한 번에 끝낼 수 있습니다. 별책 카드는 시험 직전 1시간 복습용으로 특히 요긴했습니다.', createdAt: '2026-04-09' },
  { id: 10, productId: 17, userId: 7, userName: '임채원', rating: 4, content: '물리학 고난도 문항이 많아서 처음엔 힘들었지만 해설이 친절해 단계별로 따라가니 이해가 됩니다. 공식 유도 과정이 그림과 함께 제시되어 있어 개념이 확실히 남았고 실험 도해 부록도 실제 시험에서 자료 해석할 때 도움이 컸습니다.', createdAt: '2026-04-07' },
  { id: 11, productId: 21, userId: 2, userName: '이민재', rating: 5, content: '한국사는 이 책 한 권으로 정리했습니다. 시대별로 묶인 지문과 연표가 머리 속 지도를 그려주고 인물 카드 50장 부록이 자주 나오는 인물 구분에 큰 도움이 됐습니다. 모의고사 회차별로 난이도가 조금씩 올라가서 지치지 않고 반복할 수 있었습니다.', createdAt: '2026-04-13' },
  { id: 12, productId: 21, userId: 5, userName: '최윤서', rating: 5, content: '필수과목이라 부담이 컸는데 시대 흐름표 덕분에 초반 진입이 편했습니다. 사료 원문 지문도 단계별로 해설해줘서 고어 이해에도 도움이 되었고, 별책 카드를 들고 다니며 자투리 시간에 복습할 수 있는 구성이 마음에 듭니다.', createdAt: '2026-04-06' },
  { id: 13, productId: 2, userId: 4, userName: '정하늘', rating: 4, content: '문학 작품 분석이 깔끔합니다. 특히 고전 시가 파트에서 화자 태도와 주제 변화를 표로 보여주는 방식이 암기에 효과적이었습니다. 수록 작품 80편이 수능 빈출 목록과 잘 맞아서 본 시험 전 마무리 학습에 적합합니다.', createdAt: '2026-03-30' },
  { id: 14, productId: 10, userId: 3, userName: '박지현', rating: 5, content: '킬러 문항만 모여 있어서 집중적으로 약점을 공략할 수 있었습니다. 접근법을 2~3가지로 병기한 해설이 문제마다 있어서 문제 푸는 사고 흐름을 다양하게 경험할 수 있었고 워크북 별책이 풀이 시간 단축에 특히 도움이 됐습니다.', createdAt: '2026-04-02' },
  { id: 15, productId: 10, userId: 7, userName: '임채원', rating: 4, content: '어려운데 풀고 나면 성취감이 큽니다. 첫 회차에서 시간 초과가 많이 났는데 해설에서 제시한 조건 역추론 방법을 익히니 3회차 이후부터 시간 내 풀이가 가능해졌습니다. 유사 기출 매핑표가 있어 반복 학습 방향이 뚜렷합니다.', createdAt: '2026-03-20' },
  { id: 16, productId: 24, userId: 6, userName: '강서준', rating: 5, content: '학력평가 대비에 딱 맞는 교재입니다. 국영수 세 과목을 한 회차에 묶어 풀 수 있어 실제 시험 시간 배분을 연습하기 좋았고 채점표 양식이 실제 OMR과 동일해 시뮬레이션 효과가 컸습니다. 취약점 진단표 덕분에 다음 회차 학습 포커스를 잡기 수월했습니다.', createdAt: '2026-04-14' },
  { id: 17, productId: 24, userId: 1, userName: '김수현', rating: 4, content: '과목별 시간 배분 훈련에 좋습니다. 한 번에 세 과목을 연달아 풀어야 해서 집중력 유지가 쉽지 않지만, 그만큼 실제 시험 환경과 비슷해 훈련 효과가 큽니다. 해설은 과목별로 별책이 분리되어 있어 과목별 복습이 편했습니다.', createdAt: '2026-04-01' },
  { id: 18, productId: 6, userId: 3, userName: '박지현', rating: 5, content: 'QR로 바로 듣기 파일을 열 수 있어 편합니다. 속도 3단계 지원이 섀도잉 훈련에 특히 유용했고 대본·주요 표현 정리가 함께 있어 듣기 후 복습 루틴을 만들기 좋았습니다. 음질도 깨끗해서 혼자 공부하기에 부담이 없습니다.', createdAt: '2026-03-15' },
  { id: 19, productId: 18, userId: 2, userName: '이민재', rating: 4, content: '개념 설명과 실전 문제가 번갈아 나오는 구성이라 흐름이 끊기지 않습니다. 화학 반응식 카드 부록이 시험 직전 복습에 큰 도움이 되었고 실험 기반 문제가 실제 고교 실험과 닮아 있어 자료 해석 연습에 좋았습니다.', createdAt: '2026-03-22' },
  { id: 20, productId: 4, userId: 5, userName: '최윤서', rating: 5, content: '비문학 독서력이 확실히 늘었습니다. 인문부터 과학까지 제재가 고르게 배분되어 있어 약점 영역을 파악할 수 있었고, 문단 요약·구조도 작성 방법을 해설로 익힌 뒤로는 긴 지문도 핵심을 빠르게 잡을 수 있었습니다.', createdAt: '2026-04-04' },
];

export const resources: Resource[] = [
  { id: 1, productId: 1, productTitle: '2026 수능 국어 실전 모의고사 시즌1', title: '정오표 (2026.04 수정)', fileType: 'PDF', fileSize: '245KB', downloadCount: 342, createdAt: '2026-04-01' },
  { id: 2, productId: 1, productTitle: '2026 수능 국어 실전 모의고사 시즌1', title: '추가 해설지 (문학 파트 심화)', fileType: 'PDF', fileSize: '1.2MB', downloadCount: 567, createdAt: '2026-03-15' },
  { id: 3, productId: 5, productTitle: '2026 수능 영어 실전 모의고사', title: '듣기 음성파일 전 회차 (속도 3단계)', fileType: 'ZIP', fileSize: '45.8MB', downloadCount: 823, createdAt: '2026-02-01' },
  { id: 4, productId: 6, productTitle: '영어 듣기 실전 모의고사', title: '듣기 음성파일 15회차 묶음', fileType: 'ZIP', fileSize: '38.2MB', downloadCount: 312, createdAt: '2026-03-01' },
  { id: 5, productId: 9, productTitle: '2026 수능 수학 실전 모의고사', title: '정오표 (2026.03 수정)', fileType: 'PDF', fileSize: '178KB', downloadCount: 456, createdAt: '2026-03-20' },
  { id: 6, productId: 9, productTitle: '2026 수능 수학 실전 모의고사', title: '보충 고난도 문제 24선', fileType: 'PDF', fileSize: '2.4MB', downloadCount: 689, createdAt: '2026-02-15' },
  { id: 7, productId: 10, productTitle: '수학 킬러문항 정복 모의고사', title: '풀이 동영상 링크 모음', fileType: 'PDF', fileSize: '156KB', downloadCount: 534, createdAt: '2026-01-10' },
  { id: 8, productId: 21, productTitle: '수능 한국사 필수 모의고사', title: '시대별 연표 정리 자료', fileType: 'PDF', fileSize: '3.1MB', downloadCount: 912, createdAt: '2026-01-15' },
  { id: 9, productId: 24, productTitle: '학력평가 대비 종합 모의고사', title: 'OMR 답안지 양식 (채점표 포함)', fileType: 'PDF', fileSize: '89KB', downloadCount: 445, createdAt: '2025-09-01' },
  { id: 10, productId: 17, productTitle: '2026 수능 과학탐구 실전 모의고사 - 물리학I', title: '실험 데이터 보충 자료 + 그래프 원본', fileType: 'PDF', fileSize: '1.8MB', downloadCount: 278, createdAt: '2026-02-20' },
];

export const notices: Notice[] = [
  { id: 1, title: '에듀프레스 온라인 서점 정식 오픈 안내', content: '안녕하세요, 에듀프레스입니다.\n\n그동안 서면 배본으로만 만날 수 있었던 에듀프레스 모의고사 교재를 온라인에서 직접 구매할 수 있는 공식 서점이 오픈했습니다.\n\n주요 기능\n- 전체 교재 검색·필터(과목·학년·정렬)와 상세 정보\n- 회원 전용 적립금 및 쿠폰 혜택\n- 주문·배송 상태 실시간 조회\n- 교재별 자료실(정오표, 추가 해설, 듣기 MP3 등) 다운로드\n\n오픈 기념 특별 안내\n- 신규 회원 가입 시 2,000원 적립금 즉시 지급\n- 3권 이상 구매 시 배송비 무료(상시)\n- 4월 한 달간 베스트셀러 10% 추가 할인\n\n앞으로 더 편리한 학습 경험을 제공할 수 있도록 꾸준히 개선해 나가겠습니다.', category: '공지', createdAt: '2026-04-01' },
  { id: 2, title: '2026 수능 시즌2 교재 출간 예정 및 사전예약 안내', content: '2026 수능 실전 모의고사 시즌2가 2026년 5월 15일 출간 예정입니다.\n\n출간 예정 과목\n- 국어 시즌2 (독서 4회분, 문학 4회분, 통합 2회분)\n- 영어 시즌2 (실전 8회분 + 듣기 MP3 속도 3단계)\n- 수학 시즌2 (공통 과목 6회분 + 선택 과목 3회분)\n\n사전예약 혜택\n- 10% 추가 할인 (시즌1 대비)\n- 사전예약자 전용 실전 대비 체크리스트 PDF 증정\n- 출간 당일 자동 발송, 평일 오후 2시 이전 예약 시 당일 출고\n\n사전예약은 4월 20일부터 5월 14일까지 진행됩니다. 많은 관심 부탁드립니다.', category: '공지', createdAt: '2026-04-10' },
  { id: 3, title: '[이벤트] 신규 회원가입 시 2,000원 적립금 즉시 지급', content: '에듀프레스 신규 회원가입 이벤트 안내입니다.\n\n대상\n- 에듀프레스 온라인 서점에 처음 가입하는 모든 회원\n\n혜택\n- 가입 즉시 2,000원 적립금 지급\n- 적립금은 1만원 이상 구매 시 사용 가능\n- 적립금 유효기간은 지급일로부터 6개월\n\n기간\n2026년 4월 1일 ~ 2026년 4월 30일\n\n본 이벤트는 아이디당 1회 적용되며 기존 회원 재가입은 대상이 아닙니다.', category: '이벤트', createdAt: '2026-04-01' },
  { id: 4, title: '[이벤트] 3권 이상 구매 시 무료 배송 + 독서대 증정 (선착순)', content: '3권 이상 구매 시 배송비가 무료로 적용됩니다.\n\n추가 혜택\n- 4월 한 달간 3권 이상 주문하신 선착순 300분께 접이식 독서대 증정\n- 독서대는 주문 상품과 함께 자동 동봉되며 별도 신청이 필요하지 않습니다.\n\n상시 혜택\n- 3만원 이상 구매 시 배송비 무료\n- 도서/산간 지역은 추가 배송비가 발생할 수 있습니다.\n\n문의는 고객센터(02-1234-5678) 또는 cs@edupress.co.kr로 연락주세요.', category: '이벤트', createdAt: '2026-03-20' },
  { id: 5, title: '배송 안내 (평균 1~3일 소요)', content: '에듀프레스 온라인 서점의 배송 안내입니다.\n\n출고 기준\n- 평일 오후 2시 이전 결제 완료: 당일 출고\n- 평일 오후 2시 이후 결제 완료: 익일 출고\n- 주말/공휴일 결제: 다음 영업일 출고\n\n배송 소요 기간\n- 출고 후 1~2일 내 수령 (도서/산간 지역은 추가 1~2일 소요)\n- 실시간 배송 조회는 마이페이지 > 주문 내역에서 확인 가능\n\n배송비\n- 기본 배송비 3,000원\n- 3만원 이상 주문 시 무료 배송\n- 단체 주문 및 학교/학원 대량 주문은 별도 문의\n\n미수령, 파손, 오배송 등 문제가 발생한 경우 수령 후 7일 이내에 마이페이지에서 접수해 주세요.', category: '안내', createdAt: '2026-03-15' },
  { id: 6, title: '수능 국어 실전 모의고사 시즌1 정오표 업데이트 (2026.04)', content: '수능 국어 실전 모의고사 시즌1의 정오표가 2026년 4월 기준으로 업데이트되었습니다.\n\n주요 수정 사항\n- 3회차 독서 지문 2 오답 선지 수정 (③ -> ②)\n- 5회차 문학 지문 1의 작품 서지 정보 보정\n- 7회차 해설 pp.112~113 문장 오타 정정\n\n정오표는 자료실에서 PDF로 다운로드 받으실 수 있으며, 초판본과 함께 학습하시는 분들은 반드시 정오표를 먼저 확인해 주시기 바랍니다. 학습에 불편을 드려 죄송합니다.', category: '공지', createdAt: '2026-04-01' },
];

export const banners = [
  { id: 1, title: '2026 수능 실전 모의고사', subtitle: '국어 / 영어 / 수학 전 과목 출간', cta: '지금 구매하기', color: '#1B2A4A' },
  { id: 2, title: '신규 회원 2,000원 적립금', subtitle: '가입 즉시 적립금 지급', cta: '회원가입하기', color: '#E8653A' },
  { id: 3, title: '3권 이상 구매 시 무료 배송', subtitle: '합리적인 가격에 교재를 만나보세요', cta: '교재 둘러보기', color: '#2D4A7A' },
];

export const faqData = [
  { id: 1, question: '배송은 얼마나 걸리나요?', answer: '평일 오후 2시 이전 주문하시면 당일 출고되며, 출고 후 1~2일 내에 수령 가능합니다. 주말·공휴일에는 출고되지 않으며, 도서·산간 지역은 추가 1~2일이 소요될 수 있습니다. 실시간 배송 조회는 마이페이지 주문 내역에서 확인하실 수 있습니다.' },
  { id: 2, question: '무료 배송 조건은 무엇인가요?', answer: '3만원 이상 구매 시 무료 배송이 적용됩니다. 3만원 미만 주문은 배송비 3,000원이 부과되며, 이벤트 기간 중 3권 이상 묶음 구매도 무료 배송 대상입니다. 도서·산간 지역 추가 배송비는 무료 배송 조건과 별개로 과금될 수 있습니다.' },
  { id: 3, question: '교환/반품은 어떻게 하나요?', answer: '상품 수령 후 7일 이내에 마이페이지 > 주문 내역에서 교환·반품을 신청하실 수 있습니다. 다만 필기 흔적이나 사용 흔적이 있는 경우, 포장이 훼손된 경우는 반품이 불가합니다. 단순 변심으로 인한 반품의 경우 왕복 배송비가 고객 부담이며, 오배송·파손 등 저희 측 귀책 사유인 경우 무료로 교환 처리됩니다.' },
  { id: 4, question: '적립금은 어떻게 사용하나요?', answer: '1만원 이상 구매 시 보유 적립금을 사용할 수 있습니다. 결제 페이지의 적립금 사용 항목에서 사용할 금액을 직접 입력하시면 해당 금액이 결제 금액에서 차감됩니다. 적립금은 중복 할인 쿠폰과 함께 사용 가능하며 환불 시 사용한 적립금은 자동 복구됩니다.' },
  { id: 5, question: '정오표는 어디서 확인하나요?', answer: '각 교재 상세 페이지의 자료실 탭과 홈페이지 상단 메뉴의 자료실에서 정오표 PDF를 다운로드 받으실 수 있습니다. 정오표는 초판 인쇄 후 발견된 오류를 반영해 수시 업데이트되며, 업데이트 시 공지사항에 별도 안내를 드립니다. 학습 전 반드시 최신 정오표를 확인해 주세요.' },
  { id: 6, question: '세금계산서 발행이 가능한가요?', answer: '네, 사업자 회원의 경우 주문 시 세금계산서 발행을 요청하실 수 있습니다. 결제 완료 후 사업자등록증 사본을 cs@edupress.co.kr로 보내주시면 영업일 기준 2일 내에 발행해 드립니다. 이미 발행된 세금계산서의 수정이나 재발행은 발행일로부터 10일 이내에만 가능합니다.' },
  { id: 7, question: '대량 구매 할인이 있나요?', answer: '학교, 학원, 독서실 등 단체에서 30권 이상 대량 구매하시는 경우 별도 할인이 제공됩니다. 고객센터(02-1234-5678) 또는 cs@edupress.co.kr로 구매 예정 수량과 납품 일정을 알려주시면 단가 견적을 회신드리며, 필요에 따라 세금계산서 및 단체 납품 계약서 발행도 가능합니다.' },
  { id: 8, question: '결제 수단은 무엇이 있나요?', answer: '신용/체크카드, 실시간 계좌이체, 가상계좌 입금이 가능하며 모든 결제는 토스페이먼츠를 통해 처리됩니다. 가상계좌의 경우 입금 확인 후 자동으로 출고 단계로 넘어가며 입금 기한은 발급 시점으로부터 3일(72시간)입니다. 결제 관련 문의는 고객센터로 연락주세요.' },
];

export const qnas: Qna[] = [
  { id: 1, productId: 1, userName: '수험생', question: '2025학년도 기출이 몇 회분 포함되어 있나요?', answer: '2025학년도 6월/9월/수능 기출을 기반으로 재구성된 지문이 3회차에 걸쳐 포함되어 있습니다. 전 회차는 신규 출제이며 각 문항 해설에 기출 연계 여부를 표시해 두었습니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-03-28', answeredAt: '2026-03-29' },
  { id: 2, productId: 1, userName: '학부모', question: '답지는 따로 제공되나요?', answer: '정답지와 해설지가 교재 뒤에 별책으로 포함되어 있습니다. 별책 탈착 시 보관·휴대가 편리하며, 자료실에서 PDF 버전도 다운로드 받으실 수 있습니다.', answeredBy: '고객센터', createdAt: '2026-04-02', answeredAt: '2026-04-02' },
  { id: 3, productId: 5, userName: '고3수험생', question: '듣기 음성 파일은 어떻게 받나요?', answer: '교재 뒷표지 QR 코드를 스마트폰으로 스캔하거나, 자료실에서 "2026 수능 영어 실전 모의고사" 자료를 검색해 다운로드 받으실 수 있습니다. 속도 3단계(0.8/1.0/1.2배)를 제공합니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-04-05', answeredAt: '2026-04-05' },
  { id: 4, productId: 9, userName: '수학탐험러', question: '선택 과목은 어떤 기준으로 수록되어 있나요?', answer: '공통과목(수학1, 수학2)이 회차당 15문항, 선택과목(미적분/확률과통계/기하)이 각 5문항씩 별도 세트로 제공됩니다. 자신의 선택과목에 맞춰 문항을 골라 풀 수 있도록 구성했습니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-04-08', answeredAt: '2026-04-09' },
  { id: 5, productId: 9, userName: '고3이과', question: '정오표 업데이트는 어디서 확인하나요?', answer: '자료실 > 해당 교재 > "정오표" 항목에서 최신 PDF를 내려받을 수 있습니다. 정오표 업데이트 시 공지사항에 별도 안내를 드립니다.', answeredBy: '고객센터', createdAt: '2026-04-10', answeredAt: '2026-04-10' },
  { id: 6, productId: 13, userName: '사탐선택', question: '2025학년도 수능 기출을 반영한 개정판인가요?', answer: '네, 2025학년도 수능과 6월/9월 모의평가까지 분석해 반영한 개정판입니다. 변경된 출제 경향을 회차별 도입부에 요약해 두었습니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-04-01', answeredAt: '2026-04-01' },
  { id: 7, productId: 17, userName: '물리1수험생', question: '실험 자료 PDF는 어디에서 받을 수 있나요?', answer: '자료실에서 "실험 데이터 보충 자료"로 검색하시면 각 회차별 실험 자료와 그래프 원본을 PDF로 받으실 수 있습니다. 회차마다 자료 번호를 교재에 표기해 두었습니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-04-06', answeredAt: '2026-04-06' },
  { id: 8, productId: 21, userName: '필수과목', question: '한국사 시험 대비로 이 한 권이면 충분한가요?', answer: '수능 한국사 영역 커버리지를 기준으로는 본 교재 한 권으로 전 범위 반복이 가능하도록 설계했습니다. 다만 심화 학습을 원하시는 경우 별책 연표와 인물 카드, 자료실의 사료 원문 20선 PDF를 함께 활용하시면 좋습니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-03-30', answeredAt: '2026-03-31' },
  { id: 9, productId: 24, userName: '고1학부모', question: '학평 모의고사 채점표는 어떻게 활용하나요?', answer: '별책에 수록된 채점표는 실제 학력평가 OMR과 동일 양식입니다. 자녀가 푼 뒤 직접 채점하고 과목별 시간 배분을 기록해 두면 다음 회차 학습 포커스를 잡기 쉽습니다.', answeredBy: '에듀프레스 편집부', createdAt: '2026-03-25', answeredAt: '2026-03-25' },
];

// 과목 카테고리 아이콘/색상
export const categoryInfo: Record<string, { color: string; icon: string }> = {
  '국어': { color: '#E8653A', icon: '📖' },
  '영어': { color: '#3B82F6', icon: '🌍' },
  '수학': { color: '#8B5CF6', icon: '📐' },
  '사회': { color: '#22C55E', icon: '🏛️' },
  '과학': { color: '#F59E0B', icon: '🔬' },
  '기타': { color: '#EC4899', icon: '📚' },
};
