'use client';

import { useState } from 'react';
import { Check, CircleAlert } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useToast } from '@/lib/context';

function AdminSettingsInner() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    shippingFee: '3000',
    freeShippingThreshold: '30000',
    pointsRate: '1',
    signupPoints: '2000',
    businessName: '(주)에듀프레스',
    businessNumber: '123-45-67890',
    cs: '02-1234-5678',
    csEmail: 'cs@edupress.co.kr',
    returnPeriod: '7',
    maintenance: false,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(f => ({ ...f, [key]: value }));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('쇼핑몰 설정이 저장되었습니다. (Mock)');
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">쇼핑몰 설정</h1>
        <p className="text-xs text-gray-500 mt-1">결제 연동 상태, 배송비, 기본 정보를 관리합니다.</p>
      </div>

      <section className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-3">결제/연동 상태</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">토스페이먼츠</span>
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
              <Check className="w-3 h-3" /> 연동됨 (Mock)
            </span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">포트원 (구 아임포트)</span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              미연동
            </span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-700">배송업체 API (CJ대한통운)</span>
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">
              <Check className="w-3 h-3" /> 연동됨 (Mock)
            </span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span className="text-gray-700">이메일 발송 (SendGrid)</span>
            <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
              <CircleAlert className="w-3 h-3" /> 설정 필요
            </span>
          </li>
        </ul>
      </section>

      <form onSubmit={save} className="space-y-4">
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">배송/적립금</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">기본 배송비 (원)</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.shippingFee}
                onChange={e => update('shippingFee', e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">무료 배송 기준 (원)</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.freeShippingThreshold}
                onChange={e =>
                  update('freeShippingThreshold', e.target.value.replace(/\D/g, ''))
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">적립금 비율 (%)</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.pointsRate}
                onChange={e => update('pointsRate', e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">신규 가입 적립금 (원)</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.signupPoints}
                onChange={e => update('signupPoints', e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">교환/반품 기간 (일)</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.returnPeriod}
                onChange={e => update('returnPeriod', e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3">사업자 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">회사명</span>
              <input
                type="text"
                value={form.businessName}
                onChange={e => update('businessName', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">사업자등록번호</span>
              <input
                type="text"
                value={form.businessNumber}
                onChange={e => update('businessNumber', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">고객센터 전화</span>
              <input
                type="text"
                value={form.cs}
                onChange={e => update('cs', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-600">고객센터 이메일</span>
              <input
                type="email"
                value={form.csEmail}
                onChange={e => update('csEmail', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#1B2A4A]"
              />
            </label>
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <label className="flex items-center justify-between cursor-pointer">
            <span>
              <span className="block text-sm font-semibold text-gray-900">유지보수 모드</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                활성화 시 관리자를 제외한 모든 사용자에게 점검 안내 페이지가 표시됩니다.
              </span>
            </span>
            <input
              type="checkbox"
              checked={form.maintenance}
              onChange={e => update('maintenance', e.target.checked)}
              className="w-5 h-5 accent-[#E8653A]"
            />
          </label>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-[#E8653A] text-white text-sm font-semibold rounded-md hover:bg-[#d35529]"
          >
            설정 저장
          </button>
        </div>
      </form>
    </>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <AdminSettingsInner />
    </AdminLayout>
  );
}
