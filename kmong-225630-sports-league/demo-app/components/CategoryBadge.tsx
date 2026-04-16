'use client';

import type { Category } from '@/lib/data';
import { getCategoryLabel } from '@/lib/data';

const styles: Record<Category, string> = {
  pro: 'bg-red-100 text-red-800',
  amateur: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
};

export default function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[category]}`}>
      {getCategoryLabel(category)}
    </span>
  );
}
