'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressIndicator({
  current,
  total,
  className = '',
}: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#E0E0E0] text-sm font-medium">Progress</span>
        <span className="text-[#00FF88] text-sm font-bold">
          {current}/{total}
        </span>
      </div>
      <div className="h-4 bg-[#0A2540]/50 rounded-full overflow-hidden border-2 border-[#00FF88]/20 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00A86B] via-[#00FF88] to-[#00FF88] rounded-full relative shadow-lg shadow-[#00FF88]/30"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[#00FF88]/50 blur-sm" />
        </motion.div>
      </div>
    </div>
  );
}

