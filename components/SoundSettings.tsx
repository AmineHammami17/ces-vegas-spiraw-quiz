'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '@/lib/sounds';
import { motion } from 'framer-motion';

export default function SoundSettings() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setEnabled(soundManager.isEnabled());
    setVolume(soundManager.getVolume());
  }, []);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    soundManager.setEnabled(newEnabled);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-[#1A1F3A] border-2 border-[#00FF88]/50 hover:border-[#00FF88] transition-all shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {enabled ? (
          <Volume2 className="w-5 h-5 text-[#00FF88]" />
        ) : (
          <VolumeX className="w-5 h-5 text-[#666]" />
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          className="absolute bottom-16 right-0 p-4 rounded-xl bg-[#1A1F3A] border-2 border-[#00FF88]/50 shadow-xl min-w-[200px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#E0E0E0] text-sm font-medium">Sound Effects</span>
              <button
                onClick={handleToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  enabled ? 'bg-[#00FF88]' : 'bg-[#666]'
                }`}
              >
                <motion.div
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  animate={{ x: enabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {enabled && (
              <div className="space-y-2">
                <label className="text-[#E0E0E0] text-sm font-medium">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-[#0A2540] rounded-lg appearance-none cursor-pointer accent-[#00FF88]"
                />
                <div className="text-xs text-[#999] text-right">
                  {Math.round(volume * 100)}%
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

