import React, { useState, useEffect } from 'react';
import { CalendarX2 } from 'lucide-react';
import { AppView, Schedule } from './types';
import { Navbar } from './components/layout/Navbar';
import { ScheduleDashboard } from './features/schedule/components/ScheduleDashboard';
import { getScheduleFromLocal, saveScheduleToLocal } from './services/storage/scheduleStorage';
import { parseScheduleFile } from './utils/sguParser';
import './globals.css';

/**
 * Componente raíz de la aplicación Inforario.
 * Lee el horario desde localStorage y muestra el Dashboard o un estado vacío.
 */
const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.EMPTY);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);

  // Cargar horario desde localStorage al montar
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
      chrome.storage.session.get(['sgu_pdf_data'], async (result) => {
        if (result.sgu_pdf_data) {
          try {
            const parseResult = await parseScheduleFile(result.sgu_pdf_data as string, 'application/pdf');
            
            const newSchedule: Schedule = {
              id: crypto.randomUUID(),
              title: 'Mi Horario SGU',
              sessions: parseResult.sessions,
              faculty: parseResult.faculty,
              academic_period: parseResult.academic_period,
              lastUpdated: new Date().toISOString()
            };
            
            setCurrentSchedule(newSchedule);
            setView(AppView.DASHBOARD);
            saveScheduleToLocal(newSchedule);
          } catch (error) {
            console.error("Error al procesar el PDF capturado:", error);
            loadFromLocal();
          } finally {
            chrome.storage.session.remove(['sgu_pdf_data']);
          }
        } else {
          loadFromLocal();
        }
      });
    } else {
      loadFromLocal();
    }

    function loadFromLocal() {
      const stored = getScheduleFromLocal();
      if (stored) {
        setCurrentSchedule(stored);
        setView(AppView.DASHBOARD);
      }
    }
  }, []);

  /** Reinicia el estado: limpia el horario actual y vuelve a la vista vacía */
  const handleReset = () => {
    setCurrentSchedule(null);
    setView(AppView.EMPTY);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col pt-20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-2 md:py-4 w-full">
        {view === AppView.DASHBOARD && currentSchedule ? (
          <ScheduleDashboard
            currentSchedule={currentSchedule}
            setCurrentSchedule={setCurrentSchedule}
            onReset={handleReset}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

/**
 * Vista mostrada cuando no hay ningún horario cargado en localStorage.
 * Guía al usuario a usar la extensión para sincronizar su horario.
 */
const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
      <CalendarX2 size={40} className="text-primary" />
    </div>
    <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-3 tracking-tight">
      No hay ningún horario cargado
    </h1>
    <p className="text-on-surface-variant max-w-md text-base leading-relaxed">
      Ve a tu SGU de la UTM, abre la sección de
      <span className="font-semibold text-primary"> «Horario de Clases» </span>
      y usa la extensión de Inforario para sincronizarlo al instante.
    </p>
  </div>
);

export default App;
