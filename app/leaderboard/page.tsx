'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import GameBackground from '@/components/GameBackground';
import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/types';
import { getCookie } from 'cookies-next';
import { soundManager } from '@/lib/sounds';
import { motion } from 'framer-motion';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to fetch leaderboard');
    }
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response is not JSON');
  }
  
  return res.json();
};

export default function LeaderboardPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionId = getCookie('session_id') as string | undefined;
      setCurrentSessionId(sessionId || null);
    }
    
    soundManager.playLeaderboardEntry();
  }, []);

  const { data, error, isLoading } = useSWR<{
    leaderboard: LeaderboardEntry[];
    current_user_id?: string;
  }>('/api/leaderboard?limit=10', fetcher, {
    refreshInterval: 2000,
  });

  return (
    <GameBackground>
      <motion.div
        className="min-h-screen p-4 md:p-8 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00FF88] to-[#00A86B] bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Leaderboard
          </motion.h1>
          <motion.p
            className="text-[#E0E0E0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Top performers in the Spiraw Challenge
          </motion.p>
        </motion.div>

        {isLoading && (
          <motion.div
            className="flex justify-center items-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-[#E0E0E0] text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading leaderboard...
            </motion.div>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="flex justify-center items-center min-h-[400px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-[#FF6B6B] text-lg">
              Error loading leaderboard. Please try again.
            </div>
          </motion.div>
        )}

        {data && data.leaderboard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <LeaderboardTable
              entries={data.leaderboard}
              currentUserId={data.current_user_id || currentSessionId || undefined}
            />
          </motion.div>
        )}

        {data && data.leaderboard && data.leaderboard.length === 0 && (
          <motion.div
            className="flex justify-center items-center min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-[#E0E0E0] text-lg">
              No scores yet. Be the first to complete the quiz!
            </div>
          </motion.div>
        )}
      </motion.div>
    </GameBackground>
  );
}

