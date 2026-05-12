import type { Product } from '@/lib/types'
import { brands } from './brands'
import { subCategoriesOf } from './categoryTree'

function inferSubCategory(slug: string, name: string, category: string): string {
  const subs = subCategoriesOf(category)
  if (subs.length === 0) return ''
  const lower = `${slug} ${name}`.toLowerCase()
  const isStudent = category === '학생'
  const map: Array<[RegExp, string]> = [
    // 침실
    [/bunk-bed|키즈 침대|아동 침대|junior-bed/, isStudent ? '주니어' : '침대'],
    [/(bunk-)?bed|침대|bedframe|headboard|헤드보드/, isStudent ? '주니어' : '침대'],
    [/mattress|매트리스/, '매트리스'],
    [/nightstand|협탁/, '협탁'],
    [/dressing|화장대/, '화장대'],
    [/dresser|드레서|서랍장/, '서랍장'],
    [/wardrobe|장롱|옷장|closet/, '장롱'],
    // 거실 (마홀앤은 거실장·장식장만)
    [/거실장|living-cabinet|tv-?stand|tv스탠드|tv 스탠드|console/, '거실장'],
    [/장식장|display/, '장식장'],
    // 주방
    [/dining-?table|다이닝 테이블|식탁|식탁 테이블/, '식탁 테이블'],
    [/range|렌지대|grill|불판/, category === '주방' && /grill|불판/.test(lower) ? '불판 테이블' : '렌지대'],
    [/cabinet-kitchen|주방 수납장|식기장|pantry|counter/, '주방 수납장'],
    // 학생
    [/junior|주니어/, '주니어'],
    [/desk|데스크|책상/, isStudent ? '책상' : ''],
    [/bookshelf|책장|bookcase/, isStudent ? '책장' : ''],
  ]
  for (const [re, sub] of map) {
    if (re.test(lower) && subs.includes(sub)) return sub
  }
  // 카테고리별 fallback: 거실=거실장, 침실=침대, 주방=주방 수납장, 학생=주니어
  const fallbackBy: Record<string, string> = {
    '거실': '거실장',
    '침실': '침대',
    '주방': '주방 수납장',
    '학생': '주니어',
  }
  const fallback = fallbackBy[category]
  if (fallback && subs.includes(fallback)) return fallback
  return subs[0] ?? ''
}

const categories = ['거실', '침실', '주방', '수납', '사무용', '학생'] as const

function remapCategory(legacy: string): typeof categories[number] {
  switch (legacy) {
    case '주방·다이닝': return '주방'
    case '서재·홈오피스': return '사무용'
    case '키즈': return '학생'
    case '조명': return '거실'
    case '아웃도어': return '거실'
    case '거실':
    case '침실':
    case '수납':
    case '주방':
    case '사무용':
    case '학생':
      return legacy
    default:
      return '거실'
  }
}
const uses = ['일상', '재택근무', '손님맞이', '가족', '취미', '수면', '식사', '독서']
const materials = ['원목(오크)', '원목(월넛)', '원목(소나무)', '엔지니어드 우드', '메탈+우드', '패브릭(린넨)', '패브릭(부클레)', '가죽(천연)', '라탄', '대리석']
const seriesPool = ['Warm Living', 'Soft Comfort', 'Modern Line', 'Heritage', 'Studio Compact', 'Family Calm']
const colorsPool = ['오크', '월넛', '아이보리', '차콜', '세이지', '테라코타', '딥브라운', '크림']
const sizesPool = ['S', 'M', 'L', 'XL']

function priceFor(seed: number, base: number): { reg: number; sale: number } {
  const sale = base + (seed % 7) * 10000
  const reg = Math.round(sale * (1 + (15 + (seed % 12)) / 100) / 1000) * 1000
  return { reg, sale }
}

interface SeedSpec {
  slug: string
  brandSlug: string
  name: string
  subtitle: string
  category: typeof categories[number]
  subCategory?: string
  series: string
  basePrice: number
  badges?: Array<'NEW' | 'BEST' | 'LIMITED'>
}

