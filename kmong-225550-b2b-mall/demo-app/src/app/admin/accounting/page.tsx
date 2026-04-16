'use client';

import { useState } from 'react';
import { accountingConfig, taxInvoices, cashReceipts, type TaxInvoice, type CashReceipt } from '@/data/accounting';
import { useToast } from '@/contexts/ToastContext';

function formatPrice(price: number) {
  return price.toLocaleString('ko-KR');
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    issued: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  const labels: Record<string, string> = {
    issued: '발행완료', failed: '실패', pending: '대기', cancelled: '취소',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {labels[status] || status}
    </span>
  );
}

export default function AccountingPage() {
  const { showToast } = useToast();
  const [config, setConfig] = useState(accountingConfig);
  const [activeTab, setActiveTab] = useState<'taxInvoice' | 'cashReceipt' | 'settings'>('taxInvoice');

  const issuedTax = taxInvoices.filter(t => t.status === 'issued').length;
  const totalTaxAmount = taxInvoices.filter(t => t.status === 'issued').reduce((sum, t) => sum + t.totalAmount, 0);
  const issuedReceipt = cashReceipts.filter(c => c.status === 'issued').length;
  const pendingCount = taxInvoices.filter(t => t.status === 'pending').length + cashReceipts.filter(c => c.status === 'pending').length;

  return (
    <div id="admin-accounting">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">회계솔루션 연동</h1>
          <p className="text-sm text-neutral-500 mt-1">세금계산서 · 현금영수증 자동 발행 관리</p>
        </div>
        <button
          onClick={() => showToast('대기 중인 건을 일괄 발행합니다.', 'info')}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          대기건 일괄 발행
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">연동 상태</span>
            <span className={`w-3 h-3 rounded-full ${config.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          <div className={`text-lg font-bold mt-1 ${config.isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {config.isConnected ? '연결됨' : '미연결'}
          </div>
          <div className="text-xs text-neutral-400 mt-1">제공: {config.provider}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-500">세금계산서 발행</div>
          <div className="text-lg font-bold text-neutral-900 mt-1">{issuedTax}건</div>
          <div className="text-xs text-neutral-400 mt-1">총 {formatPrice(totalTaxAmount)}원</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-500">현금영수증 발행</div>
          <div className="text-lg font-bold text-neutral-900 mt-1">{issuedReceipt}건</div>
          <div className="text-xs text-neutral-400 mt-1">자동 발행 {config.autoIssueCashReceipt ? 'ON' : 'OFF'}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-500">발행 대기</div>
          <div className="text-lg font-bold text-warning mt-1">{pendingCount}건</div>
          <div className="text-xs text-neutral-400 mt-1">처리 필요</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-neutral-200">
        {[
          { key: 'taxInvoice', label: '세금계산서' },
          { key: 'cashReceipt', label: '현금영수증' },
          { key: 'settings', label: '발행 설정' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tax Invoices */}
      {activeTab === 'taxInvoice' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">발행번호</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">거래처</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">사업자번호</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">공급가</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">부가세</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">합계</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">발행일</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {taxInvoices.map(invoice => (
                <tr key={invoice.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-neutral-600">{invoice.id}</td>
                  <td className="px-4 py-3 font-medium text-primary">{invoice.orderId}</td>
                  <td className="px-4 py-3 text-neutral-900">{invoice.businessName}</td>
                  <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{invoice.businessNumber}</td>
                  <td className="px-4 py-3 text-right text-neutral-900">{formatPrice(invoice.amount)}</td>
                  <td className="px-4 py-3 text-right text-neutral-500">{formatPrice(invoice.taxAmount)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-neutral-900">{formatPrice(invoice.totalAmount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={invoice.status} /></td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{invoice.issuedAt}</td>
                  <td className="px-4 py-3">
                    {invoice.status === 'failed' && (
                      <button
                        onClick={() => showToast(`${invoice.id} 재발행을 요청했습니다.`, 'info')}
                        className="text-xs text-primary hover:underline cursor-pointer"
                      >
                        재발행
                      </button>
                    )}
                    {invoice.status === 'pending' && (
                      <button
                        onClick={() => showToast(`${invoice.id} 발행을 요청했습니다.`, 'info')}
                        className="text-xs text-secondary hover:underline cursor-pointer"
                      >
                        발행
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cash Receipts */}
      {activeTab === 'cashReceipt' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">발행번호</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">주문번호</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">거래처</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">영수증번호</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-600">금액</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">발행일</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {cashReceipts.map(receipt => (
                <tr key={receipt.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-mono text-neutral-600">{receipt.id}</td>
                  <td className="px-4 py-3 font-medium text-primary">{receipt.orderId}</td>
                  <td className="px-4 py-3 text-neutral-900">{receipt.businessName}</td>
                  <td className="px-4 py-3 text-neutral-500 font-mono">{receipt.receiptNumber}</td>
                  <td className="px-4 py-3 text-right font-semibold text-neutral-900">{formatPrice(receipt.amount)}원</td>
                  <td className="px-4 py-3"><StatusBadge status={receipt.status} /></td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{receipt.issuedAt}</td>
                  <td className="px-4 py-3">
                    {receipt.status === 'pending' && (
                      <button
                        onClick={() => showToast(`${receipt.id} 발행을 요청했습니다.`, 'info')}
                        className="text-xs text-secondary hover:underline cursor-pointer"
                      >
                        발행
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">회계솔루션 API 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="label-field">회계솔루션 제공사</label>
              <input type="text" value={config.provider} readOnly className="input-field bg-neutral-50" />
            </div>
            <div>
              <label className="label-field">API 엔드포인트</label>
              <input type="text" value={config.apiEndpoint} readOnly className="input-field bg-neutral-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">사업자등록번호</label>
                <input type="text" value={config.businessNumber} readOnly className="input-field bg-neutral-50" />
              </div>
              <div>
                <label className="label-field">상호명</label>
                <input type="text" value={config.businessName} readOnly className="input-field bg-neutral-50" />
              </div>
            </div>
            <div>
              <label className="label-field">API Key <span className="text-error">*</span></label>
              <input type="password" value="••••••••••••••••" readOnly className="input-field bg-neutral-50" />
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <h4 className="font-medium text-neutral-900 mb-3">자동 발행 설정</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-700">주문 확정 시 세금계산서 자동 발행</div>
                    <div className="text-xs text-neutral-400">주문 상태가 &apos;확인&apos;으로 변경되면 자동 발행</div>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, autoIssueOnConfirm: !config.autoIssueOnConfirm })}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${config.autoIssueOnConfirm ? 'bg-secondary' : 'bg-neutral-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${config.autoIssueOnConfirm ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-700">현금영수증 자동 발행</div>
                    <div className="text-xs text-neutral-400">회원의 현금영수증 번호가 등록된 경우 자동 발행</div>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, autoIssueCashReceipt: !config.autoIssueCashReceipt })}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${config.autoIssueCashReceipt ? 'bg-secondary' : 'bg-neutral-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${config.autoIssueCashReceipt ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => showToast('설정이 저장되었습니다.', 'success')}
                className="btn-primary"
              >
                설정 저장
              </button>
              <button
                onClick={() => showToast('연결 테스트 성공! 회계솔루션 서버 응답 정상', 'success')}
                className="btn-secondary"
              >
                연결 테스트
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
