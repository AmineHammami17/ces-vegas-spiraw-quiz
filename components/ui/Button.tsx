'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  glow?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  glow = true,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#00A86B] to-[#00FF88] text-white shadow-lg shadow-[#00A86B]/50',
    secondary:
      'bg-gradient-to-r from-[#0A2540] to-[#1A1F3A] text-white border-2 border-[#00FF88]',
    danger: 'bg-gradient-to-r from-[#FF6B6B] to-[#FF4444] text-white shadow-lg shadow-[#FF6B6B]/50',
    success:
      'bg-gradient-to-r from-[#00A86B] to-[#00FF88] text-white shadow-lg shadow-[#00A86B]/50',
  };

  const glowEffect = glow
    ? 'hover:shadow-[0_0_20px_rgba(0,255,136,0.6)] hover:shadow-[#00FF88]/60'
    : '';

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${glowEffect} ${className}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