const featured: SeedSpec[] = [
  { slug: 'maholn-oak-sofa-3s', brandSlug: 'maholn', name: '마홀앤 오크 소파 3인용', subtitle: 'Warm Living 26SS · 거실장 셋트 메인 소파', category: '거실', subCategory: '거실장', series: 'Warm Living', basePrice: 1890000, badges: ['NEW', 'BEST'] },
  { slug: 'maholn-walnut-tv-stand', brandSlug: 'maholn', name: '마홀앤 월넛 TV 스탠드 1800', subtitle: '낮은 무게중심으로 거실의 시선을 정돈', category: '거실', subCategory: '거실장', series: 'Warm Living', basePrice: 980000, badges: ['NEW'] },
  { slug: 'maholn-linen-armchair', brandSlug: 'maholn', name: '마홀앤 린넨 아치 암체어', subtitle: '둥근 라인의 1인 장식장 코너', category: '거실', subCategory: '장식장', series: 'Warm Living', basePrice: 690000, badges: ['NEW'] },
  { slug: 'raonwood-oak-bed', brandSlug: 'raonwood', name: '라온우드 국산 오크 침대 SS', subtitle: '국내산 오크 원목, 무광 도장 마감', category: '침실', subCategory: '침대', series: 'Heritage', basePrice: 1140000, badges: ['BEST'] },
  { slug: 'raonwood-walnut-dresser', brandSlug: 'raonwood', name: '라온우드 월넛 서랍장 1500', subtitle: '5단 수납·소프트 클로징 풀 익스텐션', category: '침실', subCategory: '서랍장', series: 'Heritage', basePrice: 890000 },
  { slug: 'forestlab-low-sofa-2s', brandSlug: 'forestlab', name: '포레스트랩 좌식 라운지 소파 2인', subtitle: '북유럽풍 좌식 거실장 라인', category: '거실', subCategory: '거실장', series: 'Soft Comfort', basePrice: 760000, badges: ['BEST'] },
  { slug: 'monodot-modular-shelf', brandSlug: 'monodot', name: '모노닷 모듈 셸프 4단', subtitle: '무광 도장의 단정한 수납', category: '수납', series: 'Modern Line', basePrice: 540000 },
  { slug: 'oakhaus-dining-table-1800', brandSlug: 'oakhaus', name: '오크하우스 식탁 테이블 1800', subtitle: '6인 가족 식탁의 기준', category: '주방', subCategory: '식탁 테이블', series: 'Heritage', basePrice: 1450000, badges: ['BEST'] },
  { slug: 'softline-recliner-1s', brandSlug: 'softline', name: '소프트라인 리클라이너 1인', subtitle: '전동 리클라이닝 + USB 충전', category: '거실', subCategory: '거실장', series: 'Soft Comfort', basePrice: 1290000, badges: ['NEW'] },
  { slug: 'lenore-rug-200x290', brandSlug: 'lenore', name: '르노어 클래식 러그 200×290', subtitle: '장식장 코너의 메인 러그, 5색', category: '거실', subCategory: '장식장', series: 'Soft Comfort', basePrice: 380000 },
  { slug: 'studio-knot-foldable-desk', brandSlug: 'studio-knot', name: '스튜디오 노트 접이식 학생 책상 1200', subtitle: '소형 평수 맞춤 가변 학생 책상', category: '학생', subCategory: '책상', series: 'Studio Compact', basePrice: 320000, badges: ['NEW'] },
  { slug: 'havana-rattan-chair', brandSlug: 'havana', name: '하바나 라탄 식탁 의자 2개 셋트', subtitle: '핸드크래프트 페이퍼 코드 식탁 체어', category: '주방', subCategory: '식탁 테이블', series: 'Heritage', basePrice: 480000 },
  { slug: 'morning-craft-bedframe', brandSlug: 'morning-craft', name: '모닝크래프트 헤드보드 침대 Q', subtitle: '아침 햇살 톤의 라이트 우드', category: '침실', subCategory: '침대', series: 'Family Calm', basePrice: 970000, badges: ['BEST'] },
  { slug: 'lumira-arc-floor-lamp', brandSlug: 'lumira', name: '루미라 아크 플로어 램프', subtitle: '장식장 코너 간접 조명', category: '거실', subCategory: '장식장', series: 'Modern Line', basePrice: 290000, badges: ['NEW'] },
  { slug: 'fold-and-storage-bench', brandSlug: 'fold-and', name: '폴드앤 가변형 수납 벤치', subtitle: '현관·거실 모두 호환되는 변형 가구', category: '수납', series: 'Studio Compact', basePrice: 410000, badges: ['LIMITED'] },
  { slug: 'cobalt-and-side-table', brandSlug: 'cobalt-and', name: '코발트앤 메탈 사이드 테이블', subtitle: '인더스트리얼 모던 장식장', category: '거실', subCategory: '장식장', series: 'Modern Line', basePrice: 220000 },
  { slug: 'velvet-room-sofa-2s', brandSlug: 'velvet-room', name: '벨벳룸 부클레 소파 2인', subtitle: '무드 인테리어를 위한 패브릭 거실장', category: '거실', subCategory: '거실장', series: 'Soft Comfort', basePrice: 1380000, badges: ['NEW'] },
  { slug: 'mineral-marble-coffee-table', brandSlug: 'mineral', name: '미네랄 대리석 커피 테이블', subtitle: '석재 + 메탈 결합 장식장 라인', category: '거실', subCategory: '장식장', series: 'Modern Line', basePrice: 880000 },
  { slug: 'pinemoon-kids-bunk-bed', brandSlug: 'pinemoon', name: '파인문 주니어 2단 침대', subtitle: '안전 가드 + 라이트 톤 소나무', category: '학생', subCategory: '주니어', series: 'Family Calm', basePrice: 1150000, badges: ['BEST'] },
  { slug: 'archline-arch-mirror', brandSlug: 'archline', name: '아치라인 아치 미러 800', subtitle: '아치 모티프 시그니처 미러', category: '수납', series: 'Modern Line', basePrice: 240000, badges: ['NEW'] },
  { slug: 'sleep-island-cloud-mattress-q', brandSlug: 'sleep-island', name: '슬립아일랜드 클라우드 매트리스 Q', subtitle: '7존 포켓 스프링 + 라텍스 토퍼', category: '침실', subCategory: '매트리스', series: 'Soft Comfort', basePrice: 1290000, badges: ['BEST'] },
  { slug: 'noaks-walnut-nightstand', brandSlug: 'noaks', name: '노악스 월넛 협탁 500', subtitle: '컬러 캐비닛 라인의 침실 협탁', category: '침실', subCategory: '협탁', series: 'Modern Line', basePrice: 320000 },
  { slug: 'pinemoon-pine-vanity', brandSlug: 'pinemoon', name: '파인문 소나무 화장대 1200', subtitle: '라이트 톤 화장대 + 거울 셋트', category: '침실', subCategory: '화장대', series: 'Family Calm', basePrice: 680000, badges: ['NEW'] },
  { slug: 'mossin-designer-wardrobe', brandSlug: 'mossin', name: '모씬 디자이너 장롱 1800', subtitle: '북유럽 디자이너 협업 슬라이딩 장롱', category: '침실', subCategory: '장롱', series: 'Heritage', basePrice: 1880000, badges: ['NEW'] },
  { slug: 'pantry-craft-kitchen-pantry-1500', brandSlug: 'pantry-craft', name: '팬트리크래프트 주방 수납장 1500', subtitle: '7단 팬트리 + 와이어 바스켓', category: '주방', subCategory: '주방 수납장', series: 'Heritage', basePrice: 920000 },
  { slug: 'roundbrew-stove-stand', brandSlug: 'roundbrew', name: '라운드브루 렌지대 600', subtitle: '내열 마감 스테인리스 상판', category: '주방', subCategory: '렌지대', series: 'Modern Line', basePrice: 380000 },
  { slug: 'kerf-grill-table', brandSlug: 'kerf', name: '커프 하드우드 불판 테이블', subtitle: '4인용 가족 불판 + 수납 다이닝', category: '주방', subCategory: '불판 테이블', series: 'Heritage', basePrice: 990000, badges: ['BEST'] },
  { slug: 'graybook-modular-bookshelf', brandSlug: 'graybook', name: '그레이북 모듈 책장 5단', subtitle: '학생·서재 모두 어울리는 모듈 책장', category: '학생', subCategory: '책장', series: 'Studio Compact', basePrice: 540000 },
  { slug: 'graybook-home-office-desk-1500', brandSlug: 'graybook', name: '그레이북 홈오피스 데스크 1500', subtitle: '재택 근무·서재 사무 공간을 위한 폭 1500 데스크', category: '사무용', series: 'Modern Line', basePrice: 540000, badges: ['NEW'] },
  { slug: 'studio-knot-office-monitor-stand', brandSlug: 'studio-knot', name: '스튜디오 노트 모니터 스탠드·수납', subtitle: '데스크 위 모니터 받침 + 케이블 정리 수납', category: '사무용', series: 'Studio Compact', basePrice: 180000 },
  { slug: 'wagle-color-office-chair', brandSlug: 'wagle', name: '와글 컬러 오피스 체어', subtitle: '컬러 라인의 재택용 오피스 체어', category: '사무용', series: 'Modern Line', basePrice: 290000 },
  { slug: 'porchlight-entry-shelf', brandSlug: 'porchlight', name: '포치라이트 현관 수납 셸프', subtitle: '현관·복도 작은 공간 수납', category: '수납', series: 'Studio Compact', basePrice: 240000, badges: ['NEW'] },
  { slug: 'hyggehaus-storage-cabinet', brandSlug: 'hyggehaus', name: '휘게하우스 라운지 수납 캐비닛', subtitle: '아늑한 휘게 무드의 거실·복도 캐비닛', category: '수납', series: 'Soft Comfort', basePrice: 580000 },
  { slug: 'kibun-walnut-tray-set', brandSlug: 'kibun', name: '기분상점 월넛 트레이 셋트 3종', subtitle: '데일리 잡화 정리 트레이 라지·미디엄·스몰', category: '수납', series: 'Heritage', basePrice: 120000, badges: ['NEW'] },
  { slug: 'kibun-plant-stand-3-tier', brandSlug: 'kibun', name: '기분상점 3단 플랜트 스탠드', subtitle: '실내 식물 3단 디스플레이 스탠드', category: '수납', series: 'Modern Line', basePrice: 180000 },
  { slug: 'kibun-wood-organizer', brandSlug: 'kibun', name: '기분상점 우드 데스크 오거나이저', subtitle: '책상 위 작은 수납 오거나이저', category: '수납', series: 'Studio Compact', basePrice: 95000 },
  { slug: 'kibun-side-shelf-walnut', brandSlug: 'kibun', name: '기분상점 월넛 사이드 셸프 800', subtitle: '소형 평수 사이드 셸프', category: '수납', series: 'Heritage', basePrice: 240000 },
  { slug: 'wally-and-co-junior-bed-twin', brandSlug: 'wally-and-co', name: '왈리앤코 안전인증 주니어 침대 트윈', subtitle: 'KC 안전인증 주니어 침대, 친환경 도장', category: '학생', subCategory: '주니어', series: 'Family Calm', basePrice: 890000, badges: ['NEW', 'BEST'] },
  { slug: 'wally-and-co-kids-desk-1100', brandSlug: 'wally-and-co', name: '왈리앤코 키즈 학습 책상 1100', subtitle: '높이 조절 키즈 책상, 모서리 라운드', category: '학생', subCategory: '책상', series: 'Family Calm', basePrice: 380000 },
  { slug: 'wally-and-co-kids-bookshelf-3-tier', brandSlug: 'wally-and-co', name: '왈리앤코 키즈 3단 책장', subtitle: '낮은 키 친화 3단 책장', category: '학생', subCategory: '책장', series: 'Family Calm', basePrice: 290000 },
  { slug: 'wally-and-co-kids-wardrobe', brandSlug: 'wally-and-co', name: '왈리앤코 키즈 옷장 슬라이딩', subtitle: '키즈룸 슬라이딩 옷장, 거울 포함', category: '학생', subCategory: '주니어', series: 'Family Calm', basePrice: 720000 },
  { slug: 'cottonbird-cotton-headboard-bed-q', brandSlug: 'cottonbird', name: '코튼버드 면 헤드보드 침대 Q', subtitle: '천연 면 패브릭 헤드보드, 라이트 톤', category: '침실', subCategory: '침대', series: 'Family Calm', basePrice: 1080000, badges: ['NEW'] },
  { slug: 'cottonbird-cotton-handle-nightstand', brandSlug: 'cottonbird', name: '코튼버드 면 손잡이 협탁 500', subtitle: '면 손잡이 디테일의 침실 협탁', category: '침실', subCategory: '협탁', series: 'Family Calm', basePrice: 280000 },
  { slug: 'cottonbird-kids-bunk-bed', brandSlug: 'cottonbird', name: '코튼버드 키즈 2단 침대', subtitle: '면 패브릭 가드의 키즈 2단 침대', category: '학생', subCategory: '주니어', series: 'Family Calm', basePrice: 980000, badges: ['BEST'] },
  { slug: 'cottonbird-cotton-soft-cabinet', brandSlug: 'cottonbird', name: '코튼버드 면 패브릭 수납 캐비닛', subtitle: '면 패브릭 도어의 수납 캐비닛', category: '수납', series: 'Soft Comfort', basePrice: 460000 },
]

