'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTournamentById, formatCurrency } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { CreditCard, CheckCircle, Shield, Lock, Loader2 } from 'lucide-react';

export default function ApplyClient({ id }: { id: string }) {
  const t = getTournamentById(id);
  const { isLoggedIn, userName, userEmail } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [payMethod, setPayMethod] = useState('card');
  const [step, setStep] = useState<'form' | 'payment' | 'processing' | 'done'>('form');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [bank, setBank] = useState('');
  const [depositor, setDepositor] = useState('');

  if (!isLoggedIn) { router.push('/login'); return null; }
  if (!t) return <div className="p-8 text-center text-gray-500">대회를 찾을 수 없습니다.</div>;

  const handlePayStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { addToast('참가 규정에 동의해주세요', 'error'); return; }
    setStep('payment');
  };

  const handlePayConfirm = () => {
    if (payMethod === 'card' && (!cardNum || !cardExpiry || !cardCvc)) {
      addToast('카드 정보를 모두 입력해주세요', 'error'); return;
    }
    if (payMethod === 'transfer' && (!bank || !depositor)) {
      addToast('은행과 입금자명을 입력해주세요', 'error'); return;
    }
    setStep('processing');
    setTimeout(() => { setStep('done'); addToast('결제 및 신청이 완료되었습니다!'); }, 2000);
  };

  const formatCardNumber = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 16);
    return nums.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (v: string) => {
    const nums = v.replace(/\D/g, '').slice(0, 4);
    if (nums.length > 2) return nums.slice(0, 2) + '/' + nums.slice(2);
    return nums;
  };

  if (step === 'done') {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">신청 완료!</h2>
            <p className="text-gray-500 mb-2">결제가 정상 처리되었습니다.</p>
            <p className="text-gray-500 mb-6">관리자 승인 후 참가가 확정됩니다.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600 max-w-sm mx-auto text-left space-y-1">
              <p>대회: {t.title}</p>
              <p>결제 금액: {formatCurrency(t.entryFee)}</p>
              <p>결제 수단: {payMethod === 'card' ? '카드' : payMethod === 'transfer' ? '계좌이체' : '카카오페이'}</p>
            </div>
            <button onClick={() => router.push('/mypage')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              마이페이지에서 확인
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === 'processing') {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">결제 처리중...</h2>
            <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === 'payment') {
    return (
      <>
        <Header />
        <main className="flex-1 max-w-md mx-auto px-4 py-8 w-full">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-blue-600 p-5 text-white text-center">
              <Lock className="w-5 h-5 mx-auto mb-1" />
              <h2 className="font-bold text-lg">결제하기</h2>
              <p className="text-blue-100 text-sm mt-1">안전한 결제 환경입니다 (데모)</p>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-100">
                <span className="text-sm text-gray-600">{t.title}</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(t.entryFee)}</span>
              </div>

              {payMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카드 번호</label>
                    <input type="text" inputMode="numeric" value={cardNum}
                      onChange={e => setCardNum(formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000" maxLength={19}
                      className="w-full px-3 py-3 rounded-lg border border-gray-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">유효기간</label>
                      <input type="text" inputMode="numeric" value={cardExpiry}
                        onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY" maxLength={5}
                        className="w-full px-3 py-3 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input type="text" inputMode="numeric" value={cardCvc}
                        onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="000" maxLength={3}
                        className="w-full px-3 py-3 rounded-lg border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'transfer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">은행 선택</label>
                    <select value={bank} onChange={e => setBank(e.target.value)}
                      className="custom-select w-full px-3 py-3 rounded-lg border border-gray-300 text-sm bg-white outline-none">
                      <option value="">은행을 선택하세요</option>
                      <option value="kb">KB국민은행</option>
                      <option value="shinhan">신한은행</option>
                      <option value="woori">우리은행</option>
                      <option value="hana">하나은행</option>
                      <option value="nh">NH농협은행</option>
                      <option value="kakao">카카오뱅크</option>
                      <option value="toss">토스뱅크</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">입금자명</label>
                    <input type="text" value={depositor} onChange={e => setDepositor(e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-3 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                  </div>
                </div>
              )}

              {payMethod === 'kakao' && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#FEE500] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#3C1E1E] font-bold text-xl">K</span>
                  </div>
                  <p className="text-sm text-gray-600">카카오페이로 결제합니다</p>
                  <p className="text-xs text-gray-400 mt-1">카카오톡 앱에서 결제를 승인해주세요 (데모)</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button onClick={handlePayConfirm}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {formatCurrency(t.entryFee)} 결제하기
                </button>
                <button onClick={() => setStep('form')}
                  className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-700">
                  이전으로 돌아가기
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">* 데모 결제입니다. 실제 결제는 이루어지지 않습니다.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">경기 신청</h1>

        <form onSubmit={handlePayStart} className="space-y-6">
          <div id="apply-player-info" className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">선수 정보</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">이름</span><p className="font-medium text-gray-900">{userName}</p></div>
              <div><span className="text-gray-500">이메일</span><p className="font-medium text-gray-900">{userEmail}</p></div>
            </div>
          </div>

          <div id="apply-verify-status" className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> 인증 상태
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">인증완료</span>
              <span className="text-gray-600">아마추어 카테고리 인증이 완료되었습니다.</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">대회 정보</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="text-gray-500">대회명:</span> {t.title}</p>
              <p><span className="text-gray-500">기간:</span> {t.startDate} ~ {t.endDate}</p>
              <p><span className="text-gray-500">장소:</span> {t.location} {t.venue}</p>
            </div>
          </div>

          <div id="apply-payment" className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> 결제 정보
            </h2>
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">참가비</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(t.entryFee)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">결제 수단</label>
              {[
                { key: 'card', label: '신용/체크카드', icon: '💳' },
                { key: 'transfer', label: '계좌이체', icon: '🏦' },
                { key: 'kakao', label: '카카오페이', icon: '💛' },
              ].map(m => (
                <label key={m.key} className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  payMethod === m.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="payMethod" value={m.key} checked={payMethod === m.key}
                    onChange={e => setPayMethod(e.target.value)} className="text-blue-600" />
                  <span className="text-sm">{m.icon} {m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 text-blue-600 rounded" />
            <span className="text-sm text-gray-700">
              대회 참가 규정 및 환불 정책에 동의합니다. <span className="text-red-500">*</span>
            </span>
          </label>

          <button id="apply-submit" type="submit"
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              agreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}>
            결제 진행하기
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
