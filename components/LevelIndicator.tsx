'use client';

import { motion } from 'framer-motion';

interface LevelIndicatorProps {
  currentLevel: number;
  totalLevels: number;
}

export default function LevelIndicator({ currentLevel, totalLevels }: LevelIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-[#00FF88] to-[#00A86B] bg-clip-text text-transparent"
        key={currentLevel}
        initial={{ scale: 0, rotate: -180, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        Level {currentLevel}
      </motion.div>
      <motion.div
        className="text-[#E0E0E0] text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        / {totalLevels}
      </motion.div>
    </div>
  );
}

