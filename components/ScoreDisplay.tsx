'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

export default function ScoreDisplay({ score, className = '' }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true);
      const duration = 500;
      const steps = 30;
      const increment = (score - displayScore) / steps;
      let current = displayScore;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplayScore(score);
          setIsAnimating(false);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [score, displayScore]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-[#E0E0E0] text-sm font-medium">Score:</span>
      <motion.div
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0A2540] to-[#1A1F3A] border-2 border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/10"
        animate={isAnimating ? { scale: [1, 1.05, 1], boxShadow: ['0 0 0px rgba(255,215,0,0.3)', '0 0 20px rgba(255,215,0,0.6)', '0 0 0px rgba(255,215,0,0.3)'] } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent"
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          style={{
            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        >
          {displayScore.toLocaleString()}
        </motion.span>
      </motion.div>
    </div>
  );
}

