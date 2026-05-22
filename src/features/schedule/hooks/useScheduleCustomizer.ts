import { useState } from 'react';
import { Schedule, ScheduleTheme, ClassSession } from '../../../types';

interface UseScheduleCustomizerProps {
  schedule: Schedule | null;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule | null>>;
  onSaveSchedule?: (updated: Schedule) => void;
}

export const useScheduleCustomizer = ({
  schedule,
  setSchedule,
  onSaveSchedule,
}: UseScheduleCustomizerProps) => {
  const [theme, setTheme] = useState<ScheduleTheme>('DEFAULT');
  const [fontScale, setFontScale] = useState<number>(1);

  const changeSubjectColor = (subject: string, color: string) => {
    if (!schedule) return;

    const updatedSessions = schedule.sessions.map((session) => {
      if (session.subject.toUpperCase() === subject.toUpperCase()) {
        return { ...session, color };
      }
      return session;
    });

    const updatedSchedule: Schedule = {
      ...schedule,
      sessions: updatedSessions,
      lastUpdated: new Date(),
    };

    setSchedule(updatedSchedule);

    if (onSaveSchedule) {
      onSaveSchedule(updatedSchedule);
    }
  };

  return {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    changeSubjectColor,
  };
};
