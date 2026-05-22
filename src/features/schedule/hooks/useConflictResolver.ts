import { useMemo } from 'react';
import { ClassSession } from '../../../types';
import { detectOverlap } from '../utils/timeSelectors';

export const useConflictResolver = (sessions: ClassSession[]) => {
  const processedSessions = useMemo(() => {
    if (sessions.length <= 1) {
      return sessions.map(s => ({ ...s, conflict: false }));
    }

    // Clone sessions to avoid mutation side-effects
    const updated = sessions.map(s => ({ ...s, conflict: false }));
    const schedulable = updated.filter((s) => !s.isVirtual && s.day && s.startTime && s.endTime);

    for (let i = 0; i < schedulable.length; i++) {
      for (let j = i + 1; j < schedulable.length; j++) {
        const s1 = schedulable[i];
        const s2 = schedulable[j];

        if (detectOverlap(s1, s2)) {
          s1.conflict = true;
          s2.conflict = true;
        }
      }
    }

    return updated;
  }, [sessions]);

  return processedSessions;
};
