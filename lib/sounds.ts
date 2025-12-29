class SoundManager {
  private audioContext: AudioContext | null = null;
  private soundsEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = this.volume
  ) {
    if (!this.soundsEnabled || !this.audioContext) return;

    try {
      this.ensureAudioContext();
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Error playing tone:', e);
    }
  }

  private async playSoundFile(url: string, volume: number = this.volume): Promise<void> {
    if (!this.soundsEnabled) return;

    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(url);
        audio.volume = volume;
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Failed to play sound'));
        audio.play().catch((e) => {
          console.warn('Error playing sound file:', e);
          reject(e);
        });
      } catch (e) {
        console.warn('Error creating audio:', e);
        reject(e);
      }
    });
  }

  playCorrectAnswer() {
    this.playTone(523.25, 0.1, 'sine', this.volume * 0.6);
    setTimeout(() => {
      this.playTone(659.25, 0.1, 'sine', this.volume * 0.6);
    }, 50);
    setTimeout(() => {
      this.playTone(783.99, 0.2, 'sine', this.volume * 0.6);
    }, 100);
  }

  playWrongAnswer() {
    this.playTone(330, 0.12, 'sine', this.volume * 0.4);
    setTimeout(() => {
      this.playTone(277.18, 0.15, 'sine', this.volume * 0.4);
    }, 80);
    setTimeout(() => {
      this.playTone(246.94, 0.18, 'sine', this.volume * 0.35);
    }, 160);
  }

  playDrumRoll(duration: number = 2000) {
    if (!this.soundsEnabled || !this.audioContext) return;

    try {
      this.ensureAudioContext();
      if (!this.audioContext) return;

      const startTime = this.audioContext.currentTime;
      const interval = 80;
      const numBeats = Math.floor(duration / interval);
      
      for (let i = 0; i < numBeats; i++) {
        const time = startTime + (i * interval) / 1000;
        const progress = i / numBeats;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 80 + progress * 20;
        
        filter.type = 'lowpass';
        filter.frequency.value = 200 + progress * 100;
        filter.Q.value = 1;
        
        const volume = progress < 0.7 
          ? 0.15 + progress * 0.25
          : 0.4 * (1 - (progress - 0.7) / 0.3);
        
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(volume * this.volume, time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

        oscillator.start(time);
        oscillator.stop(time + 0.06);
      }

      setTimeout(() => {
        if (!this.audioContext) return;
        
        const finalTime = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 100;
        
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        
        gainNode.gain.setValueAtTime(0, finalTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.6, finalTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.25);
        
        oscillator.start(finalTime);
        oscillator.stop(finalTime + 0.25);
      }, duration - 250);
    } catch (e) {
      console.warn('Error playing drum roll:', e);
    }
  }

  playVictory() {
    const notes = [
      { freq: 523.25, duration: 0.15 },
      { freq: 659.25, duration: 0.15 },
      { freq: 783.99, duration: 0.15 },
      { freq: 1046.5, duration: 0.3 },
    ];

    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'sine', this.volume * 0.7);
      }, index * 150);
    });
  }

  playLeaderboardEntry() {
    this.playTone(440, 0.1, 'sine', this.volume * 0.4);
    setTimeout(() => {
      this.playTone(554.37, 0.15, 'sine', this.volume * 0.4);
    }, 100);
  }

  playPageTransition() {
    this.playTone(330, 0.1, 'sine', this.volume * 0.3);
  }

  playQuizStart() {
    if (!this.soundsEnabled || !this.audioContext) return;

    try {
      this.ensureAudioContext();
      if (!this.audioContext) return;

      const notes = [
        { freq: 392, duration: 0.12, volume: 0.5 },
        { freq: 493.88, duration: 0.12, volume: 0.55 },
        { freq: 587.33, duration: 0.12, volume: 0.6 },
        { freq: 783.99, duration: 0.18, volume: 0.7 },
      ];

      notes.forEach((note, index) => {
        setTimeout(() => {
          this.playTone(note.freq, note.duration, 'sine', this.volume * note.volume);
        }, index * 70);
      });

      setTimeout(() => {
        this.playTone(659.25, 0.15, 'sine', this.volume * 0.4);
      }, 200);
    } catch (e) {
      console.warn('Error playing quiz start sound:', e);
    }
  }

  setEnabled(enabled: boolean) {
    this.soundsEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundsEnabled', String(enabled));
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundsVolume', String(this.volume));
    }
  }

  loadPreferences() {
    if (typeof window !== 'undefined') {
      const enabled = localStorage.getItem('soundsEnabled');
      const volume = localStorage.getItem('soundsVolume');
      
      if (enabled !== null) {
        this.soundsEnabled = enabled === 'true';
      }
      if (volume !== null) {
        this.volume = parseFloat(volume);
      }
    }
  }

  isEnabled(): boolean {
    return this.soundsEnabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

export const soundManager = new SoundManager();

if (typeof window !== 'undefined') {
  soundManager.loadPreferences();
}

