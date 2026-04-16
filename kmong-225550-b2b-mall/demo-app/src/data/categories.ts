export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'CAT01',
    name: '식품/음료',
    slug: 'food-beverage',
    description: '도매 식품 및 음료 상품',
    productCount: 3,
  },
  {
    id: 'CAT02',
    name: '생활용품',
    slug: 'living',
    description: '생활용품 및 세제류',
    productCount: 3,
  },
  {
    id: 'CAT03',
    name: '사무용품',
    slug: 'office',
    description: '사무용품 및 문구',
    productCount: 3,
  },
  {
    id: 'CAT04',
    name: '패션잡화',
    slug: 'fashion',
    description: '패션잡화 및 액세서리',
    productCount: 3,
  },
];
