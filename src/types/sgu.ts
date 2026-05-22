export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';
export const DAYS: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export interface ClassSession {
  id: string;
  subject: string;
  subject_faculty?: string; // Facultad específica de la materia
  day?: DayOfWeek;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  teacher: string;
  location: string;
  floor?: string;
  isVirtual?: boolean;
  color?: string;
  conflict?: boolean;
}

export interface Schedule {
  id?: string;
  title: string;
  academic_period?: string;
  faculty?: string; // Facultad del estudiante / carrera
  sessions: ClassSession[];
  lastUpdated: Date | string;
}

export type ScheduleTheme = 'DEFAULT' | 'MINIMALIST' | 'SCHOOL' | 'NEON';
