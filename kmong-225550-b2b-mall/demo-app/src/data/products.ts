export interface ProductOption {
  name: string;
  values: {
    label: string;
    stock: number;
    additionalPrice: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  detailDescription: string;
  images: string[];
  basePrice: number;
  options: ProductOption[];
  purchaseLimit: {
    minAmount: number;
    maxQuantity: number;
    periodDays?: number;
  };
  isActive: boolean;
  createdAt: string;
}

export const products: Product[] = [
  // 식품/음료 (3개)
  {
    id: 'P001',
    name: '[대용량] 아메리카노 원두 1kg',
    category: '식품/음료',
    description: '깊은 풍미의 프리미엄 아메리카노 원두, 카페 납품용 대용량',
    detailDescription: '<h3>프리미엄 아메리카노 원두</h3><p>브라질산 100% 아라비카 원두를 사용한 프리미엄 블렌드입니다. 미디엄 로스팅으로 <strong>풍부한 바디감</strong>과 <strong>깔끔한 산미</strong>를 느낄 수 있습니다.</p><img src="/images/products/product-1.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><p>카페, 식당 등 업소용으로 최적화된 대용량 패키지입니다.</p><h4>📋 제품 상세</h4><table><tbody><tr><td>원산지</td><td>브라질</td></tr><tr><td>로스팅</td><td>미디엄</td></tr><tr><td>포장</td><td>밀봉 질소충전</td></tr><tr><td>유통기한</td><td>제조일로부터 12개월</td></tr></tbody></table><blockquote>💡 대량 주문 시 별도 견적 문의 가능합니다.</blockquote>',
    images: ['/images/products/product-1.jpg', '/images/products/product-1-2.jpg'],
    basePrice: 18000,
    options: [
      {
        name: '로스팅',
        values: [
          { label: '미디엄', stock: 150, additionalPrice: 0 },
          { label: '다크', stock: 80, additionalPrice: 1000 },
          { label: '라이트', stock: 60, additionalPrice: 0 },
        ],
      },
      {
        name: '수량단위',
        values: [
          { label: '1kg (1봉)', stock: 200, additionalPrice: 0 },
          { label: '5kg (5봉)', stock: 50, additionalPrice: 72000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 30000, maxQuantity: 100 },
    isActive: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'P002',
    name: '[업소용] 생수 2L 6입 x 4팩',
    category: '식품/음료',
    description: '깨끗한 천연 미네랄워터, 업소 납품용 대량 패키지',
    detailDescription: '<h3>천연 미네랄워터 대량 패키지</h3><p>강원도 청정지역에서 취수한 <strong>천연 미네랄워터</strong>입니다. 식당, 카페, 사무실 등 업소용으로 적합한 대량 패키지(24병)입니다.</p><img src="/images/products/product-2.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>용량</td><td>2L x 24병</td></tr><tr><td>원산지</td><td>강원도</td></tr><tr><td>유통기한</td><td>제조일로부터 24개월</td></tr></tbody></table>',
    images: ['/images/products/product-2.jpg'],
    basePrice: 12000,
    options: [
      {
        name: '패키지',
        values: [
          { label: '24병 (기본)', stock: 300, additionalPrice: 0 },
          { label: '48병 (2박스)', stock: 120, additionalPrice: 11000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 24000, maxQuantity: 50 },
    isActive: true,
    createdAt: '2025-01-12',
  },
  {
    id: 'P003',
    name: '[대량] 유기농 녹차 티백 100입',
    category: '식품/음료',
    description: '제주산 유기농 녹차 티백, 사무실/카페용',
    detailDescription: '<h3>프리미엄 유기농 녹차 티백</h3><p>제주도 유기농 차밭에서 재배한 녹차잎으로 만든 프리미엄 티백입니다. <em>개별 포장</em>되어 신선도가 오래 유지됩니다.</p><img src="/images/products/product-3.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>내용량</td><td>100티백 (1.5g x 100)</td></tr><tr><td>원산지</td><td>제주도</td></tr><tr><td>인증</td><td>유기농 인증</td></tr></tbody></table>',
    images: ['/images/products/product-3.jpg'],
    basePrice: 25000,
    options: [
      {
        name: '종류',
        values: [
          { label: '녹차', stock: 100, additionalPrice: 0 },
          { label: '현미녹차', stock: 70, additionalPrice: 2000 },
          { label: '보이차', stock: 40, additionalPrice: 5000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 25000, maxQuantity: 200 },
    isActive: true,
    createdAt: '2025-01-20',
  },

  // 생활용품 (3개)
  {
    id: 'P004',
    name: '[업소용] 다목적 세정제 5L',
    category: '생활용품',
    description: '강력한 세정력의 업소용 다목적 세정제',
    detailDescription: '<h3>업소용 다목적 세정제</h3><p>식당, 사무실, 공장 등 다양한 업소에서 사용할 수 있는 다목적 세정제입니다. <strong>강력한 세정력</strong>으로 기름때, 먼지, 각종 오염을 효과적으로 제거합니다.</p><img src="/images/products/product-4.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>용량</td><td>5L</td></tr><tr><td>용도</td><td>바닥, 벽면, 설비 청소</td></tr><tr><td>성분</td><td>친환경 계면활성제</td></tr></tbody></table>',
    images: ['/images/products/product-4.jpg'],
    basePrice: 15000,
    options: [
      {
        name: '향',
        values: [
          { label: '무향', stock: 200, additionalPrice: 0 },
          { label: '레몬', stock: 120, additionalPrice: 500 },
          { label: '라벤더', stock: 80, additionalPrice: 500 },
        ],
      },
      {
        name: '용량',
        values: [
          { label: '5L', stock: 300, additionalPrice: 0 },
          { label: '18L', stock: 50, additionalPrice: 40000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 30000, maxQuantity: 50 },
    isActive: true,
    createdAt: '2025-02-01',
  },
  {
    id: 'P005',
    name: '[대량] 산업용 고무장갑 50켤레',
    category: '생활용품',
    description: '내구성 높은 산업용 고무장갑, 박스 단위 납품',
    detailDescription: '<h3>산업용 고무장갑</h3><p><strong>내열성</strong>과 <strong>내화학성</strong>이 뛰어난 산업용 고무장갑입니다. 식품가공, 청소, 공장 작업 등 다양한 환경에서 사용 가능합니다.</p><img src="/images/products/product-5.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>수량</td><td>50켤레/박스</td></tr><tr><td>재질</td><td>천연고무 + 니트릴</td></tr><tr><td>두께</td><td>0.5mm</td></tr></tbody></table>',
    images: ['/images/products/product-5.jpg'],
    basePrice: 45000,
    options: [
      {
        name: '사이즈',
        values: [
          { label: 'M', stock: 100, additionalPrice: 0 },
          { label: 'L', stock: 150, additionalPrice: 0 },
          { label: 'XL', stock: 80, additionalPrice: 0 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 45000, maxQuantity: 30 },
    isActive: true,
    createdAt: '2025-02-05',
  },
  {
    id: 'P006',
    name: '[업소용] 점보롤 화장지 16롤',
    category: '생활용품',
    description: '업소용 대용량 점보롤 화장지, 경제적인 선택',
    detailDescription: '<h3>업소용 점보롤 화장지</h3><p>화장실, 세면실 등에 적합한 업소용 점보롤 화장지입니다. <strong>3겹 엠보싱</strong> 처리로 부드럽고 내구성이 뛰어납니다.</p><img src="/images/products/product-6.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>수량</td><td>16롤/박스</td></tr><tr><td>겹수</td><td>3겹</td></tr><tr><td>길이</td><td>롤당 300m</td></tr></tbody></table>',
    images: ['/images/products/product-6.jpg'],
    basePrice: 28000,
    options: [
      {
        name: '타입',
        values: [
          { label: '3겹 엠보싱', stock: 200, additionalPrice: 0 },
          { label: '2겹 일반', stock: 300, additionalPrice: -3000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 28000, maxQuantity: 100 },
    isActive: true,
    createdAt: '2025-02-10',
  },

  // 사무용품 (3개)
  {
    id: 'P007',
    name: 'A4 복사용지 5박스 (2,500매)',
    category: '사무용품',
    description: '고품질 A4 복사용지, 사무실 필수품',
    detailDescription: '<h3>고품질 A4 복사용지</h3><p>80g/m² 고품질 복사용지입니다. <strong>양면 인쇄에 최적화</strong>되어 있으며, 잉크젯/레이저 프린터 모두 호환됩니다.</p><img src="/images/products/product-7.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>규격</td><td>A4 (210x297mm)</td></tr><tr><td>중량</td><td>80g/m²</td></tr><tr><td>수량</td><td>500매 x 5박스 = 2,500매</td></tr></tbody></table>',
    images: ['/images/products/product-7.jpg'],
    basePrice: 32000,
    options: [
      {
        name: '중량',
        values: [
          { label: '80g', stock: 500, additionalPrice: 0 },
          { label: '100g', stock: 200, additionalPrice: 8000 },
        ],
      },
      {
        name: '색상',
        values: [
          { label: '백색', stock: 500, additionalPrice: 0 },
          { label: '미색', stock: 150, additionalPrice: 1000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 32000, maxQuantity: 50 },
    isActive: true,
    createdAt: '2025-01-25',
  },
  {
    id: 'P008',
    name: '[대량] 볼펜 세트 100자루',
    category: '사무용품',
    description: '사무용 볼펜 100자루 세트, 업소 대량 구매용',
    detailDescription: '<h3>사무용 볼펜 대량 세트</h3><p>부드러운 필기감의 사무용 볼펜입니다. 0.5mm 유성 볼펜으로 <strong>선명한 필기</strong>가 가능합니다. 사무실, 은행, 관공서 등 대량 소모처에 적합합니다.</p><img src="/images/products/product-8.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>수량</td><td>100자루/박스</td></tr><tr><td>굵기</td><td>0.5mm</td></tr><tr><td>잉크</td><td>유성</td></tr></tbody></table>',
    images: ['/images/products/product-8.jpg'],
    basePrice: 25000,
    options: [
      {
        name: '색상',
        values: [
          { label: '청색', stock: 300, additionalPrice: 0 },
          { label: '흑색', stock: 250, additionalPrice: 0 },
          { label: '적색', stock: 100, additionalPrice: 0 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 25000, maxQuantity: 100 },
    isActive: true,
    createdAt: '2025-02-15',
  },
  {
    id: 'P009',
    name: '스테이플러 + 침 세트 (10개입)',
    category: '사무용품',
    description: '사무용 스테이플러와 침 대량 세트',
    detailDescription: '<h3>사무용 스테이플러 세트</h3><p>내구성이 뛰어난 사무용 스테이플러 10개와 침 10,000개가 포함된 세트입니다. 한 번에 <strong>최대 25매 제본</strong>이 가능합니다.</p><img src="/images/products/product-9.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>구성</td><td>스테이플러 10개 + 침 10,000개</td></tr><tr><td>제본능력</td><td>최대 25매</td></tr><tr><td>침 규격</td><td>No.10</td></tr></tbody></table>',
    images: ['/images/products/product-9.jpg'],
    basePrice: 35000,
    options: [
      {
        name: '색상',
        values: [
          { label: '블랙', stock: 80, additionalPrice: 0 },
          { label: '화이트', stock: 60, additionalPrice: 0 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 35000, maxQuantity: 30 },
    isActive: true,
    createdAt: '2025-02-20',
  },

  // 패션잡화 (3개)
  {
    id: 'P010',
    name: '[단체용] 면 티셔츠 30장',
    category: '패션잡화',
    description: '단체복/유니폼용 순면 라운드 티셔츠',
    detailDescription: '<h3>순면 라운드 티셔츠</h3><p>100% 순면 소재의 라운드넥 티셔츠입니다. 단체복, 유니폼, 행사용으로 적합하며 <strong>인쇄/자수 작업</strong>이 용이합니다.</p><img src="/images/products/product-10.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>소재</td><td>면 100%</td></tr><tr><td>수량</td><td>30장/박스</td></tr><tr><td>중량</td><td>200g</td></tr></tbody></table>',
    images: ['/images/products/product-10.jpg'],
    basePrice: 150000,
    options: [
      {
        name: '색상',
        values: [
          { label: '화이트', stock: 100, additionalPrice: 0 },
          { label: '블랙', stock: 80, additionalPrice: 0 },
          { label: '네이비', stock: 60, additionalPrice: 0 },
        ],
      },
      {
        name: '사이즈',
        values: [
          { label: 'S-M 혼합', stock: 50, additionalPrice: 0 },
          { label: 'L-XL 혼합', stock: 80, additionalPrice: 0 },
          { label: 'XXL 이상', stock: 30, additionalPrice: 15000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 150000, maxQuantity: 20 },
    isActive: true,
    createdAt: '2025-02-25',
  },
  {
    id: 'P011',
    name: '[업소용] 앞치마 20장 세트',
    category: '패션잡화',
    description: '식당/카페용 방수 앞치마 대량 세트',
    detailDescription: '<h3>업소용 방수 앞치마</h3><p><strong>방수 코팅</strong> 처리된 업소용 앞치마입니다. 식당, 카페, 공방 등에서 사용하기 적합하며 세탁이 용이합니다.</p><img src="/images/products/product-11.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>소재</td><td>폴리에스터 + 방수코팅</td></tr><tr><td>수량</td><td>20장/세트</td></tr><tr><td>사이즈</td><td>프리사이즈</td></tr></tbody></table>',
    images: ['/images/products/product-11.jpg'],
    basePrice: 48000,
    options: [
      {
        name: '색상',
        values: [
          { label: '블랙', stock: 150, additionalPrice: 0 },
          { label: '브라운', stock: 80, additionalPrice: 0 },
          { label: '네이비', stock: 60, additionalPrice: 0 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 48000, maxQuantity: 50 },
    isActive: true,
    createdAt: '2025-03-01',
  },
  {
    id: 'P012',
    name: '[대량] 에코백 토트백 50장',
    category: '패션잡화',
    description: '친환경 에코백, 판촉/행사용 대량 패키지',
    detailDescription: '<h3>친환경 에코백</h3><p>친환경 캔버스 소재의 에코백입니다. <strong>기업 로고 인쇄</strong>가 가능하며 판촉물, 행사 기념품으로 인기가 높습니다.</p><img src="/images/products/product-12.jpg" alt="상품 이미지" style="margin:16px 0;border-radius:8px;" /><h4>📋 제품 상세</h4><table><tbody><tr><td>소재</td><td>캔버스(면)</td></tr><tr><td>수량</td><td>50장/박스</td></tr><tr><td>사이즈</td><td>36x40cm</td></tr></tbody></table>',
    images: ['/images/products/product-12.jpg'],
    basePrice: 50000,
    options: [
      {
        name: '색상',
        values: [
          { label: '내추럴', stock: 200, additionalPrice: 0 },
          { label: '블랙', stock: 100, additionalPrice: 2000 },
        ],
      },
      {
        name: '인쇄',
        values: [
          { label: '무지 (인쇄없음)', stock: 300, additionalPrice: 0 },
          { label: '단색 인쇄', stock: 100, additionalPrice: 25000 },
        ],
      },
    ],
    purchaseLimit: { minAmount: 50000, maxQuantity: 30, periodDays: 30 },
    isActive: true,
    createdAt: '2025-03-05',
  },
];
