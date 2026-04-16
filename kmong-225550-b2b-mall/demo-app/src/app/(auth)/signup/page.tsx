'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

type Step = 1 | 2 | 3;

interface FormData {
  loginId: string;
  password: string;
  passwordConfirm: string;
  managerName: string;
  phone: string;
  email: string;
  businessName: string;
  businessNumber: string;
  ownerName: string;
  businessType: string;
  businessItem: string;
  address: string;
  businessLicense: File | null;
  retailDesignation: File | null;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export default function SignupPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    loginId: '', password: '', passwordConfirm: '', managerName: '', phone: '', email: '',
    businessName: '', businessNumber: '', ownerName: '', businessType: '', businessItem: '',
    address: '', businessLicense: null, retailDesignation: null,
    agreeTerms: false, agreePrivacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessVerified, setBusinessVerified] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [completed, setCompleted] = useState(false);

  const update = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.loginId.trim()) errs.loginId = '아이디를 입력해주세요.';
    else if (formData.loginId.length < 4) errs.loginId = '아이디는 4자 이상이어야 합니다.';
    if (!formData.password) errs.password = '비밀번호를 입력해주세요.';
    else if (formData.password.length < 6) errs.password = '비밀번호는 6자 이상이어야 합니다.';
    if (formData.password !== formData.passwordConfirm) errs.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (!formData.managerName.trim()) errs.managerName = '담당자명을 입력해주세요.';
    if (!formData.phone.trim()) errs.phone = '연락처를 입력해주세요.';
    if (!formData.email.trim()) errs.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = '올바른 이메일 형식을 입력해주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.businessName.trim()) errs.businessName = '회사명을 입력해주세요.';
    if (!formData.businessNumber.trim()) errs.businessNumber = '사업자등록번호를 입력해주세요.';
    else if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.businessNumber)) errs.businessNumber = '형식: 000-00-00000';
    if (!formData.ownerName.trim()) errs.ownerName = '대표자명을 입력해주세요.';
    if (!formData.businessType.trim()) errs.businessType = '업태를 입력해주세요.';
    if (!formData.businessItem.trim()) errs.businessItem = '종목을 입력해주세요.';
    if (!formData.address.trim()) errs.address = '주소를 입력해주세요.';
    if (!identityVerified) errs.identity = '본인인증(성인인증)을 완료해주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setErrors({ agree: '필수 약관에 동의해주세요.' });
      return;
    }
    setCompleted(true);
    showToast('회원가입 신청이 완료되었습니다.', 'success');
  };

  const verifyBusiness = () => {
    if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.businessNumber)) {
      setErrors(prev => ({ ...prev, businessNumber: '형식: 000-00-00000' }));
      return;
    }
    setBusinessVerified(true);
    showToast('사업자등록번호가 확인되었습니다. (데모)', 'success');
  };

  const stepLabels = ['기본정보', '사업자정보', '약관동의'];

  const renderField = (label: string, field: keyof FormData, type = 'text', placeholder = '') => (
    <div>
      <label className="label-field">{label} <span className="text-error">*</span></label>
      <input
        type={type}
        value={formData[field] as string}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
        className={`input-field ${errors[field] ? 'border-error ring-1 ring-error' : ''}`}
      />
      {errors[field] && <p className="text-error text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div id="signup-page" className="w-full max-w-lg">
      <div className="text-center mb-8">
        <Link href="/login" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">B2B</span>
          </div>
          <span className="text-2xl font-bold text-primary">B2B MALL</span>
        </Link>
        <p className="text-neutral-600 text-sm">회원가입</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8 gap-2">
        {stepLabels.map((label, i) => {
          const s = (i + 1) as Step;
          const isActive = step === s;
          const isDone = step > s || completed;
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className={`w-8 h-0.5 ${isDone ? 'bg-primary' : 'bg-neutral-200'}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone ? 'bg-primary text-white' : isActive ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'
                }`}>
                  {isDone ? '✓' : s}
                </div>
                <span className={`text-xs ${isActive || isDone ? 'text-primary font-medium' : 'text-neutral-400'}`}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-8">
        {completed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-success text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">가입 신청 완료</h3>
            <p className="text-neutral-600 text-sm mb-6">
              관리자 승인 후 이용 가능합니다.<br />
              승인 완료 시 이메일로 안내드리겠습니다.
            </p>
            <Link href="/login" className="btn-primary">
              로그인 페이지로
            </Link>
          </div>
        ) : (
          <>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">기본정보</h3>
                {renderField('아이디', 'loginId', 'text', '4자 이상')}
                {renderField('비밀번호', 'password', 'password', '6자 이상')}
                {renderField('비밀번호 확인', 'passwordConfirm', 'password', '비밀번호를 다시 입력')}
                {renderField('담당자명', 'managerName', 'text', '담당자 이름')}
                {renderField('연락처', 'phone', 'tel', '010-0000-0000')}
                {renderField('이메일', 'email', 'email', 'example@company.com')}
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">사업자정보</h3>
                {renderField('회사명', 'businessName', 'text', '(주)회사명')}
                <div>
                  <label className="label-field">사업자등록번호 <span className="text-error">*</span></label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.businessNumber}
                      onChange={(e) => update('businessNumber', e.target.value)}
                      placeholder="000-00-00000"
                      className={`input-field flex-1 ${errors.businessNumber ? 'border-error ring-1 ring-error' : ''}`}
                    />
                    <button type="button" onClick={verifyBusiness} className="btn-outline whitespace-nowrap">
                      {businessVerified ? '확인완료' : '검증'}
                    </button>
                  </div>
                  {errors.businessNumber && <p className="text-error text-xs mt-1">{errors.businessNumber}</p>}
                </div>
                {renderField('대표자명', 'ownerName', 'text', '대표자 이름')}
                {renderField('업태', 'businessType', 'text', '도소매')}
                {renderField('종목', 'businessItem', 'text', '식품, 음료')}
                {renderField('주소', 'address', 'text', '사업장 주소')}
                <div>
                  <label className="label-field">사업자등록증</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => update('businessLicense', e.target.files?.[0] || null)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="label-field">소매인지정서</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => update('retailDesignation', e.target.files?.[0] || null)}
                    className="input-field text-sm"
                  />
                </div>

                {/* 이중 인증 섹션 */}
                <div className="pt-4 mt-4 border-t border-neutral-200">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1">이중 인증 <span className="text-error">*</span></h4>
                  <p className="text-xs text-neutral-500 mb-3">사업자 인증 및 본인(성인) 인증이 모두 필요합니다.</p>
                  <div className="space-y-3">
                    {/* 사업자 인증 상태 */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${businessVerified ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${businessVerified ? 'bg-green-500 text-white' : 'bg-neutral-300 text-white'}`}>
                          {businessVerified ? '✓' : '1'}
                        </span>
                        <span className="text-sm text-neutral-700">사업자 인증</span>
                      </div>
                      <span className={`text-xs font-medium ${businessVerified ? 'text-green-600' : 'text-neutral-400'}`}>
                        {businessVerified ? '인증완료' : '위 사업자등록번호 검증 필요'}
                      </span>
                    </div>
                    {/* 본인인증(성인인증) */}
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${identityVerified ? 'border-green-200 bg-green-50' : 'border-neutral-200 bg-neutral-50'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${identityVerified ? 'bg-green-500 text-white' : 'bg-neutral-300 text-white'}`}>
                          {identityVerified ? '✓' : '2'}
                        </span>
                        <span className="text-sm text-neutral-700">본인인증 (성인인증)</span>
                      </div>
                      {identityVerified ? (
                        <span className="text-xs font-medium text-green-600">인증완료 (성인확인)</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowPassModal(true)}
                          className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                          본인인증하기
                        </button>
                      )}
                    </div>
                  </div>
                  {errors.identity && <p className="text-error text-xs mt-1">{errors.identity}</p>}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">약관동의</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => update('agreeTerms', e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium text-neutral-900">[필수] 이용약관 동의</span>
                      <div className="mt-1 p-3 bg-neutral-100 rounded text-xs text-neutral-600 h-24 overflow-y-auto">
                        제1조 (목적) 이 약관은 B2B MALL(이하 &quot;회사&quot;)이 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다. 제2조 (정의) &quot;서비스&quot;란 회사가 제공하는 온라인 B2B 쇼핑몰을 의미합니다. 제3조 (약관의 효력) 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력이 발생합니다...
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreePrivacy}
                      onChange={(e) => update('agreePrivacy', e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium text-neutral-900">[필수] 개인정보 처리방침 동의</span>
                      <div className="mt-1 p-3 bg-neutral-100 rounded text-xs text-neutral-600 h-24 overflow-y-auto">
                        1. 수집하는 개인정보 항목: 담당자명, 연락처, 이메일, 사업자등록번호, 회사명, 주소 등. 2. 수집 목적: 회원가입, 서비스 제공, 고객상담. 3. 보유기간: 회원 탈퇴 시까지 또는 관계법령에 따른 보유기간...
                      </div>
                    </div>
                  </label>
                </div>
                {errors.agree && <p className="text-error text-xs">{errors.agree}</p>}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button onClick={() => setStep((step - 1) as Step)} className="btn-outline">
                  이전
                </button>
              ) : (
                <Link href="/login" className="btn-outline">
                  로그인으로
                </Link>
              )}
              {step < 3 ? (
                <button onClick={handleNext} className="btn-primary">
                  다음
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-secondary">
                  가입 신청
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {/* PASS 본인인증 Mock 모달 */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#5539CC] to-[#7B61FF] p-5 text-center">
              <div className="text-white text-xl font-bold mb-1">PASS 본인인증</div>
              <p className="text-white/80 text-xs">통신사 본인인증 (데모)</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-purple-700 text-xs font-medium">데모 안내</p>
                <p className="text-purple-600 text-xs mt-1">실제 서비스에서는 PASS/NICE 본인인증 API가 연동됩니다.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600">이름</label>
                  <input type="text" placeholder="홍길동" className="input-field text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">생년월일</label>
                  <input type="text" placeholder="19900101" className="input-field text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600">휴대폰번호</label>
                  <input type="text" placeholder="010-0000-0000" className="input-field text-sm mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 py-2.5 border border-neutral-300 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setIdentityVerified(true);
                    setShowPassModal(false);
                    showToast('본인인증이 완료되었습니다. (성인확인)', 'success');
                  }}
                  className="flex-1 py-2.5 bg-[#5539CC] text-white rounded-lg text-sm font-medium hover:bg-[#4A2FB8] cursor-pointer"
                >
                  인증하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
