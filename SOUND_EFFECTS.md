# 🔊 Sound Effects System

## Overview

The quiz game now includes immersive sound effects to enhance the user experience! All sounds are generated using the Web Audio API, so no external audio files are needed.

## 🎵 Available Sound Effects

### 1. **Correct Answer Sound**
- **When:** Plays when user selects the correct answer
- **Sound:** Pleasant ascending chord (C-E-G)
- **Location:** `components/PointsPopup.tsx`

### 2. **Wrong Answer Sound**
- **When:** Plays when user selects an incorrect answer
- **Sound:** Descending error buzz
- **Location:** `components/PointsPopup.tsx`

### 3. **Drum Roll**
- **When:** Plays before revealing the final score on game over
- **Sound:** Building drum roll effect (2 seconds)
- **Location:** `components/GameOverScreen.tsx`

### 4. **Victory Fanfare**
- **When:** Plays after drum roll for high scores (2000+ points)
- **Sound:** Victory melody (C-E-G-C)
- **Location:** `components/GameOverScreen.tsx`

### 5. **Leaderboard Entry Sound**
- **When:** Plays when entering the leaderboard page
- **Sound:** Subtle notification chime
- **Location:** `app/leaderboard/page.tsx`

## 🎛️ Sound Settings

Users can control sound effects via the **Sound Settings** button (bottom-right corner on quiz page):

- **Toggle On/Off:** Click the volume icon to enable/disable sounds
- **Volume Control:** Adjust volume slider (0-100%)
- **Persistent:** Settings are saved in localStorage

## 🔧 Technical Details

### Sound Manager (`lib/sounds.ts`)
- Singleton pattern for global sound management
- Uses Web Audio API for sound generation
- Supports both generated tones and audio files
- Stores preferences in localStorage

### Sound Hook (`hooks/useSound.ts`)
- Initializes audio context on first user interaction
- Handles browser autoplay restrictions
- Unlocks audio context for immediate playback

## 🎨 Customization

### Adding Custom Sound Files

To use custom audio files instead of generated sounds:

```typescript
// In lib/sounds.ts
playCorrectAnswer() {
  // Option 1: Use generated sound (current)
  this.playTone(523.25, 0.1, 'sine', this.volume * 0.6);
  
  // Option 2: Use audio file
  this.playSoundFile('/sounds/correct.mp3', this.volume);
}
```

### Adjusting Volume

```typescript
import { soundManager } from '@/lib/sounds';

// Set volume (0-1)
soundManager.setVolume(0.7); // 70% volume
```

### Disabling Sounds Programmatically

```typescript
import { soundManager } from '@/lib/sounds';

soundManager.setEnabled(false); // Disable all sounds
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Full support)
- ✅ Firefox (Full support)
- ✅ Safari (Full support)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** Some browsers require user interaction before playing sounds (handled automatically).

## 🎯 Best Practices

1. **Volume Levels:** Keep sounds subtle (0.3-0.6) to avoid overwhelming users
2. **Timing:** Sounds should complement animations, not compete with them
3. **User Control:** Always provide a way to disable sounds
4. **Performance:** Sounds are lightweight and don't impact performance

## 🐛 Troubleshooting

### Sounds Not Playing?
1. Check if sounds are enabled in settings
2. Ensure browser allows autoplay (may require user interaction)
3. Check browser console for errors
4. Verify Web Audio API is supported

### Audio Context Suspended?
- The sound manager automatically resumes suspended contexts
- First user interaction unlocks audio

---

**Enjoy the enhanced quiz experience with sound effects! 🎉**

