import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL as DEFAULT_SUPABASE_URL, SUPABASE_KEY as DEFAULT_SUPABASE_KEY } from '../../constants';
import { UserProfile, Schedule, ClassSession } from '../../types';

// --- Client Initialization ---

// Priorizar variables de entorno de Vite (.env.local) sobre las constantes hardcodeadas
const activeUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const activeKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Robust initialization: fallback to a dummy object if keys are missing to prevent white-screen crashes.
const isConfigured = !!(activeUrl && activeKey && !activeUrl.includes("placeholder"));

// Dummy builder that allows chaining for any operation without crashing
const createDummyBuilder = () => {
  const errorResult = { data: null, error: { message: "Database not configured" } };
  const promise = Promise.resolve(errorResult);

  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    lt: () => builder,
    gte: () => builder,
    lte: () => builder,
    in: () => builder,
    is: () => builder,
    like: () => builder,
    ilike: () => builder,
    contains: () => builder,
    match: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => promise,
    maybeSingle: () => promise,
    // Complete Promise Interface to ensure await works correctly
    then: (onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) => promise.then(onfulfilled, onrejected),
    catch: (onrejected?: (reason: any) => any) => promise.catch(onrejected),
    finally: (onfinally?: (() => void) | null) => promise.finally(onfinally)
  };
  return builder;
};

let client: any = null;
try {
  if (isConfigured) {
    client = createClient(activeUrl, activeKey);
  }
} catch (e) {
  console.error("Critical: Supabase client initialization failed:", e);
  client = null;
}

// Ensure the exported supabase object has the expected structure even if client fails
export const supabase = client || {
  from: () => createDummyBuilder(),
  functions: {
    invoke: () => Promise.resolve({ data: null, error: { message: "Database not configured" } })
  },
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } }, error: null }),
    signInWithPassword: () => Promise.resolve({ error: { message: "Database not configured" } }),
    signUp: () => Promise.resolve({ error: { message: "Database not configured" } }),
    resetPasswordForEmail: () => Promise.resolve({ error: { message: "Database not configured" } }),
    signInWithOAuth: () => Promise.resolve({ error: { message: "Database not configured" } }),
    signOut: () => Promise.resolve({ error: null })
  }
} as any;

export const isSupabaseConfigured = (): boolean => {
  return isConfigured && !!client;
};

// --- Database Operations ---

// Helper para validar si un string es un UUID válido
const isUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const saveScheduleToDB = async (userId: string, schedule: Schedule) => {
  if (!isSupabaseConfigured() || !isUUID(userId)) return null;

  try {
    if (schedule.id) {
      // Update
      const { data, error } = await supabase
        .from('schedules')
        .update({
          title: schedule.title,
          academic_period: schedule.academic_period,
          schedule_data: schedule.sessions,
          faculty: schedule.faculty,
          last_updated: new Date().toISOString()
        })
        .eq('id', schedule.id)
        .select();

      if (error) throw error;
      return data;
    } else {
      // Insert
      const { data, error } = await supabase
        .from('schedules')
        .insert({
          user_id: userId,
          title: schedule.title,
          academic_period: schedule.academic_period,
          schedule_data: schedule.sessions,
          faculty: schedule.faculty,
          last_updated: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data;
    }
  } catch (err: any) {
    console.error("Save schedule error:", err);
    return null;
  }
};

export const getUserSchedules = async (userId: string) => {
  if (!isSupabaseConfigured() || !userId) return [];
  
  // Si el ID es de desarrollo/invitado (no UUID), no consultamos la DB para evitar error 400
  if (!isUUID(userId)) {
    console.log("ℹ️ Usuario invitado: omitiendo consulta a base de datos remota.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('id, title, academic_period, last_updated')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err: any) {
    console.error("Get schedules error:", err);
    return [];
  }
};

export const getScheduleById = async (scheduleId: string) => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', scheduleId)
      .single();

    if (error) throw error;
    return data;
  } catch (err: any) {
    console.error("Get schedule by ID error:", err);
    return null;
  }
};

export const deleteSchedule = async (scheduleId: string) => {
  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', scheduleId);

    if (error) throw error;
  } catch (err: any) {
    console.error("Delete error:", err);
    if (err.message && (err.message.includes("Invalid login credentials") || err.message.includes("JWT"))) {
      throw new Error("Credenciales inválidas o sesión expirada. Por favor cierra sesión y vuelve a ingresar.");
    }
    if (err.message === "Script error.") {
      throw new Error("Error de conexión. Por favor verifica tu internet o intenta más tarde.");
    }
    throw err;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured() || !isUUID(userId)) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  } catch (err: any) {
    console.error("Get profile error:", err);
    return null;
  }
};

