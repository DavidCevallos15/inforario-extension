import React from 'react';
import { ClassSession } from '../../../types';
import { motion } from 'framer-motion';

interface SubjectCardProps {
  session: ClassSession;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Tarjeta de materia con estilo editorial.
 * Fondo blanco sólido con borde izquierdo grueso del color de la materia,
 * nombre en bold, horario y aula como metadata secundaria.
 */
export const SubjectCard: React.FC<SubjectCardProps> = ({ session, className = '', style, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer transition-shadow min-h-[70px] relative flex flex-col justify-between ${className}`}
      style={style}
      layoutId={`card-${session.id}`}
    >
      {/* Nombre de la materia */}
      <h4 className="font-bold leading-tight break-words whitespace-normal text-[0.85em] text-left tracking-wide">
        {session.subject || 'Materia sin nombre'}
      </h4>

      {/* Metadata: horario + ubicación */}
      <div className="flex flex-wrap items-end gap-2 mt-auto pt-1.5 text-[0.7em]">
        {session.startTime && session.endTime && (
          <span className="opacity-70 shrink-0 font-medium">
            {session.startTime} - {session.endTime}
          </span>
        )}
        {session.location && session.location !== 'Sin asignar' && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.9em] font-semibold bg-primary/8 text-primary shrink-0">
            {session.location.split(' - ')[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
};
