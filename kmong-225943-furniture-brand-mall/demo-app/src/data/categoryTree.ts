export interface CategoryNode {
  category: string
  letter: string
  imageUrl: string
  subCategories: string[]
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
function u(id: string): string {
  return `${BASE}/images/${id}.jpg`
}

export const categoryTree: CategoryNode[] = [
  {
    category: '침실',
    letter: '寢',
    imageUrl: u('1635594202056-9ea3b497e5c0'),
    subCategories: ['침대', '매트리스', '협탁', '화장대', '서랍장', '장롱'],
  },
  {
    category: '거실',
    letter: '居',
    imageUrl: u('1493663284031-b7e3aefcae8e'),
    subCategories: ['거실장', '장식장'],
  },
  {
    category: '주방',
    letter: '廚',
    imageUrl: u('1657524398377-567034729507'),
    subCategories: ['주방 수납장', '식탁 테이블', '렌지대', '불판 테이블'],
  },
  {
    category: '수납',
    letter: '納',
    imageUrl: u('1699443817739-cf2f7cbcd18d'),
    subCategories: [],
  },
  {
    category: '사무용',
    letter: '務',
    imageUrl: u('1620275765334-4ed948bb4502'),
    subCategories: [],
  },
  {
    category: '학생',
    letter: '學',
    imageUrl: u('1437419764061-2473afe69fc2'),
    subCategories: ['주니어', '책상', '책장'],
  },
]

export const subImageMap: Record<string, string> = {
  '침대': u('1532344214108-1b6d425db572'),
  '매트리스': u('1635594202056-9ea3b497e5c0'),
  '협탁': u('1532344214108-1b6d425db572'),
  '화장대': u('1599703678443-4fdafa9e1d0a'),
  '서랍장': u('1599703678443-4fdafa9e1d0a'),
  '장롱': u('1722942626414-5775702d7a08'),
  '거실장': u('1567016432779-094069958ea5'),
  '장식장': u('1684165610413-2401399e0e59'),
  '주방 수납장': u('1583845112239-97ef1341b271'),
  '식탁 테이블': u('1604578762246-41134e37f9cc'),
  '렌지대': u('1583845112239-97ef1341b271'),
  '불판 테이블': u('1636138388621-258a72ecb07e'),
  '주니어': u('1437419764061-2473afe69fc2'),
  '책상': u('1495195129352-aeb325a55b65'),
  '책장': u('1543248939-4296e1fea89b'),
}

export function subCategoriesOf(category: string): string[] {
  return categoryTree.find((c) => c.category === category)?.subCategories ?? []
}

export function categoryFor(subCategory: string): string | undefined {
  return categoryTree.find((c) => c.subCategories.includes(subCategory))?.category
}

export function letterOf(category: string): string {
  return categoryTree.find((c) => c.category === category)?.letter ?? ''
}

export function imageForCategory(category: string): string {
  return categoryTree.find((c) => c.category === category)?.imageUrl ?? ''
}

export function imageForSub(sub: string, fallbackCategory?: string): string {
  return subImageMap[sub] ?? (fallbackCategory ? imageForCategory(fallbackCategory) : '')
}
