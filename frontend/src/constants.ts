// ------------------------------------------------------------------
// Constantes globales de la aplicación Inforario
// ------------------------------------------------------------------
// NOTA: Las credenciales de Supabase (SUPABASE_URL, SUPABASE_KEY) y
// el objeto FEATURES fueron eliminados en la Fase 1 del refactor
// como parte del desacoplamiento hacia un modelo local-first.
// ------------------------------------------------------------------

// Acceso seguro a variables de entorno
const getEnvVar = (key: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || '';
    }
  } catch {
    // Ignorar error en entornos donde process no existe
  }
  return '';
};

// Google Calendar — ID de cliente para OAuth directo
export const GOOGLE_CLIENT_ID =
  getEnvVar('GOOGLE_CLIENT_ID') ||
  (typeof window !== 'undefined' ? localStorage.getItem('google_client_id') : '') ||
  '303071798512-muiirok53evctbn1rdmtisl2f6rednbn.apps.googleusercontent.com';