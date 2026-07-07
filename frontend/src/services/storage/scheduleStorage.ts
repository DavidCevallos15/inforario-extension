import { Schedule } from '../../types';

const STORAGE_KEY = 'inforario_schedules';

/**
 * Obtiene todos los horarios almacenados en localStorage.
 * @returns Arreglo de horarios, o arreglo vacío si ocurre un error.
 */
export function getAllSchedulesFromLocal(): Schedule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Schedule[];
  } catch {
    // Si los datos están corruptos o no se puede acceder, retornar vacío
    return [];
  }
}

/**
 * Obtiene un horario específico por ID, o el más reciente si no se pasa ID.
 * @param id - Identificador opcional del horario a buscar.
 * @returns El horario encontrado o null si no existe ninguno.
 */
export function getScheduleFromLocal(id?: string): Schedule | null {
  try {
    const schedules = getAllSchedulesFromLocal();
    if (schedules.length === 0) return null;

    if (id) {
      return schedules.find((s) => s.id === id) ?? null;
    }

    // Sin ID: retornar el horario con lastUpdated más reciente
    return schedules.reduce((latest, current) => {
      const latestTime = new Date(latest.lastUpdated).getTime();
      const currentTime = new Date(current.lastUpdated).getTime();
      return currentTime > latestTime ? current : latest;
    });
  } catch {
    return null;
  }
}

/**
 * Guarda o actualiza un horario en localStorage.
 * Si el horario no tiene ID, genera uno con crypto.randomUUID().
 * Siempre actualiza la marca de tiempo `lastUpdated`.
 * @param schedule - Horario a guardar o actualizar.
 * @returns El horario guardado con ID y lastUpdated garantizados.
 */
export function saveScheduleToLocal(schedule: Schedule): Schedule {
  const savedSchedule: Schedule = {
    ...schedule,
    id: schedule.id || crypto.randomUUID(),
    lastUpdated: new Date().toISOString(),
  };

  try {
    const schedules = getAllSchedulesFromLocal();
    const existingIndex = schedules.findIndex((s) => s.id === savedSchedule.id);

    if (existingIndex >= 0) {
      schedules[existingIndex] = savedSchedule;
    } else {
      schedules.push(savedSchedule);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Error al guardar horario en localStorage:', error);
  }

  return savedSchedule;
}

/**
 * Elimina un horario por su ID.
 * @param id - Identificador del horario a eliminar.
 */
export function deleteScheduleFromLocal(id: string): void {
  try {
    const schedules = getAllSchedulesFromLocal();
    const filtered = schedules.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error al eliminar horario de localStorage:', error);
  }
}

/**
 * Elimina todos los horarios almacenados en localStorage.
 */
export function clearAllSchedules(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar horarios de localStorage:', error);
  }
}
