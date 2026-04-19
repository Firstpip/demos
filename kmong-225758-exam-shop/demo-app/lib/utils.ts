export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case '결제완료': return 'bg-blue-100 text-blue-700';
    case '배송준비': return 'bg-yellow-100 text-yellow-700';
    case '배송중': return 'bg-purple-100 text-purple-700';
    case '배송완료': return 'bg-green-100 text-green-700';
    case '취소': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function generateBookCover(title: string, category: string): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    '국어': { bg: '#E8653A', text: '#FFF' },
    '영어': { bg: '#3B82F6', text: '#FFF' },
    '수학': { bg: '#8B5CF6', text: '#FFF' },
    '사회': { bg: '#22C55E', text: '#FFF' },
    '과학': { bg: '#F59E0B', text: '#FFF' },
    '기타': { bg: '#1B2A4A', text: '#FFF' },
  };
  return colors[category] || { bg: '#64748B', text: '#FFF' };
}
