'use client';

import GameBackground from '@/components/GameBackground';
import RegistrationForm from '@/components/RegistrationForm';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  return (
    <GameBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 pt-20">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#00FF88] to-[#00A86B] bg-clip-text text-transparent animate-glow">
            Spiraw Challenge
          </h1>
          <p className="text-xl md:text-2xl text-[#E0E0E0] mb-2">
            Test Your Knowledge
          </p>
          <p className="text-lg text-[#999] max-w-2xl mx-auto">
            Discover the power of spirulina and nutrition in this interactive
            quiz game. Answer 15 questions correctly and fast to climb the
            leaderboard!
          </p>
        </motion.div>

        {/* Hero Section with Images */}
        <div className="w-full max-w-7xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: iPhone Mockup */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                <Image
                  src="/spiraw-assets/iphone-mockup.png"
                  alt="Spiraw App Mobile View"
                  width={395}
                  height={800}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>

            {/* Right: Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <RegistrationForm />
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          className="w-full max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#00FF88] to-[#00A86B] bg-clip-text text-transparent">
              Discover Spiraw Features
            </h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/spiraw-assets/app-features.png"
              alt="Spiraw App Features"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Situation/Mockup Section */}
        <motion.div
          className="w-full max-w-6xl mx-auto mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/spiraw-assets/mise-en-situation.png"
              alt="Spiraw Situation"
              width={1186}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-[#666] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p>CES Las Vegas 2025</p>
        </motion.div>
      </div>
    </GameBackground>
  );
}