const generatedAllocation: Array<{ category: typeof categories[number]; subCategory?: string }> = [
  { category: '침실', subCategory: '침대' },
  { category: '침실', subCategory: '매트리스' },
  { category: '침실', subCategory: '협탁' },
  { category: '침실', subCategory: '화장대' },
  { category: '침실', subCategory: '서랍장' },
  { category: '침실', subCategory: '장롱' },
  { category: '거실', subCategory: '거실장' },
  { category: '거실', subCategory: '장식장' },
  { category: '주방', subCategory: '주방 수납장' },
  { category: '주방', subCategory: '식탁 테이블' },
  { category: '주방', subCategory: '렌지대' },
  { category: '주방', subCategory: '불판 테이블' },
  { category: '수납' },
  { category: '사무용' },
  { category: '학생', subCategory: '주니어' },
  { category: '학생', subCategory: '책상' },
  { category: '학생', subCategory: '책장' },
]

function generated(): SeedSpec[] {
  const list: SeedSpec[] = []
  let counter = 0
  brands.forEach((b) => {
    const featuredCount = featured.filter((f) => f.brandSlug === b.slug).length
    const want = Math.max(0, 4 - featuredCount)
    for (let i = 0; i < want; i++) {
      counter += 1
      const alloc = generatedAllocation[counter % generatedAllocation.length]
      const cat = alloc.category
      const sub = alloc.subCategory
      const series = seriesPool[counter % seriesPool.length]
      const base = 180000 + (counter % 10) * 70000
      const labelForName = sub ?? cat
      list.push({
        slug: `${b.slug}-item-${i + 1}`,
        brandSlug: b.slug,
        name: `${b.name} ${labelForName} 컬렉션 0${i + 1}`,
        subtitle: `${series} 시리즈, 일상에 곁들이는 단정한 가구`,
        category: cat,
        subCategory: sub,
        series,
        basePrice: base,
        badges: counter % 9 === 0 ? ['NEW'] : counter % 11 === 0 ? ['BEST'] : undefined,
      })
    }
  })
  return list
}

