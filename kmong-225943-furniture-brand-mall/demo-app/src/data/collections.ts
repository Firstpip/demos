import type { Collection } from '@/lib/types'
import { products } from './products'

interface Spec {
  slug: string
  title: string
  subtitle: string
  season: '26SS' | '26FW' | 'EVERGREEN'
  description: string
  filter: (productSlug: string) => boolean
  hotspots?: Array<{ x: number; y: number; productSlug: string; label: string }>
}

const specs: Spec[] = [
  {
    slug: 'warm-living-26ss',
    title: 'Warm Living 26SS',
    subtitle: '봄의 거실을 위한 따뜻한 톤의 우드 컬렉션',
    season: '26SS',
    description: '오크와 월넛 톤의 거실 가구를 한 호흡으로 모았습니다. 8축 필터로 평수·소재·배송일을 좁히면서 룩북 안에서 그대로 비교하세요.',
    filter: (s) => s.includes('maholn-oak') || s.includes('walnut') || s.includes('linen') || s.includes('softline') || s.includes('velvet-room'),
    hotspots: [
      { x: 28, y: 42, productSlug: 'maholn-oak-sofa-3s', label: '마홀앤 오크 소파 3인용' },
      { x: 62, y: 58, productSlug: 'maholn-linen-armchair', label: '마홀앤 린넨 아치 암체어' },
      { x: 78, y: 30, productSlug: 'maholn-walnut-tv-stand', label: '마홀앤 월넛 TV 스탠드 1800' },
      { x: 18, y: 70, productSlug: 'lenore-rug-200x290', label: '르노어 클래식 러그' },
      { x: 48, y: 22, productSlug: 'lumira-arc-floor-lamp', label: '루미라 아크 플로어 램프' },
    ],
  },
  {
    slug: 'soft-comfort-26ss',
    title: 'Soft Comfort 26SS',
    subtitle: '오래 머무는 거실을 위한 부드러운 패브릭 컬렉션',
    season: '26SS',
    description: '리클라이너·부클레 소파·러그까지 부드러운 촉감 중심의 거실 큐레이션.',
    filter: (s) => s.includes('softline') || s.includes('velvet-room') || s.includes('lenore') || s.includes('forestlab'),
    hotspots: [
      { x: 30, y: 38, productSlug: 'softline-recliner-1s', label: '소프트라인 리클라이너 1인' },
      { x: 70, y: 32, productSlug: 'velvet-room-sofa-2s', label: '벨벳룸 부클레 소파 2인' },
      { x: 22, y: 70, productSlug: 'lenore-rug-200x290', label: '르노어 클래식 러그' },
      { x: 64, y: 64, productSlug: 'forestlab-low-sofa-2s', label: '포레스트랩 좌식 라운지 소파' },
    ],
  },
  {
    slug: 'studio-compact-26ss',
    title: 'Studio Compact 26SS',
    subtitle: '5~10평 1인 가구를 위한 가변형 가구 모음',
    season: '26SS',
    description: '접이식 데스크·가변 벤치·모듈 셸프로 좁은 공간에서도 일상이 펼쳐지도록 구성했습니다.',
    filter: (s) => s.includes('studio-knot') || s.includes('fold-and') || s.includes('monodot'),
    hotspots: [
      { x: 28, y: 36, productSlug: 'studio-knot-foldable-desk', label: '스튜디오 노트 접이식 학생 책상' },
      { x: 66, y: 30, productSlug: 'studio-knot-office-monitor-stand', label: '스튜디오 노트 모니터 스탠드' },
      { x: 24, y: 68, productSlug: 'fold-and-storage-bench', label: '폴드앤 가변형 수납 벤치' },
      { x: 70, y: 64, productSlug: 'monodot-modular-shelf', label: '모노닷 모듈 셸프 4단' },
    ],
  },
  {
    slug: 'heritage-oak-26ss',
    title: 'Heritage Oak 26SS',
    subtitle: '국내산 오크 원목 가구 정통 라인',
    season: '26SS',
    description: '국내 공방형 브랜드들의 오크 원목 다이닝·침대·드레서를 한 자리에.',
    filter: (s) => s.includes('raonwood') || s.includes('oakhaus'),
    hotspots: [
      { x: 32, y: 34, productSlug: 'raonwood-oak-bed', label: '라온우드 국산 오크 침대 SS' },
      { x: 68, y: 36, productSlug: 'oakhaus-dining-table-1800', label: '오크하우스 식탁 테이블 1800' },
      { x: 26, y: 70, productSlug: 'raonwood-walnut-dresser', label: '라온우드 월넛 서랍장 1500' },
      { x: 72, y: 66, productSlug: 'havana-rattan-chair', label: '하바나 라탄 식탁 의자 셋트' },
    ],
  },
  {
    slug: 'family-calm-26ss',
    title: 'Family Calm 26SS',
    subtitle: '가족이 함께 쉬는 침실·키즈룸 컬렉션',
    season: '26SS',
    description: '라이트 톤 침대와 키즈 가구를 자연스럽게 코디한 시즌 라인업.',
    filter: (s) => s.includes('morning-craft') || s.includes('pinemoon') || s.includes('cottonbird') || s.includes('wally'),
    hotspots: [
      { x: 30, y: 38, productSlug: 'morning-craft-bedframe', label: '모닝크래프트 헤드보드 침대 Q' },
      { x: 70, y: 32, productSlug: 'cottonbird-cotton-headboard-bed-q', label: '코튼버드 면 헤드보드 침대 Q' },
      { x: 24, y: 70, productSlug: 'pinemoon-kids-bunk-bed', label: '파인문 주니어 2단 침대' },
      { x: 66, y: 66, productSlug: 'wally-and-co-junior-bed-twin', label: '왈리앤코 주니어 침대 트윈' },
    ],
  },
  {
    slug: 'modern-line-26ss',
    title: 'Modern Line 26SS',
    subtitle: '단정한 선과 메탈·우드 결합의 모던 라인',
    season: '26SS',
    description: '아치·곡선·메탈 프레임을 키워드로 모은 컨템포러리 라인.',
    filter: (s) => s.includes('archline') || s.includes('cobalt-and') || s.includes('mineral') || s.includes('monodot'),
    hotspots: [
      { x: 28, y: 36, productSlug: 'archline-arch-mirror', label: '아치라인 아치 미러 800' },
      { x: 70, y: 30, productSlug: 'cobalt-and-side-table', label: '코발트앤 메탈 사이드 테이블' },
      { x: 26, y: 68, productSlug: 'mineral-marble-coffee-table', label: '미네랄 대리석 커피 테이블' },
      { x: 68, y: 66, productSlug: 'monodot-modular-shelf', label: '모노닷 모듈 셸프 4단' },
    ],
  },
  {
    slug: 'autumn-wood-26fw',
    title: 'Autumn Wood 26FW',
    subtitle: '가을의 깊어지는 톤, 월넛·다크 오크 라인',
    season: '26FW',
    description: '시즌 컬러로 한층 깊어지는 우드 톤. 가을 거실의 무게중심을 잡습니다.',
    filter: (s) => s.includes('walnut') || s.includes('oakhaus') || s.includes('archline'),
    hotspots: [
      { x: 30, y: 36, productSlug: 'maholn-walnut-tv-stand', label: '마홀앤 월넛 TV 스탠드 1800' },
      { x: 70, y: 32, productSlug: 'raonwood-walnut-dresser', label: '라온우드 월넛 서랍장 1500' },
      { x: 26, y: 70, productSlug: 'oakhaus-dining-table-1800', label: '오크하우스 식탁 테이블 1800' },
      { x: 66, y: 64, productSlug: 'archline-arch-mirror', label: '아치라인 아치 미러 800' },
    ],
  },
  {
    slug: 'cozy-bedroom-26fw',
    title: 'Cozy Bedroom 26FW',
    subtitle: '겨울 침실을 위한 따뜻한 패브릭 라인',
    season: '26FW',
    description: '두꺼운 패브릭 헤드보드와 러그, 부클레 라운지의 코지 컴포지션.',
    filter: (s) => s.includes('morning-craft') || s.includes('pinemoon') || s.includes('cottonbird'),
    hotspots: [
      { x: 28, y: 38, productSlug: 'morning-craft-bedframe', label: '모닝크래프트 헤드보드 침대 Q' },
      { x: 70, y: 30, productSlug: 'cottonbird-cotton-headboard-bed-q', label: '코튼버드 면 헤드보드 침대 Q' },
      { x: 24, y: 68, productSlug: 'pinemoon-pine-vanity', label: '파인문 소나무 화장대 1200' },
      { x: 68, y: 64, productSlug: 'cottonbird-cotton-handle-nightstand', label: '코튼버드 면 손잡이 협탁' },
    ],
  },
  {
    slug: 'workhome-26fw',
    title: 'WorkHome 26FW',
    subtitle: '재택 근무를 위한 서재·홈오피스 셋업',
    season: '26FW',
    description: '데스크·체어·조명·수납을 한 컬렉션으로 묶어 즉시 셋업 가능.',
    filter: (s) => s.includes('graybook') || s.includes('studio-knot') || s.includes('lumira'),
    hotspots: [
      { x: 30, y: 36, productSlug: 'graybook-home-office-desk-1500', label: '그레이북 홈오피스 데스크 1500' },
      { x: 70, y: 32, productSlug: 'studio-knot-office-monitor-stand', label: '스튜디오 노트 모니터 스탠드' },
      { x: 26, y: 70, productSlug: 'graybook-modular-bookshelf', label: '그레이북 모듈 책장 5단' },
      { x: 68, y: 64, productSlug: 'lumira-arc-floor-lamp', label: '루미라 아크 플로어 램프' },
    ],
  },
  {
    slug: 'rattan-summer-evergreen',
    title: 'Rattan Summer',
    subtitle: '핸드크래프트 라탄 다이닝·라운지',
    season: 'EVERGREEN',
    description: '계절 무관 사용 가능한 라탄·페이퍼 코드 가구의 셀렉트.',
    filter: (s) => s.includes('havana') || s.includes('archline'),
    hotspots: [
      { x: 32, y: 42, productSlug: 'havana-rattan-chair', label: '하바나 라탄 식탁 의자 셋트' },
      { x: 68, y: 56, productSlug: 'archline-arch-mirror', label: '아치라인 아치 미러 800' },
    ],
  },
  {
    slug: 'small-corner-evergreen',
    title: 'Small Corner',
    subtitle: '현관·복도·발코니의 작은 공간 가구',
    season: 'EVERGREEN',
    description: '큰 평수가 아니어도 결을 맞출 수 있는 작은 공간 셋업.',
    filter: (s) => s.includes('porchlight') || s.includes('archline') || s.includes('cobalt'),
    hotspots: [
      { x: 30, y: 38, productSlug: 'porchlight-entry-shelf', label: '포치라이트 현관 수납 셸프' },
      { x: 68, y: 34, productSlug: 'archline-arch-mirror', label: '아치라인 아치 미러 800' },
      { x: 26, y: 70, productSlug: 'cobalt-and-side-table', label: '코발트앤 메탈 사이드 테이블' },
    ],
  },
  {
    slug: 'chefs-kitchen-evergreen',
    title: "Chef's Kitchen",
    subtitle: '주방의 작은 가구·다이닝 컴포지션',
    season: 'EVERGREEN',
    description: '오픈 주방의 결을 살리는 다이닝과 키친 셀렉션.',
    filter: (s) => s.includes('oakhaus') || s.includes('roundbrew') || s.includes('kerf'),
    hotspots: [
      { x: 30, y: 38, productSlug: 'oakhaus-dining-table-1800', label: '오크하우스 식탁 테이블 1800' },
      { x: 68, y: 32, productSlug: 'kerf-grill-table', label: '커프 하드우드 불판 테이블' },
      { x: 26, y: 70, productSlug: 'roundbrew-stove-stand', label: '라운드브루 렌지대 600' },
    ],
  },
]

export const collections: Collection[] = specs.map((spec, i) => {
  const matched = products.filter((p) => spec.filter(p.slug)).map((p) => p.id)
  const productIds = matched.length >= 4 ? matched.slice(0, 18) : products.slice(i * 6, i * 6 + 12).map((p) => p.id)
  const hotspots = (spec.hotspots ?? []).map((h) => {
    const p = products.find((pp) => pp.slug === h.productSlug)
    return p ? { x: h.x, y: h.y, productId: p.id, label: h.label } : null
  }).filter((h): h is NonNullable<typeof h> => Boolean(h))
  return {
    id: `col-${spec.slug}`,
    slug: spec.slug,
    title: spec.title,
    subtitle: spec.subtitle,
    season: spec.season,
    heroLetter: spec.title.charAt(0),
    description: spec.description,
    productIds,
    hotspots,
  }
})

export function collectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}

products.forEach((p) => {
  p.collectionIds = collections.filter((c) => c.productIds.includes(p.id)).map((c) => c.id)
})
