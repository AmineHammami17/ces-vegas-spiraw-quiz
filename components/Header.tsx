'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      className="w-full py-4 px-6 z-50 relative bg-gradient-to-b from-[#0A0E27]/95 via-[#0A2540]/95 to-transparent backdrop-blur-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <Image
            src="/spiraw-assets/logo-linkedin.png"
            alt="Spiraw Logo"
            width={50}
            height={50}
            className="rounded-lg group-hover:scale-110 transition-transform"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-[#00FF88] to-[#00A86B] bg-clip-text text-transparent">
            Spiraw
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/quiz"
            className="text-[#E0E0E0] hover:text-[#00FF88] transition-colors font-medium relative group"
          >
            Quiz
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00FF88] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/leaderboard"
            className="text-[#E0E0E0] hover:text-[#00FF88] transition-colors font-medium relative group"
          >
            Leaderboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00FF88] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}