// --- Authentication Helpers ---

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { full_name: fullName }
    }
  });
  if (error) throw error;
  return data;
};

export const resetPasswordForEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
  return data;
};

// --- AI Extraction Edge Service ---

interface ExtractScheduleEdgeResponse {
  sessions?: Array<{
    subject?: string;
    teacher?: string;
    day?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    floor?: string;
    isVirtual?: boolean;
  }>;
  error?: string;
}

const DAY_MAP: Record<string, ClassSession['day']> = {
  Lunes: 'Lunes',
  Martes: 'Martes',
  Miércoles: 'Miércoles',
  Jueves: 'Jueves',
  Viernes: 'Viernes',
};

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const sanitizeText = (text: string): string => text.replace(/\s+/g, ' ').trim();

const extractPdfText = async (base64DataUrl: string): Promise<string> => {
  const pdfjsLib = await import('pdfjs-dist');

  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const cleanBase64 = base64DataUrl.replace(/^data:(.*);base64,/, '');
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const pageChunks: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    const rows = textContent.items
      .map((item) => {
        const candidate = item as { str?: string; transform?: number[] };
        if (!candidate.str || !candidate.transform || candidate.transform.length < 6) {
          return null;
        }

        const text = candidate.str.trim();
        if (!text) {
          return null;
        }

        return {
          text,
          x: Math.round(candidate.transform[4]),
          y: Math.round(viewport.height - candidate.transform[5]),
        };
      })
      .filter((item): item is { text: string; x: number; y: number } => item !== null)
      .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));

    let currentY: number | null = null;
    let currentLine: string[] = [];
    const lines: string[] = [];

    for (const row of rows) {
      if (currentY === null || Math.abs(row.y - currentY) <= 2) {
        currentLine.push(row.text);
        currentY = currentY ?? row.y;
      } else {
        lines.push(currentLine.join(' '));
        currentLine = [row.text];
        currentY = row.y;
      }
    }

    if (currentLine.length) {
      lines.push(currentLine.join(' '));
    }

    pageChunks.push(lines.join('\n'));
  }

  const plainText = pageChunks.join('\n\n');
  const normalized = sanitizeText(plainText);

  if (!normalized) {
    throw new Error('No se pudo extraer texto del PDF.');
  }

  return plainText;
};

const mapSessions = (payload: ExtractScheduleEdgeResponse): ClassSession[] => {
  if (!Array.isArray(payload.sessions)) {
    throw new Error('La respuesta de la IA no contiene sessions.');
  }

  return payload.sessions
    .map((item) => {
      const isVirtual = item.isVirtual === true || (item.location || '').toUpperCase().includes('VIRTUAL');
      const day = item.day ? DAY_MAP[item.day] : undefined;
      const startTime = item.startTime?.trim();
      const endTime = item.endTime?.trim();
      const subject = item.subject
        ?.replace(/^(TECNOLOG[IÍ]AS DE LA\s*)+/i, '')
        ?.replace(/\s*\((A19|ITINERARIO|[A-Z0-9]+)\)\s*/gi, '')
        .trim() || '';
      const hasValidTime =
        !!startTime &&
        !!endTime &&
        TIME_REGEX.test(startTime) &&
        TIME_REGEX.test(endTime);

      if (!subject) {
        return null;
      }

      if (!isVirtual && (!day || !hasValidTime)) {
        return null;
      }

      return {
        id: crypto.randomUUID(),
        subject,
        day: isVirtual ? undefined : day,
        startTime: isVirtual ? undefined : startTime,
        endTime: isVirtual ? undefined : endTime,
        teacher: item.teacher?.trim() || 'N/A',
        location: isVirtual ? 'Virtual' : item.location?.trim() || 'N/A',
        floor: item.floor?.trim() || 'N/A',
        isVirtual,
        conflict: false,
      } as ClassSession;
    })
    .filter((session): session is ClassSession => session !== null);
};

export const parseScheduleFileWithEdge = async (base64Data: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado para usar extracción por IA.');
  }

  const pdfText = await extractPdfText(base64Data);

  const { data, error } = await supabase.functions.invoke('extract-schedule', {
    body: { pdfText },
  });

  if (error) {
    throw new Error(error.message || 'No se pudo invocar extract-schedule.');
  }

  const payload = (data || {}) as ExtractScheduleEdgeResponse;

  if (payload.error) {
    throw new Error(payload.error);
  }

  const sessions = mapSessions(payload);

  if (!sessions.length) {
    throw new Error('La IA no devolvió sesiones válidas.');
  }

  return {
    sessions,
  };
};
