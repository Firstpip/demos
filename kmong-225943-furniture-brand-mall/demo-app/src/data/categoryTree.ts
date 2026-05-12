export interface CategoryNode {
  category: string
  letter: string
  imageUrl: string
  subCategories: string[]
}

function u(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80&auto=format`
}

export const categoryTree: CategoryNode[] = [
  {
    category: '침실',
    letter: '寢',
    imageUrl: u('1505693416388-ac5ce068fe85'),
    subCategories: ['침대', '매트리스', '협탁', '화장대', '서랍장', '장롱'],
  },
  {
    category: '거실',
    letter: '居',
    imageUrl: u('1555041469-a586c61ea9bc'),
    subCategories: ['거실장', '장식장'],
  },
  {
    category: '주방',
    letter: '廚',
    imageUrl: u('1556909114-f6e7ad7d3136'),
    subCategories: ['주방 수납장', '식탁 테이블', '렌지대', '불판 테이블'],
  },
  {
    category: '수납',
    letter: '納',
    imageUrl: u('1565538810643-b5bdb714032a'),
    subCategories: [],
  },
  {
    category: '사무용',
    letter: '務',
    imageUrl: u('1497366216548-37526070297c'),
    subCategories: [],
  },
  {
    category: '학생',
    letter: '學',
    imageUrl: u('1517502884422-41eaead166d4'),
    subCategories: ['주니어', '책상', '책장'],
  },
]

export const subImageMap: Record<string, string> = {
  '침대': u('1505693416388-ac5ce068fe85'),
  '매트리스': u('1631679706909-1844bbd07221'),
  '협탁': u('1540518614846-7eded433c457'),
  '화장대': u('1616627781925-3f2c0a8dd026'),
  '서랍장': u('1522708323590-d24dbb6b0267'),
  '장롱': u('1558997519-83ea9252edf8'),
  '거실장': u('1567538096630-e0c55bd6374c'),
  '장식장': u('1493663284031-b7e3aefcae8e'),
  '주방 수납장': u('1556909114-f6e7ad7d3136'),
  '식탁 테이블': u('1505691938895-1758d7feb511'),
  '렌지대': u('1556909114-f6e7ad7d3136'),
  '불판 테이블': u('1505691938895-1758d7feb511'),
  '주니어': u('1517502884422-41eaead166d4'),
  '책상': u('1517502884422-41eaead166d4'),
  '책장': u('1497366754035-f200968a6e72'),
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
