'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import Confetti from './Confetti';
import { soundManager } from '@/lib/sounds';

interface PointsPopupProps {
  points: number;
  isCorrect: boolean;
  onComplete?: () => void;
}

export default function PointsPopup({ points, isCorrect, onComplete }: PointsPopupProps) {
  const [show, setShow] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isCorrect) {
      soundManager.playCorrectAnswer();
      if (points > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    } else {
      soundManager.playWrongAnswer();
    }

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onComplete?.(), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, isCorrect, points]);

  return (
    <>
      <Confetti active={showConfetti} color={isCorrect ? '#00FF88' : '#FF6B6B'} />
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`flex flex-col items-center gap-4 ${
                isCorrect
                  ? 'text-[#00FF88]'
                  : 'text-[#FF6B6B]'
              }`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-20 h-20 drop-shadow-[0_0_30px_rgba(0,255,136,0.8)]" />
                ) : (
                  <XCircle className="w-20 h-20 drop-shadow-[0_0_30px_rgba(255,107,107,0.8)]" />
                )}
              </motion.div>

              <motion.div
                className={`text-7xl font-bold ${
                  isCorrect
                    ? 'drop-shadow-[0_0_30px_rgba(0,255,136,0.8)]'
                    : 'drop-shadow-[0_0_30px_rgba(255,107,107,0.8)]'
                }`}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                }}
              >
                {isCorrect ? `+${points}` : '0'}
              </motion.div>

              <motion.p
                className="text-2xl font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isCorrect ? 'Correct!' : 'Wrong!'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

