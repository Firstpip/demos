'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const { isLoggedIn } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [studentBirth, setStudentBirth] = useState('');
  const [proFile, setProFile] = useState('');

  if (!isLoggedIn) { router.push('/login'); return null; }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">인증 관리</h1>

        <div id="verify-status" className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h2 className="font-semibold text-gray-900">아마추어 인증 완료</h2>
              <p className="text-sm text-gray-500">현재 아마추어 카테고리로 인증되어 있습니다.</p>
            </div>
          </div>
        </div>

        <div id="verify-student-form" className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" /> 학생 인증
          </h2>
          <p className="text-sm text-gray-500 mb-4">학생 카테고리 대회 참가를 위해 나이 인증이 필요합니다.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">생년월일 <span className="text-red-500">*</span></label>
              <input type="date" value={studentBirth} onChange={e => setStudentBirth(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <button onClick={() => { addToast('학생 인증 신청이 완료되었습니다. 관리자 승인을 기다려주세요.'); }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              학생 인증 신청
            </button>
          </div>
        </div>

        <div id="verify-pro-form" className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" /> 프로 인증
          </h2>
          <p className="text-sm text-gray-500 mb-4">프로 카테고리는 추후 오픈 예정입니다. 미리 선수증을 제출하실 수 있습니다.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">선수증 업로드 <span className="text-red-500">*</span></label>
              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">{proFile || '파일을 선택하세요 (PDF, JPG, PNG)'}</span>
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setProFile(e.target.files?.[0]?.name || '')} />
              </label>
            </div>
            <button onClick={() => { addToast('프로 인증 신청이 완료되었습니다. 관리자 승인을 기다려주세요.'); }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              프로 인증 신청
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
