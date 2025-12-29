export function calculatePoints(isCorrect: boolean, timeTakenMs: number): number {
  if (!isCorrect) {
    return 0;
  }

  const basePoints = 100;

  const speedBonus = Math.max(0, 100 - Math.floor(timeTakenMs / 100));

  return basePoints + speedBonus;
}

export function isValidTiming(timeTakenMs: number): boolean {
  return timeTakenMs >= 0 && timeTakenMs <= 15000;
}

