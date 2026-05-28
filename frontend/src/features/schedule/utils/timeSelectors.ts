import { ClassSession } from '../../../types';

/**
 * Converts a "HH:mm" time string to the number of minutes since midnight.
 */
export const timeToMins = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/**
 * Checks if two class sessions overlap in time on the same day.
 */
export const detectOverlap = (s1: ClassSession, s2: ClassSession): boolean => {
  if (!s1.day || !s2.day || s1.day !== s2.day) return false;
  if (!s1.startTime || !s1.endTime || !s2.startTime || !s2.endTime) return false;

  const start1 = timeToMins(s1.startTime);
  const end1 = timeToMins(s1.endTime);
  const start2 = timeToMins(s2.startTime);
  const end2 = timeToMins(s2.endTime);

  return start1 < end2 && start2 < end1;
};

/**
 * Gets the active schedule's bounding hours (minimum and maximum).
 */
export const getScheduleHoursRange = (
  sessions: ClassSession[],
  fallbackMin = 7,
  fallbackMax = 18
): { minHour: number; maxHour: number } => {
  const regular = sessions.filter(s => !s.isVirtual && s.day && s.startTime && s.endTime);
  if (regular.length === 0) {
    return { minHour: fallbackMin, maxHour: fallbackMax };
  }

  let min = 24;
  let max = 0;

  regular.forEach(s => {
    if (!s.startTime || !s.endTime) return;
    const startH = parseInt(s.startTime.split(':')[0]);
    const [endHStr, endMStr] = s.endTime.split(':');
    const endH = parseInt(endHStr);
    const endM = parseInt(endMStr);
    
    if (startH < min) min = startH;
    
    let effectiveEnd = endH;
    if (endM > 0) effectiveEnd += 1;
    if (effectiveEnd > max) max = effectiveEnd;
  });

  const finalMin = Math.max(6, min);
  const finalMax = Math.max(finalMin + 4, max + 1);

  return { minHour: finalMin, maxHour: finalMax };
};
