'use client';

import { ButtonHTMLAttributes, useState } from 'react';
import { motion } from 'framer-motion';

interface AnswerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}

export default function AnswerButton({
  children,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  className = '',
  onClick,
  disabled,
  ...props
}: AnswerButtonProps) {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !isCorrect && !isWrong) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y });
      setTimeout(() => setRipple(null), 600);
      onClick(e);
    }
  };

  const baseStyles =
    'w-full p-4 rounded-xl text-left font-medium text-lg transition-all duration-300 border-2 relative overflow-hidden';

  let styles = baseStyles;
  if (isCorrect) {
    styles += ' bg-gradient-to-r from-[#00A86B]/30 to-[#00FF88]/20 border-[#00FF88] text-[#00FF88] shadow-lg shadow-[#00FF88]/50';
  } else if (isWrong) {
    styles += ' bg-gradient-to-r from-[#FF6B6B]/30 to-[#FF4444]/20 border-[#FF6B6B] text-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/50';
  } else if (isSelected) {
    styles += ' bg-gradient-to-r from-[#1A1F3A] to-[#0A2540] border-[#00FF88] text-white shadow-lg shadow-[#00FF88]/40';
  } else {
    styles += ' bg-gradient-to-r from-[#1A1F3A] to-[#0A2540] border-[#0A2540] text-[#E0E0E0] hover:border-[#00FF88]/60 hover:bg-gradient-to-r hover:from-[#1A1F3A]/90 hover:to-[#0A2540]/90 hover:shadow-lg hover:shadow-[#00FF88]/20';
  }
  
  if (disabled && !isCorrect && !isWrong) {
    styles += ' opacity-50 cursor-not-allowed';
  }

  const {
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onDragStart,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDrop,
    ...safeProps
  } = props;

  return (
    <motion.button
      className={`${styles} ${className}`}
      whileHover={!isCorrect && !isWrong && !disabled ? { scale: 1.02, x: 5 } : {}}
      whileTap={!isCorrect && !isWrong && !disabled ? { scale: 0.98 } : {}}
      disabled={isCorrect || isWrong || disabled}
      onClick={handleClick}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      {...safeProps}
    >
      {ripple && (
        <motion.span
          className="absolute rounded-full bg-white/30"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{ width: 300, height: 300, x: ripple.x - 150, y: ripple.y - 150 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {isSelected && !isCorrect && !isWrong && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

