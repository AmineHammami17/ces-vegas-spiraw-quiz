'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  neon?: boolean;
  glow?: boolean;
}

export default function Card({ children, className = '', neon = true, glow = false }: CardProps) {
  const baseStyles =
    'rounded-2xl p-6 bg-gradient-to-br from-[#1A1F3A] via-[#0A2540] to-[#1A1F3A] backdrop-blur-sm border-2 transition-all duration-300 relative overflow-hidden';

  const neonBorder = neon
    ? 'border-[#00FF88]/50 shadow-xl shadow-[#00FF88]/20 hover:shadow-[#00FF88]/40 hover:border-[#00FF88]'
    : 'border-[#0A2540]/50 hover:border-[#0A2540]';

  const glowEffect = glow ? 'animate-pulse-glow' : '';

  return (
    <motion.div
      className={`${baseStyles} ${neonBorder} ${glowEffect} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={neon ? { scale: 1.01 } : {}}
    >
      {neon && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/5 via-transparent to-transparent pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