const allSpecs: SeedSpec[] = [...featured, ...generated()]

function buildProduct(spec: SeedSpec, idx: number): Product {
  const brand = brands.find((b) => b.slug === spec.brandSlug)!
  const seed = idx + 1
  const { reg, sale } = priceFor(seed, spec.basePrice)
  const colors = [colorsPool[seed % colorsPool.length], colorsPool[(seed + 3) % colorsPool.length]]
  const sizes = spec.category === '거실' || spec.category === '침실' ? ['Q', 'K', 'CK'] : sizesPool.slice(0, 1 + (seed % 3))
  const stock: Record<string, number> = {}
  colors.forEach((c) => sizes.forEach((s) => { stock[`${c}|${s}`] = 1 + (seed * 7 + s.length) % 9 }))
  const useArr = [uses[seed % uses.length], uses[(seed + 2) % uses.length]]
  const matArr = [materials[seed % materials.length]]
  const deliveryDays = [3, 5, 7, 10, 14, 21][seed % 6]
  const desc = `<h2>제품 소개</h2><p>${spec.name}은(는) ${brand.name}의 ${spec.series} 시리즈로, ${spec.category} 공간에 자연스럽게 녹아드는 비례와 마감을 갖췄습니다.</p><p>표면은 무광 도장으로 일상에서 묻어나는 작은 흔적이 시간이 지날수록 가구의 결로 자리잡습니다. 조립은 30분 내외, 도장 케어 안내문이 동봉됩니다.</p><h3>사용 권장</h3><ul><li>${useArr.join(', ')} 용도에 적합합니다.</li><li>주요 소재: ${matArr.join(', ')}</li><li>주요 컬러: ${colors.join(', ')}</li></ul><p>${brand.description}</p>`
  return {
    id: `prd-${spec.slug}`,
    slug: spec.slug,
    brandId: brand.id,
    name: spec.name,
    subtitle: spec.subtitle,
    badges: spec.badges ?? [],
    priceRegular: reg,
    priceSale: sale,
    rewardPoint: Math.round(sale * 0.01 / 100) * 100,
    options: { color: colors, size: sizes },
    stock,
    axes: {
      category: spec.category,
      subCategory: spec.subCategory ?? inferSubCategory(spec.slug, spec.name, spec.category),
      use: useArr,
      material: matArr,
      deliveryDays,
    },
    thumbLetter: spec.name.charAt(0),
    galleryLetters: [spec.name.charAt(0), spec.category.charAt(0), spec.series.charAt(0), brand.name.charAt(0), '+'],
    descriptionHtml: desc,
    rating: Math.min(5, 3.6 + (seed % 14) / 10),
    reviewCount: 12 + (seed * 3) % 80,
    collectionIds: [],
  }
}

export const products: Product[] = allSpecs.map((s, i) => buildProduct(s, i))

export function productById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
export function productsByBrand(brandId: string): Product[] {
  return products.filter((p) => p.brandId === brandId)
}
