'use client';

import Link from 'next/link';
import { DollarSign, ShoppingBag, UserPlus, Package, ArrowUpRight } from 'lucide-react';
import { orders, products, users } from '@/lib/data';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import AdminLayout from '@/components/AdminLayout';

function Stat({ icon: Icon, label, value, delta, color }: { icon: React.ElementType; label: string; value: string; delta: string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center`} style={{ backgroundColor: color + '20', color }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-green-600">
          <ArrowUpRight className="w-3 h-3" /> {delta}
        </span>
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-40 px-2">
      {data.map(d => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gradient-to-t from-[#1B2A4A] to-[#2D4A7A] rounded-t transition-all hover:opacity-80"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${formatPrice(d.value)}`}
          />
          <span className="text-[11px] text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 300;
  const h = 120;
  const step = w / (data.length - 1);
  const points = data.map((d, i) => `${i * step},${h - (d.value / max) * h}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full h-40">
        <polyline
          fill="none"
          stroke="#E8653A"
          strokeWidth={2}
          points={points}
        />
        {data.map((d, i) => (
          <g key={d.label}>
            <circle cx={i * step} cy={h - (d.value / max) * h} r={3} fill="#E8653A" />
            <text x={i * step} y={h + 15} fontSize={9} textAnchor="middle" fill="#64748B">
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DashboardInner() {
  const today = orders.filter(o => o.createdAt === '2026-04-15').length || 3;
  const totalSales = orders.reduce((s, o) => s + o.totalAmount, 0);
  const recent5 = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  const top5 = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);

  const weekly = [
    { label: '월', value: 1234000 },
    { label: '화', value: 2103000 },
    { label: '수', value: 1589000 },
    { label: '목', value: 2892000 },
    { label: '금', value: 3421000 },
    { label: '토', value: 2105000 },
    { label: '일', value: 1673000 },
  ];

  const monthly = [
    { label: '1월', value: 58000000 },
    { label: '2월', value: 72000000 },
    { label: '3월', value: 89000000 },
    { label: '4월', value: 95000000 },
    { label: '5월', value: 78000000 },
    { label: '6월', value: 103000000 },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-xs text-gray-500 mt-1">에듀프레스 온라인 서점 운영 현황</p>
      </div>

      <section id="admin-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat icon={DollarSign} label="오늘 매출" value={formatPrice(2890000)} delta="12.4%" color="#E8653A" />
        <Stat icon={ShoppingBag} label="오늘 주문" value={`${today}건`} delta="8.1%" color="#1B2A4A" />
        <Stat icon={UserPlus} label="신규 회원" value="12명" delta="3.2%" color="#22C55E" />
        <Stat icon={Package} label="총 상품 수" value={`${products.length}권`} delta="—" color="#8B5CF6" />
      </section>

      <section id="admin-chart" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">주간 매출</h2>
            <span className="text-xs text-gray-500">이번 주 총 {formatPrice(weekly.reduce((s, d) => s + d.value, 0))}</span>
          </div>
          <BarChart data={weekly} />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">월간 주문 추이</h2>
            <span className="text-xs text-gray-500">누적 {formatPrice(totalSales)}</span>
          </div>
          <LineChart data={monthly} />
        </div>
      </section>

      <section id="admin-table" className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">최근 주문</h2>
            <Link href="/admin/orders" className="text-xs text-[#1B2A4A] hover:text-[#E8653A]">
              전체보기
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="py-2">주문번호</th>
                  <th className="py-2">주문자</th>
                  <th className="py-2 text-right">금액</th>
                  <th className="py-2 text-center">상태</th>
                  <th className="py-2 text-right">날짜</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recent5.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-2">
                      <Link href={`/admin/orders/${o.id}`} className="text-[#1B2A4A] hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2 text-gray-700">{o.userName}</td>
                    <td className="py-2 text-right font-semibold">{formatPrice(o.totalAmount)}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-0.5 text-[10px] rounded ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2 text-right text-gray-500">{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">인기 상품 Top 5</h2>
            <Link href="/admin/products" className="text-xs text-[#1B2A4A] hover:text-[#E8653A]">
              상품 관리
            </Link>
          </div>
          <ul className="space-y-2">
            {top5.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 text-xs">
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-white text-[11px] shrink-0 ${
                    i === 0 ? 'bg-[#E8653A]' : i === 1 ? 'bg-[#2D4A7A]' : 'bg-gray-400'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 line-clamp-1">{p.title}</p>
                  <p className="text-gray-500 text-[10px]">
                    {p.soldCount.toLocaleString('ko-KR')}권 판매
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-4 bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3">총 회원 현황</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">전체 회원</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}명</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">이번 달 가입</p>
            <p className="text-2xl font-bold text-[#1B2A4A] mt-1">37명</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">활성 회원</p>
            <p className="text-2xl font-bold text-[#E8653A] mt-1">{users.filter(u => u.orderCount > 0).length}명</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardInner />
    </AdminLayout>
  );
}
