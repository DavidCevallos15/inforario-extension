import { useState } from 'react';
import { Schedule } from '../../../types';
import { parseScheduleFileWithEdge, saveScheduleToDB } from '../../../services/supabase/supabaseClient';
import { parseScheduleFile } from '../utils/sguRegexParser';

interface UseScheduleUploadProps {
  deviceId: string | null;
  onSuccess: (schedule: Schedule) => void;
}

export const useScheduleUpload = ({ deviceId, onSuccess }: UseScheduleUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const uploadFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const mimeType = file.type;

        try {
          let parsedResult;

          if (mimeType === 'application/pdf') {
            try {
              parsedResult = await parseScheduleFileWithEdge(base64data);
            } catch (edgeError) {
              console.warn(
                "La extracción con Edge Function falló, usando parser local.",
                edgeError
              );
              parsedResult = await parseScheduleFile(base64data, mimeType);
            }
          } else {
            parsedResult = await parseScheduleFile(base64data, mimeType);
          }

          const { sessions, faculty, academic_period } = parsedResult;

          const newSchedule: Schedule = {
            title: "Mi Horario Académico",
            sessions: sessions,
            lastUpdated: new Date(),
            academic_period: academic_period || "SEPTIEMBRE 2025 - ENERO 2026",
            faculty: faculty || "FACULTAD DE CIENCIAS INFORMÁTICAS",
          };

          // Save to DB if deviceId is present
          if (deviceId) {
            try {
              const saved = await saveScheduleToDB(deviceId, newSchedule);
              if (saved && saved[0]) {
                newSchedule.id = saved[0].id;
              }
            } catch (dbError) {
              console.error("Error guardando horario en la base de datos:", dbError);
            }
          }

          onSuccess(newSchedule);
          resolve();
        } catch (err: any) {
          const msg = err.message || "No se pudo procesar el documento.";
          setError(msg);
          console.error(err);
          reject(err);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        setIsProcessing(false);
        setError("Error de lectura del archivo.");
        reject(new Error("Error de lectura del archivo."));
      };
    });
  };

  return {
    isProcessing,
    error,
    uploadFile,
    clearError,
  };
};
