'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function MypageProfilePage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [cashReceiptType, setCashReceiptType] = useState<'personal' | 'business'>('personal');
  const [cashReceiptNumber, setCashReceiptNumber] = useState(currentUser?.cashReceiptNumber || '');

  if (!currentUser) {
    return <div className="card p-8 text-center text-neutral-400">회원 정보를 불러올 수 없습니다.</div>;
  }

  const handleSave = () => {
    showToast('현금영수증 번호가 저장되었습니다. (데모)', 'success');
  };

  return (
    <div id="mypage-profile">
      <h2 className="text-lg font-bold text-neutral-900 mb-4">회원정보</h2>

      {/* Discount rate */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-neutral-900">할인율</h3>
            <p className="text-sm text-neutral-400 mt-1">회원별 개별 할인 혜택이 적용됩니다.</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
              {currentUser.discountRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Business info */}
      <div className="card p-6 mb-6">
        <h3 className="font-medium text-neutral-900 mb-4">사업자 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">회사명</span>
            <p className="font-medium mt-0.5">{currentUser.businessName}</p>
          </div>
          <div>
            <span className="text-neutral-400">사업자등록번호</span>
            <p className="font-medium mt-0.5">{currentUser.businessNumber}</p>
          </div>
          <div>
            <span className="text-neutral-400">대표자명</span>
            <p className="font-medium mt-0.5">{currentUser.ownerName}</p>
          </div>
          <div>
            <span className="text-neutral-400">담당자명</span>
            <p className="font-medium mt-0.5">{currentUser.managerName}</p>
          </div>
          <div>
            <span className="text-neutral-400">업태 / 종목</span>
            <p className="font-medium mt-0.5">{currentUser.businessType} / {currentUser.businessItem}</p>
          </div>
          <div>
            <span className="text-neutral-400">이메일</span>
            <p className="font-medium mt-0.5">{currentUser.email}</p>
          </div>
          <div>
            <span className="text-neutral-400">연락처</span>
            <p className="font-medium mt-0.5">{currentUser.phone}</p>
          </div>
          <div>
            <span className="text-neutral-400">주소</span>
            <p className="font-medium mt-0.5">{currentUser.address}</p>
          </div>
        </div>
      </div>

      {/* Cash receipt */}
      <div className="card p-6">
        <h3 className="font-medium text-neutral-900 mb-4">현금영수증 설정</h3>
        <div className="flex gap-3 mb-3">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="cashReceiptType"
              checked={cashReceiptType === 'personal'}
              onChange={() => { setCashReceiptType('personal'); setCashReceiptNumber(''); }}
            />
            <span className="text-sm">개인 (휴대폰번호)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="cashReceiptType"
              checked={cashReceiptType === 'business'}
              onChange={() => { setCashReceiptType('business'); setCashReceiptNumber(currentUser.businessNumber || ''); }}
            />
            <span className="text-sm">사업자 (사업자번호)</span>
          </label>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={cashReceiptNumber}
            onChange={(e) => setCashReceiptNumber(e.target.value)}
            className="input-field max-w-xs"
            placeholder={cashReceiptType === 'personal' ? '010-0000-0000' : '000-00-00000'}
          />
          <button onClick={handleSave} className="btn-primary">
            저장
          </button>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          {cashReceiptType === 'personal'
            ? '휴대폰번호로 개인 현금영수증이 발행됩니다.'
            : '사업자번호로 지출증빙용 현금영수증이 발행됩니다.'}
        </p>
      </div>
    </div>
  );
}
