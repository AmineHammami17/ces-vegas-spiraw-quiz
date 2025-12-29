'use client';

import { LeaderboardEntry } from '@/types';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-[#FFD700]" />;
      case 2:
        return <Medal className="w-6 h-6 text-[#C0C0C0]" />;
      case 3:
        return <Award className="w-6 h-6 text-[#CD7F32]" />;
      default:
        return <span className="text-[#E0E0E0] font-bold">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge variant="gold">1st</Badge>;
      case 2:
        return <Badge variant="silver">2nd</Badge>;
      case 3:
        return <Badge variant="bronze">3rd</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {entries.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {[entries[1], entries[0], entries[2]].map((entry, index) => {
            const heights = ['h-24', 'h-32', 'h-20'];
            const order = [1, 0, 2];
            return (
              <motion.div
                key={entry.registration_id}
                className={`flex flex-col items-center ${heights[index]} ${
                  index === 1 ? 'order-2' : index === 0 ? 'order-1' : 'order-3'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-2">{getRankIcon(order[index] + 1)}</div>
                <div
                  className={`w-20 rounded-t-xl ${
                    order[index] === 0
                      ? 'bg-gradient-to-t from-[#FFD700] to-[#FFA500]'
                      : order[index] === 1
                        ? 'bg-gradient-to-t from-[#C0C0C0] to-[#808080]'
                        : 'bg-gradient-to-t from-[#CD7F32] to-[#8B4513]'
                  } flex flex-col items-center justify-end p-2`}
                >
                  <div className="text-white font-bold text-sm">{entry.name}</div>
                  <div className="text-white text-xs">{entry.score} pts</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Card>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Leaderboard
        </h2>
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const isCurrentUser = entry.registration_id === currentUserId;
            return (
              <motion.div
                key={entry.registration_id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCurrentUser
                    ? 'bg-[#00FF88]/10 border-[#00FF88] shadow-lg shadow-[#00FF88]/30'
                    : 'bg-[#0A2540] border-[#0A2540] hover:border-[#00FF88]/30'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-lg ${
                            isCurrentUser ? 'text-[#00FF88]' : 'text-white'
                          }`}
                        >
                          {entry.name}
                        </span>
                        {getRankBadge(entry.rank)}
                        {isCurrentUser && (
                          <span className="text-xs text-[#00FF88]">(You)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[#FFD700] font-bold text-lg">
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-[#E0E0E0] text-xs">points</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#E0E0E0] font-medium">
                        {formatTime(entry.time)}
                      </div>
                      <div className="text-[#666] text-xs">time</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

