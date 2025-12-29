'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Trophy, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Confetti from './Confetti';
import { soundManager } from '@/lib/sounds';

interface GameOverScreenProps {
  finalScore: number;
  totalTime: number;
  onViewLeaderboard: () => void;
}

export default function GameOverScreen({
  finalScore,
  totalTime,
  onViewLeaderboard,
}: GameOverScreenProps) {
  const router = useRouter();
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    if (finalScore >= 2500) return 'Outstanding! You are a Spirulina Master!';
    if (finalScore >= 2000) return 'Excellent! You know your stuff!';
    if (finalScore >= 1500) return 'Great job! Well done!';
    if (finalScore >= 1000) return 'Good effort! Keep learning!';
    return 'Nice try! Practice makes perfect!';
  };

  const showConfetti = finalScore >= 2000;
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    soundManager.playDrumRoll(2000);
    
    const timer = setTimeout(() => {
      setShowScore(true);
      if (finalScore >= 2000) {
        soundManager.playVictory();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [finalScore]);

  return (
    <>
      <Confetti active={showConfetti} color="#FFD700" />
      <motion.div
        className="fixed inset-0 bg-[#0A0E27]/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Card className="max-w-md w-full text-center">
          {showScore ? (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Trophy className="w-20 h-20 text-[#FFD700] mx-auto mb-4" />
                </motion.div>
              </motion.div>

              <motion.h1
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Game Over!
              </motion.h1>
              <motion.p
                className="text-[#E0E0E0] mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {getPerformanceMessage()}
              </motion.p>

              <motion.div
                className="space-y-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-4 rounded-xl bg-[#0A2540] border border-[#00FF88]/30">
                  <div className="text-[#E0E0E0] text-sm mb-1">Final Score</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                    {finalScore.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0A2540] border border-[#00FF88]/30">
                  <div className="text-[#E0E0E0] text-sm mb-1">Total Time</div>
                  <div className="text-2xl font-bold text-[#00FF88]">
                    {formatTime(totalTime)}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="py-12">
              <motion.div
                className="text-2xl font-bold text-[#00FF88]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Calculating Score...
              </motion.div>
            </div>
          )}

          {showScore && (
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="primary"
                onClick={onViewLeaderboard}
                className="flex-1"
              >
                View Leaderboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
                className="flex-1"
              >
                Play Again
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </motion.div>
    </>
  );
}

