'use client';

import { ReactNode, useState, useEffect } from 'react';

interface GameBackgroundProps {
  children: ReactNode;
}

interface Particle {
  left: number;
  top: number;
  delay: number;
}

export default function GameBackground({ children }: GameBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const generatedParticles = Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0A2540] to-[#1A1F3A] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00A86B]/10 via-transparent to-[#00FF88]/10 animate-pulse" />
      
      {isMounted && (
        <div className="absolute inset-0 opacity-20">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#00FF88] rounded-full animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 pt-0">{children}</div>

    </div>
  );
}

