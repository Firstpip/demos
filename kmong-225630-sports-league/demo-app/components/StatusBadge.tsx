'use client';

import type { TournamentStatus, ApplicationStatus, VerificationStatus, AppealStatus } from '@/lib/data';

const statusStyles: Record<string, string> = {
  upcoming: 'bg-yellow-100 text-yellow-800',
  open: 'bg-blue-100 text-blue-800',
  closed: 'bg-purple-100 text-purple-800',
  ongoing: 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  none: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  refunded: 'bg-orange-100 text-orange-800',
  scheduled: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  upcoming: '접수예정', open: '접수중', closed: '접수완료', ongoing: '진행중', finished: '종료',
  pending: '대기중', approved: '승인', rejected: '거절',
  none: '미인증',
  submitted: '접수', reviewing: '심사중',
  completed: '완료', refunded: '환불',
  scheduled: '예정',
};

export default function StatusBadge({ status }: { status: TournamentStatus | ApplicationStatus | VerificationStatus | AppealStatus | string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {statusLabels[status] || status}
    </span>
  );
}
