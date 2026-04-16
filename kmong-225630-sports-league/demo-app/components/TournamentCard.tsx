'use client';

import Link from 'next/link';
import type { Tournament } from '@/lib/data';
import { formatCurrency } from '@/lib/data';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import { MapPin, Calendar, Users } from 'lucide-react';

function getDDay(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function TournamentCard({ tournament }: { tournament: Tournament }) {
  const t = tournament;
  const fillRate = t.maxParticipants > 0 ? t.currentParticipants / t.maxParticipants : 0;
  const remaining = t.maxParticipants - t.currentParticipants;
  const isAlmostFull = fillRate >= 0.7;
  const isFull = remaining <= 0;
  const dDay = t.status === 'open' ? getDDay(t.startDate) : null;

  return (
    <Link href={`/schedule/${t.id}`} id={`tournament-card-${t.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-32 bg-gradient-to-br ${t.posterColor} flex items-center justify-center relative`}>
        <span className="text-white text-lg font-bold text-center px-4 drop-shadow">{t.title}</span>
        {t.status === 'open' && dDay !== null && dDay > 0 && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold ${
            dDay <= 3 ? 'bg-red-500 text-white' : dDay <= 7 ? 'bg-amber-500 text-white' : 'bg-white/90 text-gray-700'
          }`}>
            D-{dDay}
          </span>
        )}
        {t.status === 'open' && isFull && (
          <span className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold bg-red-500 text-white">
            마감
          </span>
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={t.status} />
          <CategoryBadge category={t.category} />
        </div>
        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {t.startDate} ~ {t.endDate}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {t.location} {t.venue}
          </div>
        </div>
        {/* Participants progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-gray-500">
              <Users className="w-3 h-3" /> 참가 현황
            </span>
            <span className={`font-medium ${isAlmostFull ? 'text-red-600' : 'text-gray-600'}`}>
              {t.currentParticipants}/{t.maxParticipants}명
              {isAlmostFull && !isFull && ` (잔여 ${remaining}석)`}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`rounded-full h-1.5 transition-all ${
              isFull ? 'bg-red-500' : isAlmostFull ? 'bg-amber-500' : 'bg-blue-500'
            }`} style={{ width: `${Math.min(fillRate * 100, 100)}%` }} />
          </div>
        </div>
        <div className="text-sm font-semibold text-blue-600">
          참가비 {formatCurrency(t.entryFee)}
        </div>
      </div>
    </Link>
  );
}
