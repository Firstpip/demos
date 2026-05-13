import {
  POOL_BY_CATEGORY,
  POOL_INTERIOR,
  SUB_POOL,
  COLLECTION_POOL,
  LOOKBOOK_POOL,
  MODULE_POOL_BY_TYPE,
  interior,
  decor,
  rug,
  lamp,
  bench,
  plant,
  bookshelf,
  sofa,
  bed,
  wardrobe,
  dining,
  desk,
  SUB_LIVING_SOFA,
  SUB_LIVING_DECOR,
  SUB_BED,
  SUB_WARDROBE,
  SUB_DINING,
  SUB_STORAGE,
  SUB_DESK,
} from '@/lib/imagePool'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function imgUrl(id: string): string {
  return `${BASE_PATH}/images/${id}.jpg`
}

export function pickByPool(pool: readonly string[], seed: string, offset = 0): string {
  if (pool.length === 0) return imgUrl(POOL_INTERIOR[0])
  const idx = (hash(seed) + offset) % pool.length
  return imgUrl(pool[idx])
}

// 신설 풀 (키워드 매칭에서 사용)
const MIRROR_POOL = [...decor, ...wardrobe.slice(0, 4)] // mirror 별도 큐레이션 부족, decor 정물 fallback
const RUG_POOL = [...rug]
const LAMP_POOL = [...lamp]
// bench 풀은 야외 공원 벤치라 가구몰에 부적합 — 좌식·라운지·암체어 풀로 대체
const BENCH_POOL = [...SUB_LIVING_DECOR, ...SUB_LIVING_SOFA.slice(0, 4)]
const PLANT_POOL = [...plant]

interface PickOpts {
  name?: string
  slug?: string
}

// 상품 이름·slug 키워드로 도메인 직접 판별 (sub fallback보다 우선)
function pickByKeyword(opts?: PickOpts): readonly string[] | undefined {
  if (!opts || (!opts.name && !opts.slug)) return undefined
  const text = `${opts.slug ?? ''} ${opts.name ?? ''}`.toLowerCase()
  const has = (re: RegExp) => re.test(text)

  // 1) 키즈 침대 — '주니어' sub로 흡수된 침대 상품 구제
  if (has(/(bunk|kids|키즈|아동|junior|주니어)/) && has(/(bed|침대|bedframe|headboard|헤드보드|2단|이층|bunk)/)) return SUB_BED
  // 2) 키즈 옷장
  if (has(/(kids|키즈|아동|junior|주니어)/) && has(/(wardrobe|옷장|장롱|closet)/)) return SUB_WARDROBE
  // 3) 미러
  if (has(/(mirror|미러|거울)/)) return MIRROR_POOL
  // 4) 러그·카펫
  if (has(/(rug|러그|carpet|카펫)/)) return RUG_POOL
  // 5) 램프·조명·라이팅
  if (has(/(lamp|램프|lighting|조명|스탠드 조명|pendant|샹들리에|chandelier)/)) return LAMP_POOL
  // 6) 트레이·오거나이저
  if (has(/(tray|트레이|organizer|오거나이저)/)) return [...decor]
  // 7) 플랜트 스탠드 (조명 제외)
  if (has(/(plant|플랜트|화분)/) && !has(/(lamp|램프|조명)/)) return PLANT_POOL
  // 8) 벤치
  if (has(/(bench|벤치|stool|스툴)/)) return BENCH_POOL
  // 9) 셸프 (책장 제외 — bookshelf 별도)
  if (has(/(shelf|셸프)/) && !has(/(bookshelf|책장|bookcase)/)) return [...bookshelf]
  // 10) 일반 캐비닛
  if (has(/(cabinet|캐비닛)/)) return SUB_WARDROBE
  // 11) 책장
  if (has(/(bookshelf|책장|bookcase)/)) return [...bookshelf]
  // 12) 식탁 의자(다이닝 의자)
  if (has(/(dining|다이닝|식탁)/) && has(/(chair|의자)/)) return SUB_DINING
  return undefined
}

export function productImage(category: string, subCategory: string | undefined, seed: string, offset = 0, opts?: PickOpts): string {
  const byKw = pickByKeyword(opts)
  const pool = byKw || (subCategory && SUB_POOL[subCategory]) || POOL_BY_CATEGORY[category] || POOL_INTERIOR
  return pickByPool(pool, seed, offset)
}

export function productGallery(category: string, subCategory: string | undefined, seed: string, count = 5, opts?: PickOpts): string[] {
  const byKw = pickByKeyword(opts)
  const pool = byKw || (subCategory && SUB_POOL[subCategory]) || POOL_BY_CATEGORY[category] || POOL_INTERIOR
  const start = hash(seed) % pool.length
  return Array.from({ length: count }, (_, i) => imgUrl(pool[(start + i) % pool.length]))
}

export function interiorImage(seed: string, offset = 0): string {
  return pickByPool(POOL_INTERIOR, seed, offset)
}

export function collectionImage(slug: string, seed?: string): string {
  const pool = COLLECTION_POOL[slug] || POOL_INTERIOR
  return pickByPool(pool, seed || slug)
}

export function lookbookImage(slug: string): string {
  const pool = LOOKBOOK_POOL[slug] || [...interior]
  return pickByPool(pool, slug)
}

export function moduleImage(id: string, type?: string): string {
  const pool = (type && MODULE_POOL_BY_TYPE[type]) || [...interior, ...decor]
  return pickByPool(pool, id)
}

export function categoryImage(category: string): string {
  return productImage(category, undefined, category)
}

// 브랜드 카드·hero 이미지. brand 정보 기반 도메인 매핑.
export function brandImageById(brandSlug: string, hintPool?: readonly string[]): string {
  const pool = hintPool || POOL_INTERIOR
  return pickByPool(pool, brandSlug)
}
