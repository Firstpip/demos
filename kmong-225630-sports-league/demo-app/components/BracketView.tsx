'use client';

import type { Match } from '@/lib/data';
import { getUserById } from '@/lib/data';

interface BracketViewProps {
  matches: Match[];
  tournamentId: string;
}

function MatchCard({ match }: { match: Match }) {
  const p1 = match.player1Id ? getUserById(match.player1Id) : null;
  const p2 = match.player2Id ? getUserById(match.player2Id) : null;

  const borderColor = match.status === 'ongoing' ? 'border-green-400 ring-2 ring-green-100' :
    match.status === 'finished' ? 'border-gray-200' : 'border-gray-100';

  return (
    <div id={`bracket-match-${match.id}`}
      className={`bg-white rounded-lg border-2 ${borderColor} shadow-sm min-w-[180px] overflow-hidden`}>
      {match.status === 'ongoing' && (
        <div className="bg-green-500 text-white text-[10px] font-bold text-center py-0.5">LIVE</div>
      )}
      <div className={`flex items-center justify-between px-3 py-2 border-b border-gray-100 ${
        match.winnerId === match.player1Id ? 'bg-blue-50' : ''
      }`}>
        <span className={`text-sm ${match.winnerId === match.player1Id ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
          {p1?.name || 'TBD'}
        </span>
        <span className={`text-sm font-mono ${match.winnerId === match.player1Id ? 'font-bold text-blue-700' : 'text-gray-500'}`}>
          {match.status !== 'scheduled' ? match.player1Score : '-'}
        </span>
      </div>
      <div className={`flex items-center justify-between px-3 py-2 ${
        match.winnerId === match.player2Id ? 'bg-blue-50' : ''
      }`}>
        <span className={`text-sm ${match.winnerId === match.player2Id ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
          {p2?.name || 'TBD'}
        </span>
        <span className={`text-sm font-mono ${match.winnerId === match.player2Id ? 'font-bold text-blue-700' : 'text-gray-500'}`}>
          {match.status !== 'scheduled' ? match.player2Score : '-'}
        </span>
      </div>
    </div>
  );
}

export default function BracketView({ matches }: BracketViewProps) {
  if (matches.length === 0) return <p className="text-gray-500 text-center py-8">대진표가 아직 생성되지 않았습니다.</p>;

  const maxRound = Math.max(...matches.map(m => m.round));
  const roundNames = ['', '8강', '준결승', '결승'];
  if (maxRound > 3) {
    for (let i = roundNames.length; i <= maxRound; i++) {
      roundNames.push(`라운드 ${i}`);
    }
  }

  const rounds: Match[][] = [];
  for (let r = 1; r <= maxRound; r++) {
    rounds.push(matches.filter(m => m.round === r).sort((a, b) => a.matchNumber - b.matchNumber));
  }

  return (
    <div id="bracket-tree" className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-max">
        {rounds.map((roundMatches, idx) => (
          <div key={idx} id={`bracket-round-${idx + 1}`} className="flex flex-col items-center">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">
              {roundNames[idx + 1] || `라운드 ${idx + 1}`}
            </h3>
            <div className="flex flex-col justify-around flex-1 gap-4" style={{ paddingTop: `${idx * 40}px`, paddingBottom: `${idx * 40}px` }}>
              {roundMatches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Winner display */}
      {matches.find(m => m.round === maxRound && m.winnerId) && (
        <div id="bracket-winner" className="text-center py-6 border-t border-gray-100 mt-4">
          <span className="text-amber-500 text-3xl">🏆</span>
          <p className="text-lg font-bold text-gray-900 mt-2">
            우승: {getUserById(matches.find(m => m.round === maxRound)!.winnerId!)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
