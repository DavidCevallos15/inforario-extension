import { useState } from 'react';
import { Schedule, ClassSession } from '../../../types';

/**
 * Mapeo de días en Español a los códigos aceptados por RRULE de Google Calendar.
 */
const DAY_MAP: Record<string, string> = {
  'Lunes': 'MO',
  'Martes': 'TU',
  'Miércoles': 'WE',
  'Jueves': 'TH',
  'Viernes': 'FR',
  'Sábado': 'SA',
  'Domingo': 'SU',
};

/**
 * Mapeo de días en Español al índice numérico de JavaScript (0=Domingo, 1=Lunes, etc.).
 */
const JS_DAY_MAP: Record<string, number> = {
  'Domingo': 0,
  'Lunes': 1,
  'Martes': 2,
  'Miércoles': 3,
  'Jueves': 4,
  'Viernes': 5,
  'Sábado': 6,
};

export const useGoogleCalendar = () => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Envuelve la API de chrome.identity en una Promesa para obtener el token OAuth2.
   * Solicita el token de forma interactiva (abriendo el popup si es necesario).
   * @returns {Promise<string>} El token de acceso.
   */
  const getAuthToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!chrome || !chrome.identity) {
        reject(new Error('La API de chrome.identity no está disponible. Asegúrate de ejecutar esto como extensión.'));
        return;
      }
      
      chrome.identity.getAuthToken({ interactive: true }, (token: any) => {
        if (chrome.runtime.lastError || !token) {
          const errMsg = chrome.runtime.lastError?.message || '';
          if (errMsg.toLowerCase().includes('organization') || errMsg.toLowerCase().includes('restricted')) {
            reject(new Error('Acceso institucional requerido: Por favor, asegúrate de haber iniciado sesión en Chrome con tu cuenta de la @utm.edu.ec'));
          } else {
            reject(new Error(errMsg || 'Error al obtener el token de acceso.'));
          }
        } else {
          // Las versiones recientes de @types/chrome pueden devolver un objeto { token, grantedScopes }
          // o simplemente el string.
          resolve(typeof token === 'string' ? token : token.token);
        }
      });
    });
  };

  /**
   * Calcula la próxima fecha calendario que corresponde a un día de la semana específico.
   * @param {string} dayName Nombre del día en Español (ej. 'Lunes').
   * @returns {Date} El objeto Date correspondiente al próximo día.
   */
  const getNextDateForDay = (dayName: string): Date => {
    const targetDay = JS_DAY_MAP[dayName];
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntil = (targetDay - currentDay + 7) % 7;
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate;
  };

  /**
   * Sincroniza todas las sesiones de clases válidas con Google Calendar.
   * Transforma el horario en eventos recurrentes y hace llamadas POST a la API de Google.
   * @param {Schedule} schedule El horario interactivo actual.
   */
  const syncScheduleToGoogle = async (schedule: Schedule): Promise<void> => {
    setIsSyncing(true);
    setError(null);
    
    try {
      const token = await getAuthToken();
      
      const syncPromises = schedule.sessions.map(async (session: ClassSession) => {
        // Omitir sesiones virtuales sin horario específico
        if (!session.day || !session.startTime || !session.endTime || session.isVirtual) {
          return Promise.resolve(null);
        }

        const rruleDay = DAY_MAP[session.day];
        if (!rruleDay) return Promise.resolve(null);

        const firstDate = getNextDateForDay(session.day);
        const year = firstDate.getFullYear();
        const month = String(firstDate.getMonth() + 1).padStart(2, '0');
        const date = String(firstDate.getDate()).padStart(2, '0');

        const [startH, startM] = session.startTime.split(':');
        const [endH, endM] = session.endTime.split(':');

        const startDateTime = new Date(`${year}-${month}-${date}T${startH}:${startM}:00`);
        const endDateTime = new Date(`${year}-${month}-${date}T${endH}:${endM}:00`);

        // Generar repetición durante 16 semanas (duración típica de semestre)
        const untilDate = new Date(firstDate);
        untilDate.setDate(untilDate.getDate() + 16 * 7);
        // Formato requerido para UNTIL en RRULE: YYYYMMDDTHHMMSSZ (UTC)
        const untilStr = untilDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const eventPayload = {
          summary: session.subject,
          location: session.location || '',
          description: `Docente: ${session.teacher || 'N/A'}\nFacultad: ${session.subject_faculty || ''}\nGenerado por Inforario UTM`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${rruleDay};UNTIL=${untilStr}`
          ],
          colorId: '9' // Azul predeterminado de Calendar
        };

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventPayload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error en API de Google: ${errorData.error?.message}`);
        }
        
        return response.json();
      });

      await Promise.all(syncPromises);

    } catch (err: any) {
      console.error('Error durante la sincronización con Google Calendar:', err);
      const errorMessage = err.message || 'Error desconocido al sincronizar.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  return { syncScheduleToGoogle, isSyncing, error };
};
