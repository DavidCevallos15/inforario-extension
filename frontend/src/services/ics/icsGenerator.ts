import { Schedule, ClassSession } from '../../types';

const DAY_TO_ICS_DAY: Record<string, string> = {
  'Lunes': 'MO',
  'Martes': 'TU',
  'Miércoles': 'WE',
  'Jueves': 'TH',
  'Viernes': 'FR',
  'Sábado': 'SA',
  'Domingo': 'SU'
};

const DAY_TO_NUM: Record<string, number> = {
  'Domingo': 0,
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6
};

// Formats a JS Date to ICS Datetime YYYYMMDDTHHMMSS (Floating local time)
function formatICSDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

function getFirstOccurrence(startDate: Date, dayName: string, startTime: string): Date {
  const start = new Date(startDate);
  // Parse "HH:MM"
  const [hours, mins] = startTime.split(':').map(Number);
  start.setHours(hours, mins, 0, 0);

  const targetDay = DAY_TO_NUM[dayName];
  const currentDay = start.getDay();
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd < 0) daysToAdd += 7; // Next occurrence

  start.setDate(start.getDate() + daysToAdd);
  return start;
}

export function generateICS(schedule: Schedule, semesterStart: Date, semesterEnd: Date): void {
  const vcalendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Inforario UTM//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  // UNTIL requires UTC format YYYYMMDDTHHMMSSZ for safety
  const untilDateStr = `${semesterEnd.getUTCFullYear()}${String(semesterEnd.getUTCMonth()+1).padStart(2,'0')}${String(semesterEnd.getUTCDate()).padStart(2,'0')}T235959Z`;

  schedule.sessions.forEach(session => {
    // Skip virtual or unassigned classes with no real times
    if (!session.day || !session.startTime || !session.endTime || session.isVirtual) {
      return; 
    }

    // Determine exact first start/end dates
    const firstStart = getFirstOccurrence(semesterStart, session.day, session.startTime);
    const firstEnd = getFirstOccurrence(semesterStart, session.day, session.endTime);

    // Format strings
    const dtStart = formatICSDate(firstStart);
    const dtEnd = formatICSDate(firstEnd);
    
    const byday = DAY_TO_ICS_DAY[session.day] || 'MO';
    const rule = `FREQ=WEEKLY;UNTIL=${untilDateStr};BYDAY=${byday}`;

    // Random UID
    const uid = `${crypto.randomUUID()}@inforario.utm`;
    // Add Z for current stamp UTC
    const now = new Date();
    const dtStamp = `${now.getUTCFullYear()}${String(now.getUTCMonth()+1).padStart(2,'0')}${String(now.getUTCDate()).padStart(2,'0')}T${String(now.getUTCHours()).padStart(2,'0')}0000Z`;

    vcalendar.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `RRULE:${rule}`,
      `SUMMARY:${session.subject}`,
      `LOCATION:${session.location}`,
      `DESCRIPTION:Docente: ${session.teacher}\\nSGU Inforario UTM`,
      'END:VEVENT'
    );
  });

  vcalendar.push('END:VCALENDAR');

  const blob = new Blob([vcalendar.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  const cleanPeriod = (schedule.academic_period || 'horario').replace(/\s+/g, '_');
  a.download = `horario_${cleanPeriod}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
