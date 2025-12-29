'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'silver' | 'bronze' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    gold: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A0E27] shadow-lg shadow-[#FFD700]/50',
    silver:
      'bg-gradient-to-r from-[#C0C0C0] to-[#808080] text-[#0A0E27] shadow-lg shadow-[#C0C0C0]/50',
    bronze:
      'bg-gradient-to-r from-[#CD7F32] to-[#8B4513] text-white shadow-lg shadow-[#CD7F32]/50',
    default:
      'bg-gradient-to-r from-[#00A86B] to-[#00FF88] text-white shadow-lg shadow-[#00A86B]/50',
  };

  return (
    <motion.span
      className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm ${variants[variant]} ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {children}
    </motion.span>
  );
}

