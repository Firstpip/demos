'use client';

import AdminLayout from '@/components/AdminLayout';
import StatusBadge from '@/components/StatusBadge';
import { users, tournaments, applications, appeals, payments, getUserById, formatCurrency } from '@/lib/data';
import { Users, Trophy, CreditCard, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingVerifications = users.filter(u => u.verificationStatus === 'pending').length;
  const ongoingTournaments = tournaments.filter(t => t.status === 'ongoing').length;
  const recentApps = applications.slice(-5).reverse();

  const stats = [
    { label: '총 회원', value: users.length, icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: '진행중 대회', value: ongoingTournaments, icon: Trophy, color: 'text-green-600 bg-green-100' },
    { label: '이번달 매출', value: formatCurrency(totalRevenue), icon: CreditCard, color: 'text-purple-600 bg-purple-100' },
    { label: '대기중 인증', value: pendingVerifications, icon: Shield, color: 'text-amber-600 bg-amber-100' },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>

      <div id="admin-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className="text-lg font-bold text-gray-900">{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div id="admin-recent" className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">최근 신청</h2>
          <div className="space-y-3">
            {recentApps.map(a => {
              const user = getUserById(a.userId);
              const t = tournaments.find(t => t.id === a.tournamentId);
              return (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{t?.title}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Appeals */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">이의제기 알림</h2>
          <div className="space-y-3">
            {appeals.filter(a => a.status === 'submitted' || a.status === 'reviewing').map(a => {
              const user = getUserById(a.userId);
              const t = tournaments.find(t => t.id === a.tournamentId);
              return (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{t?.title} - {a.reason.slice(0, 30)}...</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart (simple bars) */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">월별 매출</h2>
          <div className="flex items-end gap-3 h-40">
            {[
              { month: '11월', amount: 480000 },
              { month: '12월', amount: 960000 },
              { month: '1월', amount: 320000 },
              { month: '2월', amount: 640000 },
              { month: '3월', amount: 1180000 },
              { month: '4월', amount: 750000 },
            ].map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-500 font-medium">{formatCurrency(d.amount)}</div>
                <div className="w-full bg-blue-500 rounded-t-md transition-all"
                  style={{ height: `${(d.amount / 1200000) * 100}%` }} />
                <div className="text-xs text-gray-500">{d.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
