import type { Lookbook } from '@/lib/types'
import { products } from './products'

function pid(slug: string): string {
  return products.find((p) => p.slug === slug)?.id ?? ''
}

export const lookbooks: Lookbook[] = [
  {
    id: 'lb-2026-spring',
    brandId: 'brand-maholn',
    slug: '2026-spring',
    title: '2026 Spring — 거실에 봄의 호흡',
    subtitle: '오크와 린넨, 그리고 햇살이 머무는 자리',
    heroLetter: '春',
    description: '봄의 거실은 가구의 색이 아니라 빛의 깊이로 완성됩니다. 마홀앤은 26SS에 오크와 월넛, 린넨 패브릭을 다시 한 자리에 모았습니다. 같은 컬렉션의 카드 컴포넌트는 본체 가구·상품 상세에서도 동일하게 등장합니다.',
    publishedAt: '2026-03-12',
    hotspots: [
      { x: 32, y: 46, productId: pid('maholn-oak-sofa-3s'), label: '마홀앤 오크 소파 3인용' },
      { x: 64, y: 52, productId: pid('maholn-linen-armchair'), label: '마홀앤 린넨 아치 암체어' },
      { x: 78, y: 28, productId: pid('maholn-walnut-tv-stand'), label: '마홀앤 월넛 TV 스탠드 1800' },
      { x: 22, y: 72, productId: pid('lenore-rug-200x290'), label: '르노어 클래식 러그' },
      { x: 50, y: 18, productId: pid('lumira-arc-floor-lamp'), label: '루미라 아크 플로어 램프' },
    ],
  },
  {
    id: 'lb-2025-archive',
    brandId: 'brand-maholn',
    slug: '2025-archive',
    title: '2025 Archive — 한 해를 거슬러',
    subtitle: '지난 시즌의 베스트 셀렉션',
    heroLetter: '輪',
    description: '한 해 동안 가장 사랑받았던 마홀앤의 거실·침실 큐레이션. 시즌이 지나도 결이 변하지 않는 가구들을 한 페이지에 다시 모았습니다.',
    publishedAt: '2025-12-20',
    hotspots: [
      { x: 30, y: 50, productId: pid('maholn-oak-sofa-3s'), label: '마홀앤 오크 소파' },
      { x: 70, y: 40, productId: pid('velvet-room-sofa-2s'), label: '벨벳룸 부클레 소파' },
    ],
  },
  {
    id: 'lb-bedroom-collection',
    brandId: 'brand-maholn',
    slug: 'bedroom-collection',
    title: '침실 컬렉션 — 잠의 결을 위한 디자인',
    subtitle: '낮은 무게중심의 침대와 사이드 테이블',
    heroLetter: '夜',
    description: '아침의 첫 호흡이 가구의 결을 따라 부드럽게 펼쳐지도록. 침대 헤드보드, 사이드 테이블, 수납 라인의 통합 코디.',
    publishedAt: '2026-02-08',
    hotspots: [
      { x: 40, y: 60, productId: pid('morning-craft-bedframe'), label: '모닝크래프트 헤드보드 침대 Q' },
      { x: 70, y: 50, productId: pid('raonwood-walnut-dresser'), label: '라온우드 월넛 드레서 1500' },
    ],
  },
  {
    id: 'lb-small-spaces',
    brandId: 'brand-maholn',
    slug: 'small-spaces',
    title: '작은 공간을 위한 마홀앤',
    subtitle: '5~10평 거실에 어울리는 가변 가구',
    heroLetter: '小',
    description: '좁은 평수에서도 마홀앤의 결을 즐기는 방법. 접이식 데스크, 가변 벤치, 슬림 셸프 라인.',
    publishedAt: '2026-01-30',
    hotspots: [
      { x: 50, y: 50, productId: pid('studio-knot-foldable-desk'), label: '스튜디오 노트 접이식 데스크' },
      { x: 30, y: 60, productId: pid('fold-and-storage-bench'), label: '폴드앤 가변형 수납 벤치' },
    ],
  },
]

export function lookbookBySlug(slug: string): Lookbook | undefined {
  return lookbooks.find((l) => l.slug === slug)
}
