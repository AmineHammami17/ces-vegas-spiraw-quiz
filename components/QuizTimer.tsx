'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface QuizTimerProps {
  seconds: number;
  onExpire: () => void;
  className?: string;
}

export default function QuizTimer({ seconds, onExpire, className = '' }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
    setIsWarning(false);
    setIsExpired(false);
  }, [seconds]);

  useEffect(() => {
    if (isExpired || timeLeft <= 0) {
      return;
    }

    if (timeLeft <= 5) {
      setIsWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          setIsWarning(false);
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire, isExpired]);

  const percentage = (timeLeft / seconds) * 100;
  const color =
    timeLeft > 10
      ? '#00FF88'
      : timeLeft > 5
        ? '#FFD700'
        : '#FF6B6B';

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <motion.div
        className="relative w-28 h-28"
        animate={isWarning ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
      >
        {isWarning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
        
        <svg className="w-28 h-28 transform -rotate-90 relative z-10" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#0A2540"
            strokeWidth="10"
            fill="none"
            className="opacity-30"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage / 100)}`,
            }}
            transition={{ duration: 1, ease: 'linear' }}
            style={{
              filter: `drop-shadow(0 0 12px ${color})`,
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.span
            className={`text-3xl font-bold ${
              timeLeft > 10
                ? 'text-[#00FF88]'
                : timeLeft > 5
                  ? 'text-[#FFD700]'
                  : 'text-[#FF6B6B]'
            }`}
            animate={isWarning ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3, repeat: isWarning ? Infinity : 0 }}
            style={{
              textShadow: `0 0 20px ${color}`,
            }}
          >
            {timeLeft}
          </motion.span>
        </div>
      </motion.div>
      <motion.span
        className="text-[#E0E0E0] text-sm font-medium"
        animate={isWarning ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
      >
        Time Remaining
      </motion.span>
    </div>
  );
}

