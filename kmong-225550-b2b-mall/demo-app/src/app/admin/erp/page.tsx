'use client';

import { useState } from 'react';
import { erpConfig, erpSyncLogs, erpProductMappings, type ErpSyncLog, type ErpProductMapping } from '@/data/erp';
import { useToast } from '@/contexts/ToastContext';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    synced: 'bg-green-100 text-green-700',
    mismatch: 'bg-orange-100 text-orange-700',
    unlinked: 'bg-gray-100 text-gray-500',
  };
  const labels: Record<string, string> = {
    success: '성공', failed: '실패', pending: '대기',
    synced: '연동됨', mismatch: '불일치', unlinked: '미연결',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {labels[status] || status}
    </span>
  );
}

export default function ErpPage() {
  const { showToast } = useToast();
  const [config, setConfig] = useState(erpConfig);
  const [logs] = useState<ErpSyncLog[]>(erpSyncLogs);
  const [mappings] = useState<ErpProductMapping[]>(erpProductMappings);
  const [activeTab, setActiveTab] = useState<'logs' | 'products' | 'settings'>('logs');
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('ERP 동기화가 완료되었습니다.', 'success');
    }, 2000);
  };

  const successCount = logs.filter(l => l.status === 'success').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;
  const eventProducts = mappings.filter(m => m.isEventProduct).length;

  return (
    <div id="admin-erp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">이카운트 ERP 연동</h1>
          <p className="text-sm text-neutral-500 mt-1">주문 조회 및 이벤트성 상품 동기화 관리</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {syncing ? '동기화 중...' : '수동 동기화'}
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
          <div className="text-xs text-neutral-400 mt-1">회사코드: {config.companyCode}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-500">마지막 동기화</div>
          <div className="text-lg font-bold text-neutral-900 mt-1">{config.lastSyncAt.split(' ')[1]}</div>
          <div className="text-xs text-neutral-400 mt-1">{config.lastSyncAt.split(' ')[0]}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-500">동기화 성공/실패</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-green-600">{successCount}</span>
            <span className="text-neutral-400">/</span>
            <span className="text-lg font-bold text-red-600">{failedCount}</span>
          </div>
          <div className="text-xs text-neutral-400 mt-1">최근 동기화 기록</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-neutral-500">이벤트 상품</div>
          <div className="text-lg font-bold text-secondary mt-1">{eventProducts}개</div>
          <div className="text-xs text-neutral-400 mt-1">ERP 연동 이벤트 상품</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-neutral-200">
        {[
          { key: 'logs', label: '동기화 로그' },
          { key: 'products', label: '상품 매핑' },
          { key: 'settings', label: 'API 설정' },
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

      {/* Sync Logs */}
      {activeTab === 'logs' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">유형</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">참조</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">내용</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">시간</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      log.type === 'order' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {log.type === 'order' ? '주문' : '상품'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{log.referenceId}</div>
                    <div className="text-xs text-neutral-400">{log.referenceName}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{log.message}</td>
                  <td className="px-4 py-3"><StatusBadge status={log.status} /></td>
                  <td className="px-4 py-3 text-neutral-500">{log.syncedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Mappings */}
      {activeTab === 'products' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-4 py-3 font-medium text-neutral-600">쇼핑몰 상품</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">ERP 상품코드</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">ERP 상품명</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">이벤트</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">상태</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-600">마지막 동기화</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map(mapping => (
                <tr key={mapping.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">{mapping.shopProductName}</div>
                    <div className="text-xs text-neutral-400">{mapping.shopProductId}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-neutral-600">{mapping.erpProductCode || '-'}</td>
                  <td className="px-4 py-3 text-neutral-600">{mapping.erpProductName || '-'}</td>
                  <td className="px-4 py-3">
                    {mapping.isEventProduct && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">이벤트</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={mapping.status} /></td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{mapping.lastSynced || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="card p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">이카운트 ERP API 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="label-field">API 엔드포인트</label>
              <input type="text" value={config.apiEndpoint} readOnly className="input-field bg-neutral-50" />
            </div>
            <div>
              <label className="label-field">회사 코드 <span className="text-error">*</span></label>
              <input
                type="text"
                value={config.companyCode}
                onChange={(e) => setConfig({ ...config, companyCode: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">API Key <span className="text-error">*</span></label>
              <input
                type="password"
                value="••••••••••••••••"
                readOnly
                className="input-field bg-neutral-50"
              />
              <p className="text-xs text-neutral-400 mt-1">보안을 위해 API Key는 표시되지 않습니다.</p>
            </div>
            <div>
              <label className="label-field">동기화 간격 (분)</label>
              <input
                type="text" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }}
                value={config.syncInterval}
                onChange={(e) => setConfig({ ...config, syncInterval: Number(e.target.value) })}
                className="input-field w-32"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfig({ ...config, autoSync: !config.autoSync })}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${config.autoSync ? 'bg-secondary' : 'bg-neutral-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${config.autoSync ? 'translate-x-5' : ''}`} />
              </button>
              <span className="text-sm text-neutral-700">자동 동기화</span>
            </div>
            <div className="pt-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => showToast('설정이 저장되었습니다.', 'success')}
                className="btn-primary"
              >
                설정 저장
              </button>
              <button
                onClick={() => showToast('연결 테스트 성공! ERP 서버 응답 정상', 'success')}
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
