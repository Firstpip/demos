'use client';

import { useState } from 'react';
import { members, type Member } from '@/data/members';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import { useToast } from '@/contexts/ToastContext';

export default function AdminMembersPage() {
  const { showToast } = useToast();
  const [memberList, setMemberList] = useState(members);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editDiscount, setEditDiscount] = useState<string>('');

  const filtered = statusFilter === 'all'
    ? memberList
    : memberList.filter(m => m.status === statusFilter);

  const statuses = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '승인대기' },
    { value: 'approved', label: '승인' },
    { value: 'suspended', label: '정지' },
  ];

  const openDetail = (member: Member) => {
    setSelectedMember(member);
    setEditDiscount(String(member.discountRate));
  };

  const handleApprove = (id: string) => {
    setMemberList(prev => prev.map(m =>
      m.id === id ? { ...m, status: 'approved' as const, approvedAt: new Date().toISOString().split('T')[0] } : m
    ));
    setSelectedMember(null);
    showToast('회원이 승인되었습니다.', 'success');
  };

  const handleReject = (id: string) => {
    setMemberList(prev => prev.map(m =>
      m.id === id ? { ...m, status: 'rejected' as const } : m
    ));
    setSelectedMember(null);
    showToast('회원이 거절되었습니다.', 'info');
  };

  const handleSuspend = (id: string) => {
    setMemberList(prev => prev.map(m =>
      m.id === id ? { ...m, status: 'suspended' as const } : m
    ));
    setSelectedMember(null);
    showToast('회원이 정지되었습니다.', 'warning');
  };

  const handleSaveDiscount = (id: string) => {
    setMemberList(prev => prev.map(m =>
      m.id === id ? { ...m, discountRate: Number(editDiscount) } : m
    ));
    showToast('할인율이 변경되었습니다.', 'success');
  };

  return (
    <div id="admin-members">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">회원관리</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
              statusFilter === s.value ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-striped">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">회사명</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">아이디</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">대표자</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">사업자번호</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">할인율</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">가입일</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium">{member.businessName}</td>
                  <td className="px-4 py-3 text-neutral-400">{member.loginId}</td>
                  <td className="px-4 py-3">{member.ownerName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{member.businessNumber}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-bold text-primary">
                      {member.discountRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={member.status} /></td>
                  <td className="px-4 py-3 text-center text-neutral-400 text-xs">{member.createdAt}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => openDetail(member)} className="text-primary hover:underline text-xs cursor-pointer">
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!selectedMember} onClose={() => setSelectedMember(null)} title="회원 상세" size="lg">
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{selectedMember.businessName}</h3>
              <StatusBadge status={selectedMember.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-neutral-400">아이디</span><p className="font-medium">{selectedMember.loginId}</p></div>
              <div><span className="text-neutral-400">대표자</span><p className="font-medium">{selectedMember.ownerName}</p></div>
              <div><span className="text-neutral-400">담당자</span><p className="font-medium">{selectedMember.managerName}</p></div>
              <div><span className="text-neutral-400">사업자번호</span><p className="font-medium">{selectedMember.businessNumber}</p></div>
              <div><span className="text-neutral-400">업태/종목</span><p className="font-medium">{selectedMember.businessType} / {selectedMember.businessItem}</p></div>
              <div><span className="text-neutral-400">연락처</span><p className="font-medium">{selectedMember.phone}</p></div>
              <div><span className="text-neutral-400">이메일</span><p className="font-medium">{selectedMember.email}</p></div>
              <div><span className="text-neutral-400">주소</span><p className="font-medium">{selectedMember.address}</p></div>
            </div>

            {/* Business license preview */}
            {selectedMember.businessLicense && (
              <div>
                <h4 className="text-sm font-medium text-neutral-600 mb-2">사업자등록증</h4>
                <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-sm">
                  📄 사업자등록증 미리보기 (데모)
                </div>
              </div>
            )}

            {/* Grade / discount edit */}
            <div className="bg-neutral-100 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-3">할인율 설정</h4>
              <div className="flex gap-3 items-end">
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">할인율 (%)</label>
                  <input type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} className="input-field !py-1.5 text-sm w-24" />
                </div>
                <button onClick={() => handleSaveDiscount(selectedMember.id)} className="btn-primary text-sm !py-1.5">
                  저장
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end border-t border-neutral-200 pt-4">
              {selectedMember.status === 'pending' && (
                <>
                  <button onClick={() => handleReject(selectedMember.id)} className="btn-outline text-error border-error hover:bg-red-50">
                    거절
                  </button>
                  <button onClick={() => handleApprove(selectedMember.id)} className="btn-secondary">
                    승인
                  </button>
                </>
              )}
              {selectedMember.status === 'approved' && (
                <button onClick={() => handleSuspend(selectedMember.id)} className="btn-danger">
                  정지
                </button>
              )}
              {selectedMember.status === 'suspended' && (
                <button onClick={() => handleApprove(selectedMember.id)} className="btn-secondary">
                  정지 해제
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
