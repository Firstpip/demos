interface StatusBadgeProps {
  status: string;
  type?: 'member' | 'order';
}

const memberStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: '승인대기', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  approved: { label: '승인', className: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: '거절', className: 'bg-red-100 text-red-800 border-red-200' },
  suspended: { label: '정지', className: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const orderStatusMap: Record<string, { label: string; className: string }> = {
  pending: { label: '입금대기', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  confirmed: { label: '주문확인', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipping: { label: '배송중', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: '배송완료', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: '취소', className: 'bg-red-100 text-red-800 border-red-200' },
};

export default function StatusBadge({ status, type = 'member' }: StatusBadgeProps) {
  const map = type === 'order' ? orderStatusMap : memberStatusMap;
  const info = map[status] || { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${info.className}`}>
      {info.label}
    </span>
  );
}
